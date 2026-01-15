namespace social_media_BE.Helpers
{
    public static class TokenHelper
    {
        // Extraire l'ID utilisateur du token Base64 actuel (temporaire)
        // Format du token: Base64(username:ticks)
        public static int? GetUserIdFromToken(string token)
        {
            try
            {
                // Décoder le token Base64
                var decodedBytes = Convert.FromBase64String(token);
                var decodedString = System.Text.Encoding.UTF8.GetString(decodedBytes);
                
                // Format: "username:ticks"
                var parts = decodedString.Split(':');
                if (parts.Length != 2)
                {
                    return null;
                }

                var username = parts[0];
                
                // TODO: Remplacer par une vraie validation JWT
                // Pour l'instant, on retourne l'username pour chercher l'userId dans la DB
                return null; // Sera géré dans le contrôleur
            }
            catch
            {
                return null;
            }
        }

        // Extraire le username du token
        public static string? GetUsernameFromToken(string token)
        {
            try
            {
                var decodedBytes = Convert.FromBase64String(token);
                var decodedString = System.Text.Encoding.UTF8.GetString(decodedBytes);
                
                var parts = decodedString.Split(':');
                if (parts.Length != 2)
                {
                    return null;
                }

                return parts[0];
            }
            catch
            {
                return null;
            }
        }
    }
}
