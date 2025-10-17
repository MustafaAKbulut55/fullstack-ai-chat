using System;

namespace SentimentAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Nickname { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
