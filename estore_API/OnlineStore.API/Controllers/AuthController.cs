 using Microsoft.AspNetCore.Authorization;
  using Microsoft.AspNetCore.Identity;
  using Microsoft.AspNetCore.Mvc;
  using OnlineStore.API.Models.Auth;
  using OnlineStore.Core.Entities;
  using OnlineStore.Core.Interfaces;
  using OnlineStore.API.Services;   // Whatever namespace holds ITokenService
using System.Security.Claims;

namespace OnlineStore.API.Controllers;

  [ApiController]
  [Route("api/[controller]")]
  public class AuthController : ControllerBase
  {
      private readonly IUserRepository _users;
      private readonly IPasswordHasher<User> _passwordHasher;
      private readonly ITokenService _tokenService;

      public AuthController(
          IUserRepository users,
          IPasswordHasher<User> passwordHasher,
          ITokenService tokenService)
      {
          _users = users;
          _passwordHasher = passwordHasher;
          _tokenService = tokenService;
      }

      [HttpPost("register")]
    [AllowAnonymous]
    //      [Authorize(Roles = "Admin")] // loosen if self-service signup is allowed
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
      {
          if (!ModelState.IsValid) return ValidationProblem(ModelState);

          var existing = await _users.GetByEmailAsync(request.Email);
          if (existing is not null)
              return Conflict("Email already in use.");

          var user = new User
          {
              FirstName = request.FirstName,
              LastName = request.LastName,
              CustomerEmail = request.Email,
              Role = "User",//request.Role,
              CreatedAt = DateTime.UtcNow,
              UpdatedAt = DateTime.UtcNow,
              LastLoginAt = DateTime.UtcNow,
              UserStatus = UserState.Active
          };

          user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

          var created = await _users.AddAsync(user);

          var (token, expiresAt) = _tokenService.CreateToken(created);

          return Ok(new AuthResponse
          {
              UserId = created.UserId,
              FirstName = created.FirstName,
              LastName = created.LastName,
              Email = created.CustomerEmail,
              Role = created.Role,
              Token = token,
              ExpiresAt = expiresAt
          });
      }

      [HttpPost("login")]
      [AllowAnonymous]
      public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
      {
          if (!ModelState.IsValid) return ValidationProblem(ModelState);

          var user = await _users.GetByEmailAsync(request.Email);
          if (user is null)
              return Unauthorized("Invalid credentials.");

          if (user.UserStatus != UserState.Active)
              return Unauthorized("User account is not active.");

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
          if (result == PasswordVerificationResult.Failed)
              return Unauthorized("Invalid credentials.");

          user.LastLoginAt = DateTime.UtcNow;
          await _users.UpdateAsync(user);

          var (token, expiresAt) = _tokenService.CreateToken(user);

          return Ok(new AuthResponse
          {
              UserId = user.UserId,
              FirstName = user.FirstName,
              LastName = user.LastName,
              Email = user.CustomerEmail,
              Role = user.Role,
              Token = token,
              ExpiresAt = expiresAt
          });
      }

      [HttpGet("me")]
      [Authorize]
      public async Task<ActionResult<AuthResponse>> Me()
      {
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrWhiteSpace(email))
              return Unauthorized();

          var user = await _users.GetByEmailAsync(email);
          if (user is null)
              return Unauthorized();

          return Ok(new AuthResponse
          {
              UserId = user.UserId,
              FirstName = user.FirstName,
              LastName = user.LastName,
              Email = user.CustomerEmail,
              Role = user.Role,
              Token = string.Empty,
              ExpiresAt = DateTime.UtcNow
          });
      }
  }