# 🏛️ OptiVendor.AI - Sistem Mimarisi & Teknik Tasarım Dokümanı

> **Doküman Versiyonu:** 1.0.0  
> **Hedef:** Kurumsal Seviye, Güvenli, Ölçeklenebilir ve Modüler B2B Karar Destek Ajanı

---

## 1. Yüksek Düzey Mimari Şeması (High-Level Architecture)

Aşağıdaki Mermaid şeması; farklı kanallardan (Web Upload, E-posta, WhatsApp) gelen tekliflerin sisteme girişinden nihai satın alma kararına kadar olan veri akışını gösterir:

```mermaid
flowchart TD
    subgraph Ingestion ["1. Giriş Kanalları (Ingestion Layer)"]
        A1[Kullanıcı Web Yüklemesi - Drag & Drop]
        A2[Gelen E-posta Yönlendirme - IMAP/Webhook]
        A3[ERP / Satın Alma Talep Entegrasyonu]
    end

    subgraph Preprocessing ["2. Ön İşleme & Normalizasyon"]
        B1[Belge Türü Tespiti - PDF / Resim / Excel]
        B2[Görüntü İyileştirme & Sayfa Ayrıştırma]
        B3[Koordinat Haritalama Motoru - Bounding Box Engine]
    end

    subgraph AgentCore ["3. Ajan Çekirdeği (LangGraph State Machine)"]
        C1[Extraction Agent - Multimodal LLM + Pydantic]
        C2[Normalization Node - Döviz, Birim, Vade Çevirici]
        C3[TCO Scoring Engine - Toplam Maliyet & Risk Skoru]
        C4[Anomaly & Negotiation Agent - Zam Tespiti & İndirim Taslağı]
        C5{Güven Skoru >= 0.85 mi?}
    end

    subgraph Persistence ["4. Kalıcılık & Güvenlik"]
        D1[(PostgreSQL + PostgresSaver)]
        D2[(pgvector - Geçmiş Alım Fiyat Hafızası)]
    end

    subgraph HITL ["5. İnsan Döngüde & Karar Paneli (UI)"]
        E1[İnteraktif Karşılaştırma Matrisi]
        E2[Görsel Doğrulama - Visual Grounding PDF Viewer]
        E3[Human-in-the-Loop Onay / Düzeltme Butonu]
        E4[Tek Tıkla Aksiyon: Excel İndir / Tedarikçiye E-posta Gönder]
    end

    A1 & A2 & A3 --> B1 --> B2 --> B3
    B3 --> C1
    C1 <--> D1
    C1 --> C2 --> C3 --> C4 --> C5
    C5 -- Evet --> E1
    C5 -- Hayır / Kritik Anomali --> D1 --> E3
    E3 -- İnsan Düzeltmesi / Onayı --> E1
    E1 --> E2 & E4
    E4 -.-> D2
```

---

## 2. Nesne Yönelimli Sınıf Akışı (OOP Class Flow)

Sistemin Python backend katmanında temiz kod ve SOLID prensiplerine uygun olarak tasarlanan temel sınıf yapısı:

```mermaid
classDiagram
    class DocumentParser {
        <<Interface>>
        +parse(file_bytes: bytes) ParsedDocument
        +extract_bounding_boxes() List~BoundingBox~
    }

    class PDFMultimodalParser {
        -model_client: LLMClient
        -dpi: int
        +parse(file_bytes: bytes) ParsedDocument
    }

    class ExcelParser {
        +parse(file_bytes: bytes) ParsedDocument
    }

    DocumentParser <|.. PDFMultimodalParser
    DocumentParser <|.. ExcelParser

    class VendorQuote {
        +UUID id
        +str vendor_name
        +str tax_id
        +date quote_date
        +date validity_date
        +List~LineItem~ items
        +CommercialTerms terms
        +float total_amount
        +Currency currency
        +calculate_tco(target_currency: Currency) float
    }

    class LineItem {
        +str item_code
        +str description
        +float quantity
        +str unit
        +float unit_price
        +float vat_rate
        +BoundingBox source_box
    }

    class CommercialTerms {
        +int payment_term_days
        +int delivery_days
        +bool shipping_included
        +str warranty_period
    }

    class TCOCalculator {
        -interest_rate_per_day: float
        -daily_delay_penalty: float
        +compute_score(quote: VendorQuote) TCOScore
    }

    class RFQComparisonEngine {
        +List~VendorQuote~ quotes
        +rank_quotes() RankedResult
        +detect_anomalies(history_db: VectorStore) List~AnomalyAlert~
        +generate_negotiation_draft(quote: VendorQuote) str
    }

    VendorQuote "1" *-- "many" LineItem
    VendorQuote "1" *-- "1" CommercialTerms
    RFQComparisonEngine o-- VendorQuote
    TCOCalculator --> VendorQuote
```

---

## 3. Pydantic Katı Veri Şeması (Zero-Hallucination Schemas)

```python
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date
from enum import Enum

class Currency(str, Enum):
    TRY = "TRY"
    USD = "USD"
    EUR = "EUR"

class BoundingBox(BaseModel):
    page_number: int = Field(description="1-based sayfa numarası")
    x_min: float = Field(description="Normalize edilmiş sol koordinat (0.0 - 1.0)")
    y_min: float = Field(description="Normalize edilmiş üst koordinat (0.0 - 1.0)")
    x_max: float = Field(description="Normalize edilmiş sağ koordinat (0.0 - 1.0)")
    y_max: float = Field(description="Normalize edilmiş alt koordinat (0.0 - 1.0)")

class QuoteLineItem(BaseModel):
    item_name: str = Field(description="Teklif edilen malzeme veya hizmet adı")
    quantity: float = Field(description="Teklif edilen miktar")
    unit: str = Field(description="Birim (Adet, Kg, Metre, Saat vb.)")
    unit_price: float = Field(description="KDV hariç birim fiyat")
    vat_rate: float = Field(default=20.0, description="KDV oranı (%)")
    bounding_box: Optional[BoundingBox] = Field(default=None, description="Metnin belgedeki görsel konumu")

class CommercialTerms(BaseModel):
    payment_terms_days: int = Field(default=0, description="Vade süresi (gün). 0 = Peşin")
    delivery_lead_time_days: int = Field(description="Teslimat süresi (iş günü)")
    shipping_included: bool = Field(default=True, description="Nakliye fiyata dahil mi?")
    notes: Optional[str] = Field(default=None, description="Özel iskonto veya şartlar")

class VendorQuoteSchema(BaseModel):
    vendor_name: str = Field(description="Teklifi veren firma ticari unvanı")
    tax_number: Optional[str] = Field(default=None, description="Vergi kimlik numarası")
    quote_date: Optional[date] = Field(default=None, description="Teklif düzenleme tarihi")
    currency: Currency = Field(description="Teklif para birimi")
    line_items: List[QuoteLineItem] = Field(description="Teklif kalemleri")
    commercial_terms: CommercialTerms = Field(description="Ticari ve teslimat şartları")
    confidence_score: float = Field(description="LLM çıkarma güven skoru (0.0 - 1.0)")
```

---

## 4. TCO (Toplam Sahip Olma Maliyeti) Hesaplama Algoritması

En ucuz teklif her zaman en karlı teklif değildir. OptiVendor.AI aşağıdaki matematiksel modeli uygular:

$$\text{TCO} = \text{Net Teklif Fiyatı} + \text{Finansman/Vade Maliyeti} + \text{Gecikme/Termin Riski Maliyeti} + \text{Nakliye/Ek Masraflar}$$

* **Vade Avantajı:** 90 gün vadeli 100.000 TL teklif, peşin 95.000 TL tekliften yüksek faiz ortamında daha karlı olabilir.
* **Gecikme Riski:** Fabrikanın üretim bandını durduracak 5 günlük bir gecikmenin maliyeti, 2.000 TL'lik malzeme indiriminden çok daha büyüktür.
* **Anomali Skoru:** Benzer malzeme son 6 ayda ortalama 100 TL'ye alınmışken gelen 135 TL'lik teklif derhal sarı alarm olarak işaretlenir.
