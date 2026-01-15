using Microsoft.Data.SqlClient;
using social_media_BE.Models;

namespace social_media_BE.Data.Repositories
{
    public class PostRepository
    {
        private readonly SqlConnectionFactory _connectionFactory;

        public PostRepository(SqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        // Mapper un SqlDataReader vers un objet Post
        private Post MapToPost(SqlDataReader reader)
        {
            return new Post
            {
                Id = reader.GetInt32(reader.GetOrdinal("id")),
                UserId = reader.GetInt32(reader.GetOrdinal("user_id")),
                SocialMediaId = reader.GetInt32(reader.GetOrdinal("social_media_id")),
                Title = reader.GetString(reader.GetOrdinal("title")),
                Content = reader.GetString(reader.GetOrdinal("content")),
                PathFile = reader.IsDBNull(reader.GetOrdinal("path_file")) 
                    ? null 
                    : reader.GetString(reader.GetOrdinal("path_file")),
                CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
            };
        }

        // CREATE - Créer un nouveau post
        public async Task<int> CreatePostAsync(int userId, int socialMediaId, string title, string content, string? pathFile = null)
        {
            using var connection = await _connectionFactory.CreateOpenConnectionAsync();

            var query = @"INSERT INTO posts (user_id, social_media_id, title, content, path_file) 
                         VALUES (@userId, @socialMediaId, @title, @content, @pathFile);
                         SELECT CAST(SCOPE_IDENTITY() AS int)";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@userId", userId);
            command.Parameters.AddWithValue("@socialMediaId", socialMediaId);
            command.Parameters.AddWithValue("@title", title);
            command.Parameters.AddWithValue("@content", content);
            command.Parameters.AddWithValue("@pathFile", (object?)pathFile ?? DBNull.Value);

            var postId = await command.ExecuteScalarAsync();
            return Convert.ToInt32(postId);
        }

        // READ - Récupérer tous les posts d'un utilisateur
        public async Task<List<Post>> GetPostsByUserIdAsync(int userId)
        {
            using var connection = await _connectionFactory.CreateOpenConnectionAsync();
            var posts = new List<Post>();

            var query = "SELECT * FROM posts WHERE user_id = @userId ORDER BY created_at DESC";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@userId", userId);

            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                posts.Add(MapToPost(reader));
            }

            return posts;
        }

        // READ - Récupérer un post par ID
        public async Task<Post?> GetPostByIdAsync(int postId, int userId)
        {
            using var connection = await _connectionFactory.CreateOpenConnectionAsync();

            var query = "SELECT * FROM posts WHERE id = @postId AND user_id = @userId";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@postId", postId);
            command.Parameters.AddWithValue("@userId", userId);

            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return MapToPost(reader);
            }

            return null;
        }

        // UPDATE - Mettre à jour un post
        public async Task<bool> UpdatePostAsync(int postId, int userId, int socialMediaId, string title, string content, string? pathFile = null)
        {
            using var connection = await _connectionFactory.CreateOpenConnectionAsync();

            var query = @"UPDATE posts 
                         SET social_media_id = @socialMediaId, 
                             title = @title, 
                             content = @content, 
                             path_file = @pathFile
                         WHERE id = @postId AND user_id = @userId";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@postId", postId);
            command.Parameters.AddWithValue("@userId", userId);
            command.Parameters.AddWithValue("@socialMediaId", socialMediaId);
            command.Parameters.AddWithValue("@title", title);
            command.Parameters.AddWithValue("@content", content);
            command.Parameters.AddWithValue("@pathFile", (object?)pathFile ?? DBNull.Value);

            var rowsAffected = await command.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }

        // DELETE - Supprimer un post
        public async Task<bool> DeletePostAsync(int postId, int userId)
        {
            using var connection = await _connectionFactory.CreateOpenConnectionAsync();

            var query = "DELETE FROM posts WHERE id = @postId AND user_id = @userId";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@postId", postId);
            command.Parameters.AddWithValue("@userId", userId);

            var rowsAffected = await command.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }

        // READ - Récupérer les détails d'un post avec informations utilisateur et réseau social
        public async Task<DTOs.PostDto?> GetPostDetailsByIdAsync(int postId, int userId)
        {
            using var connection = await _connectionFactory.CreateOpenConnectionAsync();

            var query = @"SELECT p.*, u.username, sm.platform 
                         FROM posts p
                         INNER JOIN users u ON p.user_id = u.id
                         INNER JOIN social_media sm ON p.social_media_id = sm.id
                         WHERE p.id = @postId AND p.user_id = @userId";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@postId", postId);
            command.Parameters.AddWithValue("@userId", userId);

            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new DTOs.PostDto
                {
                    Id = reader.GetInt32(reader.GetOrdinal("id")),
                    UserId = reader.GetInt32(reader.GetOrdinal("user_id")),
                    Username = reader.GetString(reader.GetOrdinal("username")),
                    SocialMediaId = reader.GetInt32(reader.GetOrdinal("social_media_id")),
                    Platform = reader.GetString(reader.GetOrdinal("platform")),
                    Title = reader.GetString(reader.GetOrdinal("title")),
                    Content = reader.GetString(reader.GetOrdinal("content")),
                    PathFile = reader.IsDBNull(reader.GetOrdinal("path_file")) 
                        ? null 
                        : reader.GetString(reader.GetOrdinal("path_file")),
                    CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
                };
            }

            return null;
        }

        // READ - Récupérer tous les posts avec détails
        public async Task<List<DTOs.PostDto>> GetAllPostsWithDetailsAsync(int userId)
        {
            using var connection = await _connectionFactory.CreateOpenConnectionAsync();
            var posts = new List<DTOs.PostDto>();

            var query = @"SELECT p.*, u.username, sm.platform 
                         FROM posts p
                         INNER JOIN users u ON p.user_id = u.id
                         INNER JOIN social_media sm ON p.social_media_id = sm.id
                         WHERE p.user_id = @userId
                         ORDER BY p.created_at DESC";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@userId", userId);

            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                posts.Add(new DTOs.PostDto
                {
                    Id = reader.GetInt32(reader.GetOrdinal("id")),
                    UserId = reader.GetInt32(reader.GetOrdinal("user_id")),
                    Username = reader.GetString(reader.GetOrdinal("username")),
                    SocialMediaId = reader.GetInt32(reader.GetOrdinal("social_media_id")),
                    Platform = reader.GetString(reader.GetOrdinal("platform")),
                    Title = reader.GetString(reader.GetOrdinal("title")),
                    Content = reader.GetString(reader.GetOrdinal("content")),
                    PathFile = reader.IsDBNull(reader.GetOrdinal("path_file")) 
                        ? null 
                        : reader.GetString(reader.GetOrdinal("path_file")),
                    CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
                });
            }

            return posts;
        }
    }
}
