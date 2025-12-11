using social_media_BE.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Ajouter les controllers API
builder.Services.AddControllers();

// Configuration de la chaîne de connexion et injection de SqlConnectionFactory
builder.Services.AddScoped<SqlConnectionFactory>();

// Ajouter CORS pour permettre les requêtes depuis le front React
builder.Services.AddCors(options =>
{
       options.AddPolicy("AllowAll",
           policy => policy.AllowAnyOrigin()
                           .AllowAnyHeader()
                           .AllowAnyMethod());
   });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

// Activer CORS
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();


app.Run();
