<div align="center">
  <img src="assets/logo.svg" alt="OptiVendor.AI Logo" width="100%" max-width="720px" />

  <p align="center">
    <strong>Tedarikçi Teklif Karşılaştırma &amp; Otonom Satın Alma Karar Destek Ajanı</strong><br />
    <em>Autonomous RFQ Normalization, Visual Grounding &amp; TCO Intelligence Engine</em>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Architecture-Clean%20%26%20Modular-blue.svg" alt="Architecture" />
    <img src="https://img.shields.io/badge/Agent-LangGraph%20StateGraph-indigo.svg" alt="LangGraph" />
    <img src="https://img.shields.io/badge/Validation-Pydantic%20Strict-green.svg" alt="Pydantic" />
    <img src="https://img.shields.io/badge/UI-Lovable%20%7C%20Glassmorphic-38bdf8.svg" alt="UI" />
    <img src="https://img.shields.io/badge/Status-Phase%201%20Ready-emerald.svg" alt="Status" />
  </p>
</div>

---

## 📌 Proje Hakkında
**OptiVendor.AI**, şirketlerin farklı tedarikçilerden farklı formatlarda (PDF, Excel, WhatsApp görseli, taranmış belge) aldığı teklifleri dakikalar içinde otonom olarak toplayan, standart bir veri şemasına oturtan, **Görsel Doğrulama (Visual Grounding)** ile güven inşa eden ve Toplam Sahip Olma Maliyeti (TCO) hesaplayarak en karlı teklifi öneren kurumsal bir yapay zeka platformudur.

---

## 🌟 Öne Çıkan "Wow" Özellikleri

1. **Görsel Doğrulama (Visual Grounding):**  
   Çıkarılan fiyat verisine tıklandığında, sol paneldeki orijinal teklif PDF'indeki ilgili satır sarı/yeşil parlayan bir kutucukla (Bounding Box) anında aydınlanır. Halüsinasyon şüphesini sıfırlar.
2. **Akıllı TCO & Finansman Analizi:**  
   Sadece fiyata değil; vade gününe (90 gün vadeli teklifin nakit akışı avantajı), teslimat süresine ve nakliye şartlarına göre ağırlıklı maliyet çıkarır.
3. **Anomali & Pazarlık Asistanı:**  
   Geçmiş alımlara kıyasla %15+ zamlanan kalemleri tespit eder ve tek tıkla tedarikçiye gönderilecek profesyonel bir indirim talep e-postası taslağı oluşturur.
4. **Human-in-the-Loop (HITL) Güvenlik Kapısı:**  
   Ajan kritik anomalilerde veya düşük güven skorlarında `interrupt()` ile durur, durumunu PostgreSQL'e kaydeder ve insan onayından sonra süreci tamamlar.

---

## 🗂️ Dizin Yapısı

```
OptiVendor-AI/
├── assets/                  # Vektörel SVG logolar ve görsel varlıklar
│   ├── logo.svg
│   └── icon.svg
├── docs/                    # Detaylı mimari ve persona kılavuzları
│   ├── architecture.md      # Mermaid şemaları, OOP sınıf akışı ve TCO formülü
│   ├── personas.md          # P1 Satın Alma, P2 CFO, P3 Operasyon personaları
│   └── lovable_guidelines.md# Tasarım sistemi, dark mode ve glassmorphism kuralları
├── prompts/                 # Fazlara göre profesyonel prompt koleksiyonu
│   ├── 01_faz1_ui_skeleton_prompts.md
│   ├── 02_faz2_extraction_and_graph_prompts.md
│   ├── 03_faz2_negotiation_anomaly_prompts.md
│   ├── 04_faz3_testing_and_benchmarking_prompts.md
│   └── 05_faz4_copilot_and_system_archive_prompts.md
├── core/                    # Python Backend & LangGraph Motoru
│   ├── schemas/quote_schema.py
│   ├── services/tco_calculator.py
│   └── requirements.txt
├── web/                     # Next.js / Lovable Frontend iskeleti
├── Yapilacaklar.md          # Master yapılacaklar ve faz takip listesi
└── README.md
```

---

## 🚀 Hızlı Başlangıç (Geliştirme Ortamı)

### 1. Backend Kurulumu (Python 3.11+)
```bash
cd OptiVendor-AI/core
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Yapılacaklar Listesini Takip Edin
Geliştirme fazları, kontrol listeleri ve Copilot doğrulama adımları için [Yapilacaklar.md](Yapilacaklar.md) dosyasını inceleyin.

---

## 📜 Lisans & Standartlar
Bu proje Clean Architecture, Twelve-Factor App ve kurumsal veri gizliliği standartlarına uygun olarak tasarlanmıştır.
