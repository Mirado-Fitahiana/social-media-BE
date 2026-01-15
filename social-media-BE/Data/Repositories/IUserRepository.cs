using social_media_BE.Models;

namespace social_media_BE.Data.Repositories;

public interface IUserRepository
{
    Task<int> RegisterAsync(string username, string email, string name, string password);
    Task<User?> LoginAsync(string username, string password);
    Task<User?> GetUserByIdAsync(int id);
}
