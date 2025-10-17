import gradio as gr
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# 🔹 Model ve etiketler
MODEL_NAME = "cardiffnlp/twitter-roberta-base-sentiment-latest"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
labels = ["Negative", "Neutral", "Positive"]

# 🔹 Tahmin fonksiyonu
def analyze_sentiment(text):
    if not text.strip():
        return "Neutral"
    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
        scores = torch.nn.functional.softmax(outputs.logits, dim=1)[0]
    predicted_label = labels[torch.argmax(scores)]
    score_dict = {labels[i]: round(float(scores[i]) * 100, 2) for i in range(len(labels))}
    return f"{predicted_label} | Scores → {score_dict}"

# 🔹 Blocks yapısı (Gradio 4.36+ için gerekli)
with gr.Blocks() as demo:
    gr.Markdown("## 🧠 3-Class Sentiment Analyzer (Positive / Neutral / Negative)")
    text_in = gr.Textbox(label="Enter your text")
    result_out = gr.Textbox(label="Prediction result")
    analyze_btn = gr.Button("Analyze")

    # 🔸 Fonksiyonu buton ile bağla ve API endpoint olarak kaydet
    analyze_btn.click(
        fn=analyze_sentiment,
        inputs=text_in,
        outputs=result_out,
        api_name="analyze_sentiment"  # 🔥 yeni Gradio sisteminde endpoint burada kaydolur
    )

if __name__ == "__main__":
    demo.launch(share=True, server_name="0.0.0.0", server_port=7860)
