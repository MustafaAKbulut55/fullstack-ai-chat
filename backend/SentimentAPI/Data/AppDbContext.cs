// ============================================================
// 🧠 AppDbContext.cs
// Bu sınıf, Entity Framework Core (EF Core) altyapısını kullanarak
// uygulamanın veritabanı bağlantısını ve tablolarını (DbSet) tanımlar.
//
// Görev:
//   - Veritabanı bağlantısını yönetmek
//   - User ve Message tablolarını temsil eden modelleri ilişkilendirmek
//
// Bu context, Program.cs veya Startup.cs dosyasında DI (Dependency Injection)
// aracılığıyla yapılandırılır.
// ============================================================

using Microsoft.EntityFrameworkCore;
using SentimentAPI.Models;

namespace SentimentAPI.Data
{
    public class AppDbContext : DbContext
    {
        // ------------------------------------------------------------
        // 🔹 Constructor
        // DI (Dependency Injection) sistemi aracılığıyla gelen
        // DbContextOptions parametresi base sınıfa aktarılır.
        // Bu parametre, veritabanı bağlantı dizesi (connection string)
        // ve EF konfigürasyonlarını içerir.
        // ------------------------------------------------------------
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // ------------------------------------------------------------
        // 🔹 DbSet Tanımları
        // Her DbSet, veritabanındaki bir tabloyu temsil eder.
        // EF Core bu sınıfları kullanarak CRUD işlemlerini otomatik yönetir.
        // ------------------------------------------------------------

        // 👤 Users tablosu: Sistemde mesaj gönderen kullanıcıları tutar.
        public DbSet<User> Users { get; set; }

        // 💬 Messages tablosu: Her bir mesajı ve ona ait duygu analizini tutar.
        public DbSet<Message> Messages { get; set; }
    }
}
