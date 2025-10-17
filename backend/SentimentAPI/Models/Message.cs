using System.ComponentModel.DataAnnotations.Schema;

namespace SentimentAPI.Models
{
    public class Message
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Text { get; set; } = string.Empty;
        public string Sentiment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // 🔹 BURAYI EKLE
        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}
