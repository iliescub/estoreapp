 using Microsoft.AspNetCore.Mvc;
  using OnlineStore.Core.Entities;
  using OnlineStore.Core.Interfaces;

  namespace OnlineStore.API.Controllers;

  [ApiController]
  [Route("api/[controller]")]
  public class OrdersController : ControllerBase
  {
      private readonly IOrderRepository _orderRepository;
      private readonly IOrderItemRepository _orderItemRepository;

      public OrdersController(IOrderRepository orderRepository, IOrderItemRepository orderItemRepository)
      {
          _orderRepository = orderRepository;
          _orderItemRepository = orderItemRepository;
      }

      [HttpGet]
      public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
      {
          var orders = await _orderRepository.GetAllWithItemsAsync();
          return Ok(orders);
      }

      [HttpGet("{id}")]
      public async Task<ActionResult<Order>> GetOrder(int id)
      {
          var order = await _orderRepository.GetWithItemsAsync(id);
          if (order is null) return NotFound();
          return Ok(order);
      }

      [HttpGet("user/{userId}")]
      public async Task<ActionResult<IEnumerable<Order>>> GetByUser(int userId)
      {
          var orders = await _orderRepository.GetByUserAsync(userId);
          return Ok(orders);
      }

      [HttpPost]
      public async Task<ActionResult<Order>> CreateOrder(Order order)
      {
          order.CreatedAt = DateTime.UtcNow;
          var created = await _orderRepository.AddAsync(order);
          return CreatedAtAction(nameof(GetOrder), new { id = created.OrderId }, created);
      }

      [HttpPut("{id}")]
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
      public async Task<IActionResult> DeleteOrder(int id)
      {
          var existing = await _orderRepository.GetByIdAsync(id);
          if (existing is null) return NotFound();

          await _orderRepository.DeleteAsync(id);
          return NoContent();
      }

      [HttpGet("{orderId}/items")]
      public async Task<ActionResult<IEnumerable<OrderItem>>> GetOrderItems(int orderId)
      {
          var order = await _orderRepository.GetByIdAsync(orderId);
          if (order is null) return NotFound();

          var items = await _orderItemRepository.GetByOrderAsync(orderId);
          return Ok(items);
      }
  }