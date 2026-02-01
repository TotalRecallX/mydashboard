# Kişisel Dashboard - Kurulum Rehberi

Modern, minimalist ve real-time veri akışlı kişisel dashboard.

## 📋 Özellikler

- ✅ Kripto fiyatları (Bitcoin, Ethereum, Solana)
- ✅ Dünya haberleri
- ✅ Ekonomik haberler
- ✅ Outlook mail entegrasyonu (setup gerekli)
- ✅ Kültür & sanat (filmler, diziler)
- ✅ Otomatik güncelleme (5 dk - 2 saat aralıkları)
- ✅ Responsive tasarım
- ✅ Açık renk, minimalist tema

## 🚀 Hızlı Başlangıç

### 1. GitHub'a Yükleme

```bash
# 1. Bu dosyaları GitHub'a yükleyin
# 2. Cloudflare Pages'e bağlayın (aşağıda detaylı anlatım var)
```

### 2. API Anahtarlarını Alma

#### A) NewsAPI (Haberler için - ÜCRETSİZ)

1. https://newsapi.org adresine gidin
2. "Get API Key" butonuna tıklayın
3. Ücretsiz hesap açın
4. API anahtarınızı kopyalayın
5. `script.js` dosyasında `API_KEYS.NEWS` kısmına yapıştırın

**Limit:** 100 istek/gün (Bizim kullanımımız: ~50 istek/gün)

#### B) CoinGecko (Kripto için - ÜCRETSİZ)

✅ **API anahtarı gerektirmez!** Hemen çalışır.

**Limit:** 50 istek/dakika (Bizim kullanımımız: 12 istek/saat)

#### C) TMDb (Film/Dizi için - OPSİYONEL)

1. https://www.themoviedb.org/settings/api adresine gidin
2. Ücretsiz hesap açın
3. API key isteyin
4. `script.js` dosyasına ekleyin

#### D) Microsoft Graph API (Outlook Mail - GELIŞMIŞ)

⚠️ **Kurulumu karmaşık!** İsteğe bağlı.

1. Azure Portal'a gidin (portal.azure.com)
2. "App registrations" > "New registration"
3. Redirect URI: `http://localhost` (test için)
4. "API permissions" > "Microsoft Graph" > "Mail.Read"
5. Client ID ve Client Secret alın
6. OAuth2 authentication kodu yazın

**Alternatif:** Gmail API kullanabilirsiniz (daha kolay setup)

---

## 📦 Cloudflare Pages'e Yükleme

### Adım 1: GitHub Repository Oluşturma

1. GitHub'da yeni repository oluşturun (`my-dashboard` gibi)
2. Bu 4 dosyayı yükleyin:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`

### Adım 2: Cloudflare'e Bağlama

1. Cloudflare Dashboard'a gidin
2. **Workers & Pages** tıklayın
3. **"Create application"** > **"Pages"** > **"Connect to Git"**
4. GitHub hesabınızı bağlayın
5. Repository'nizi seçin (`my-dashboard`)
6. **Build settings:**
   - Framework preset: `None`
   - Build command: *(boş bırakın)*
   - Build output directory: `/`
7. **"Save and Deploy"** tıklayın

🎉 **Tebrikler!** Siteniz yayında: `your-site.pages.dev`

---

## ⚙️ Güncelleme Aralıkları

Mevcut ayarlar (değiştirilebilir):

| Bölüm | Aralık | Günlük İstek |
|-------|--------|--------------|
| Kripto | 5 dakika | 288 |
| Haberler (Dünya) | 30 dakika | 48 |
| Haberler (Ekonomi) | 30 dakika | 48 |
| Mail | 15 dakika | 96 |
| Kültür | 2 saat | 12 |

**Toplam: ~500 istek/gün** (Tüm ücretsiz limitler içinde!)

### Aralıkları Değiştirme

`script.js` dosyasında `UPDATE_INTERVALS` objesini düzenleyin:

```javascript
const UPDATE_INTERVALS = {
    CRYPTO: 10 * 60 * 1000,  // 10 dakika yap
    NEWS: 60 * 60 * 1000,    // 1 saat yap
    // ...
};
```

---

## 🎨 Tasarım Özelleştirme

### Renk Teması Değiştirme

`style.css` dosyasında `:root` kısmını düzenleyin:

```css
:root {
    --bg-primary: #fafafa;     /* Ana arka plan */
    --bg-secondary: #ffffff;   /* Widget arka planı */
    --text-primary: #1a1a1a;   /* Ana metin */
    --accent-blue: #2563eb;    /* Vurgu rengi */
    /* ... */
}
```

### Koyu Tema İçin

```css
:root {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --text-primary: #ffffff;
    --text-secondary: #a0a0a0;
    --border-color: #404040;
}
```

### Font Değiştirme

`index.html` dosyasında Google Fonts linkini değiştirin ve `style.css` dosyasında `font-family` değiştirin.

---

## 🔧 Sorun Giderme

### Kripto Verileri Gelmiyor

✅ **CoinGecko API limiti:** 50 istek/dk
- Çözüm: Güncelleme aralığını artırın (5 dk → 10 dk)

### Haberler Gelmiyor

❌ **API anahtarı eksik veya yanlış**
- Çözüm: NewsAPI.org'dan yeni key alın
- Kontrol: Console'da hata mesajlarını okuyun (F12)

### Mail Çalışmıyor

⚠️ **OAuth2 setup yapılmamış**
- Çözüm: Microsoft Graph API kurulumu yapın (yukarıda anlatıldı)
- Alternatif: Gmail API kullanın (daha kolay)

---

## 📱 Responsive

- ✅ Desktop (1800px+): Tam grid layout
- ✅ Tablet (768px - 1400px): 2 sütun
- ✅ Mobil (<768px): Tek sütun, dikey stack

---

## 🔒 Güvenlik

**ÖNEMLİ:** API anahtarlarınızı asla GitHub'a yüklemeyin!

### Environment Variables Kullanma (İleri Seviye)

1. Cloudflare Pages'de "Settings" > "Environment variables"
2. API anahtarlarınızı buraya ekleyin
3. `script.js` dosyasında `process.env.API_KEY` şeklinde kullanın

---

## 📈 Gelecek Geliştirmeler

- [ ] Hava durumu widget'ı
- [ ] Borsa verileri (S&P 500, NASDAQ)
- [ ] X (Twitter) entegrasyonu
- [ ] Spotify şimdi çalan
- [ ] Takvim entegrasyonu
- [ ] Dark mode toggle

---

## 💡 İpuçları

1. **API limitleri:** Ücretsiz tier'ler yeterli, endişelenmeyin
2. **Güncelleme sıklığı:** Daha sık = daha güncel ama daha fazla istek
3. **Mail setup:** Karmaşıksa Gmail kullanın veya şimdilik atlayın
4. **Özelleştirme:** CSS değişkenlerini kullanarak kolayca tema değiştirin

---

## 📞 Destek

Sorun yaşarsanız:
1. Console'u kontrol edin (F12)
2. API anahtarlarını doğrulayın
3. README'yi tekrar okuyun

---

## 📄 Lisans

MIT License - İstediğiniz gibi kullanabilirsiniz!

**Hazırlayan:** Claude AI
**Tarih:** Şubat 2025
