using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PilatesStudio.Api.Models;

namespace PilatesStudio.Api.Data;

public class PilatesStudioContext : IdentityDbContext<User>
{
    public PilatesStudioContext(DbContextOptions<PilatesStudioContext> options) : base(options)
    {
    }

    public DbSet<Instructor> Instructors { get; set; }
    public DbSet<Studio> Studios { get; set; }
    public DbSet<ClassType> ClassTypes { get; set; }
    public DbSet<Class> Classes { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<Package> Packages { get; set; }
    public DbSet<UserPackage> UserPackages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Customize Identity table names (remove AspNet prefix)
        modelBuilder.Entity<User>(entity => {
            entity.ToTable("Users");
            entity.Property(e => e.FirstName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.LastName).HasMaxLength(100).IsRequired();
        });

        modelBuilder.Entity<IdentityRole>(entity => {
            entity.ToTable("Roles");
        });

        modelBuilder.Entity<IdentityUserRole<string>>(entity => {
            entity.ToTable("UserRoles");
        });

        modelBuilder.Entity<IdentityUserClaim<string>>(entity => {
            entity.ToTable("UserClaims");
        });

        modelBuilder.Entity<IdentityUserLogin<string>>(entity => {
            entity.ToTable("UserLogins");
        });

        modelBuilder.Entity<IdentityRoleClaim<string>>(entity => {
            entity.ToTable("RoleClaims");
        });

        modelBuilder.Entity<IdentityUserToken<string>>(entity => {
            entity.ToTable("UserTokens");
        });

        modelBuilder.Entity<Instructor>(entity =>
        {
            entity.Property(e => e.FirstName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.LastName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Email).HasMaxLength(255).IsRequired();
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.Bio).HasMaxLength(1000);
        });

        modelBuilder.Entity<Studio>(entity =>
        {
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(500);
        });

        modelBuilder.Entity<ClassType>(entity =>
        {
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Price).HasColumnType("decimal(10,2)");
        });

        modelBuilder.Entity<Class>(entity =>
        {
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(500);

            entity.HasOne(e => e.ClassType)
                .WithMany(ct => ct.Classes)
                .HasForeignKey(e => e.ClassTypeId);

            entity.HasOne(e => e.Instructor)
                .WithMany(i => i.Classes)
                .HasForeignKey(e => e.InstructorId);

            entity.HasOne(e => e.Studio)
                .WithMany(s => s.Classes)
                .HasForeignKey(e => e.StudioId);
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.Property(e => e.Notes).HasMaxLength(500);

            entity.HasOne(e => e.User)
                .WithMany(u => u.Bookings)
                .HasForeignKey(e => e.UserId);

            entity.HasOne(e => e.Class)
                .WithMany(c => c.Bookings)
                .HasForeignKey(e => e.ClassId);
        });

        modelBuilder.Entity<Package>(entity =>
        {
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Price).HasColumnType("decimal(10,2)");
        });

        modelBuilder.Entity<UserPackage>(entity =>
        {
            entity.HasOne(e => e.User)
                .WithMany(u => u.UserPackages)
                .HasForeignKey(e => e.UserId);

            entity.HasOne(e => e.Package)
                .WithMany(p => p.UserPackages)
                .HasForeignKey(e => e.PackageId);
        });
    }
}