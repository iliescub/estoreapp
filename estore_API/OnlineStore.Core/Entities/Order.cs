namespace OnlineStore.Core.Entities;

public class Order
{
    public int OrderId { get; set; }
    public int UserId { get; set; }
    //public string CustomerName { get; set; } = string.Empty;
    //public string CustomerEmail { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}

public enum OrderStatus
{
    Pending,
    Processing,
    Shipped,
    Delivered,
    Cancelled
}
