using System.Net;
using System.Net.Http.Json;
using DiemDanhLopHoc.DTOs;
using DiemDanhLopHoc.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DiemDanhLopHoc.Tests;

public class AttendanceIntegrationTests : BaseIntegrationTest
{
    public AttendanceIntegrationTests(WebApplicationFactory<Program> factory) : base(factory)
    {
    }

    [Fact]
    public async Task Submit_WithNonExistentSession_ReturnsNotFound()
    {
        // Arrange
        var request = new SubmitDiemDanhDto
        {
            MaBuoiHoc = 999999,
            MaSv = "test_sv",
            Lat = 10.0,
            Long = 106.0,
            DeviceToken = "test_device"
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/diemdanh/submit", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetStudentAttendance_ReturnsHistory()
    {
        // Arrange
        string maSv = "SV001"; // Assuming this exists or we seed it

        // Act
        var response = await Client.GetAsync($"/api/diemdanh/student/{maSv}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var history = await response.Content.ReadFromJsonAsync<List<DiemDanhDto>>();
        history.Should().NotBeNull();
    }
}
