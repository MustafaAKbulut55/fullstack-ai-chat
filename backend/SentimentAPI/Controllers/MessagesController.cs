// ============================================================
// 🧠 MessagesController.cs
// Bu controller, kullanıcıların mesajlarını alır, metni İngilizceye çevirir,
// Hugging Face üzerinde çalışan duygu analizi (sentiment analysis) modeline gönderir,
// ve sonuçları veritabanına kaydeder.
//
// API Endpoint’leri:
//   POST   /api/messages   → Yeni mesaj ekler ve AI ile duygu analizi yapar
//   GET    /api/messages   → Son mesajları listeler
// ============================================================

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
        // ------------------------------------------------------------
        // 🔹 Alanlar (Dependencies)
        // ------------------------------------------------------------
        private readonly AppDbContext _context; // Veritabanı erişimi için DbContext
        private readonly HttpClient _http;       // Hugging Face API çağrıları için HTTP istemcisi

        // Hugging Face API temel URL ve endpoint ismi
        private const string HfBase = "https://mustafa5534-sentiment-analyzer.hf.space";
        private const string ApiName = "analyze_sentiment";

        // ------------------------------------------------------------
        // 🔹 Constructor
        // DbContext ve HttpClient örneği oluşturulur.
        // ------------------------------------------------------------
        public MessagesController(AppDbContext context)
        {
            _context = context;
            _http = new HttpClient();
        }

        // ============================================================
        // 📨 POST /api/messages
        // Kullanıcıdan gelen metni alır, AI modeline gönderir,
        // sonucu (duygu etiketi) ile birlikte veritabanına kaydeder.
        // ============================================================
        [HttpPost]
        public async Task<IActionResult> PostMessage([FromBody] MessageRequest request)
        {
            // 🔸 1. Kullanıcıyı veritabanında kontrol et veya oluştur
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Nickname == request.Nickname);
            if (user == null)
            {
                user = new User { Nickname = request.Nickname };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            string sentiment = "Unknown"; // Varsayılan değer

            try
            {
                // 🔹 2. Metni İngilizceye çevir (çok dilli destek için)
                string translatedText = await TranslateToEnglish(request.Text);

                // 🔹 3. Çevirilen metni Hugging Face modeline gönder
                var hfRequest = new { data = new[] { translatedText } };
                var firstResponse = await _http.PostAsJsonAsync($"{HfBase}/gradio_api/call/{ApiName}", hfRequest);
                var firstJson = await firstResponse.Content.ReadAsStringAsync();

                // Hugging Face çağrısından dönen event_id alınır (işleme ID’si)
                string? eventId = null;
                using (var doc = JsonDocument.Parse(firstJson))
                {
                    if (doc.RootElement.TryGetProperty("event_id", out var prop))
                        eventId = prop.GetString();
                }

                // 🔹 4. İşlem tamamlanmışsa sonucu sorgula
                if (!string.IsNullOrEmpty(eventId))
                {
                    await Task.Delay(1000); // kısa bekleme (model çıktısı hazır olsun)
                    var secondResponse = await _http.GetAsync($"{HfBase}/gradio_api/call/{ApiName}/{eventId}");
                    var resultText = await secondResponse.Content.ReadAsStringAsync();

                    // Regex ile Hugging Face yanıtından sentiment sonucu çekilir
                    var match = Regex.Match(resultText, @"data:\s*\[(.*?)\]", RegexOptions.Singleline);
                    if (match.Success)
                    {
                        var content = match.Groups[1].Value.Trim('"', ' ', '[', ']');
                        sentiment = content.Split('|')[0].Trim(); // örn. "Positive"
                    }
                }
            }
            catch (Exception ex)
            {
                // 🔸 Herhangi bir hata durumunda loglama yapılır
                Console.WriteLine($"[HF ERROR] {ex.Message}");
            }

            // 🔹 5. Mesaj veritabanına kaydedilir
            var message = new Message
            {
                UserId = user.Id,
                Text = request.Text,      // Orijinal kullanıcı metni
                Sentiment = sentiment     // AI sonucu
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // 🔹 6. Kaydedilen mesaj geri döndürülür
            return Ok(message);
        }

        // ============================================================
        // 🌍 TranslateToEnglish()
        // Basit bir çeviri fonksiyonu – örnek olarak MyMemory API kullanılmıştır.
        // Dilersen burayı kendi API (ör. Google Translate, DeepL, Azure Translator)
        // ile değiştirebilirsin.
        // ============================================================
        private async Task<string> TranslateToEnglish(string text)
        {
            try
            {
                var body = new
                {
                    q = text,
                    source = "auto",
                    target = "en",
                    format = "text"
                };

                // Ücretsiz MyMemory API çağrısı
                using var client = new HttpClient();
                var res = await client.GetAsync($"https://api.mymemory.translated.net/get?q={Uri.EscapeDataString(text)}&langpair=tr|en");
                var json = await res.Content.ReadAsStringAsync();

                // Dönen JSON içinden çeviri metnini çek
                using var doc = JsonDocument.Parse(json);
                if (doc.RootElement.TryGetProperty("responseData", out var data) &&
                    data.TryGetProperty("translatedText", out var translated))
                {
                    return translated.GetString() ?? text;
                }

                return text; // Çeviri başarısızsa orijinal metni döndür
            }
            catch
            {
                return text; // Hata durumunda metni değiştirmeden döndür
            }
        }

        // ============================================================
        // 📥 GET /api/messages
        // En son kaydedilen mesajları listeler.
        // limit parametresi ile maksimum kayıt sayısı belirlenebilir.
        // ============================================================
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

        // ============================================================
        // 🧩 MessageRequest Class
        // Frontend’den gelen JSON verisini karşılamak için kullanılır.
        // ============================================================
        public class MessageRequest
        {
            public string Text { get; set; } = string.Empty;
            public string Nickname { get; set; } = string.Empty;
        }
    }
}
