namespace PilatesStudio.Api.Models;

public class UserPackage
{
    public int Id { get; set; }
    public int RemainingCredits { get; set; }
    public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;
    public DateTime ExpiryDate { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;

    public int PackageId { get; set; }
    public Package Package { get; set; } = null!;
}