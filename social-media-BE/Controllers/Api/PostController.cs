using Microsoft.AspNetCore.Mvc;
using social_media_BE.Data;
using social_media_BE.Data.Repositories;
using social_media_BE.DTOs;
using social_media_BE.Helpers;

namespace social_media_BE.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostController : ControllerBase
    {
        private readonly PostRepository _postRepository;
        private readonly UserRepository _userRepository;

        public PostController(SqlConnectionFactory connectionFactory)
        {
            _postRepository = new PostRepository(connectionFactory);
            _userRepository = new UserRepository(connectionFactory);
        }

        // Extraire le fichier du formulaire
        private async Task<string?> HandleFileUploadAsync()
        {
            if (Request.Form.Files.Count > 0)
            {
                var file = Request.Form.Files[0];
                return await FileHelper.SaveFileAsync(file);
            }
            return null;
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

            // Récupérer l'utilisateur par username pour obtenir son ID
            var user = await _userRepository.LoginAsync(username, ""); // On cherche juste l'utilisateur
            
            if (user == null)
            {
                // Essayer de chercher par email
                var users = await _userRepository.GetUserByUsernameOrEmailAsync(username);
                return users?.Id;
            }

            return user.Id;
        }

        // POST: api/post - Créer un nouveau post
        [HttpPost]
        public async Task<IActionResult> CreatePost([FromForm] CreatePostDto createPostDto, IFormFile? file)
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
                    return Unauthorized(new { message = "Token invalide ou expiré" });
                }

                // Gérer l'upload du fichier si présent
                string? filePath = null;
                if (file != null && file.Length > 0)
                {
                    filePath = await FileHelper.SaveFileAsync(file);
                    createPostDto.PathFile = filePath;
                }

                var postId = await _postRepository.CreatePostAsync(
                    userId.Value,
                    createPostDto.SocialMediaId,
                    createPostDto.Title,
                    createPostDto.Content,
                    createPostDto.PathFile
                );

                var post = await _postRepository.GetPostDetailsByIdAsync(postId, userId.Value);

                return CreatedAtAction(nameof(GetPost), new { id = postId }, new
                {
                    message = "Post créé avec succès",
                    post = post,
                    filePath = filePath
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur serveur", error = ex.Message });
            }
        }

        // GET: api/post - Récupérer tous les posts de l'utilisateur
        [HttpGet]
        public async Task<IActionResult> GetAllPosts()
        {
            try
            {
                var userId = await GetUserIdFromAuthorizationAsync();
                
                if (userId == null)
                {
                    return Unauthorized(new { message = "Token invalide ou expiré" });
                }

                var posts = await _postRepository.GetAllPostsWithDetailsAsync(userId.Value);

                return Ok(new
                {
                    message = "Posts récupérés avec succès",
                    posts = posts,
                    total = posts.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur serveur", error = ex.Message });
            }
        }

        // GET: api/post/{id} - Récupérer un post par ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(int id)
        {
            try
            {
                var userId = await GetUserIdFromAuthorizationAsync();
                
                if (userId == null)
                {
                    return Unauthorized(new { message = "Token invalide ou expiré" });
                }

                var post = await _postRepository.GetPostDetailsByIdAsync(id, userId.Value);

                if (post == null)
                {
                    return NotFound(new { message = "Post non trouvé" });
                }

                return Ok(new
                {
                    message = "Post récupéré avec succès",
                    post = post
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur serveur", error = ex.Message });
            }
        }

        // PUT: api/post/{id} - Mettre à jour un post
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, [FromForm] UpdatePostDto updatePostDto, IFormFile? file)
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
                    return Unauthorized(new { message = "Token invalide ou expiré" });
                }

                // Vérifier que le post appartient à l'utilisateur
                var existingPost = await _postRepository.GetPostByIdAsync(id, userId.Value);
                if (existingPost == null)
                {
                    return NotFound(new { message = "Post non trouvé" });
                }

                // Gérer le nouveau fichier si présent
                if (file != null && file.Length > 0)
                {
                    // Supprimer l'ancien fichier
                    FileHelper.DeleteFile(existingPost.PathFile);
                    
                    // Sauvegarder le nouveau
                    var filePath = await FileHelper.SaveFileAsync(file);
                    updatePostDto.PathFile = filePath;
                }

                var updated = await _postRepository.UpdatePostAsync(
                    id,
                    userId.Value,
                    updatePostDto.SocialMediaId,
                    updatePostDto.Title,
                    updatePostDto.Content,
                    updatePostDto.PathFile
                );

                if (!updated)
                {
                    return NotFound(new { message = "Post non trouvé ou non autorisé" });
                }

                var post = await _postRepository.GetPostDetailsByIdAsync(id, userId.Value);

                return Ok(new
                {
                    message = "Post mis à jour avec succès",
                    post = post
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur serveur", error = ex.Message });
            }
        }

        // DELETE: api/post/{id} - Supprimer un post
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            try
            {
                var userId = await GetUserIdFromAuthorizationAsync();
                
                if (userId == null)
                {
                    return Unauthorized(new { message = "Token invalide ou expiré" });
                }

                // Récupérer le post pour supprimer le fichier
                var existingPost = await _postRepository.GetPostByIdAsync(id, userId.Value);
                if (existingPost == null)
                {
                    return NotFound(new { message = "Post non trouvé" });
                }

                // Supprimer le fichier associé si présent
                FileHelper.DeleteFile(existingPost.PathFile);

                var deleted = await _postRepository.DeletePostAsync(id, userId.Value);

                if (!deleted)
                {
                    return NotFound(new { message = "Post non trouvé ou non autorisé" });
                }

                return Ok(new { message = "Post supprimé avec succès" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur serveur", error = ex.Message });
            }
        }
    }
}
