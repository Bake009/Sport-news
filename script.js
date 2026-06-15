// Картинки для новостей (бесплатные, с Unsplash)
const sportImages = [
    'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544476408-bd5f35c9fef1?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=400&fit=crop'
];

// RSS-ленты (откуда берём новости)
const feedUrls = [
    'https://www.sports.ru/rss/',
    'https://www.championat.com/rss/news.xml',
    'https://www.sport-express.ru/rss/',
    'https://www.mmafighting.com/rss/index.xml'
];

function getRandomImage() {
    return sportImages[Math.floor(Math.random() * sportImages.length)];
}

function getCategory(title) {
    const t = title.toLowerCase();
    if (t.includes('ufc') || t.includes('mma') || t.includes('бой')) return '🥊 UFC/MMA';
    if (t.includes('футбол') || t.includes('реал') || t.includes('барселона')) return '⚽ Футбол';
    if (t.includes('хабиб') || t.includes('махачев') || t.includes('конор')) return '🏆 ММА';
    return '🔥 Спорт';
}

// Запасные новости (если RSS не работает)
const fallbackNews = [
    { title: "⚽ Реал Мадрид разгромил Барселону в Эль Класико — 4:1", category: "⚽ Футбол" },
    { title: "🥊 Ислам Махачев: «Я лучший боец мира вне зависимости от веса»", category: "🥊 UFC/MMA" },
    { title: "💥 Хабиб Нурмагомедов раскритиковал новых звёзд UFC", category: "🏆 ММА" },
    { title: "🏆 Лига чемпионов: все пары 1/4 финала", category: "⚽ Футбол" },
    { title: "🇪🇸 Реал Мадрид готовит мега-трансфер на 150 млн евро", category: "⚽ Футбол" }
];

async function loadNews() {
    const newsContainer = document.getElementById('news');
    if (!newsContainer) return;
    
    newsContainer.innerHTML = '<div style="grid-column:1/-1; text-align:center;">📡 Загрузка новостей...</div>';
    
    let allArticles = [];
    
    // Пытаемся загрузить RSS
    for (const url of feedUrls) {
        try {
            const proxy = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);
            const response = await fetch(proxy);
            const text = await response.text();
            const parser = new DOMParser();
            const xml = parser.parseFromString(text, 'text/xml');
            const items = xml.querySelectorAll('item');
            
            for (let i = 0; i < Math.min(items.length, 5); i++) {
                const title = items[i].querySelector('title')?.textContent || 'Новость спорта';
                const pubDate = items[i].querySelector('pubDate')?.textContent || '';
                const link = items[i].querySelector('link')?.textContent || '#';
                
                allArticles.push({
                    title: title.substring(0, 90),
                    date: pubDate.substring(0, 16),
                    link: link,
                    category: getCategory(title),
                    image: getRandomImage()
                });
            }
        } catch(e) {
            console.log('RSS ошибка:', url);
        }
    }
    
    // Если RSS не дал новостей — используем запасные
    if (allArticles.length === 0) {
        for (const news of fallbackNews) {
            allArticles.push({
                title: news.title,
                date: 'Свежая новость',
                link: '#',
                category: news.category,
                image: getRandomImage()
            });
        }
    }
    
    // Показываем первые 8 новостей
    allArticles = allArticles.slice(0, 8);
    
    let html = '';
    for (const a of allArticles) {
        html += `
            <div class="news-card" onclick="window.open('${a.link}', '_blank')">
                <div class="card-img" style="background-image: url('${a.image}'); background-size: cover; background-position: center;">
                    <div class="card-category">${a.category}</div>
                </div>
                <div class="card-content">
                    <h3>${a.title}</h3>
                    <div class="card-date">📅 ${a.date}</div>
                </div>
            </div>
        `;
    }
    newsContainer.innerHTML = html;
}

function loadPopular() {
    const popularContainer = document.getElementById('popular');
    if (!popularContainer) return;
    
    const popularNews = [
        '💥 Хабиб Нурмагомедов: «У UFC большие проблемы с новыми звёздами»',
        '⚽ Лига чемпионов: жеребьёвка 1/4 финала — сенсационные пары',
        '🥊 Ислам Махачев: «Хочу завершить карьеру непобеждённым»',
        '🇪🇸 Реал Мадрид готовит мега-трансфер на 150 млн евро'
    ];
    
    let html = '';
    popularNews.forEach((title, idx) => {
        html += `
            <div class="popular-item">
                <div class="popular-number">${idx + 1}</div>
                <div class="popular-title">${title}</div>
            </div>
        `;
    });
    popularContainer.innerHTML = html;
}

// Запускаем всё при загрузке страницы
loadNews();
loadPopular();
