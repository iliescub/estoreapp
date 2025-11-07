using Microsoft.EntityFrameworkCore;
using OnlineStore.Core.Entities;

namespace OnlineStore.Infrastructure.Data;

public class StoreDbContext : DbContext
{
    public StoreDbContext(DbContextOptions<StoreDbContext> options) : base(options) { }

    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(p => p.Price).HasPrecision(18, 2);
            entity.HasOne<Category>()
                  .WithMany(c => c.Products)
                  .HasForeignKey(p => p.CategoryId);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.Property(o => o.TotalAmount).HasPrecision(18, 2);
            entity.HasOne<User>()
              .WithMany()
              .HasForeignKey(o => o.UserId);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.Property(oi => oi.Price).HasPrecision(18, 2);
            entity.HasOne<Order>()
                  .WithMany(o => o.OrderItems)
                  .HasForeignKey(oi => oi.OrderId);
            entity.HasOne<Product>()
                    .WithMany()
                    .HasForeignKey(oi =>oi.ProductId);
        });

        // Seed data
        modelBuilder.Entity<Category>().HasData(
            new Category { CategoryId = 1, CategoryName = "Electronics" },
            new Category { CategoryId = 2, CategoryName = "Clothing" },
            new Category { CategoryId = 3, CategoryName = "Books" }
        );

        modelBuilder.Entity<Product>().HasData(
            new Product { ProductId = 1, ProductName = "Laptop", Description = "High-performance laptop", Price = 999.99m, Stock = 10, CategoryId = 1, ImageUrl = "https://via.placeholder.com/300", CreatedAt = new DateTime(2024, 01, 01, 0, 0, 0, DateTimeKind.Utc) },
            new Product { ProductId = 2, ProductName = "T-Shirt", Description = "Cotton t-shirt", Price = 19.99m, Stock = 50, CategoryId = 2, ImageUrl = "https://via.placeholder.com/300", CreatedAt = new DateTime(2024, 01, 01, 0, 0, 0, DateTimeKind.Utc) },
            new Product { ProductId = 3, ProductName = "Novel", Description = "Bestselling novel", Price = 14.99m, Stock = 30, CategoryId = 3, ImageUrl = "https://via.placeholder.com/300", CreatedAt = new DateTime(2024, 01, 01, 0, 0, 0, DateTimeKind.Utc) }
        );
    }
}
