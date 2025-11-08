using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

  using OnlineStore.Core.Entities;
  using OnlineStore.Core.Interfaces;
using System.Linq;

  namespace OnlineStore.API.Controllers;

  [ApiController]
  [Route("api/[controller]")]
  public class UsersController : ControllerBase
  {
      private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher<User> _passwordHasher;

    public UsersController(IUserRepository userRepository)
      {
          _userRepository = userRepository;
      }

      [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
      {
          var users = await _userRepository.GetAllAsync();
          return Ok(Sanitize(users));
      }

      [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<User>> GetUser(int id)
      {
          var user = await _userRepository.GetByIdAsync(id);
          if (user is null) return NotFound();
          return Ok(Sanitize(user));
      }

      [HttpGet("search")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<User>>> Search([FromQuery] string? term)
      {
          if (string.IsNullOrWhiteSpace(term)) return BadRequest("Search term is required.");
          var users = await _userRepository.SearchAsync(term);
          return Ok(Sanitize(users));
      }

      [HttpGet("email/{email}")]
    [Authorize]
    public async Task<ActionResult<User>> GetByEmail(string email)
      {
          var user = await _userRepository.GetByEmailAsync(email);
          if (user is null) return NotFound();
          return Ok(Sanitize(user));
      }
/*
      [HttpPost]
      public async Task<ActionResult<User>> CreateUser(User user)
      {
          user.CreatedAt = DateTime.UtcNow;
          user.UpdatedAt = DateTime.UtcNow;
          user.LastLoginAt = DateTime.UtcNow;

          var created = await _userRepository.AddAsync(user);
          return CreatedAtAction(nameof(GetUser), new { id = created.UserId }, Sanitize(created));
      }
*/
      [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUser(int id, User user)
      {
          if (id != user.UserId) return BadRequest();

          var existing = await _userRepository.GetByIdAsync(id);
          if (existing is null) return NotFound();

          existing.FirstName = user.FirstName;
          existing.LastName = user.LastName;
          existing.CustomerEmail = user.CustomerEmail;
          existing.PasswordHash = _passwordHasher.HashPassword(user, user.PasswordHash);
          existing.Role = user.Role;
          existing.UserStatus = user.UserStatus;
          existing.UpdatedAt = DateTime.UtcNow;

          await _userRepository.UpdateAsync(existing);
          return NoContent();
      }

      [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(int id)
      {
          var existing = await _userRepository.GetByIdAsync(id);
          if (existing is null) return NotFound();

          await _userRepository.DeleteAsync(id);
          return NoContent();
      }

     /* private static User Sanitize(User user) =>
          user with { PasswordHash = string.Empty };
     */
    private static User Sanitize(User user)
      {
          user.PasswordHash = string.Empty;
          return user;
    }
    private static IEnumerable<User> Sanitize(IEnumerable<User> users) =>
          users.Select(Sanitize).ToList();
  }