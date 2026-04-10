using System.Net;
using System.Net.Http.Json;
using DiemDanhLopHoc.DTOs;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;

namespace DiemDanhLopHoc.Tests;

public class AuthIntegrationTests : BaseIntegrationTest
{
    public AuthIntegrationTests(WebApplicationFactory<Program> factory) : base(factory)
    {
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ReturnsUnauthorized()
    {
        // Arrange
        var request = new LoginRequestDto
        {
            TaiKhoan = "invalid_user",
            MatKhau = "wrong_password"
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/auth/login", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Login_WithEmptyCredentials_ReturnsBadRequest()
    {
        // Arrange
        var request = new LoginRequestDto
        {
            TaiKhoan = "",
            MatKhau = ""
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/auth/login", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
