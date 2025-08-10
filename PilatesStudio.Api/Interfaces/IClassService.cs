using PilatesStudio.Api.DTOs;

namespace PilatesStudio.Api.Interfaces;

public interface IClassService
{
    Task<IEnumerable<ClassDto>> GetClassesAsync(DateTime? date = null);
    Task<ClassDto?> GetClassByIdAsync(int id);
    Task<ClassDto> CreateClassAsync(ClassDto classDto);
    Task<ClassDto> UpdateClassAsync(int id, ClassDto classDto);
    Task<bool> DeleteClassAsync(int id);
}