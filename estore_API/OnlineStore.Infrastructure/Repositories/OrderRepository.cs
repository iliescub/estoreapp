 using Microsoft.EntityFrameworkCore;
  using OnlineStore.Core.Entities;
  using OnlineStore.Core.Interfaces;
  using OnlineStore.Infrastructure.Data;

  namespace OnlineStore.Infrastructure.Repositories;

  public class OrderRepository : Repository<Order>, IOrderRepository
  {
      public OrderRepository(StoreDbContext context) : base(context) { }

      public async Task<IEnumerable<Order>> GetAllWithItemsAsync()
      {
          return await _dbSet
              .AsNoTracking()
              .Include(o => o.OrderItems)
              .ToListAsync();
      }

      public async Task<Order?> GetWithItemsAsync(int id)
      {
          return await _dbSet
              .Include(o => o.OrderItems)
              .AsNoTracking()
              .FirstOrDefaultAsync(o => o.OrderId == id);
      }

      public async Task<IEnumerable<Order>> GetByUserAsync(int userId)
      {
          return await _dbSet
              .AsNoTracking()
              .Include(o => o.OrderItems)
              .Where(o => o.UserId == userId)
              .ToListAsync();
      }
  }