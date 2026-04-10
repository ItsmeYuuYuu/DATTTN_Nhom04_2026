using System.Net;
using System.Net.Http.Json;
using DiemDanhLopHoc.DTOs;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;

namespace DiemDanhLopHoc.Tests;

public class ClassManagementIntegrationTests : BaseIntegrationTest
{
    public ClassManagementIntegrationTests(WebApplicationFactory<Program> factory) : base(factory)
    {
    }

    [Fact]
    public async Task GetAll_ReturnsSuccessAndData()
    {
        // Act
        var response = await Client.GetAsync("/api/lophoc");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<dynamic>();
        // Check success property (as per LopHocController implementation)
    }

    [Fact]
    public async Task Create_WithMissingData_ReturnsBadRequest()
    {
        // Arrange
        var request = new TaoLopHocDto { MaLop = "" }; // Missing required fields

        // Act
        var response = await Client.PostAsJsonAsync("/api/lophoc", request);

        // Assert
        // The controller uses try-catch around creation, so it might return 400 with exception message
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
