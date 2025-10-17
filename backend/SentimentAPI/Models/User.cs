using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SentimentAPI.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Nickname { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // 🔹 Kullanıcının mesaj listesi
        public ICollection<Message>? Messages { get; set; }
    }
}
