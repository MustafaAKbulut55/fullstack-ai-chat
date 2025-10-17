using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SentimentAPI.Data;
using SentimentAPI.Models;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace SentimentAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly HttpClient _http;

        private const string HfBase = "https://mustafa5534-sentiment-analyzer.hf.space";
        private const string ApiName = "analyze_sentiment";

        public MessagesController(AppDbContext context)
        {
            _context = context;
            _http = new HttpClient();
        }

        [HttpPost]
        public async Task<IActionResult> PostMessage([FromBody] MessageRequest request)
        {
            // 1️⃣ Kullanıcıyı bul veya oluştur
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Nickname == request.Nickname);
            if (user == null)
            {
                user = new User { Nickname = request.Nickname };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            string sentiment = "Unknown";

            try
            {
                // 2️⃣ HF'ye istek gönder (event_id al)
                var hfRequest = new { data = new[] { request.Text } };
                var firstResponse = await _http.PostAsJsonAsync($"{HfBase}/gradio_api/call/{ApiName}", hfRequest);
                var firstJson = await firstResponse.Content.ReadAsStringAsync();
                Console.WriteLine("[HF RESPONSE 1] " + firstJson);

                string? eventId = null;
                using (var doc = JsonDocument.Parse(firstJson))
                {
                    if (doc.RootElement.TryGetProperty("event_id", out var eventProp))
                        eventId = eventProp.GetString();
                }

                // 3️⃣ Event_id varsa sonucu al
                if (!string.IsNullOrEmpty(eventId))
                {
                    await Task.Delay(1000); // biraz bekle
                    var secondResponse = await _http.GetAsync($"{HfBase}/gradio_api/call/{ApiName}/{eventId}");
                    var resultText = await secondResponse.Content.ReadAsStringAsync();
                    Console.WriteLine("[HF RESPONSE 2] " + resultText);

                    // 4️⃣ SSE formatından sadece data satırını çekelim
                    // Örnek: event: complete\ndata: ["Positive | Scores → {...}"]
                    var match = Regex.Match(resultText, @"data:\s*\[(.*?)\]", RegexOptions.Singleline);
                    if (match.Success)
                    {
                        var content = match.Groups[1].Value.Trim('"', ' ', '[', ']');
                        // "Positive | Scores → ..." kısmından sadece "Positive" al
                        sentiment = content.Split('|')[0].Trim();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[HF ERROR] {ex.Message}");
            }

            // 5️⃣ DB'ye kaydet
            var message = new Message
            {
                UserId = user.Id,
                Text = request.Text,
                Sentiment = sentiment
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(message);
        }

        [HttpGet]
        public async Task<IActionResult> GetMessages([FromQuery] int limit = 50)
        {
            var messages = await _context.Messages
                .OrderByDescending(m => m.CreatedAt)
                .Take(limit)
                .ToListAsync();

            return Ok(messages);
        }
    }

    public class MessageRequest
    {
        public string Text { get; set; } = string.Empty;
        public string Nickname { get; set; } = string.Empty;
    }
}
