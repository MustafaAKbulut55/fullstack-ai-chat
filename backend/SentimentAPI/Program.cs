using Microsoft.EntityFrameworkCore;
using SentimentAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// 🔹 1️⃣ CORS policy tanımı
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins(
                "http://localhost:3000",          // React web dev ortamı
                "http://10.0.2.2:8081",           // Android Emulator (React Native CLI)
                "http://127.0.0.1:8081",          // Localhost mobil test
                "https://your-vercel-app.vercel.app", // Vercel production domain
                "https://fullstack-ai-chat-dpog.onrender.com" // Render domain (self call izinli)
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        });
});

// 🔹 2️⃣ Controller & Swagger servisi
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔹 3️⃣ SQLite veritabanı bağlantısı
// Render deployment'ta relative path sorun çıkarabilir → absolute path kullanalım
var dbPath = Path.Combine(AppContext.BaseDirectory, "sentiment.db");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

// 🔹 4️⃣ Uygulama oluşturuluyor
var app = builder.Build();

// 🔹 5️⃣ CORS middleware aktif
app.UseCors(MyAllowSpecificOrigins);

// 🔹 6️⃣ Swagger sadece development'ta aktif
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

// 🔹 7️⃣ Render ortamı için PORT değişkenini kullan
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Run($"http://0.0.0.0:{port}");
