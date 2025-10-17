using Microsoft.EntityFrameworkCore;
using SentimentAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// 🔹 1️⃣ CORS policy tanımı
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",              // React dev
                "http://127.0.0.1:5173",              // Alternatif localhost
                "https://fullstack-ai-chat-dpog.onrender.com", // Backend (self)
                "https://vercel-app-url.vercel.app"   // (ileride eklenecek)
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .SetIsOriginAllowed(_ => true); // 👈 Bu satır kritik (her origin'i geçici olarak izinli yapar)
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
app.UseCors("AllowFrontend");


// 🔹 6️⃣ Swagger sadece development'ta aktif
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

// 🔹 7️⃣ Migration'ı otomatik çalıştır (Render’da tablo yoksa oluşturur)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// 🔹 8️⃣ Render ortamı için PORT değişkenini kullan
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Run($"http://0.0.0.0:{port}");
