# 🎨 Lovable & Modern Arayüz Geliştirme Kılavuzu

OptiVendor.AI'nin kullanıcı arayüzü; kurumsal güven hissi veren, göz yormayan ve veriyi ön plana çıkaran modern bir **Glassmorphic Dark Mode** tasarımı ile kurgulanmıştır.

---

## 1. Tasarım Sistemi & Renk Paleti (Design Tokens)

* **Arka Plan:** Deep Slate `#090D16` ve `#0F172A`
* **Cam Efekti (Glass Surface):** `background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(12px); border: 1px solid rgba(59, 130, 246, 0.15);`
* **Vurgu Renkleri (Accents):**
  - **Elektrik Mavisi (`#3B82F6`):** Birincil butonlar, aktif sekmeler, bağlantılar.
  - **İndigo (`#6366F1`):** Yapay zeka ajan akışı ve durum göstergeleri.
  - **Zümrüt Yeşili (`#10B981`):** En karlı teklif kartı, onaylanan adımlar, başarı rozetleri.
  - **Kehribar / Kırmızı (`#F59E0B` / `#EF4444`):** Fiyat anomalisi uyarısı, gecikme riski ve kritik sözleşme maddesi.
* **Tipografi:** 
  - Başlıklar ve Arayüz: `Inter` veya `Montserrat`
  - Sayısal Veriler, Kodlar ve Tarihler: `JetBrains Mono`

---

## 2. Arayüz Bileşen Hiyerarşisi (Component Tree)

```
<AppLayout>
  ├── <Header>
  │     ├── <LogoSVG> (OptiVendor.AI)
  │     ├── <LiveAgentStatusPill> ("Agent Active" yeşil nabız efekti)
  │     └── <WorkspaceSelector>
  │
  ├── <MainContent> (Split Screen 50% - 50%)
  │     ├── <LeftPanel: DocumentViewer>
  │     │     ├── <DocumentTabs> (Tedarikçi A, Tedarikçi B, Tedarikçi C)
  │     │     ├── <PDFCanvasViewer>
  │     │     └── <BoundingBoxOverlay> (Vurgulanan koordinat çerçevesi)
  │     │
  │     └── <RightPanel: IntelligenceDashboard>
  │           ├── <SummaryDecisionCards> (En İyi Fiyat, En Hızlı Teslimat, Optimum TCO)
  │           ├── <ComparisonMatrixTable> (Satır satır kıyaslama tablosu)
  │           ├── <AnomalyAlertBanner> (Zam tespiti ve uyarılar)
  │           └── <ActionDrawer> (Excel İndir, İndirim E-postası Taslağı)
  │
  └── <Footer / StatusAuditTrail>
```

---

## 3. Lovable Varlık (Asset) ve Logo Yönetim Kılavuzu

Marka bütünlüğünü korumak ve logo güncellemelerini sorunsuz entegre etmek için:

1. **Logo Yolu:** Tüm vektörel logolar `assets/logo.svg` ve `assets/icon.svg` dosyalarında tutulur.
2. **Lovable'a Logo Yükleme:**
   - Projenin `public/assets/` dizinine `logo.svg` dosyasını kopyalayın.
   - Lovable AI sohbetine şu komutu verin:
     > *"Header bileşeninde kullanılan logoyu `/assets/logo.svg` dosyasıyla değiştir, yüksekliğini 40px olarak ayarla ve yanına 'Agent Active' yeşil durum rozetini ekle."*
3. **SVG Avantajı:** Hiçbir çözünürlük kaybı yaşanmaz, dark mode renkleriyle tam uyumlu degrade ve filtreler desteklenir.
