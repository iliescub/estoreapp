using Microsoft.AspNetCore.Mvc;
using OnlineStore.Core.Entities;
using OnlineStore.Core.Interfaces;

namespace OnlineStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly IRepository<Category> _categoryRepository;

    public CategoriesController(IRepository<Category> categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        var categories = await _categoryRepository.GetAllAsync();
        return Ok(categories);
    }
}
