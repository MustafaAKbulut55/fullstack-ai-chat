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
                var hfRequest = new { data = new[] { request.Text } };
                var firstResponse = await _http.PostAsJsonAsync($"{HfBase}/gradio_api/call/{ApiName}", hfRequest);
                var firstJson = await firstResponse.Content.ReadAsStringAsync();

                string? eventId = null;
                using (var doc = JsonDocument.Parse(firstJson))
                {
                    if (doc.RootElement.TryGetProperty("event_id", out var prop))
                        eventId = prop.GetString();
                }

                if (!string.IsNullOrEmpty(eventId))
                {
                    await Task.Delay(1000);
                    var secondResponse = await _http.GetAsync($"{HfBase}/gradio_api/call/{ApiName}/{eventId}");
                    var resultText = await secondResponse.Content.ReadAsStringAsync();

                    var match = Regex.Match(resultText, @"data:\s*\[(.*?)\]", RegexOptions.Singleline);
                    if (match.Success)
                    {
                        var content = match.Groups[1].Value.Trim('"', ' ', '[', ']');
                        sentiment = content.Split('|')[0].Trim();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[HF ERROR] {ex.Message}");
            }

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
                .Include(m => m.User)
                .OrderByDescending(m => m.CreatedAt)
                .Take(limit)
                .Select(m => new
                {
                    m.Id,
                    m.Text,
                    m.Sentiment,
                    m.CreatedAt,
                    Nickname = m.User != null ? m.User.Nickname : "Anonim"
                })
                .ToListAsync();

            return Ok(messages);
        }

        public class MessageRequest
        {
            public string Text { get; set; } = string.Empty;
            public string Nickname { get; set; } = string.Empty;
        }
    }
}
