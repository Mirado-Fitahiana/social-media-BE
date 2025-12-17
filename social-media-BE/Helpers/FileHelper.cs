namespace social_media_BE.Helpers
{
    public static class FileHelper
    {
        private static readonly string[] AllowedImageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        private static readonly string[] AllowedVideoExtensions = { ".mp4", ".mov", ".avi", ".wmv", ".webm" };
        private const long MaxFileSize = 10 * 1024 * 1024; // 10MB

        public static string GetUploadsPath()
        {
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }
            return uploadsPath;
        }

        public static async Task<string?> SaveFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return null;

            // Vérifier la taille
            if (file.Length > MaxFileSize)
                throw new InvalidOperationException("Le fichier est trop volumineux (max 10MB)");

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            // Vérifier l'extension
            if (!AllowedImageExtensions.Contains(extension) && !AllowedVideoExtensions.Contains(extension))
                throw new InvalidOperationException("Type de fichier non autorisé");

            // Générer un nom unique
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(GetUploadsPath(), fileName);

            // Sauvegarder le fichier
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Retourner le chemin relatif
            return $"/uploads/{fileName}";
        }

        public static void DeleteFile(string? filePath)
        {
            if (string.IsNullOrEmpty(filePath))
                return;

            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", filePath.TrimStart('/'));
            
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }
        }

        public static bool IsImage(string? filePath)
        {
            if (string.IsNullOrEmpty(filePath))
                return false;

            var extension = Path.GetExtension(filePath).ToLowerInvariant();
            return AllowedImageExtensions.Contains(extension);
        }

        public static bool IsVideo(string? filePath)
        {
            if (string.IsNullOrEmpty(filePath))
                return false;

            var extension = Path.GetExtension(filePath).ToLowerInvariant();
            return AllowedVideoExtensions.Contains(extension);
        }
    }
}
