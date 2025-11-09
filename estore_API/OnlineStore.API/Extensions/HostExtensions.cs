using Microsoft.AspNetCore.Identity;
  using Microsoft.EntityFrameworkCore;
  using OnlineStore.Core.Entities;
  using OnlineStore.Infrastructure.Data;
  using Microsoft.Extensions.DependencyInjection;

  namespace OnlineStore.API.Extensions;

  public static class HostExtensions
  {
    /*      public static async Task SeedAdminAsync(this IHost app)
          {
              using var scope = app.Services.CreateScope();
              var context = scope.ServiceProvider.GetRequiredService<StoreDbContext>();
              var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();

              await context.Database.MigrateAsync();

              const string adminEmail = "admin@estore.local";
              if (await context.Users.AnyAsync(u => u.CustomerEmail == adminEmail))
                  return; // already seeded

              var admin = new User
              {
                  FirstName = "System",
                  LastName = "Admin",
                  CustomerEmail = adminEmail,
                  Role = "Admin",
                  UserStatus = UserState.Active,
                  CreatedAt = DateTime.UtcNow,
                  UpdatedAt = DateTime.UtcNow,
                  LastLoginAt = DateTime.UtcNow
              };

              admin.PasswordHash = hasher.HashPassword(admin, "ChangeMe123!");

              context.Users.Add(admin);
              await context.SaveChangesAsync();
          }
    */
}