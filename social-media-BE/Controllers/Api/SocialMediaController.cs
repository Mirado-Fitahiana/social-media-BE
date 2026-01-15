using Microsoft.AspNetCore.Mvc;
using social_media_BE.Data;
using social_media_BE.Data.Repositories;

namespace social_media_BE.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class SocialMediaController : ControllerBase
    {
        private readonly SocialMediaRepository _socialMediaRepository;

        public SocialMediaController(SqlConnectionFactory connectionFactory)
        {
            _socialMediaRepository = new SocialMediaRepository(connectionFactory);
        }

        // GET: api/socialmedia - Récupérer tous les réseaux sociaux
        [HttpGet]
        public async Task<IActionResult> GetAllSocialMedias()
        {
            try
            {
                var socialMedias = await _socialMediaRepository.GetAllSocialMediasAsync();

                return Ok(new
                {
                    message = "Réseaux sociaux récupérés avec succès",
                    socialMedias = socialMedias,
                    total = socialMedias.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur serveur", error = ex.Message });
            }
        }

        // GET: api/socialmedia/{id} - Récupérer un réseau social par ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSocialMedia(int id)
        {
            try
            {
                var socialMedia = await _socialMediaRepository.GetSocialMediaByIdAsync(id);

                if (socialMedia == null)
                {
                    return NotFound(new { message = "Réseau social non trouvé" });
                }

                return Ok(new
                {
                    message = "Réseau social récupéré avec succès",
                    socialMedia = socialMedia
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur serveur", error = ex.Message });
            }
        }
    }
}
