using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using social_media_BE.Data;
using social_media_BE.Models;

namespace social_media_BE.Pages.Account;

[AllowAnonymous]
public class RegisterModel : PageModel
{
    private readonly ApplicationDbContext _dbContext;

    public RegisterModel(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [BindProperty]
    public InputModel Input { get; set; } = new();

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            return Page();
        }

        bool usernameExists = await _dbContext.Users.AnyAsync(u => u.Username == Input.Username);
        bool emailExists = await _dbContext.Users.AnyAsync(u => u.Email == Input.Email);

        if (usernameExists)
        {
            ModelState.AddModelError("Input.Username", "Username is already taken.");
        }

        if (emailExists)
        {
            ModelState.AddModelError("Input.Email", "Email is already registered.");
        }

        if (!ModelState.IsValid)
        {
            return Page();
        }

        var user = new User
        {
            Username = Input.Username,
            Email = Input.Email,
            Name = Input.Name,
            Password = BCrypt.Net.BCrypt.HashPassword(Input.Password),
            Role = "user"
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        TempData["SuccessMessage"] = "Account created successfully. Please sign in.";

        return RedirectToPage("/Account/Login");
    }

    public class InputModel
    {
        [Required]
        [StringLength(255, MinimumLength = 2)]
        [Display(Name = "Full name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 3)]
        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        [StringLength(100, MinimumLength = 6)]
        [Display(Name = "Password")]
        public string Password { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "Passwords do not match.")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
