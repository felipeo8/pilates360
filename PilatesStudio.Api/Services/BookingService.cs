using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PilatesStudio.Api.Data;
using PilatesStudio.Api.DTOs;
using PilatesStudio.Api.Interfaces;
using PilatesStudio.Api.Models;

namespace PilatesStudio.Api.Services;

public class BookingService : IBookingService
{
    private readonly PilatesStudioContext _context;
    private readonly IMapper _mapper;

    public BookingService(PilatesStudioContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<BookingDto> CreateBookingAsync(string userId, CreateBookingDto createBookingDto)
    {
        var classEntity = await _context.Classes
            .Include(c => c.ClassType)
            .Include(c => c.Instructor)
            .Include(c => c.Studio)
            .Include(c => c.Bookings)
            .FirstOrDefaultAsync(c => c.Id == createBookingDto.ClassId && c.IsActive);

        if (classEntity == null)
            throw new ArgumentException("Class not found");

        var confirmedBookings = classEntity.Bookings.Count(b => b.Status == BookingStatus.Confirmed);
        if (confirmedBookings >= classEntity.MaxCapacity)
            throw new InvalidOperationException("Class is fully booked");

        var existingBooking = await _context.Bookings
            .FirstOrDefaultAsync(b => b.UserId == userId && b.ClassId == createBookingDto.ClassId && b.Status == BookingStatus.Confirmed);

        if (existingBooking != null)
            throw new InvalidOperationException("User is already booked for this class");

        var booking = new Booking
        {
            UserId = userId,
            ClassId = createBookingDto.ClassId,
            Notes = createBookingDto.Notes,
            Status = BookingStatus.Confirmed
        };

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        return new BookingDto
        {
            Id = booking.Id,
            BookingDate = booking.BookingDate,
            Status = booking.Status,
            Notes = booking.Notes,
            Class = new ClassDto
            {
                Id = classEntity.Id,
                Name = classEntity.Name,
                Description = classEntity.Description,
                StartTime = classEntity.StartTime,
                EndTime = classEntity.EndTime,
                MaxCapacity = classEntity.MaxCapacity,
                AvailableSpots = classEntity.MaxCapacity - confirmedBookings - 1,
                Price = classEntity.ClassType.Price,
                ClassTypeName = classEntity.ClassType.Name,
                InstructorName = $"{classEntity.Instructor.FirstName} {classEntity.Instructor.LastName}",
                StudioName = classEntity.Studio.Name
            }
        };
    }

    public async Task<IEnumerable<BookingDto>> GetUserBookingsAsync(string userId)
    {
        var bookings = await _context.Bookings
            .Include(b => b.Class)
                .ThenInclude(c => c.ClassType)
            .Include(b => b.Class)
                .ThenInclude(c => c.Instructor)
            .Include(b => b.Class)
                .ThenInclude(c => c.Studio)
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.Class.StartTime)
            .ToListAsync();

        return bookings.Select(b => new BookingDto
        {
            Id = b.Id,
            BookingDate = b.BookingDate,
            Status = b.Status,
            Notes = b.Notes,
            Class = new ClassDto
            {
                Id = b.Class.Id,
                Name = b.Class.Name,
                Description = b.Class.Description,
                StartTime = b.Class.StartTime,
                EndTime = b.Class.EndTime,
                MaxCapacity = b.Class.MaxCapacity,
                Price = b.Class.ClassType.Price,
                ClassTypeName = b.Class.ClassType.Name,
                InstructorName = $"{b.Class.Instructor.FirstName} {b.Class.Instructor.LastName}",
                StudioName = b.Class.Studio.Name
            }
        });
    }

    public async Task<BookingDto?> GetBookingByIdAsync(int id, string userId)
    {
        var booking = await _context.Bookings
            .Include(b => b.Class)
                .ThenInclude(c => c.ClassType)
            .Include(b => b.Class)
                .ThenInclude(c => c.Instructor)
            .Include(b => b.Class)
                .ThenInclude(c => c.Studio)
            .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

        if (booking == null)
            return null;

        return new BookingDto
        {
            Id = booking.Id,
            BookingDate = booking.BookingDate,
            Status = booking.Status,
            Notes = booking.Notes,
            Class = new ClassDto
            {
                Id = booking.Class.Id,
                Name = booking.Class.Name,
                Description = booking.Class.Description,
                StartTime = booking.Class.StartTime,
                EndTime = booking.Class.EndTime,
                MaxCapacity = booking.Class.MaxCapacity,
                Price = booking.Class.ClassType.Price,
                ClassTypeName = booking.Class.ClassType.Name,
                InstructorName = $"{booking.Class.Instructor.FirstName} {booking.Class.Instructor.LastName}",
                StudioName = booking.Class.Studio.Name
            }
        };
    }

    public async Task<bool> CancelBookingAsync(int id, string userId)
    {
        var booking = await _context.Bookings
            .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

        if (booking == null || booking.Status != BookingStatus.Confirmed)
            return false;

        booking.Status = BookingStatus.Cancelled;
        booking.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }
}