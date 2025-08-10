namespace PilatesStudio.Api.Models;

public enum BookingStatus
{
    Confirmed,
    Cancelled,
    Completed,
    NoShow
}

public class Booking
{
    public int Id { get; set; }
    public DateTime BookingDate { get; set; } = DateTime.UtcNow;
    public BookingStatus Status { get; set; } = BookingStatus.Confirmed;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;

    public int ClassId { get; set; }
    public Class Class { get; set; } = null!;
}