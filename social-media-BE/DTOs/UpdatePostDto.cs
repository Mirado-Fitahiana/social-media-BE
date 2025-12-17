using System.ComponentModel.DataAnnotations;

namespace social_media_BE.DTOs
{
    public class UpdatePostDto
    {
        [Required(ErrorMessage = "Le titre est requis")]
        [StringLength(255, ErrorMessage = "Le titre ne peut pas dépasser 255 caractères")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le contenu est requis")]
        public string Content { get; set; } = string.Empty;

        [Required(ErrorMessage = "L'ID du réseau social est requis")]
        public int SocialMediaId { get; set; }

        public string? PathFile { get; set; }
    }
}
