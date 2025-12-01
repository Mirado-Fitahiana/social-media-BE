using Microsoft.Data.SqlClient;
using System.Data;

namespace social_media_BE.Data.Repositories
{
    public class UserRepository
    {
        private readonly SqlConnectionFactory _connectionFactory;

        public UserRepository(SqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        // Exemple de méthode pour tester la connexion
        public async Task<bool> TestConnectionAsync()
        {
            try
            {
                using var connection = await _connectionFactory.CreateOpenConnectionAsync();
                return connection.State == ConnectionState.Open;
            }
            catch (Exception)
            {
                return false;
            }
        }

        // Exemple de requête SELECT
        public async Task<List<string>> GetAllUsersAsync()
        {
            var users = new List<string>();

            using var connection = await _connectionFactory.CreateOpenConnectionAsync();
            
            string query = "SELECT username FROM Users";
            
            using var command = new SqlCommand(query, connection);
            using var reader = await command.ExecuteReaderAsync();
            
            while (await reader.ReadAsync())
            {
                users.Add(reader.GetString(0));
            }

            return users;
        }

        // Exemple d'INSERT avec paramètres
        public async Task<int> CreateUserAsync(string username, string email)
        {
            using var connection = await _connectionFactory.CreateOpenConnectionAsync();
            
            string query = @"INSERT INTO Users (username, email, created_at) 
                           VALUES (@username, @email, GETDATE());
                           SELECT CAST(SCOPE_IDENTITY() as int)";
            
            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@username", username);
            command.Parameters.AddWithValue("@email", email);
            
            var userId = (int)await command.ExecuteScalarAsync();
            return userId;
        }
    }
}
