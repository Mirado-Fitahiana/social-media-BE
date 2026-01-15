using System.ComponentModel.DataAnnotations;

namespace social_media_BE.DTOs
{
    public class UpdateProfileDto
    {
        [Required(ErrorMessage = "Le nom d'utilisateur est requis")]
        [StringLength(50, ErrorMessage = "Le nom d'utilisateur ne peut pas dépasser 50 caractères")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "L'email est requis")]
        [EmailAddress(ErrorMessage = "Format d'email invalide")]
        [StringLength(100, ErrorMessage = "L'email ne peut pas dépasser 100 caractères")]
        public string Email { get; set; } = string.Empty;
    }
}
