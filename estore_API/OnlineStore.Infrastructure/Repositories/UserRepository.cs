using Microsoft.EntityFrameworkCore;
  using OnlineStore.Core.Entities;
  using OnlineStore.Core.Interfaces;
  using OnlineStore.Infrastructure.Data;

  namespace OnlineStore.Infrastructure.Repositories;

  public class UserRepository : Repository<User>, IUserRepository
  {
      public UserRepository(StoreDbContext context) : base(context) { }

      public async Task<User?> GetByEmailAsync(string email)
      {
          return await _dbSet.AsNoTracking().FirstOrDefaultAsync(u => u.CustomerEmail == email);
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