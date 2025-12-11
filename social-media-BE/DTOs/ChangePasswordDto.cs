using System.ComponentModel.DataAnnotations;

namespace social_media_BE.DTOs
{
    public class ChangePasswordDto
    {
        [Required(ErrorMessage = "Le mot de passe actuel est requis")]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le nouveau mot de passe est requis")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Le mot de passe doit contenir au moins 6 caractères")]
        public string NewPassword { get; set; } = string.Empty;
    }
}
