using OnlineStore.Core.Entities;

  namespace OnlineStore.Core.Interfaces;

  public interface IOrderItemRepository : IRepository<OrderItem>
  {
      Task<IEnumerable<OrderItem>> GetByOrderAsync(int orderId);
  }