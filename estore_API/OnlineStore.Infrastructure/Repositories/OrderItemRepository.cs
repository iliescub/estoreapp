using Microsoft.EntityFrameworkCore;
  using OnlineStore.Core.Entities;
  using OnlineStore.Core.Interfaces;
  using OnlineStore.Infrastructure.Data;

  namespace OnlineStore.Infrastructure.Repositories;

  public class OrderItemRepository : Repository<OrderItem>, IOrderItemRepository
  {
      public OrderItemRepository(StoreDbContext context) : base(context) { }

      public async Task<IEnumerable<OrderItem>> GetByOrderAsync(int orderId)
      {
          return await _dbSet
              .AsNoTracking()
              .Where(oi => oi.OrderId == orderId)
              .ToListAsync();
      }
  }