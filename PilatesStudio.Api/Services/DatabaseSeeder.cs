using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PilatesStudio.Api.Data;
using PilatesStudio.Api.Models;

namespace PilatesStudio.Api.Services;

public class DatabaseSeeder
{
    private readonly PilatesStudioContext _context;
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(
        PilatesStudioContext context,
        UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager,
        ILogger<DatabaseSeeder> logger)
    {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        try
        {
            // Ensure database is created
            await _context.Database.EnsureCreatedAsync();

            // Seed roles first
            await SeedRolesAsync();

            // Seed users
            await SeedUsersAsync();

            // Seed sample data
            await SeedSampleDataAsync();

            _logger.LogInformation("Database seeding completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database");
            throw;
        }
    }

    private async Task SeedRolesAsync()
    {
        string[] roles = { "Admin", "Instructor", "Customer" };

        foreach (var role in roles)
        {
            if (!await _roleManager.RoleExistsAsync(role))
            {
                await _roleManager.CreateAsync(new IdentityRole(role));
                _logger.LogInformation($"Created role: {role}");
            }
        }
    }

    private async Task SeedUsersAsync()
    {
        // Create Admin User
        await CreateUserIfNotExists(
            email: "admin@pilatesstudio.com",
            password: "Admin123!",
            firstName: "Admin",
            lastName: "User",
            role: "Admin",
            phoneNumber: "+1234567890"
        );

        // Create Instructor User
        await CreateUserIfNotExists(
            email: "instructor@pilatesstudio.com",
            password: "Instructor123!",
            firstName: "Maria",
            lastName: "Rodriguez",
            role: "Instructor",
            phoneNumber: "+1234567891"
        );

        // Create Customer User
        await CreateUserIfNotExists(
            email: "customer@pilatesstudio.com",
            password: "Customer123!",
            firstName: "John",
            lastName: "Smith",
            role: "Customer",
            phoneNumber: "+1234567892"
        );

        // Create Test Customer
        await CreateUserIfNotExists(
            email: "test@test.com",
            password: "Test123!",
            firstName: "Test",
            lastName: "User",
            role: "Customer",
            phoneNumber: "+1234567893"
        );
    }

    private async Task CreateUserIfNotExists(
        string email,
        string password,
        string firstName,
        string lastName,
        string role,
        string phoneNumber = "")
    {
        var existingUser = await _userManager.FindByEmailAsync(email);
        if (existingUser != null)
        {
            _logger.LogInformation($"User {email} already exists, skipping creation");
            return;
        }

        var user = new User
        {
            UserName = email,
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            PhoneNumber = phoneNumber,
            EmailConfirmed = true,
            DateOfBirth = DateTime.UtcNow.AddYears(-30), // Default age of 30
            IsActive = true
        };

        var result = await _userManager.CreateAsync(user, password);
        if (result.Succeeded)
        {
            await _userManager.AddToRoleAsync(user, role);
            _logger.LogInformation($"Created user: {email} with role: {role}");
        }
        else
        {
            _logger.LogError($"Failed to create user {email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }
    }

    private async Task SeedSampleDataAsync()
    {
        // Create Studios if none exist
        if (!await _context.Studios.AnyAsync())
        {
            var studios = new[]
            {
                new Studio { Name = "Main Studio", Description = "Our main pilates studio with full equipment", Capacity = 15 },
                new Studio { Name = "Private Room", Description = "Intimate space for private sessions", Capacity = 4 },
                new Studio { Name = "Outdoor Deck", Description = "Beautiful outdoor space for mat classes", Capacity = 20 }
            };

            _context.Studios.AddRange(studios);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Created {studios.Length} studios");
        }

        // Create Instructors if none exist
        if (!await _context.Instructors.AnyAsync())
        {
            var instructors = new[]
            {
                new Instructor 
                { 
                    FirstName = "Maria", 
                    LastName = "Rodriguez", 
                    Email = "instructor@pilatesstudio.com",
                    Phone = "+1234567891",
                    Bio = "Certified Pilates instructor with 10+ years of experience",
                    HireDate = DateTime.UtcNow.AddYears(-2)
                },
                new Instructor 
                { 
                    FirstName = "Sarah", 
                    LastName = "Johnson", 
                    Email = "sarah@pilatesstudio.com",
                    Phone = "+1234567894",
                    Bio = "Specializes in rehabilitation and therapeutic Pilates",
                    HireDate = DateTime.UtcNow.AddYears(-1)
                }
            };

            _context.Instructors.AddRange(instructors);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Created {instructors.Length} instructors");
        }

        // Create Class Types if none exist
        if (!await _context.ClassTypes.AnyAsync())
        {
            var classTypes = new[]
            {
                new ClassType { Name = "Beginner Mat", Description = "Introduction to Pilates fundamentals", Duration = 60, Price = 25.00m },
                new ClassType { Name = "Intermediate Mat", Description = "Build strength and flexibility", Duration = 60, Price = 30.00m },
                new ClassType { Name = "Advanced Mat", Description = "Challenge your limits", Duration = 75, Price = 35.00m },
                new ClassType { Name = "Reformer Basics", Description = "Introduction to reformer equipment", Duration = 60, Price = 45.00m },
                new ClassType { Name = "Private Session", Description = "One-on-one personalized training", Duration = 60, Price = 85.00m }
            };

            _context.ClassTypes.AddRange(classTypes);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Created {classTypes.Length} class types");
        }

        // Create Packages if none exist
        if (!await _context.Packages.AnyAsync())
        {
            var packages = new[]
            {
                new Package { Name = "Drop-in Class", Description = "Single class pass", Credits = 1, Price = 30.00m, ValidityDays = 1 },
                new Package { Name = "5-Class Pack", Description = "5 classes to use within 2 months", Credits = 5, Price = 135.00m, ValidityDays = 60 },
                new Package { Name = "10-Class Pack", Description = "10 classes to use within 3 months", Credits = 10, Price = 250.00m, ValidityDays = 90 },
                new Package { Name = "Unlimited Monthly", Description = "Unlimited classes for 1 month", Credits = 999, Price = 150.00m, ValidityDays = 30 }
            };

            _context.Packages.AddRange(packages);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Created {packages.Length} packages");
        }

        // Create Sample Classes for the next 7 days
        await CreateSampleClasses();
    }

    private async Task CreateSampleClasses()
    {
        var today = DateTime.Today;
        var hasClasses = await _context.Classes.AnyAsync(c => c.StartTime >= today && c.StartTime < today.AddDays(7));
        
        if (hasClasses)
        {
            _logger.LogInformation("Sample classes for this week already exist, skipping creation");
            return;
        }

        var studios = await _context.Studios.ToListAsync();
        var instructors = await _context.Instructors.ToListAsync();
        var classTypes = await _context.ClassTypes.ToListAsync();

        if (!studios.Any() || !instructors.Any() || !classTypes.Any())
        {
            _logger.LogWarning("Cannot create sample classes: missing studios, instructors, or class types");
            return;
        }

        var sampleClasses = new List<Class>();
        var random = new Random();

        // Create classes for the next 7 days
        for (int day = 0; day < 7; day++)
        {
            var currentDate = today.AddDays(day);
            
            // Morning classes (9 AM, 10:30 AM)
            var morningTimes = new[] { new TimeSpan(9, 0, 0), new TimeSpan(10, 30, 0) };
            
            // Evening classes (6 PM, 7:30 PM)
            var eveningTimes = new[] { new TimeSpan(18, 0, 0), new TimeSpan(19, 30, 0) };
            
            var allTimes = morningTimes.Concat(eveningTimes).ToArray();

            foreach (var time in allTimes)
            {
                var startTime = currentDate.Add(time);
                var classType = classTypes[random.Next(classTypes.Count)];
                var instructor = instructors[random.Next(instructors.Count)];
                var studio = studios[random.Next(studios.Count)];

                var pilatesClass = new Class
                {
                    Name = $"{classType.Name} - {instructor.FirstName}",
                    Description = classType.Description,
                    StartTime = startTime,
                    EndTime = startTime.AddMinutes(classType.Duration),
                    MaxCapacity = Math.Min(studio.Capacity, 12), // Cap at 12 for better experience
                    ClassTypeId = classType.Id,
                    InstructorId = instructor.Id,
                    StudioId = studio.Id,
                    IsActive = true
                };

                sampleClasses.Add(pilatesClass);
            }
        }

        _context.Classes.AddRange(sampleClasses);
        await _context.SaveChangesAsync();
        _logger.LogInformation($"Created {sampleClasses.Count} sample classes for the next 7 days");
    }
}