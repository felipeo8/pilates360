using PilatesStudio.Api.Models;

namespace PilatesStudio.Api.Interfaces;

public interface ITokenService
{
    Task<string> GenerateTokenAsync(User user);
}