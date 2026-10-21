# 🎨 FAZ 1 Promptları: Arayüz İskeleti & Lovable Tasarım Sistemi

Bu promptlar; **Lovable**, **v0.dev**, **Cursor** veya **GitHub Copilot**'a verilerek OptiVendor.AI'nin modern, kurumsal ve göz alıcı arayüzünü tek seferde doğru üretmek için optimize edilmiştir.

---

### Prompt 1.1: Lovable / v0.dev Split-Screen Glassmorphic Dashboard

```markdown
Sen kıdemli bir Frontend Mimarı ve UI/UX Tasarımcısısın. Next.js 14 (App Router), Tailwind CSS, Lucide Icons ve shadcn/ui bileşenlerini kullanarak "OptiVendor.AI - Autonomous RFQ Decision Engine" için iki panelli (split-screen) kurumsal bir B2B paneli oluşturacaksın.

Tasarım Kuralları:
1. Tema: Ultra-modern Dark Mode (#090D16 arka plan). Glassmorphic yüzeyler (backdrop-blur-md, sınır rengi rgba(59, 130, 246, 0.15)).
2. Renkler: Ana aksiyonlar için Electric Blue (#3B82F6), en karlı ve güvenli teklifler için Emerald Green (#10B981), uyarılar için Amber (#F59E0B). Sayısal veriler ve kodlar için JetBrains Mono yazı tipi.

Arayüz Bileşenleri:
- Header: Sol tarafta OptiVendor.AI logosu (/assets/logo.svg), yanında yeşil nabız (pulse) atan "AGENT ACTIVE" rozeti, sağ tarafta aktif çalışma alanı seçici ("Fabrika A - Satın Alma").
- Sol Panel (%45 Genişlik): "Görsel Doğrulama & Belge Önizleyici". Üstte yüklenen tekliflerin sekmeleri (Tedarikçi A, Tedarikçi B, Tedarikçi C). Ortada taranmış teklif belgesini gösteren bir Canvas/PDF mock alanı. Sağ panelden bir satır seçildiğinde bu belgedeki ilgili satırın üzerinde parlayan sarı/yeşil bir Bounding Box (koordinat çerçevesi) çizilsin.
- Sağ Panel (%55 Genişlik): "Karar ve Zeka Paneli".
  * Üst Bölüm: 3 adet özet kart ("En Düşük Fiyat: Firma B", "En Hızlı Teslimat: Firma A", "Optimum TCO Seçimi: Firma C - 90 Gün Vade Avantajı").
  * Orta Bölüm: İnteraktif Kıyaslama Tablosu. Sütunlar: Malzeme Kodu, Tanım, Miktar, Tedarikçi A Fiyatı, Tedarikçi B Fiyatı, Tedarikçi C Fiyatı, En Karlı Seçim (Yeşil Badge).
  * Alt Bölüm: Anomali Uyarı Kartı ("Firma A geçen aya göre %18 zam yapmıştır").
  * Aksiyon Çubuğu: "Excel Olarak Dışa Aktar" ve "Tedarikçiye İndirim E-postası Hazırla" butonları.

Tüm bileşenleri modüler, TypeScript tipleri tanımlı ve temiz kod prensiplerine uygun olarak üret.
```

---

### Prompt 1.2: İnteraktif Görsel Vurgulama (Visual Grounding Component)

```markdown
React ve Tailwind CSS kullanarak `VisualGroundingViewer.tsx` isimli bir bileşen oluştur.

Gereksinimler:
1. Bileşen prop olarak `documentUrl: string`, `activeBoundingBox: { page: number, x_min: number, y_min: number, x_max: number, y_max: number } | null` ve `onBoxClick: () => void` alsın.
2. Belge üzerinde tıklanan satıra ait koordinatlar varsa, CSS ile smooth bir şekilde o koordinata scroll etsin ve koordinatın üzerine yarı saydam sarı bir katman (rgba(250, 204, 21, 0.3)) ile 2px parlayan sarı çerçeve (shadow-[0_0_15px_rgba(250,204,21,0.5)]) yerleştirsin.
3. Çerçevenin hemen üst köşesinde "Güven Skoru: %98.4 (Gemini 1.5 Pro)" yazan ufak bir tooltip yer alsın.
4. Çift tıklama ile zoom-in ve zoom-out animasyonları eklensin.
```
