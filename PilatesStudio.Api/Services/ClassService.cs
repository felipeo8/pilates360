using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PilatesStudio.Api.Data;
using PilatesStudio.Api.DTOs;
using PilatesStudio.Api.Interfaces;
using PilatesStudio.Api.Models;

namespace PilatesStudio.Api.Services;

public class ClassService : IClassService
{
    private readonly PilatesStudioContext _context;
    private readonly IMapper _mapper;

    public ClassService(PilatesStudioContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ClassDto>> GetClassesAsync(DateTime? date = null)
    {
        var query = _context.Classes
            .Include(c => c.ClassType)
            .Include(c => c.Instructor)
            .Include(c => c.Studio)
            .Include(c => c.Bookings)
            .Where(c => c.IsActive);

        if (date.HasValue)
        {
            var startDate = date.Value.Date;
            var endDate = startDate.AddDays(1);
            query = query.Where(c => c.StartTime >= startDate && c.StartTime < endDate);
        }

        var classes = await query.OrderBy(c => c.StartTime).ToListAsync();

        return classes.Select(c => new ClassDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            StartTime = c.StartTime,
            EndTime = c.EndTime,
            MaxCapacity = c.MaxCapacity,
            AvailableSpots = c.MaxCapacity - c.Bookings.Count(b => b.Status == BookingStatus.Confirmed),
            Price = c.ClassType.Price,
            ClassTypeName = c.ClassType.Name,
            InstructorName = $"{c.Instructor.FirstName} {c.Instructor.LastName}",
            StudioName = c.Studio.Name
        });
    }

    public async Task<ClassDto?> GetClassByIdAsync(int id)
    {
        var classEntity = await _context.Classes
            .Include(c => c.ClassType)
            .Include(c => c.Instructor)
            .Include(c => c.Studio)
            .Include(c => c.Bookings)
            .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

        if (classEntity == null)
            return null;

        return new ClassDto
        {
            Id = classEntity.Id,
            Name = classEntity.Name,
            Description = classEntity.Description,
            StartTime = classEntity.StartTime,
            EndTime = classEntity.EndTime,
            MaxCapacity = classEntity.MaxCapacity,
            AvailableSpots = classEntity.MaxCapacity - classEntity.Bookings.Count(b => b.Status == BookingStatus.Confirmed),
            Price = classEntity.ClassType.Price,
            ClassTypeName = classEntity.ClassType.Name,
            InstructorName = $"{classEntity.Instructor.FirstName} {classEntity.Instructor.LastName}",
            StudioName = classEntity.Studio.Name
        };
    }

    public async Task<ClassDto> CreateClassAsync(ClassDto classDto)
    {
        var classEntity = new Class
        {
            Name = classDto.Name,
            Description = classDto.Description,
            StartTime = classDto.StartTime,
            EndTime = classDto.EndTime,
            MaxCapacity = classDto.MaxCapacity,
            ClassTypeId = 1,
            InstructorId = 1,
            StudioId = 1
        };

        _context.Classes.Add(classEntity);
        await _context.SaveChangesAsync();

        return await GetClassByIdAsync(classEntity.Id) ?? classDto;
    }

    public async Task<ClassDto> UpdateClassAsync(int id, ClassDto classDto)
    {
        var classEntity = await _context.Classes.FindAsync(id);
        if (classEntity == null)
            throw new ArgumentException("Class not found");

        classEntity.Name = classDto.Name;
        classEntity.Description = classDto.Description;
        classEntity.StartTime = classDto.StartTime;
        classEntity.EndTime = classDto.EndTime;
        classEntity.MaxCapacity = classDto.MaxCapacity;
        classEntity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetClassByIdAsync(id) ?? classDto;
    }

    public async Task<bool> DeleteClassAsync(int id)
    {
        var classEntity = await _context.Classes.FindAsync(id);
        if (classEntity == null)
            return false;

        classEntity.IsActive = false;
        classEntity.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }
}