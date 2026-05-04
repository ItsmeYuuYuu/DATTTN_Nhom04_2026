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
    public async Task GetStudentAttendance_WithoutToken_ReturnsUnauthorized()
    {
        // Act
        var response = await Client.GetAsync("/api/diemdanh/student/SV001");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task WebAuthn_RegisterOptions_WithoutToken_ReturnsUnauthorized()
    {
        // Act
        var response = await Client.GetAsync("/api/webauthn/register-options?username=sv001");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
