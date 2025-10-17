# ============================================================
# 🧠 SENTIMENT ANALYSIS MODEL (Gradio API)
# Bu dosya, kullanıcıdan gelen metinleri alarak
# CardiffNLP'nin RoBERTa tabanlı modelini kullanır
# ve duygu analizini (Pozitif, Negatif, Nötr) yapar.
# 
# Gradio arayüzü sayesinde hem web üzerinden test edilir
# hem de bir API endpoint olarak kullanılabilir.
# ============================================================

import gradio as gr
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# ------------------------------------------------------------
# 🔹 Model ve etiketlerin yüklenmesi
# CardiffNLP tarafından eğitilen "twitter-roberta-base-sentiment-latest"
# modeli sosyal medya metinlerinde duygusal analiz için optimize edilmiştir.
# ------------------------------------------------------------
MODEL_NAME = "cardiffnlp/twitter-roberta-base-sentiment-latest"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
labels = ["Negative", "Neutral", "Positive"]

# ------------------------------------------------------------
# 🔹 Duygu Analizi Fonksiyonu
# Bu fonksiyon, kullanıcıdan gelen metni tokenleştirir,
# modeli çalıştırır ve tahmini etiket ile olasılıkları döner.
# ------------------------------------------------------------
def analyze_sentiment(text):
    # Eğer giriş boşsa nötr olarak işaretle
    if not text.strip():
        return "Neutral"
    
    # Metni modele uygun hale getir (tokenize et)
    inputs = tokenizer(text, return_tensors="pt", truncation=True)

    # Modeli değerlendirme modunda çalıştır (gradyan hesaplanmaz)
    with torch.no_grad():
        outputs = model(**inputs)
        # Çıktıları softmax fonksiyonuyla olasılığa çevir
        scores = torch.nn.functional.softmax(outputs.logits, dim=1)[0]

    # En yüksek skoru alan etiketi belirle
    predicted_label = labels[torch.argmax(scores)]

    # Her sınıfın yüzdelik skorunu oluştur
    score_dict = {labels[i]: round(float(scores[i]) * 100, 2) for i in range(len(labels))}

    # Sonucu metin formatında döndür
    return f"{predicted_label} | Scores → {score_dict}"

# ------------------------------------------------------------
# 🔹 Gradio Arayüzü (Blocks yapısı)
# Gradio 4.36+ sürümünde kullanılan yeni arayüz tipi.
# Bu yapı, hem kullanıcı etkileşimini hem de API tanımını içerir.
# ------------------------------------------------------------
with gr.Blocks() as demo:
    # Başlık
    gr.Markdown("## 🧠 3-Class Sentiment Analyzer (Positive / Neutral / Negative)")

    # Kullanıcıdan giriş alınacak kutu
    text_in = gr.Textbox(label="Enter your text")

    # Tahmin sonucu burada gösterilir
    result_out = gr.Textbox(label="Prediction result")

    # Tahmini başlatan buton
    analyze_btn = gr.Button("Analyze")

    # 🔸 analyze_sentiment fonksiyonunu buton tıklamasına bağla
    # Ayrıca API endpoint olarak "analyze_sentiment" ismiyle kaydet
    analyze_btn.click(
        fn=analyze_sentiment,
        inputs=text_in,
        outputs=result_out,
        api_name="analyze_sentiment"  # 🚀 Bu isim, Gradio API çağrılarında endpoint olarak kullanılır
    )

# ------------------------------------------------------------
# 🔹 Ana çalışma bloğu
# Uygulama başlatıldığında Gradio servisini 0.0.0.0:7860 adresinde açar.
# share=True sayesinde internet üzerinden test edilebilir bir link üretilir.
# ------------------------------------------------------------
if __name__ == "__main__":
    demo.launch(share=True, server_name="0.0.0.0", server_port=7860)
