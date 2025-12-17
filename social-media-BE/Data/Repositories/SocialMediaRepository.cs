using Microsoft.Data.SqlClient;
using social_media_BE.Models;

namespace social_media_BE.Data.Repositories
{
    public class SocialMediaRepository
    {
        private readonly SqlConnectionFactory _connectionFactory;

        public SocialMediaRepository(SqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        // Mapper un SqlDataReader vers un objet SocialMedia
        private SocialMedia MapToSocialMedia(SqlDataReader reader)
        {
            return new SocialMedia
            {
                Id = reader.GetInt32(reader.GetOrdinal("id")),
                Platform = reader.GetString(reader.GetOrdinal("platform")),
                IconLogo = reader.IsDBNull(reader.GetOrdinal("icon_logo")) 
                    ? null 
                    : reader.GetString(reader.GetOrdinal("icon_logo")),
                Description = reader.IsDBNull(reader.GetOrdinal("description")) 
                    ? null 
                    : reader.GetString(reader.GetOrdinal("description")),
                CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
            };
        }

        // READ - Récupérer tous les réseaux sociaux
        public async Task<List<SocialMedia>> GetAllSocialMediasAsync()
        {
            using var connection = await _connectionFactory.CreateOpenConnectionAsync();
            var socialMedias = new List<SocialMedia>();

            var query = "SELECT * FROM social_media ORDER BY platform";

            using var command = new SqlCommand(query, connection);
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                socialMedias.Add(MapToSocialMedia(reader));
            }

            return socialMedias;
        }

        // READ - Récupérer un réseau social par ID
        public async Task<SocialMedia?> GetSocialMediaByIdAsync(int id)
        {
            using var connection = await _connectionFactory.CreateOpenConnectionAsync();

            var query = "SELECT * FROM social_media WHERE id = @id";

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@id", id);

            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return MapToSocialMedia(reader);
            }

            return null;
        }
    }
}
