using PilatesStudio.Api.DTOs;

namespace PilatesStudio.Api.Interfaces;

public interface IBookingService
{
    Task<BookingDto> CreateBookingAsync(string userId, CreateBookingDto createBookingDto);
    Task<IEnumerable<BookingDto>> GetUserBookingsAsync(string userId);
    Task<BookingDto?> GetBookingByIdAsync(int id, string userId);
    Task<bool> CancelBookingAsync(int id, string userId);
}