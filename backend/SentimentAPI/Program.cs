using Microsoft.EntityFrameworkCore;
using SentimentAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// 🔹 CORS policy tanımı
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",           // React local (dev)
            "http://127.0.0.1:5173",           // Vite default port
            "http://10.0.2.2:8081",            // Android emulator
            "https://fullstack-ai-chat.vercel.app", // ✅ senin gerçek Vercel domainin
            "https://fullstack-ai-chat-dpog.onrender.com" // ✅ backend kendi domaini
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔹 SQLite bağlantısı
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// 🔹 CORS aktif
app.UseCors(MyAllowSpecificOrigins);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

// 🔹 Render için PORT ayarı
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Run($"http://0.0.0.0:{port}");
