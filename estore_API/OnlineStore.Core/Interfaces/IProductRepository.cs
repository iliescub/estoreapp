using OnlineStore.Core.Entities;

namespace OnlineStore.Core.Interfaces;

public interface IProductRepository : IRepository<Product>
{
    Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId);
    Task<IEnumerable<Product>> SearchAsync(string searchTerm);
}
