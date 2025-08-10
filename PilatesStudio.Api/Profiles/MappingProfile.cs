using AutoMapper;
using PilatesStudio.Api.DTOs;
using PilatesStudio.Api.Models;

namespace PilatesStudio.Api.Profiles;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>();
        CreateMap<RegisterDto, User>();
        CreateMap<Class, ClassDto>()
            .ForMember(dest => dest.AvailableSpots, opt => opt.Ignore())
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.ClassType.Price))
            .ForMember(dest => dest.ClassTypeName, opt => opt.MapFrom(src => src.ClassType.Name))
            .ForMember(dest => dest.InstructorName, opt => opt.MapFrom(src => $"{src.Instructor.FirstName} {src.Instructor.LastName}"))
            .ForMember(dest => dest.StudioName, opt => opt.MapFrom(src => src.Studio.Name));
        
        CreateMap<Booking, BookingDto>();
    }
}