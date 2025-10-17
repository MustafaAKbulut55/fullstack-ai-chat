// ============================================================
// 🚀 Program.cs
// Bu dosya, ASP.NET Core 8 Web API uygulamasının giriş noktasıdır.
// Servisleri (CORS, DbContext, Swagger vb.) yapılandırır ve
// HTTP istek yaşam döngüsünü (middleware pipeline) tanımlar.
//
// Proje: SentimentAPI
// Amaç: AI destekli duygu analizi için RESTful API servisidir.
// ============================================================

using Microsoft.EntityFrameworkCore;
using SentimentAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// ------------------------------------------------------------
// 🔹 1️⃣ CORS (Cross-Origin Resource Sharing) Ayarları
// Frontend (örneğin React, Vite veya mobil istemci) isteklerinin
// API’ye erişebilmesi için gerekli izinleri tanımlar.
// ------------------------------------------------------------
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",                 // 🔸 React (development)
            "http://127.0.0.1:5173",                 // 🔸 Vite (frontend dev)
            "http://10.0.2.2:8081",                  // 🔸 Android Emulator erişimi
            "https://fullstack-ai-chat.vercel.app",  // ✅ Production frontend domain
            "https://fullstack-ai-chat-dpog.onrender.com" // ✅ Backend Render domain
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials(); // Çerez/tabanlı kimlik doğrulama desteği
    });
});

// ------------------------------------------------------------
// 🔹 2️⃣ JSON Döngü Hatasını Engelle
// EF Core ilişkili modellerde (User → Messages) döngüsel referanslar
// oluşabileceğinden, JSON serializer bu hatayı önlemek için ayarlanır.
// ------------------------------------------------------------
builder.Services.AddControllers().AddJsonOptions(x =>
{
    x.JsonSerializerOptions.ReferenceHandler =
        System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

// ------------------------------------------------------------
// 🔹 3️⃣ Swagger (API Dokümantasyonu)
// Geliştirme ortamında otomatik API test arayüzü sağlar.
// ------------------------------------------------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ------------------------------------------------------------
// 🔹 4️⃣ Veritabanı Bağlantısı
// SQLite veritabanı EF Core üzerinden bağlanır.
// appsettings.json içinde "DefaultConnection" değeri tanımlıdır.
// ------------------------------------------------------------
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// ------------------------------------------------------------
// 🔹 5️⃣ Uygulama Oluşturma
// Tüm servislerin eklenmesinin ardından WebApplication örneği oluşturulur.
// ------------------------------------------------------------
var app = builder.Build();

// ------------------------------------------------------------
// 🔹 6️⃣ Middleware Yapılandırması
// HTTP isteklerinin hangi sırayla işlendiğini belirler.
// ------------------------------------------------------------

// CORS politikası etkinleştirilir
app.UseCors(MyAllowSpecificOrigins);

// Swagger yalnızca geliştirme ortamında aktif olur
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Kimlik doğrulama veya yetkilendirme middleware’i (gerekirse)
app.UseAuthorization();

// Controller’ları endpoint olarak eşleştir
app.MapControllers();

// ------------------------------------------------------------
// 🔹 7️⃣ Veritabanı Migration Otomasyonu
// Uygulama başlatıldığında veritabanı yoksa otomatik oluşturulur
// ve en son migration’lar uygulanır.
// ------------------------------------------------------------
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // otomatik veritabanı güncellemesi
}

// ------------------------------------------------------------
// 🔹 8️⃣ Render Ortamı için PORT Ayarı
// Render gibi PaaS ortamlarında PORT environment variable’ı kullanılır.
// Varsayılan değer 8080’dir.
// ------------------------------------------------------------
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Run($"http://0.0.0.0:{port}");

// ============================================================
// ✅ ÖZET:
// - Geliştirme ortamı: Swagger + CORS açık
// - Dağıtım ortamı: Render port yapılandırması
// - Veritabanı: SQLite + EF Core Migration
// - Frontend: Vercel (React / Vite), Backend: Render (.NET 8 API)
// ============================================================
