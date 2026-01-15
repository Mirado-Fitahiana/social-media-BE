using Microsoft.Data.SqlClient;
using social_media_BE.Models;

namespace social_media_BE.Data.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ISqlConnectionFactory _connectionFactory;

    public UserRepository(ISqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    private static User MapToUser(SqlDataReader reader)
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

    public async Task<int> RegisterAsync(string username, string email, string name, string password)
    {
        await using var connection = await _connectionFactory.CreateOpenConnectionAsync();

        const string checkQuery = "SELECT COUNT(*) FROM users WHERE username = @username OR email = @email";
        using var checkCommand = new SqlCommand(checkQuery, connection);
        checkCommand.Parameters.AddWithValue("@username", username);
        checkCommand.Parameters.AddWithValue("@email", email);

        var countResult = await checkCommand.ExecuteScalarAsync();
        var count = Convert.ToInt32(countResult);
        if (count > 0)
        {
            throw new InvalidOperationException("Username ou email deja utilise");
        }

        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

        const string insertQuery = @"INSERT INTO users (username, email, name, password, role) 
                                   VALUES (@username, @email, @name, @password, 'user');
                                   SELECT CAST(SCOPE_IDENTITY() AS int)";

        using var insertCommand = new SqlCommand(insertQuery, connection);
        insertCommand.Parameters.AddWithValue("@username", username);
        insertCommand.Parameters.AddWithValue("@email", email);
        insertCommand.Parameters.AddWithValue("@name", name);
        insertCommand.Parameters.AddWithValue("@password", hashedPassword);

        var userId = await insertCommand.ExecuteScalarAsync();
        if (userId is null)
        {
            throw new InvalidOperationException("Impossible de recuperer l'identifiant cree");
        }

        return Convert.ToInt32(userId);
    }

    public async Task<User?> LoginAsync(string username, string password)
    {
        await using var connection = await _connectionFactory.CreateOpenConnectionAsync();

        const string query = "SELECT * FROM users WHERE username = @username";
        using var command = new SqlCommand(query, connection);
        command.Parameters.AddWithValue("@username", username);

        using var reader = await command.ExecuteReaderAsync();

        if (await reader.ReadAsync())
        {
            var user = MapToUser(reader);

            if (BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                return user;
            }
        }

        return null;
    }

    public async Task<User?> GetUserByIdAsync(int id)
    {
        await using var connection = await _connectionFactory.CreateOpenConnectionAsync();

        const string query = "SELECT * FROM users WHERE id = @id";
        using var command = new SqlCommand(query, connection);
        command.Parameters.AddWithValue("@id", id);

        using var reader = await command.ExecuteReaderAsync();

        if (await reader.ReadAsync())
        {
            return MapToUser(reader);
        }

        return null;
    }
}
