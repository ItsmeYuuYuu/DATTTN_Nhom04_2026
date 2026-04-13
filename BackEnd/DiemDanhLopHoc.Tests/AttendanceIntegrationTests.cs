using System.Net;
using System.Net.Http.Json;
using DiemDanhLopHoc.DTOs;
using DiemDanhLopHoc.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Cryptography;
using DiemDanhLopHoc.Data;

namespace DiemDanhLopHoc.Tests;

public class AttendanceIntegrationTests : BaseIntegrationTest
{
    public AttendanceIntegrationTests(WebApplicationFactory<Program> factory) : base(factory)
    {
    }

    private async Task SeedPrerequisites(AppDbContext db)
    {
        // Seed MonHoc
        if (!await db.MonHocs.AnyAsync(m => m.MaMon == "TEST_MON"))
            db.MonHocs.Add(new MonHoc { MaMon = "TEST_MON", TenMon = "Test subject" });

        // Seed GiangVien
        if (!await db.GiangViens.AnyAsync(g => g.MaGv == "GV_TEST"))
            db.GiangViens.Add(new GiangVien { MaGv = "GV_TEST", TaiKhoan = "gv_test", MatKhau = "1", HoLot = "Test", TenGv = "GV", Email = "gv@test.com" });

        await db.SaveChangesAsync();

        // Seed LopHoc
        if (!await db.LopHocs.AnyAsync(l => l.MaLop == "TEST_CLASS"))
        {
            db.LopHocs.Add(new LopHoc { 
                MaLop = "TEST_CLASS", 
                TenLop = "Test Class", 
                MaMon = "TEST_MON", 
                MaGv = "GV_TEST",
                NgayBatDau = DateOnly.FromDateTime(DateTime.Today),
                NgayKetThuc = DateOnly.FromDateTime(DateTime.Today.AddDays(30)),
                GioBatDau = new TimeOnly(7,0),
                GioKetThuc = new TimeOnly(11,0),
                SoBuoiHoc = 15
            });
        }
        await db.SaveChangesAsync();
    }

    [Fact]
    public async Task Submit_WithDistanceOver30m_ReturnsForbidden()
    {
        // 1. Arrange
        var db = GetDbContext();
        await SeedPrerequisites(db);

        var session = new BuoiHoc { 
            MaLop = "TEST_CLASS", 
            NgayHoc = DateOnly.FromDateTime(DateTime.Today),
            GioBatDau = TimeOnly.FromDateTime(DateTime.Now),
            GioKetThuc = TimeOnly.FromDateTime(DateTime.Now.AddHours(2)),
            TrangThaiBh = 1,
            ToaDoGocLat = 10.7369,
            ToaDoGocLong = 106.6790
        };
        db.BuoiHocs.Add(session);
        await db.SaveChangesAsync();

        var request = new SubmitDiemDanhDto
        {
            MaBuoiHoc = session.MaBuoiHoc,
            MaSv = "SV001",
            Lat = 10.7369,
            Long = 106.7790, // Cách xa > 30m
            RawPayload = "dummy",
            Signature = "dummy"
        };

        // 2. Act
        var response = await Client.PostAsJsonAsync("/api/diemdanh/submit", request);

        // 3. Assert
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("Bạn không ở trong phạm vi phòng học");
    }

    [Fact]
    public async Task Submit_WithValidSignatureAndDistance_ReturnsOk()
    {
        // 1. Arrange
        using var ecdsa = System.Security.Cryptography.ECDsa.Create();
        var publicKeyBase64 = Convert.ToBase64String(ecdsa.ExportSubjectPublicKeyInfo());

        var db = GetDbContext();
        await SeedPrerequisites(db);
        
        var sv = await db.SinhViens.FindAsync("SV001") ?? new SinhVien { MaSv = "SV001", TaiKhoan = "sv001", MatKhau = "1", HoLot = "Test", TenSv = "A", Lop = "L" };
        sv.MaThietBi = publicKeyBase64;
        if (db.Entry(sv).State == EntityState.Detached) db.SinhViens.Add(sv);
        
        var buoiHoc = new BuoiHoc { 
            MaLop = "TEST_CLASS", NgayHoc = DateOnly.FromDateTime(DateTime.Today), 
            GioBatDau = TimeOnly.MinValue, GioKetThuc = TimeOnly.MaxValue, 
            TrangThaiBh = 1, ToaDoGocLat = 10.0, ToaDoGocLong = 106.0 
        };
        db.BuoiHocs.Add(buoiHoc);
        await db.SaveChangesAsync();

        var rawPayload = $"SV001|{buoiHoc.MaBuoiHoc}|10.0|106.0|{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        var signatureBytes = ecdsa.SignData(System.Text.Encoding.UTF8.GetBytes(rawPayload), HashAlgorithmName.SHA256);
        var signatureBase64 = Convert.ToBase64String(signatureBytes);

        var request = new SubmitDiemDanhDto
        {
            MaBuoiHoc = buoiHoc.MaBuoiHoc,
            MaSv = "SV001",
            Lat = 10.0,
            Long = 106.0,
            RawPayload = rawPayload,
            Signature = signatureBase64
        };

        // 2. Act
        var response = await Client.PostAsJsonAsync("/api/diemdanh/submit", request);

        // 3. Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Submit_WithTamperedPayload_ReturnsForbidden()
    {
        // 1. Arrange: Ký Payload A nhưng gửi Payload B
        using var ecdsa = System.Security.Cryptography.ECDsa.Create();
        var publicKeyBase64 = Convert.ToBase64String(ecdsa.ExportSubjectPublicKeyInfo());

        var db = GetDbContext();
        await SeedPrerequisites(db);

        var sv = await db.SinhViens.FindAsync("SV_HACKER") ?? new SinhVien { MaSv = "SV_HACKER", TaiKhoan = "sv_h", MatKhau = "1", HoLot = "Test", TenSv = "H", Lop = "L" };
        sv.MaThietBi = publicKeyBase64;
        if (db.Entry(sv).State == EntityState.Detached) db.SinhViens.Add(sv);

        var buoiHoc = new BuoiHoc { MaLop = "TEST_CLASS", NgayHoc = DateOnly.FromDateTime(DateTime.Today), TrangThaiBh = 1 };
        db.BuoiHocs.Add(buoiHoc);
        await db.SaveChangesAsync();

        var realPayload = "RealData";
        var fakePayload = "TamperedData";
        var signatureBytes = ecdsa.SignData(System.Text.Encoding.UTF8.GetBytes(realPayload), HashAlgorithmName.SHA256);

        var request = new SubmitDiemDanhDto
        {
            MaBuoiHoc = buoiHoc.MaBuoiHoc,
            MaSv = "SV_HACKER",
            RawPayload = fakePayload,
            Signature = Convert.ToBase64String(signatureBytes)
        };

        // 2. Act
        var response = await Client.PostAsJsonAsync("/api/diemdanh/submit", request);

        // 3. Assert
        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}
