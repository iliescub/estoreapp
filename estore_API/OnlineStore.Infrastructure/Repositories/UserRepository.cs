using Microsoft.EntityFrameworkCore;
using OnlineStore.Core.Entities;
using OnlineStore.Core.Interfaces;
using OnlineStore.Infrastructure.Data;

namespace OnlineStore.Infrastructure.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(StoreDbContext context) : base(context) { }

    public async Task<User?> GetByEmailAsync(string email) =>
        await _dbSet.AsNoTracking().FirstOrDefaultAsync(u => u.CustomerEmail == email);

    public async Task<bool> EmailExistsAsync(string email) =>
        await _dbSet.AsNoTracking().AnyAsync(u => u.CustomerEmail == email);

    public async Task UpdateLastLoginAsync(int userId, DateTime when)
    {
        var user = await _dbSet.FirstOrDefaultAsync(u => u.UserId == userId);
        if (user is null) return;

        user.LastLoginAt = when;
        user.UpdatedAt = when;
        await _context.SaveChangesAsync();
    }
      public async Task<IEnumerable<User>> SearchAsync(string term)
      {
          return await _dbSet
              .AsNoTracking()
              .Where(u =>
                  u.FirstName.Contains(term) ||
                  u.LastName.Contains(term) ||
                  u.CustomerEmail.Contains(term))
              .ToListAsync();
      }
  }