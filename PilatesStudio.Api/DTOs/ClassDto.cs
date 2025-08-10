namespace PilatesStudio.Api.DTOs;

public class ClassDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public int MaxCapacity { get; set; }
    public int AvailableSpots { get; set; }
    public decimal Price { get; set; }
    public string ClassTypeName { get; set; } = string.Empty;
    public string InstructorName { get; set; } = string.Empty;
    public string StudioName { get; set; } = string.Empty;
}