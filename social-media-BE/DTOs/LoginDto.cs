using System.ComponentModel.DataAnnotations;

namespace social_media_BE.DTOs
{
    public class LoginDto
    {
        [Required(ErrorMessage = "Le nom d'utilisateur ou l'email est requis")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le mot de passe est requis")]
        public string Password { get; set; } = string.Empty;
    }
}
