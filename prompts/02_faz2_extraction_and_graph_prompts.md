# ⚙️ FAZ 2 Promptları: Belge Ayrıştırma, Pydantic & LangGraph Mimarisi

Bu promptlar; **Google AI Studio**, **Claude 3.5 Sonnet API** ve **LangGraph** motorunu yapılandırmak ve **GitHub Copilot** ile backend kodunu sıfır hata ile üretmek için hazırlanmıştır.

---

### Prompt 2.1: Multimodal LLM için Sıfır-Halüsinasyon Teklif Ayrıştırma Promptu

```markdown
Sen endüstriyel satın alma belgelerini ayrıştıran uzman bir Doküman Zekası Ajanısın (Document Intelligence Agent). Görevin sana sağlanan teklif mektubu görüntüsünü (PDF veya görsel) analiz etmek ve hiçbir varsayımda bulunmadan, yalnızca belgede açıkça görünen verileri katı JSON formatında çıkarmaktır.

KURALLAR:
1. Kesinlikle kendi kafandan veri uydurma (No Hallucination). Belgede teslimat süresi yazmıyorsa null bırak, asla tahmin etme.
2. Fiyatları sayısallaştırırken binlik ve ondalık ayraçlarına dikkat et (Örn: 1.250,50 TL -> 1250.50).
3. KDV durumunu kontrol et: Fiyatlar KDV dahil mi, hariç mi?
4. Her satır kalemi için metnin belgedeki normalize edilmiş konumunu (0.0 ile 1.0 arasında x_min, y_min, x_max, y_max) Bounding Box olarak tahmin et.

ÇIKTI ŞEMASI (Strict JSON):
{
  "vendor_name": "string",
  "tax_id": "string or null",
  "quote_date": "YYYY-MM-DD or null",
  "validity_date": "YYYY-MM-DD or null",
  "currency": "TRY" | "USD" | "EUR",
  "line_items": [
    {
      "item_code": "string or null",
      "description": "string",
      "quantity": float,
      "unit": "string",
      "unit_price": float,
      "vat_rate": float,
      "total_line_price": float,
      "bounding_box": {
        "page_number": int,
        "x_min": float,
        "y_min": float,
        "x_max": float,
        "y_max": float
      }
    }
  ],
  "commercial_terms": {
    "payment_terms_days": int (Örn: 30, 60, 90. Peşin ise 0),
    "delivery_lead_time_days": int,
    "shipping_included": boolean,
    "special_notes": "string or null"
  },
  "extraction_confidence": float (0.0 - 1.0)
}
```

---

### Prompt 2.2: LangGraph StateGraph & Human-in-the-Loop Backend Mimarisi

```markdown
Kıdemli bir Python AI Mühendisi kimliğiyle, `langgraph`, `pydantic` ve `psycopg` kullanarak kurumsal bir `RFQWorkflowGraph` sınıfı oluştur.

Gereksinimler:
1. TypedDict State Şeması:
   - `rfq_id: str`
   - `raw_documents: List[bytes]`
   - `parsed_quotes: List[VendorQuoteSchema]`
   - `tco_rankings: List[RankedVendorQuote]`
   - `anomalies: List[str]`
   - `requires_human_review: bool`
   - `human_approval_status: Optional[str]`

2. Graph Düğümleri (Nodes):
   - `node_parse_documents`: Multimodal model çağrısı yapar ve Pydantic ile doğrular.
   - `node_normalize_currencies`: TCMB API simülasyonu ile tüm teklifleri hedef para birimine (TRY veya USD) çevirir.
   - `node_calculate_tco`: Net Fiyat + (Vade Maliyeti - Aylık %3 faiz) + Gecikme Cezası formülüyle TCO hesaplar.
   - `node_detect_anomalies`: Fiyatı ortalamanın %20 üzerinde olan kalemleri veya termin süresi uyuşmayanları tespit eder.
   - `node_human_gate`: Eğer anomali varsa veya güven skoru < 0.85 ise `interrupt()` tetikleyerek akışı durdurur ve durumu PostgreSQL `PostgresSaver` ile diske kaydeder.

3. GitHub Copilot Doğrulama Kontrol Listesi:
   - Her fonksiyon tip güvenli (strict type hinted) olmalı.
   - Asenkron yürütme (`async/await`) desteklenmeli.
   - Pydantic ValidationError yakalanarak hata loglanmalı ve güven skoru 0 olarak işaretlenmeli.
```
