using Microsoft.AspNetCore.Mvc;
using social_media_BE.Data;
using social_media_BE.Data.Repositories;
using social_media_BE.DTOs;

namespace social_media_BE.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserRepository _userRepository;

        public AuthController(SqlConnectionFactory connectionFactory)
        {
            _userRepository = new UserRepository(connectionFactory);
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userId = await _userRepository.RegisterAsync(
                    registerDto.Username,
                    registerDto.Email,
                    registerDto.Name,
                    registerDto.Password
                );

                var user = await _userRepository.GetUserByIdAsync(userId);
                
                if (user == null)
                {
                    return StatusCode(500, new { message = "Erreur lors de la création de l'utilisateur" });
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

                return CreatedAtAction(nameof(Register), new { id = userId }, new
                {
                    message = "Utilisateur créé avec succès",
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

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = await _userRepository.LoginAsync(loginDto.Username, loginDto.Password);

                if (user == null)
                {
                    return Unauthorized(new { message = "Nom d'utilisateur ou mot de passe incorrect" });
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
                    message = "Connexion réussie",
                    user = userDto
                    // TODO: Ajouter un JWT token ici
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur serveur", error = ex.Message });
            }
        }
    }
}
