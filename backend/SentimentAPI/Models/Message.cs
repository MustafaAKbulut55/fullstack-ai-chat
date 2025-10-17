// ============================================================
// 💬 Message.cs
// Bu model, sistemde gönderilen her bir mesajı temsil eder.
// Mesaj metni, duygu analizi sonucu (sentiment) ve hangi kullanıcıya
// ait olduğu bilgisini içerir.
//
// İlişki: Her mesaj bir kullanıcıya (User) aittir.
// ============================================================

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SentimentAPI.Models
{
    public class Message
    {
        // 🔹 Mesajın benzersiz kimliği (Primary Key)
        [Key]
        public int Id { get; set; }

        // 🔹 Mesajın içeriği (kullanıcının gönderdiği metin)
        [Required]
        public string Text { get; set; } = string.Empty;

        // 🔹 Duygu analizi sonucu (örneğin: Positive, Negative, Neutral)
        public string Sentiment { get; set; } = "Unknown";

        // 🔹 Mesajın oluşturulma tarihi (otomatik UTC zamanı)
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // ------------------------------------------------------------
        // 🔹 İlişkilendirme (User → Message)
        // Her mesaj bir kullanıcıya aittir (foreign key).
        // ------------------------------------------------------------
        public int UserId { get; set; }

        // Kullanıcı ilişkisi (navigasyon özelliği)
        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }
    }
}
