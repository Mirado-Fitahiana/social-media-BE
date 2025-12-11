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
                
                var result = await checkCommand.ExecuteScalarAsync();
                var count = result != null ? Convert.ToInt32(result) : 0;
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

        // UPDATE PROFILE - Mettre à jour nom et email
        public async Task<bool> UpdateProfileAsync(int id, string name, string email, SqlConnection? connection = null)
        {
            bool shouldCloseConnection = false;
            
            if (connection == null)
            {
                connection = await _connectionFactory.CreateOpenConnectionAsync();
                shouldCloseConnection = true;
            }

            try
            {
                // Vérifier si l'email est déjà utilisé par un autre utilisateur
                var checkQuery = "SELECT COUNT(*) FROM users WHERE email = @email AND id != @id";
                using var checkCommand = new SqlCommand(checkQuery, connection);
                checkCommand.Parameters.AddWithValue("@email", email);
                checkCommand.Parameters.AddWithValue("@id", id);
                
                var result = await checkCommand.ExecuteScalarAsync();
                var count = result != null ? Convert.ToInt32(result) : 0;
                if (count > 0)
                {
                    throw new InvalidOperationException("Cet email est déjà utilisé");
                }

                // Mettre à jour l'utilisateur
                var updateQuery = "UPDATE users SET name = @name, email = @email WHERE id = @id";
                using var updateCommand = new SqlCommand(updateQuery, connection);
                updateCommand.Parameters.AddWithValue("@name", name);
                updateCommand.Parameters.AddWithValue("@email", email);
                updateCommand.Parameters.AddWithValue("@id", id);
                
                var rowsAffected = await updateCommand.ExecuteNonQueryAsync();
                return rowsAffected > 0;
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

        // CHANGE PASSWORD - Changer le mot de passe
        public async Task<bool> ChangePasswordAsync(int id, string currentPassword, string newPassword, SqlConnection? connection = null)
        {
            bool shouldCloseConnection = false;
            
            if (connection == null)
            {
                connection = await _connectionFactory.CreateOpenConnectionAsync();
                shouldCloseConnection = true;
            }

            try
            {
                // Récupérer l'utilisateur
                var user = await GetUserByIdAsync(id, connection);
                if (user == null)
                {
                    return false;
                }

                // Vérifier le mot de passe actuel
                if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.Password))
                {
                    return false;
                }

                // Hasher le nouveau mot de passe
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(newPassword);

                // Mettre à jour le mot de passe
                var updateQuery = "UPDATE users SET password = @password WHERE id = @id";
                using var updateCommand = new SqlCommand(updateQuery, connection);
                updateCommand.Parameters.AddWithValue("@password", hashedPassword);
                updateCommand.Parameters.AddWithValue("@id", id);
                
                var rowsAffected = await updateCommand.ExecuteNonQueryAsync();
                return rowsAffected > 0;
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

        // DELETE USER - Supprimer un utilisateur
        public async Task<bool> DeleteUserAsync(int id, SqlConnection? connection = null)
        {
            bool shouldCloseConnection = false;
            
            if (connection == null)
            {
                connection = await _connectionFactory.CreateOpenConnectionAsync();
                shouldCloseConnection = true;
            }

            try
            {
                var deleteQuery = "DELETE FROM users WHERE id = @id";
                using var deleteCommand = new SqlCommand(deleteQuery, connection);
                deleteCommand.Parameters.AddWithValue("@id", id);
                
                var rowsAffected = await deleteCommand.ExecuteNonQueryAsync();
                return rowsAffected > 0;
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
