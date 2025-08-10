using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PilatesStudio.Api.DTOs;
using PilatesStudio.Api.Interfaces;

namespace PilatesStudio.Api.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
public class ClassesController : ControllerBase
{
    private readonly IClassService _classService;

    public ClassesController(IClassService classService)
    {
        _classService = classService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClassDto>>> GetClasses([FromQuery] DateTime? date = null)
    {
        var classes = await _classService.GetClassesAsync(date);
        return Ok(classes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ClassDto>> GetClass(int id)
    {
        var classDto = await _classService.GetClassByIdAsync(id);
        if (classDto == null)
            return NotFound();

        return Ok(classDto);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Instructor")]
    public async Task<ActionResult<ClassDto>> CreateClass([FromBody] ClassDto classDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var createdClass = await _classService.CreateClassAsync(classDto);
        return CreatedAtAction(nameof(GetClass), new { id = createdClass.Id }, createdClass);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Instructor")]
    public async Task<ActionResult<ClassDto>> UpdateClass(int id, [FromBody] ClassDto classDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var updatedClass = await _classService.UpdateClassAsync(id, classDto);
            return Ok(updatedClass);
        }
        catch (ArgumentException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteClass(int id)
    {
        var result = await _classService.DeleteClassAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }
}