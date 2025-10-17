# 💬 Fullstack AI Chat Application  
> **React (Web + Native) + .NET 8 Backend + Hugging Face AI Service**  
> Çok katmanlı bir yapay zekâ destekli duygu analizi sohbet uygulaması.

---

## 🧩 1. Proje Hakkında

Bu proje, kullanıcıların metin tabanlı mesajlarını yapay zekâya gönderip **duygu analizi (sentiment analysis)** sonucunu gerçek zamanlı olarak görmelerini sağlar.  
Uygulama üç ana bölümden oluşur:

| Katman | Teknoloji | Açıklama |
|--------|------------|----------|
| 🧠 **AI Servisi** | Python + Gradio + Transformers | Hugging Face üzerinde barındırılan RoBERTa tabanlı sentiment analizi modeli |
| ⚙️ **Backend API** | ASP.NET Core 8 + SQLite | Frontend’lerden gelen mesajları AI servisine ileten ve veritabanına kaydeden REST API |
| 💻 **Frontend** | React (Vite) + React Native (Expo) | Web ve mobil arayüzler üzerinden mesajlaşma ve sonuçların görüntülenmesi |

---

## ⚙️ 2. Proje Kurulum Adımları

### 🔹 A. Repository Yapısı
```
fullstack-ai-chat/
│
├── frontend/             # Web ve mobil arayüzler
│   ├── reactweb/         # Web arayüzü (Vercel deploy)
│   └── reactnativemobil/ # Mobil uygulama (React Native APK)
│
├── backend/              # .NET 8 API (Render deploy)
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   └── Dockerfile
│
└── ai-service/           # Hugging Face Gradio servisi
```

---

## 🤖 3. AI Servisi (Hugging Face Space)

### 📍 Kullanılan Araçlar:
- **Hugging Face Space:** `sentiment_analyzer`
- **SDK:** Gradio
- **Model:** `cardiffnlp/twitter-roberta-base-sentiment-latest`
- **Runtime:** CPU Basic (Public Space)

### 🧠 Çalışma Mantığı:
1. Kullanıcıdan gelen metin (Türkçe olabilir) önce İngilizceye çevrilir.  
2. Metin Hugging Face API’ye gönderilir.  
3. Model sonucu `"Positive" | "Neutral" | "Negative"` olarak döner.  

### 🔧 Dosyalar:
- **`app.py`** → Gradio arayüzü ve REST endpoint tanımı.  
- **`requirements.txt`** → `torch`, `transformers`, `gradio`, `numpy`.

### 🔗 **Demo Link:**  
👉 [Hugging Face Space – Sentiment Analyzer](https://huggingface.co/spaces/Mustafa5534/sentiment_analyzer)

---

## 🧱 4. Backend (.NET 8 – Render)

### 📂 Ana Dosyalar:
| Dosya | Açıklama |
|--------|----------|
| `Program.cs` | CORS, Swagger, DB migration, Render port yapılandırması |
| `AppDbContext.cs` | SQLite bağlantısı ve DbSet tanımları |
| `User.cs` | Kullanıcı modeli |
| `Message.cs` | Mesaj modeli (metin + sentiment + user relation) |
| `MessagesController.cs` | API endpointleri (POST / GET) |
| `Dockerfile` | Render deploy için multi-stage build ayarı |

### 🌐 API Endpoint’leri:
| Method | URL | Açıklama |
|---------|-----|----------|
| `GET` | `/api/messages?limit=50` | Son mesajları döner |
| `POST` | `/api/messages` | Yeni mesaj kaydeder ve AI sonucu ekler |

### 🛠️ Çalıştırma:
```bash
cd backend/SentimentAPI
dotnet restore
dotnet ef database update
dotnet run
```

### 🔗 **Render API Link:**  
👉 [https://fullstack-ai-chat-dpog.onrender.com/api/messages](https://fullstack-ai-chat-dpog.onrender.com/api/messages)

---

## 💻 5. Frontend (React + Vite – Vercel)

### 📦 Kurulum:
```bash
cd frontend/reactweb
npm install
npm run dev
```

### 🌍 `.env` İçeriği:
```env
VITE_API_BASE_URL=https://fullstack-ai-chat-dpog.onrender.com
```

### 🔧 Ana Dosyalar:
| Dosya | Açıklama |
|--------|----------|
| `App.jsx` | Rumuz kaydı ve sayfa yönlendirme |
| `NicknameGate.jsx` | Kullanıcı rumuzu giriş ekranı |
| `Chat.jsx` | API ile mesajlaşma ve duygu analizini gösteren ekran |
| `style.css` | Koyu tema + UI düzeni |
| `vercel.json` | Vercel build yapılandırması (vite + node 22) |

### 🔗 **Web Demo (Vercel):**  
👉 [https://fullstack-ai-chat.vercel.app](https://fullstack-ai-chat.vercel.app)

---

## 📱 6. Mobil (React Native)

### ⚙️ Kurulum:
```bash
npx react-native init ReactNativeMobil
cd ReactNativeMobil
npm install
npx react-native run-android
```

### 📱 Ekranlar:
| Dosya | Açıklama |
|--------|----------|
| `NicknameScreen.js` | Kullanıcıdan rumuz alınır |
| `ChatScreen.js` | Mesaj gönderme / sentiment sonucu |
| `App.js` | Stack Navigator (ekran yönlendirmesi) |

### 🔗 **APK Build Süreci:**
1. `keytool -genkey -v -keystore my-release-key.keystore`
2. `gradlew assembleRelease`
3. `app-release.apk` oluşturulur ve test edilir.  

---

## 🧩 7. AI Kullanım Alanları

| Kısım | AI Aracı | Durum | Açıklama |
|--------|-----------|--------|----------|
| **Hugging Face Servisi (app.py)** | Transformers + Gradio | ✅ AI ile yazıldı | Model çağrısı, REST endpoint, UI |
| **Sentiment Analiz Fonksiyonu (Controller)** | Hugging Face API | ✅ AI ile yazıldı | Modelden gelen sonucu işleme |
| **Frontend Chat.js Açıklamaları** | ChatGPT (AI destekli açıklama) | ✅ AI ile yazıldı | Kodun açıklama satırları |
| **NicknameGate & App.js açıklamaları** | ChatGPT | ✅ AI ile yazıldı | UI mantığı açıklamaları |
| **CSS stil düzeni açıklamaları** | ChatGPT | ✅ AI ile yazıldı | Tema, renk, açıklama satırları |
| **Mobil ekran açıklamaları** | ChatGPT | ✅ AI ile yazıldı | Yorum satırları ve ekran açıklamaları |
| **Database sorguları (EF Core)** | — | ❌ Elle yazıldı | `AppDbContext`, `Migrations`, `DbSet` tanımları |
| **Mobil API çağrıları (fetch)** | — | ❌ Elle yazıldı | Gerçek API bağlantısı manuel kodlandı |

> 🧠 AI tarafından yazılan bölümler yalnızca açıklama, UI tasarım veya model entegrasyonu ile ilgilidir.  
> Veritabanı işlemleri, mobil API çağrıları, migration ve backend veri akışı **tamamen manuel** yazılmıştır.

---

## 🧪 8. Çalışır Demo Linkleri

| Platform | URL / Dosya |
|-----------|--------------|
| 🌍 **Web Chat (Vercel)** | [https://fullstack-ai-chat.vercel.app](https://fullstack-ai-chat.vercel.app) |
| ⚙️ **Backend API (Render)** | [https://fullstack-ai-chat-dpog.onrender.com/api/messages](https://fullstack-ai-chat-dpog.onrender.com/api/messages) |
| 🤖 **Hugging Face Space** | [https://huggingface.co/spaces/Mustafa5534/sentiment_analyzer](https://huggingface.co/spaces/Mustafa5534/sentiment_analyzer) |
| 📱 **Mobil Build (APK)** | `android/app/release/app-release.apk` *(Test edilebilir build)* |

---

## 🧠 9. Kod Hakimiyeti & Açıklamalar

- Tüm dosyalarda **yorum satırları** eklenmiş ve ne iş yaptıkları açıklanmıştır.  
- **AI aracıyla yazılan** kısımlar yorumlarda açıkça belirtilmiştir.  
- **Veritabanı işlemleri**, **fetch yapıları** ve **mobil API çağrıları** manuel olarak yazılmıştır.  
- Kodun tamamı hem **frontend (React / RN)** hem **backend (.NET)** hem de **AI servis entegrasyonu** açısından detaylı olarak belgelenmiştir.

---

## 📚 10. Sonuç

Bu proje, uçtan uca çalışan bir **Fullstack AI Chat Sistemi** olarak tasarlanmıştır.  
Tüm bileşenler birbirine entegre biçimde çalışır:  

```
React / React Native  →  .NET Backend  →  Hugging Face AI Model
```

> ✅ Web arayüzü → Vercel  
> ✅ Backend → Render  
> ✅ AI Servisi → Hugging Face  
> ✅ Mobil → React Native APK  

---

📝 **Hazırlayan:** Mustafa Akbulut  
📅 **Yıl:** 2025  
📍 **Teknolojiler:** React Native, React Vite, .NET 8, Hugging Face, SQLite, Render, Vercel  
