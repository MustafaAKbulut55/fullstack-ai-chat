// ============================================================
// 👤 User.cs
// Bu model, sistemi kullanan her bir kullanıcıyı temsil eder.
// Her kullanıcının bir rumuzu (nickname’i) vardır ve birden fazla
// mesaj gönderebilir.
//
// İlişki: Bir kullanıcı birden fazla mesaja sahip olabilir.
// ============================================================

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SentimentAPI.Models
{
    public class User
    {
        // 🔹 Kullanıcının benzersiz kimliği (Primary Key)
        [Key]
        public int Id { get; set; }

        // 🔹 Kullanıcı adı veya rumuz (zorunlu alan)
        [Required]
        public string Nickname { get; set; } = string.Empty;

        // 🔹 Kullanıcının sisteme ilk kayıt olduğu zaman (UTC)
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // 🔹 Kullanıcının gönderdiği mesajlar listesi (1 → N ilişki)
        public ICollection<Message>? Messages { get; set; }
    }
}
