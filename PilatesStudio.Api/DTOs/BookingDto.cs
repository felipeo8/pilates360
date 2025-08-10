using PilatesStudio.Api.Models;

namespace PilatesStudio.Api.DTOs;

public class BookingDto
{
    public int Id { get; set; }
    public DateTime BookingDate { get; set; }
    public BookingStatus Status { get; set; }
    public string? Notes { get; set; }
    public ClassDto Class { get; set; } = null!;
}

public class CreateBookingDto
{
    public int ClassId { get; set; }
    public string? Notes { get; set; }
}