namespace social_media_BE.Models
{
    public class Post
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int SocialMediaId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? PathFile { get; set; }
        public DateTime CreatedAt { get; set; }
        
        // Navigation properties
        public User? User { get; set; }
        public SocialMedia? SocialMedia { get; set; }
    }
}
