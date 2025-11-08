using OnlineStore.Core.Entities;
namespace OnlineStore.Core.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<bool> EmailExistsAsync(string email);
    Task UpdateLastLoginAsync(int userId, DateTime when);
    Task<IEnumerable<User>> SearchAsync(string term);
}