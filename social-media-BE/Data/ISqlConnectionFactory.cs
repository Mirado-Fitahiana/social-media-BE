using Microsoft.Data.SqlClient;

namespace social_media_BE.Data;

public interface ISqlConnectionFactory
{
    SqlConnection CreateConnection();
    Task<SqlConnection> CreateOpenConnectionAsync();
}
