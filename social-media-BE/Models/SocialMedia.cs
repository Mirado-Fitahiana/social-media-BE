namespace social_media_BE.Models
{
    public class SocialMedia
    {
        public int Id { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string? IconLogo { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
