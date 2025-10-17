using Microsoft.EntityFrameworkCore;
using SentimentAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// CORS policy ekleniyor
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins(
                "http://localhost:3000",         // React web dev ortamı
                "http://10.0.2.2:8081",          // Android Emulator (React Native CLI)
                "http://127.0.0.1:8081",         // Localhost mobil test
                "https://your-vercel-app.vercel.app" // Vercel production domain
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// 🔹 CORS aktif ediliyor
app.UseCors(MyAllowSpecificOrigins);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();
app.Run();
