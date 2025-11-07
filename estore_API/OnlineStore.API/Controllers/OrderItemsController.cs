 using Microsoft.AspNetCore.Mvc;
  using OnlineStore.Core.Entities;
  using OnlineStore.Core.Interfaces;

  namespace OnlineStore.API.Controllers;

  [ApiController]
  [Route("api/[controller]")]
  public class OrderItemsController : ControllerBase
  {
      private readonly IOrderItemRepository _orderItemRepository;

      public OrderItemsController(IOrderItemRepository orderItemRepository)
      {
          _orderItemRepository = orderItemRepository;
      }

      [HttpGet]
      public async Task<ActionResult<IEnumerable<OrderItem>>> GetOrderItems()
      {
          var items = await _orderItemRepository.GetAllAsync();
          return Ok(items);
      }

      [HttpGet("{id}")]
      public async Task<ActionResult<OrderItem>> GetOrderItem(int id)
      {
          var item = await _orderItemRepository.GetByIdAsync(id);
          if (item is null) return NotFound();
          return Ok(item);
      }

      [HttpGet("order/{orderId}")]
      public async Task<ActionResult<IEnumerable<OrderItem>>> GetByOrder(int orderId)
      {
          var items = await _orderItemRepository.GetByOrderAsync(orderId);
          return Ok(items);
      }

      [HttpPost]
      public async Task<ActionResult<OrderItem>> CreateOrderItem(OrderItem orderItem)
      {
          // optionally sanitize server-managed fields here
          var created = await _orderItemRepository.AddAsync(orderItem);
          return CreatedAtAction(nameof(GetOrderItem), new { id = created.OrderItemId }, created);
      }

      [HttpPut("{id}")]
      public async Task<IActionResult> UpdateOrderItem(int id, OrderItem orderItem)
      {
          if (id != orderItem.OrderItemId) return BadRequest();

          var existing = await _orderItemRepository.GetByIdAsync(id);
          if (existing is null) return NotFound();

          existing.OrderId = orderItem.OrderId;
          existing.ProductId = orderItem.ProductId;
          existing.Quantity = orderItem.Quantity;
          existing.Price = orderItem.Price;

          await _orderItemRepository.UpdateAsync(existing);
          return NoContent();
      }

      [HttpDelete("{id}")]
      public async Task<IActionResult> DeleteOrderItem(int id)
      {
          var existing = await _orderItemRepository.GetByIdAsync(id);
          if (existing is null) return NotFound();

          await _orderItemRepository.DeleteAsync(id);
          return NoContent();
      }
  }