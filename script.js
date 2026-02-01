// API Anahtarları - Bunları dolduracaksınız
const API_KEYS = {
    NEWS: 'YOUR_NEWSAPI_KEY', // https://newsapi.org
    CRYPTO: '', // CoinGecko ücretsiz, key gerektirmez
    // Mail için ayrı setup gerekiyor
};

// Güncelleme Aralıkları (milisaniye)
const UPDATE_INTERVALS = {
    CRYPTO: 5 * 60 * 1000,      // 5 dakika
    NEWS: 30 * 60 * 1000,        // 30 dakika
    ECONOMY: 30 * 60 * 1000,     // 30 dakika
    MAIL: 15 * 60 * 1000,        // 15 dakika
    CULTURE: 2 * 60 * 60 * 1000, // 2 saat
};

// Zaman ve Tarih
function updateDateTime() {
    const now = new Date();
    
    const timeStr = now.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const dateStr = now.toLocaleDateString('tr-TR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('currentTime').textContent = timeStr;
    document.getElementById('currentDate').textContent = dateStr;
}

// Kripto Verileri (CoinGecko - Ücretsiz)
async function fetchCryptoData() {
    try {
        updateIndicator('cryptoUpdate', true);
        
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true'
        );
        
        if (!response.ok) throw new Error('Kripto verisi alınamadı');
        
        const data = await response.json();
        
        const cryptoHTML = `
            <div class="crypto-grid">
                <div class="crypto-item">
                    <div>
                        <div class="crypto-symbol">BTC/USDT</div>
                        <div class="crypto-price">$${data.bitcoin.usd.toLocaleString('en-US')}</div>
                    </div>
                    <div class="crypto-change ${data.bitcoin.usd_24h_change > 0 ? 'positive' : 'negative'}">
                        ${data.bitcoin.usd_24h_change > 0 ? '+' : ''}${data.bitcoin.usd_24h_change.toFixed(2)}%
                    </div>
                </div>
                
                <div class="crypto-item">
                    <div>
                        <div class="crypto-symbol">ETH/USDT</div>
                        <div class="crypto-price">$${data.ethereum.usd.toLocaleString('en-US')}</div>
                    </div>
                    <div class="crypto-change ${data.ethereum.usd_24h_change > 0 ? 'positive' : 'negative'}">
                        ${data.ethereum.usd_24h_change > 0 ? '+' : ''}${data.ethereum.usd_24h_change.toFixed(2)}%
                    </div>
                </div>
                
                <div class="crypto-item">
                    <div>
                        <div class="crypto-symbol">SOL/USDT</div>
                        <div class="crypto-price">$${data.solana.usd.toLocaleString('en-US')}</div>
                    </div>
                    <div class="crypto-change ${data.solana.usd_24h_change > 0 ? 'positive' : 'negative'}">
                        ${data.solana.usd_24h_change > 0 ? '+' : ''}${data.solana.usd_24h_change.toFixed(2)}%
                    </div>
                </div>
            </div>
            
            <div class="crypto-stats">
                <div class="crypto-stat">
                    <span class="crypto-stat-label">Total Market Cap</span>
                    <span class="crypto-stat-value">$${((data.bitcoin.usd_market_cap + data.ethereum.usd_market_cap + data.solana.usd_market_cap) / 1e9).toFixed(2)}B</span>
                </div>
                <div class="crypto-stat">
                    <span class="crypto-stat-label">24h Volume</span>
                    <span class="crypto-stat-value">$${((data.bitcoin.usd_24h_vol + data.ethereum.usd_24h_vol + data.solana.usd_24h_vol) / 1e9).toFixed(2)}B</span>
                </div>
                <div class="crypto-stat">
                    <span class="crypto-stat-label">BTC Dominance</span>
                    <span class="crypto-stat-value">${((data.bitcoin.usd_market_cap / (data.bitcoin.usd_market_cap + data.ethereum.usd_market_cap + data.solana.usd_market_cap)) * 100).toFixed(1)}%</span>
                </div>
            </div>
        `;
        
        document.getElementById('cryptoContent').innerHTML = cryptoHTML;
        updateIndicator('cryptoUpdate', false);
        
    } catch (error) {
        console.error('Kripto hatası:', error);
        document.getElementById('cryptoContent').innerHTML = `
            <div class="loading">Veri yüklenemedi. CoinGecko API'sine erişilemiyor.</div>
        `;
    }
}

// Haber Verileri (NewsAPI)
async function fetchNews(type = 'world') {
    try {
        const targetId = type === 'world' ? 'worldNews' : 'economyNews';
        const indicatorId = type === 'world' ? 'newsUpdate' : 'economyUpdate';
        
        updateIndicator(indicatorId, true);
        
        if (API_KEYS.NEWS === 'YOUR_NEWSAPI_KEY') {
            document.getElementById(targetId).innerHTML = `
                <div class="news-item">
                    <div class="news-item-title">API Anahtarı Gerekli</div>
                    <div class="news-item-meta">
                        <span class="news-source">Sistem</span>
                        <span>Az önce</span>
                    </div>
                </div>
                <div style="margin-top: 1rem; padding: 1rem; background: rgba(37, 99, 235, 0.05); border-radius: 8px; font-size: 0.875rem; color: #666;">
                    <strong>Haberler için API anahtarı gerekiyor:</strong><br>
                    1. <a href="https://newsapi.org" target="_blank" style="color: #2563eb;">newsapi.org</a> adresinden ücretsiz hesap açın<br>
                    2. API anahtarınızı alın (ücretsiz 100 istek/gün)<br>
                    3. script.js dosyasındaki API_KEYS.NEWS kısmına yapıştırın<br>
                    4. Sayfayı yenileyin
                </div>
            `;
            updateIndicator(indicatorId, false);
            return;
        }
        
        const query = type === 'world' ? 'world OR international OR global' : 'economy OR finance OR business OR market';
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${API_KEYS.NEWS}`
        );
        
        if (!response.ok) throw new Error('Haberler alınamadı');
        
        const data = await response.json();
        
        const newsHTML = data.articles.map(article => {
            const publishedDate = new Date(article.publishedAt);
            const timeAgo = getTimeAgo(publishedDate);
            
            return `
                <div class="news-item">
                    <div class="news-item-title">${article.title}</div>
                    <div class="news-item-meta">
                        <span class="news-source">${article.source.name}</span>
                        <span>${timeAgo}</span>
                    </div>
                </div>
            `;
        }).join('');
        
        document.getElementById(targetId).innerHTML = newsHTML || '<div class="loading">Haber bulunamadı</div>';
        updateIndicator(indicatorId, false);
        
    } catch (error) {
        console.error('Haber hatası:', error);
        const targetId = type === 'world' ? 'worldNews' : 'economyNews';
        document.getElementById(targetId).innerHTML = `
            <div class="loading">Haberler yüklenemedi. Lütfen API anahtarınızı kontrol edin.</div>
        `;
    }
}

// Mail Verileri (Demo - Gerçek entegrasyon için Microsoft Graph API gerekli)
async function fetchMail() {
    try {
        updateIndicator('mailUpdate', true);
        
        // Demo veri - Gerçek Outlook entegrasyonu için ayrı setup gerekiyor
        const demoMails = [
            {
                subject: 'Microsoft Graph API Setup Gerekli',
                from: 'Sistem',
                time: 'Az önce',
                unread: true
            },
            {
                subject: 'Outlook entegrasyonu için adımlar',
                from: 'Dashboard',
                time: '5 dk önce',
                unread: false
            }
        ];
        
        const mailHTML = `
            ${demoMails.map(mail => `
                <div class="mail-item ${mail.unread ? 'unread' : ''}">
                    <div class="mail-subject">${mail.subject}</div>
                    <div class="mail-from">${mail.from}</div>
                    <div class="mail-time">${mail.time}</div>
                </div>
            `).join('')}
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(37, 99, 235, 0.05); border-radius: 8px; font-size: 0.875rem; color: #666;">
                <strong>Outlook entegrasyonu için:</strong><br>
                1. Microsoft Azure'da uygulama kaydedin<br>
                2. Graph API izinleri verin<br>
                3. OAuth2 authentication setup yapın<br>
                <br>
                Detaylı kurulum için README.md dosyasına bakın.
            </div>
        `;
        
        document.getElementById('mailContent').innerHTML = mailHTML;
        updateIndicator('mailUpdate', false);
        
    } catch (error) {
        console.error('Mail hatası:', error);
    }
}

// Kültür & Sanat (TMDb API - Ücretsiz ama key gerekli)
async function fetchCulture() {
    try {
        updateIndicator('cultureUpdate', true);
        
        // Demo veri
        const demoContent = [
            {
                title: 'Dune: Part Two',
                meta: '2024 • Sci-Fi',
                rating: '8.8'
            },
            {
                title: 'Oppenheimer',
                meta: '2023 • Biography, Drama',
                rating: '8.6'
            },
            {
                title: 'The Last of Us',
                meta: '2023 • TV Series',
                rating: '8.9'
            },
            {
                title: 'Poor Things',
                meta: '2023 • Comedy, Drama',
                rating: '8.2'
            }
        ];
        
        const cultureHTML = `
            ${demoContent.map(item => `
                <div class="culture-item">
                    <div class="culture-title">${item.title}</div>
                    <div class="culture-meta">
                        ${item.meta}
                        <span class="culture-rating">★ ${item.rating}</span>
                    </div>
                </div>
            `).join('')}
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(37, 99, 235, 0.05); border-radius: 8px; font-size: 0.875rem; color: #666;">
                <strong>TMDb API için:</strong><br>
                1. <a href="https://www.themoviedb.org/settings/api" target="_blank" style="color: #2563eb;">themoviedb.org</a> adresinden ücretsiz API key alın<br>
                2. script.js dosyasına ekleyin<br>
                3. Trending filmler ve dizileri gösterin
            </div>
        `;
        
        document.getElementById('cultureContent').innerHTML = cultureHTML;
        updateIndicator('cultureUpdate', false);
        
    } catch (error) {
        console.error('Kültür hatası:', error);
    }
}

// Yardımcı Fonksiyonlar
function updateIndicator(id, active) {
    const indicator = document.getElementById(id);
    if (active) {
        indicator.textContent = '●';
        indicator.classList.add('active');
    } else {
        const now = new Date();
        indicator.textContent = now.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        indicator.classList.remove('active');
    }
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Az önce';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} dk önce`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} saat önce`;
    return `${Math.floor(seconds / 86400)} gün önce`;
}

function updateLastUpdate() {
    const now = new Date();
    document.getElementById('lastUpdate').textContent = now.toLocaleString('tr-TR');
}

// Başlangıç
function init() {
    // İlk yükleme
    updateDateTime();
    fetchCryptoData();
    fetchNews('world');
    fetchNews('economy');
    fetchMail();
    fetchCulture();
    updateLastUpdate();
    
    // Periyodik güncellemeler
    setInterval(updateDateTime, 1000);
    setInterval(fetchCryptoData, UPDATE_INTERVALS.CRYPTO);
    setInterval(() => fetchNews('world'), UPDATE_INTERVALS.NEWS);
    setInterval(() => fetchNews('economy'), UPDATE_INTERVALS.ECONOMY);
    setInterval(fetchMail, UPDATE_INTERVALS.MAIL);
    setInterval(fetchCulture, UPDATE_INTERVALS.CULTURE);
    setInterval(updateLastUpdate, 60000);
}

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', init);
