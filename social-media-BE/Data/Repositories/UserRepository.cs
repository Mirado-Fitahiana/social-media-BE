using Microsoft.Data.SqlClient;
using System.Data;
using social_media_BE.Models;
using BCrypt.Net;

namespace social_media_BE.Data.Repositories
{
    public class UserRepository
    {
        private readonly SqlConnectionFactory _connectionFactory;

        public UserRepository(SqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        // Mapper un SqlDataReader vers un objet User
        private User MapToUser(SqlDataReader reader)
        {
            return new User
            {
                Id = reader.GetInt32(reader.GetOrdinal("id")),
                Username = reader.GetString(reader.GetOrdinal("username")),
                Email = reader.GetString(reader.GetOrdinal("email")),
                Name = reader.GetString(reader.GetOrdinal("name")),
                Password = reader.GetString(reader.GetOrdinal("password")),
                Role = reader.GetString(reader.GetOrdinal("role")),
                CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
            };
        }

        // REGISTER - Créer un nouvel utilisateur avec mot de passe hashé
        public async Task<int> RegisterAsync(string username, string email, string name, string password, SqlConnection? connection = null)
        {
            bool shouldCloseConnection = false;
            
            if (connection == null)
            {
                connection = await _connectionFactory.CreateOpenConnectionAsync();
                shouldCloseConnection = true;
            }

            try
            {
                // Vérifier si l'username ou l'email existe déjà
                var checkQuery = "SELECT COUNT(*) FROM users WHERE username = @username OR email = @email";
                using var checkCommand = new SqlCommand(checkQuery, connection);
                checkCommand.Parameters.AddWithValue("@username", username);
                checkCommand.Parameters.AddWithValue("@email", email);
                
                var count = (int)await checkCommand.ExecuteScalarAsync();
                if (count > 0)
                {
                    throw new InvalidOperationException("Username ou email déjà utilisé");
                }

                // Hasher le mot de passe
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

                // Insérer le nouvel utilisateur
                var insertQuery = @"INSERT INTO users (username, email, name, password, role) 
                                   VALUES (@username, @email, @name, @password, 'user');
                                   SELECT CAST(SCOPE_IDENTITY() AS int)";
                
                using var insertCommand = new SqlCommand(insertQuery, connection);
                insertCommand.Parameters.AddWithValue("@username", username);
                insertCommand.Parameters.AddWithValue("@email", email);
                insertCommand.Parameters.AddWithValue("@name", name);
                insertCommand.Parameters.AddWithValue("@password", hashedPassword);
                
                var userId = await insertCommand.ExecuteScalarAsync();
                return Convert.ToInt32(userId);
            }
            finally
            {
                if (shouldCloseConnection)
                {
                    await connection.CloseAsync();
                    connection.Dispose();
                }
            }
        }

        // LOGIN - Vérifier les identifiants et retourner l'utilisateur
        public async Task<User?> LoginAsync(string username, string password, SqlConnection? connection = null)
        {
            bool shouldCloseConnection = false;
            
            if (connection == null)
            {
                connection = await _connectionFactory.CreateOpenConnectionAsync();
                shouldCloseConnection = true;
            }

            try
            {
                var query = "SELECT * FROM users WHERE username = @username";
                
                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@username", username);
                
                using var reader = await command.ExecuteReaderAsync();
                
                if (await reader.ReadAsync())
                {
                    var user = MapToUser(reader);
                    
                    // Vérifier le mot de passe hashé
                    if (BCrypt.Net.BCrypt.Verify(password, user.Password))
                    {
                        return user;
                    }
                }
                
                return null;
            }
            finally
            {
                if (shouldCloseConnection)
                {
                    await connection.CloseAsync();
                    connection.Dispose();
                }
            }
        }

        // GET BY ID - Utilisé pour récupérer l'utilisateur après register
        public async Task<User?> GetUserByIdAsync(int id, SqlConnection? connection = null)
        {
            bool shouldCloseConnection = false;
            
            if (connection == null)
            {
                connection = await _connectionFactory.CreateOpenConnectionAsync();
                shouldCloseConnection = true;
            }

            try
            {
                var query = "SELECT * FROM users WHERE id = @id";
                
                using var command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@id", id);
                
                using var reader = await command.ExecuteReaderAsync();
                
                if (await reader.ReadAsync())
                {
                    return MapToUser(reader);
                }
                
                return null;
            }
            finally
            {
                if (shouldCloseConnection)
                {
                    await connection.CloseAsync();
                    connection.Dispose();
                }
            }
        }
    }
}
