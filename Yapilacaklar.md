# 📋 Master Yapılacaklar Listesi: OptiVendor.AI

> **Repo:** `OptiVendor-AI`  
> **Sürüm:** `v0.1.0-alpha`  
> **Mimari Prensip:** Clean Architecture, Stateful Multi-Agent (LangGraph), Deterministic Validation, Zero-Trust Security, Glassmorphic UI  
> **Durum Takibi:** `[ ] Beklemede` | `[/] Devam Ediyor` | `[x] Tamamlandı`

---

## 🎯 Proje Özeti & Vizyon
OptiVendor.AI; dağınık ve farklı formatlarda (taranmış PDF, Excel, e-posta metni, WhatsApp görseli) gelen tedarikçi tekliflerini (RFQ) multimodal LLM'ler ve deterministik şemalarla otonom olarak ayrıştıran, normalize eden, Toplam Sahip Olma Maliyeti (TCO) ve risk puanlaması yaparak satın alma ekiplerine **görsel doğrulamalı (visual grounding)** karar desteği sunan yeni nesil bir B2B yapay zeka platformudur.

---

## 👥 Hedef Personalar ve Kapsam Çerçevesi

| Persona | Rol & İhtiyaç | Kritik Başarı Kriteri |
| :--- | :--- | :--- |
| **P1: Satın Alma Müdürü (Procurement Lead)** | 5-10 farklı teklifi tek ekranda yan yana görüp en ucuz, en hızlı ve en güvenilir olanı seçmek. | Teklife tıklayınca orijinal belgedeki ilgili satırın fosforlu kutuyla parlaması (Visual Grounding). |
| **P2: Finans Direktörü / CFO** | Gizli maliyetleri, kur riskini, vade farkını ve piyasa anomalisini tespit etmek. | Geçmiş fiyat trendi ile kıyaslama ve anomali uyarıları (%15 zam tespiti vb.). |
| **P3: Saha / Operasyon Şefi** | Gecikme riskini önlemek, termin tarihlerine tam uyum sağlamak. | Teslimat tarihi ile kritik proje takvimi çakışma dedektörü. |

---

## 🚀 FAZ 1: Temel İskelet, Arayüz & Persona Çerçevesi (UI & Skeleton)
- [x] **1.1 Proje Çalışma Alanı ve Repo İskeletinin Kurulması**
  - [x] `OptiVendor-AI` klasör hiyerarşisi oluşturuldu (`assets/`, `docs/`, `prompts/`, `core/`, `web/`).
  - [x] Vektörel SVG marka varlıkları (`logo.svg`, `icon.svg`) dizine eklendi.
  - [x] `README.md` ve `Yapilacaklar.md` master dosyaları hazırlandı.
- [x] **1.2 Lovable & Frontend Tasarım Sistemi Kurulumu**
  - [x] Dark mode tabanlı, glassmorphism (`backdrop-blur-md`, subtle border glow `#3B82F6`) tasarım token'larının tanımlanması.
  - [x] İki panelli ana layout: Sol tarafta İnteraktif PDF/Belge Önizleyici, Sağ tarafta Akıllı Kıyaslama Matrisi.
  - [x] Sürükle-bırak (Drag & Drop) çoklu teklif yükleme alanı (PDF, XLSX, PNG/JPG).
- [ ] **1.3 Görsel Doğrulama (Visual Grounding) Mockup'ı**
  - [ ] Belge üzerindeki koordinatları (Bounding Boxes) temsil eden SVG/Canvas katmanının arayüze bağlanması.
  - [ ] Sağ paneldeki tablo satırına tıklandığında sol taraftaki PDF'in ilgili satırına otomatik kayma (smooth scroll & highlight).
- [ ] **1.4 Karar Kartları ve Hızlı Aksiyon Arayüzü**
  - [ ] "En İyi Fiyat", "En Hızlı Teslimat", "Önerilen Dengeli Seçenek" rozetleri.
  - [ ] Tek tıkla "Excel Olarak İndir" ve "Pazarlık / İndirim E-postası Taslağı Oluştur" butonları.

---

## ⚙️ FAZ 2: İş Mantığı, Nesne Yönelimli Akışlar & LangGraph Mimarisi
- [ ] **2.1 Pydantic Veri Şemalarının İnşası (Zero-Hallucination Schemas)**
  - [ ] `VendorQuoteSchema`: Tedarikçi adı, vergi no, belge tarihi, geçerlilik süresi.
  - [ ] `QuoteLineItemSchema`: Malzeme/hizmet adı, miktar, birim, birim fiyat, KDV oranı, para birimi.
  - [ ] `CommercialTermsSchema`: Vade (gün), peşinat şartı, nakliye dahil/hariç durumu, teslim süresi.
- [ ] **2.2 Multimodal Belge Ayrıştırma Hattı (Document Parsing Engine)**
  - [ ] Gemini 1.5 Pro / Claude 3.5 Sonnet multimodal API entegrasyonu.
  - [ ] Yapılandırılmamış ve yamuk taranmış belgeler için görüntü iyileştirme ve sayfa koordinatlarını yakalama.
- [ ] **2.3 LangGraph Durum Makinesi (StateGraph Engine)**
  - [ ] `IngestionNode`: Belgeleri sıraya alma ve ön işleme.
  - [ ] `ExtractionNode`: Pydantic ile yapılandırılmış JSON çıkarma ve koordinat haritalama.
  - [ ] `NormalizationNode`: Farklı para birimlerini (USD/EUR/TRY) TCMB kur API'si ile ortak paydaya getirme.
  - [ ] `TCO_ScoringNode`: Toplam Sahip Olma Maliyeti (Fiyat + Vade Avantajı - Gecikme Riski) hesaplama motoru.
  - [ ] `AnomalyDetectionNode`: Geçmiş alım fiyatlarıyla sapma tespiti (%X zam kontrolü).
  - [ ] `HumanApprovalGate`: Skorlama sonrası `interrupt()` ile insan kontrolü ve PostgreSQL (`PostgresSaver`) checkpoint'i.
- [ ] **2.4 GitHub Copilot & Kod Kalitesi Doğrulama Kontrol Listesi (Checklist)**
  - [ ] Tüm fonksiyonlarda katı Tip Belirteçleri (Strict Type Hints).
  - [ ] Hata durumlarında (timeout, bozuk görsel) gracefully fallback mekanizmaları.
  - [ ] Rate-limit ve token maliyet koruma devre kesicileri (Circuit Breakers).

---

## 🧪 FAZ 3: Uçtan Uca Testler, Sentetik Benchmark & Performans Optimizasyonu
- [ ] **3.1 Sentetik RFQ Test Veri Setinin Oluşturulması**
  - [ ] 10 farklı sektörden (İnşaat, Makine, Kimya, Tekstil, Bilişim) sentetik teklif mektubu üretimi.
  - [ ] Zorlayıcı test vakaları: El yazısı notlar, eksik teslim tarihi, çift para birimi, dövizli vadeler.
- [ ] **3.2 Doğruluk ve F1/Recall Benchmark Testleri**
  - [ ] Alan bazlı çıkarma doğruluğu (Fiyat, Miktar, Vade) için otomatik test suiti (`pytest`).
  - [ ] Kabul kriteri: Fiyat ve miktarda %99.5+, ticari şartlarda %95+ alan doğruluğu.
- [ ] **3.3 Performans ve Maliyet Optimizasyonu**
  - [ ] LLM Response Caching (Redis veya yerel disk hash) ile tekrarlanan tekliflerde sıfır maliyet.
  - [ ] Token optimizasyonu: Doküman sayfalarını gereksiz yere birden fazla modele göndermeme.

---

## 📦 FAZ 4: Sistem Arşivleme, Dağıtım Kılavuzu & Makine Okunabilir Çıktı
- [ ] **4.1 AI-to-AI / Machine Readable Archive (`SYSTEM_STATE.md`)**
  - [ ] Başka bir LLM veya IDE asistanının (Copilot, Cursor) tek okumada projeyi tam kavramasını sağlayan tekil sistem durum dökümü.
- [ ] **4.2 Docker & Kolay Kurulum Altyapısı**
  - [ ] `docker-compose.yml` (FastAPI backend + PostgreSQL + Redis + Next.js).
  - [ ] `.env.example` ve güvenlik sertifikasyon rehberi (SOC2 / KVKK uyumluluk notları).
- [ ] **4.3 60 Saniyelik Müşteri Demosu & Satış Kılavuzu**
  - [ ] Satın alma müdürlerine gönderilecek 1 dakikalık Loom video senaryosu.
  - [ ] Soğuk e-posta ve LinkedIn outreach şablonları.

---

## 🔄 Periyodik Genel Tarama & Kalite Kontrol Protokolü
Her faz tamamlandığında aşağıdaki 4 soru zorunlu olarak denetlenecektir:
1. **Mimari Uyumluluk:** Kod katı OOP ve Clean Architecture prensiplerine sadık mı?
2. **Güvenlik & Gizlilik:** Müşteri teklif verileri hiçbir üçüncü parti kontrolsüz modele sızdırılmadan yerel/şifreli olarak saklanıyor mu?
3. **Kullanıcı Deneyimi:** Satın almacı 2 tıkla aradığı cevabı bulabiliyor mu?
4. **Hata Dayanıklılığı:** Model beklenmeyen bir çıktı ürettiğinde sistem patlamadan kullanıcıya anlamlı bir hata ve düzeltme kutusu sunuyor mu?
