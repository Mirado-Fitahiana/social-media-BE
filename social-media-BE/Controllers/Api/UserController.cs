using Microsoft.AspNetCore.Mvc;
using social_media_BE.Data;
using social_media_BE.Data.Repositories;
using social_media_BE.DTOs;
using social_media_BE.Helpers;

namespace social_media_BE.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserRepository _userRepository;

        public UserController(SqlConnectionFactory connectionFactory)
        {
            _userRepository = new UserRepository(connectionFactory);
        }

        // Helper pour extraire l'userId du token
        private async Task<int?> GetUserIdFromAuthorizationAsync()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return null;
            }

            var token = authHeader.Substring("Bearer ".Length).Trim();
            var username = TokenHelper.GetUsernameFromToken(token);

            if (string.IsNullOrEmpty(username))
            {
                return null;
            }

            var user = await _userRepository.GetUserByUsernameOrEmailAsync(username);
            return user?.Id;
        }

        // PUT: api/user/update-profile
        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userId = await GetUserIdFromAuthorizationAsync();
                if (userId == null)
                {
                    return Unauthorized(new { message = "Token invalide ou utilisateur non trouvé" });
                }

                var updated = await _userRepository.UpdateProfileAsync(userId.Value, updateDto.Username, updateDto.Email);

                if (!updated)
                {
                    return NotFound(new { message = "Utilisateur non trouvé" });
                }

                var user = await _userRepository.GetUserByIdAsync(userId.Value);
                
                if (user == null)
                {
                    return StatusCode(500, new { message = "Erreur lors de la récupération de l'utilisateur" });
                }

                var userDto = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    Name = user.Name,
                    Role = user.Role,
                    CreatedAt = user.CreatedAt
                };

                return Ok(new
                {
                    message = "Profil mis à jour avec succès",
                    user = userDto
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur serveur", error = ex.Message });
            }
        }

        // PUT: api/user/change-password
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userId = await GetUserIdFromAuthorizationAsync();
                if (userId == null)
                {
                    return Unauthorized(new { message = "Token invalide ou utilisateur non trouvé" });
                }

                var updated = await _userRepository.ChangePasswordAsync(userId.Value, changePasswordDto.OldPassword, changePasswordDto.NewPassword);

                if (!updated)
                {
                    return BadRequest(new { message = "Mot de passe actuel incorrect" });
                }

                return Ok(new { message = "Mot de passe modifié avec succès" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur serveur", error = ex.Message });
            }
        }

        // DELETE: api/user/delete-account
        [HttpDelete("delete-account")]
        public async Task<IActionResult> DeleteAccount()
        {
            try
            {
                var userId = await GetUserIdFromAuthorizationAsync();
                if (userId == null)
                {
                    return Unauthorized(new { message = "Token invalide ou utilisateur non trouvé" });
                }

                var deleted = await _userRepository.DeleteUserAsync(userId.Value);

                if (!deleted)
                {
                    return NotFound(new { message = "Utilisateur non trouvé" });
                }

                return Ok(new { message = "Compte supprimé avec succès" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur serveur", error = ex.Message });
            }
        }
    }
}
