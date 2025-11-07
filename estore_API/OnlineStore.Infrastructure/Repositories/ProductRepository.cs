using Microsoft.EntityFrameworkCore;
using OnlineStore.Core.Entities;
using OnlineStore.Core.Interfaces;
using OnlineStore.Infrastructure.Data;

namespace OnlineStore.Infrastructure.Repositories;

public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(StoreDbContext context) : base(context) { }

    public async Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId)
    {
        return await _dbSet
//            .Include(p => p.Category)
            .Where(p => p.CategoryId == categoryId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> SearchAsync(string searchTerm)
    {
        return await _dbSet
 //           .Include(p => p.Category)
            .Where(p => p.ProductName.Contains(searchTerm) || p.Description.Contains(searchTerm))
            .ToListAsync();
    }
}
