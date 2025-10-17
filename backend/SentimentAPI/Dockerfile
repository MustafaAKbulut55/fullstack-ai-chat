# .NET 8 SDK kullan
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

# Proje dosyalarını kopyala ve restore et
COPY . ./
RUN dotnet restore
RUN dotnet publish -c Release -o out

# Runtime imajı
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Uygulamayı başlat
ENTRYPOINT ["dotnet", "SentimentAPI.dll"]
