namespace OnlineStore.Core.Entities;

public class User
{
	public int UserId { get; set; }
	public string FirstName { get; set; } = string.Empty;
	public string LastName { get; set; } = string.Empty;
	public string CustomerEmail { get; set; } = string.Empty;
	public string PasswordHash { get; set; } = string.Empty;
	public string Role { get; set; } = string.Empty;
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
	public DateTime LastLoginAt { get; set; } = DateTime.UtcNow;
	public int UserStatus { get; set; }
}

