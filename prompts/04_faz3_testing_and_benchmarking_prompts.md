# 🧪 FAZ 3 Promptları: Sentetik Test Verisi & Doğrulama Benchmark'ı

Bu promptlar; OptiVendor.AI'yi yayına almadan önce zorlu sınır durumlarında (edge cases) test etmek, modelin halüsinasyon yapmadığını kanıtlamak ve otomatik test suiti oluşturmak için kullanılır.

---

### Prompt 4.1: 10 Sektör İçin Gerçekçi & Zorlayıcı Sentetik RFQ Üretici

```markdown
Sen endüstriyel satın alma belgeleri üreten bir Test Verisi Mühendisisin. OptiVendor.AI'nin ayrıştırma motorunu test etmek amacıyla 5 farklı zorluk seviyesinde 5 adet gerçekçi tedarikçi teklif mektubu metni oluşturacaksın.

Zorluk Seviyeleri & Senaryolar:
1. Kolay Senaryo (Temiz Kurumsal PDF): Standart tablo, açıkça belirtilmiş KDV (%20), 30 gün vade, teslimat 7 gün, TRY para birimi.
2. Orta Senaryo (Dövizli & Vadeli): Birim fiyatlar EUR, ödeme "Fatura tarihinden itibaren 60 gün vadeli çek", nakliye alıcıya ait.
3. Zor Senaryo (Taranmış / Dağınık Görsel Metni): OCR hataları simüle edilmiş (0 yerine O harfi, 1 yerine l harfi), tablo çizgileri olmayan serbest metin formatında yazılmış teklif mektubu.
4. Karmaşık Senaryo (İskonto & Kademeli Fiyat): "100 adede kadar 50 TL, 100-500 adet arası 42 TL, nakit ödemede ilave %5 iskonto uygulanacaktır" şeklinde koşullu fiyatlandırma.
5. Sınır Durum (Edge Case - Eksik Bilgi): Fiyat var ama para birimi sembolü yok, teslimat tarihi "stok durumuna göre bildirilecektir" yazılmış.

Her senaryo için:
- Ham Belge Metni (Raw OCR input)
- Beklenen Doğruluk Çıktısı (Ground Truth Pydantic JSON)
formatında test çiftleri oluştur.
```

---

### Prompt 4.2: Pytest Doğrulama ve Benchmark Test Suiti Üretici

```markdown
Kıdemli bir Test Otomasyon Mühendisi kimliğiyle, OptiVendor.AI ayrıştırma motoru için `test_extraction_benchmark.py` dosyasını oluştur.

Gereksinimler:
1. `pytest` ve `pytest-asyncio` kullan.
2. Ground Truth JSON verileri ile Modelden dönen Pydantic nesnesini karşılaştıran bir metrik hesaplayıcı yaz:
   - Fiyat Doğruluk Skoru (Tolerance: ±0.01)
   - Miktar Doğruluk Skoru (Tam eşleşme)
   - Vade Süresi Doğruluğu (Gün bazında tam eşleşme)
   - Genel F1 Skoru
3. Eğer test edilen modelin Fiyat Çıkarma Skoru %99'un altına düşerse `AssertionError` fırlatsın ve hangi kalemde sapma olduğunu detaylı hata logu olarak yazdırsın.
```
