# 📦 FAZ 4 Promptları: Sistem Arşivleme, Dağıtım & AI-to-AI Handoff

Bu promptlar; projenin tamamını başka bir yapay zekanın (Copilot, Cursor veya yeni bir LLM oturumu) tek seferde kusursuzca anlayabileceği standart bir Markdown arşivine dönüştürmek ve prodüksiyona çıkış sürecini otomatize etmek için kullanılır.

---

### Prompt 5.1: Tekil Sistem Durum Arşivi Üretici (`SYSTEM_STATE.md`)

```markdown
Sen bir Yazılım Arşivleme ve Sistem Mimarisi Uzmanısın. OptiVendor.AI projesinin tüm kod tabanını, veri şemalarını, API uç noktalarını ve aktif durumunu özetleyen, başka bir AI asistanının (örneğin GitHub Copilot veya yeni bir Claude oturumunun) sistemi sıfırdan okuyup anında geliştirmeye devam edebileceği tekil bir `SYSTEM_STATE.md` dökümü hazırla.

İçerik Başlıkları:
1. Executive Summary & Tech Stack List
2. Active Component Matrix (Frontend, Backend, Database, AI Models)
3. Schema Contracts (Pydantic şemalarının ham Python tanımları)
4. State Transitions (LangGraph düğüm haritası ve karar eşikleri)
5. Known Edge Cases & Mitigations
6. Environment Variables List (.env parametreleri ve açıklamaları)
7. Handoff Instruction: "Bir sonraki oturumda çalışan ajan şu görevi üstlenmelidir: [...]"
```

---

### Prompt 5.2: Dockerized Production & CI/CD Dağıtım Promptu

```markdown
DevOps ve Bulut Güvenliği Uzmanı kimliğiyle, OptiVendor.AI için üretime hazır (production-ready) bir dağıtım altyapısı kur.

Gereksinimler:
1. `docker-compose.prod.yml`:
   - `web`: Next.js 14 frontend (Standalone build, optimize edilmiş çok aşamalı Dockerfile).
   - `api`: FastAPI Python backend (Uvicorn workers, non-root user).
   - `postgres`: PostgreSQL 16 + pgvector eklentisi yüklü imaj.
   - `redis`: Önbellek ve token koruması için.
2. Nginx Ters Dizinleyici (Reverse Proxy) yapılandırması:
   - SSL/TLS sertifikasyon ayarları,
   - Rate limiting (dakikada max 60 istek),
   - 50MB'a kadar PDF yükleme desteği (`client_max_body_size 50M`).
3. Sağlık Kontrolü (Healthcheck) uç noktaları (`/healthz`).
```
