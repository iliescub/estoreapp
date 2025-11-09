using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using OnlineStore.API.Models.Orders;
using OnlineStore.Core.Entities;
using OnlineStore.Core.Interfaces;
using OnlineStore.Infrastructure.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace OnlineStore.API.Controllers;

  [ApiController]
  [Route("api/[controller]")]
  public class OrdersController : ControllerBase
  {
      private readonly IOrderRepository _orderRepository;
      private readonly IOrderItemRepository _orderItemRepository;
      private readonly IProductRepository _productRepository;
    private readonly StoreDbContext _dbContext;

    public OrdersController(IOrderRepository orderRepository, IOrderItemRepository orderItemRepository,
        IProductRepository productRepository, StoreDbContext dbContext)
    {
          _orderRepository = orderRepository;
          _orderItemRepository = orderItemRepository;
        _productRepository = productRepository;
        _dbContext = dbContext;

    }

      [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
      {
          var orders = await _orderRepository.GetAllWithItemsAsync();
          return Ok(orders);
      }

      [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<Order>> GetOrder(int id)
      {
          var order = await _orderRepository.GetWithItemsAsync(id);
          if (order is null) return NotFound();
          if (!User.IsInRole("Admin"))
          {
             var userId = GetUserId();
             if (userId is null || order.UserId != userId)
                     return Forbid();
          }
        return Ok(order);
      }

      [HttpGet("user/{userId}")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<Order>>> GetByUser(int userId)
    {
        if (!User.IsInRole("Admin"))
        {
            var callerId = GetUserId();
            if (callerId is null || callerId != userId)
                return Forbid();
        }
        var orders = await _orderRepository.GetByUserAsync(userId);
          return Ok(orders);
      }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Order>> CreateOrder([FromBody] CreateOrderRequest request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var userId = GetUserId();
        if (userId is null)
            return Forbid();

        await using var tx = await _dbContext.Database.BeginTransactionAsync();

        var orderItems = new List<OrderItem>();
        decimal total = 0;

        foreach (var item in request.Items)
        {
            var product = await _productRepository.GetByIdAsync(item.ProductId);
            if (product is null)
                return BadRequest($"Product {item.ProductId} not found.");

            if (product.Stock < item.Quantity)
                return BadRequest($"Insufficient stock for {product.ProductName}.");

            product.Stock -= item.Quantity;
            await _productRepository.UpdateAsync(product);

            orderItems.Add(new OrderItem
            {
                ProductId = product.ProductId,
                Quantity = item.Quantity,
                Price = product.Price
            });

            total += product.Price * item.Quantity;
        }

        var order = new Order
        {
            UserId = userId.Value,
            Status = OrderStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            TotalAmount = total,
            OrderItems = orderItems
        };

        var created = await _orderRepository.AddAsync(order);

        await tx.CommitAsync();

        return CreatedAtAction(nameof(GetOrder), new { id = created.OrderId }, created);
    }
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateOrder(int id, Order order)
      {
          if (id != order.OrderId) return BadRequest();

          var existing = await _orderRepository.GetByIdAsync(id);
          if (existing is null) return NotFound();

          existing.UserId = order.UserId;
          existing.TotalAmount = order.TotalAmount;
          existing.Status = order.Status;
          existing.CreatedAt = order.CreatedAt;

          await _orderRepository.UpdateAsync(existing);
          return NoContent();
      }

      [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteOrder(int id)
      {
          var existing = await _orderRepository.GetByIdAsync(id);
          if (existing is null) return NotFound();

          await _orderRepository.DeleteAsync(id);
          return NoContent();
      }

    [HttpGet("{orderId}/items")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<OrderItem>>> GetOrderItems(int orderId)
      {
          var order = await _orderRepository.GetByIdAsync(orderId);
          if (order is null) return NotFound();
        if (!User.IsInRole("Admin"))
        {
            var userId = GetUserId();
            if (userId is null || order.UserId != userId)
                return Forbid();
        }
        var items = await _orderItemRepository.GetByOrderAsync(orderId);
        return Ok(items);
    }
    private int? GetUserId()
    {
        var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ??
            User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(sub, out var id) ? id : null;
    }
}