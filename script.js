// Картинки для новостей
const sportImages = [
    'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544476408-bd5f35c9fef1?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=400&fit=crop'
];

function getRandomImage() {
    return sportImages[Math.floor(Math.random() * sportImages.length)];
}

function getCategory(title) {
    const t = title.toLowerCase();
    if (t.includes('ufc') || t.includes('mma') || t.includes('бой')) return '🥊 UFC/MMA';
    if (t.includes('футбол') || t.includes('реал') || t.includes('барселона') || t.includes('лига')) return '⚽ Футбол';
    if (t.includes('хабиб') || t.includes('махачев') || t.includes('конор')) return '🏆 ММА';
    return '🔥 Спорт';
}

// ==== НОВОСТИ (прямо в коде, чтобы работали сразу) ====
const newsList = [
    { title: "⚽ Реал Мадрид разгромил Барселону в Эль Класико — 4:1", category: "⚽ Футбол", date: "Сегодня, 20:15" },
    { title: "🥊 Ислам Махачев: «Я лучший боец мира вне зависимости от веса»", category: "🥊 UFC/MMA", date: "Сегодня, 18:30" },
    { title: "💥 Хабиб Нурмагомедов раскритиковал новых звёзд UFC", category: "🏆 ММА", date: "Сегодня, 15:45" },
    { title: "🏆 Лига чемпионов: все пары 1/4 финала", category: "⚽ Футбол", date: "Вчера, 22:10" },
    { title: "🇪🇸 Реал Мадрид готовит мега-трансфер на 150 млн евро", category: "⚽ Футбол", date: "Вчера, 14:20" },
    { title: "💪 Хамзат Чимаев: «Я уничтожу любого в среднем весе»", category: "🥊 UFC/MMA", date: "Вчера, 11:00" },
    { title: "⚽ Месси рассказал о планах на следующий сезон", category: "⚽ Футбол", date: "2 дня назад" },
    { title: "🥊 Тони Фергюсон завершает карьеру после 8 поражений подряд", category: "🥊 UFC/MMA", date: "2 дня назад" }
];

function loadNews() {
    const newsContainer = document.getElementById('news');
    if (!newsContainer) return;
    
    let html = '';
    for (let i = 0; i < newsList.length; i++) {
        const news = newsList[i];
        html += `
            <div class="news-card">
                <div class="card-img" style="background-image: url('${getRandomImage()}'); background-size: cover; background-position: center;">
                    <div class="card-category">${news.category}</div>
                </div>
                <div class="card-content">
                    <h3>${news.title}</h3>
                    <div class="card-date">📅 ${news.date}</div>
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
    for (let i = 0; i < popularNews.length; i++) {
        html += `
            <div class="popular-item">
                <div class="popular-number">${i + 1}</div>
                <div class="popular-title">${popularNews[i]}</div>
            </div>
        `;
    }
    popularContainer.innerHTML = html;
}

// Запускаем
loadNews();
loadPopular();
