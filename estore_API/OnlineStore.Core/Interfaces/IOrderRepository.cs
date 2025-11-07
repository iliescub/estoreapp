using OnlineStore.Core.Entities;

  namespace OnlineStore.Core.Interfaces;

  public interface IOrderRepository : IRepository<Order>
  {
      Task<IEnumerable<Order>> GetAllWithItemsAsync();
      Task<Order?> GetWithItemsAsync(int id);
      Task<IEnumerable<Order>> GetByUserAsync(int userId);
  }