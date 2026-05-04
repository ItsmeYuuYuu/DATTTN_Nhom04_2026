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
    public async Task GetAll_WithoutToken_ReturnsUnauthorized()
    {
        // Act
        var response = await Client.GetAsync("/api/lophoc");

        // Assert - Chắc chắn trả về 401 vì đã có [Authorize]
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Create_WithoutToken_ReturnsUnauthorized()
    {
        // Arrange
        var request = new TaoLopHocDto { MaLop = "" }; // Missing required fields

        // Act
        var response = await Client.PostAsJsonAsync("/api/lophoc", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
