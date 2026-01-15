using Microsoft.EntityFrameworkCore;
using social_media_BE.Models;

namespace social_media_BE.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(u => u.Id);

                entity.Property(u => u.Id).HasColumnName("id");
                entity.Property(u => u.Username).HasColumnName("username").HasMaxLength(100).IsRequired();
                entity.Property(u => u.Email).HasColumnName("email").HasMaxLength(255).IsRequired();
                entity.Property(u => u.Name).HasColumnName("name").HasMaxLength(255).IsRequired();
                entity.Property(u => u.Password).HasColumnName("password").IsRequired();
                entity.Property(u => u.Role).HasColumnName("role").HasMaxLength(50).HasDefaultValue("user");
                entity.Property(u => u.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("GETDATE()");
            });
        }
    }
}
