using OnlineStore.Core.Entities;
using System.ComponentModel.DataAnnotations;

namespace OnlineStore.API.Models.Users {
  public sealed class UpdateUserRequest
{
    [Required]
    public int UserId { get; set; }

    [Required, MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string LastName { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = "User";

    [Required]
    public UserState UserStatus { get; set; } = UserState.Active;

    [MinLength(6)]
    public string? NewPassword { get; set; }
}
}
