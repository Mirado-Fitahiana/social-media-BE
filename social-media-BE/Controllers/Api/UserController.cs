using Microsoft.AspNetCore.Mvc;
using social_media_BE.Data;
using social_media_BE.Data.Repositories;
using social_media_BE.DTOs;

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

        // PUT: api/user/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdateProfileDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updated = await _userRepository.UpdateProfileAsync(id, updateDto.Name, updateDto.Email);

                if (!updated)
                {
                    return NotFound(new { message = "Utilisateur non trouvé" });
                }

                var user = await _userRepository.GetUserByIdAsync(id);
                
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

        // PUT: api/user/{id}/password
        [HttpPut("{id}/password")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordDto changePasswordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updated = await _userRepository.ChangePasswordAsync(id, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);

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

        // DELETE: api/user/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            try
            {
                var deleted = await _userRepository.DeleteUserAsync(id);

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
