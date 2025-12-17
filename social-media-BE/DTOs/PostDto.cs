namespace social_media_BE.DTOs
{
    public class PostDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public int SocialMediaId { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? PathFile { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
