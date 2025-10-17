# ============================================================
# 🐳 Dockerfile - SentimentAPI
# Bu dosya, .NET 8 tabanlı duygu analizi API’sinin container ortamında
# çalıştırılması için gerekli adımları tanımlar.
#
# İki aşamalı (multi-stage) yapı kullanılmıştır:
#   1️⃣ Build aşaması: Uygulama derlenir ve yayınlanır.
#   2️⃣ Runtime aşaması: Yalnızca yayın dosyalarıyla hafif bir imaj oluşturulur.
# ============================================================

# ------------------------------------------------------------
# 1️⃣ BUILD AŞAMASI
# .NET SDK imajı kullanılarak projenin restore ve publish işlemleri yapılır.
# ------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Çalışma dizinini oluştur ve içine geç
WORKDIR /app

# Tüm proje dosyalarını container içine kopyala
COPY . ./

# Gerekli bağımlılıkları indir (NuGet restore)
RUN dotnet restore

# Uygulamayı "Release" modunda derle ve çıktıyı "out" klasörüne al
RUN dotnet publish -c Release -o out

# ------------------------------------------------------------
# 2️⃣ RUNTIME AŞAMASI
# Bu aşama, sadece derlenmiş çıktıları kullanır.
# SDK içermediği için imaj boyutu küçüktür (daha güvenli ve performanslıdır).
# ------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0

# Çalışma dizinini ayarla
WORKDIR /app

# Build aşamasında oluşturulan dosyaları kopyala
COPY --from=build /app/out .

# Container başlatıldığında çalışacak komut
ENTRYPOINT ["dotnet", "SentimentAPI.dll"]

# ------------------------------------------------------------
# 📌 ÖZET:
#  - Bu yapı Render, Docker Hub veya Azure Container App gibi ortamlarda
#    SentimentAPI projesini kolayca dağıtmanı sağlar.
#  - Uygulama, .NET 8 runtime üzerinde çalışır.
#  - Build ve runtime ayrımı sayesinde gereksiz dosyalar imaja dahil edilmez.
# ------------------------------------------------------------
