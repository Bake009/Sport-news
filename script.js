// ========== АВТОМАТИЧЕСКИЕ НОВОСТИ + ПОЛНЫЕ ТЕКСТЫ НА САЙТЕ ==========

// Бесплатные спортивные фото
const sportImages = [
    'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1544476408-bd5f35c9fef1?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=500&fit=crop'
];

// RSS-ленты (только для заголовков и анонсов)
const rssFeeds = [
    { name: "Sports.ru", url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.sports.ru/rss/", category: "football" },
    { name: "Чемпионат", url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.championat.com/rss/news.xml", category: "football" },
    { name: "Спорт-Экспресс", url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.sport-express.ru/rss/", category: "football" },
    { name: "MMAFighting", url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.mmafighting.com/rss/index.xml", category: "ufc" },
    { name: "MMA Junkie", url: "https://api.rss2json.com/v1/api.json?rss_url=https://mmajunkie.usatoday.com/feed", category: "ufc" },
    { name: "Bloody Elbow", url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.bloodyelbow.com/rss/index.xml", category: "ufc" }
];

// Хранилище новостей (полные тексты генерируются автоматически)
let newsDatabase = [];
let currentCategory = "all";
let visibleCount = 5;

// ========== ФУНКЦИЯ ГЕНЕРАЦИИ ПОЛНОГО ТЕКСТА (на основе заголовка и анонса) ==========
function generateFullText(title, excerpt, category) {
    // Убираем эмодзи из заголовка для чистоты
    const cleanTitle = title.replace(/[⚽🥊💥🏆🇪🇸💪]/g, '').trim();
    
    // Базовая структура полной новости
    let fullText = `${cleanTitle}\n\n`;
    
    // Добавляем анонс как первый абзац
    fullText += `${excerpt}\n\n`;
    
    // Добавляем детали в зависимости от категории
    if (category === "football") {
        fullText += `По информации инсайдеров, эта новость активно обсуждается в футбольном сообществе. Эксперты отмечают, что данное событие может повлиять на расстановку сил в турнирной таблице.\n\n`;
        fullText += `Болельщики уже активно комментируют эту ситуацию в социальных сетях. Ожидается, что в ближайшее время появятся новые подробности.`;
    } else if (category === "ufc") {
        fullText += `В мире смешанных единоборств это событие вызвало широкий резонанс. Аналитики UFC уже высказали своё мнение относительно данной ситуации.\n\n`;
        fullText += `Напомним, что следующий турнир промоушена состоится в ближайшие выходные. Возможно, мы узнаем больше подробностей прямо во время прямого эфира.`;
    } else {
        fullText += `Специалисты в мире спорта продолжают анализировать эту ситуацию. Ожидается, что в ближайшее время появятся официальные комментарии.\n\n`;
        fullText += `Следите за обновлениями на нашем сайте — мы будем держать вас в курсе всех событий.`;
    }
    
    return fullText;
}

// Генерация уникального изображения
function getRandomImage() {
    return sportImages[Math.floor(Math.random() * sportImages.length)];
}

// Определение категории
function detectCategory(title, feedCategory) {
    const t = title.toLowerCase();
    if (feedCategory === "ufc") return "ufc";
    if (t.includes('бокс') || t.includes('усик') || t.includes('фьюри')) return "boxing";
    return "football";
}

// Форматирование даты
function formatDate(dateStr) {
    try {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (isNaN(diff)) return "Свежая новость";
        if (diff === 0) return "Сегодня";
        if (diff === 1) return "Вчера";
        if (diff < 7) return `${diff} дня назад`;
        return date.toLocaleDateString("ru-RU");
    } catch(e) {
        return "Свежая новость";
    }
}

// Очистка текста от HTML
function cleanText(text) {
    if (!text) return "";
    return text.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

// ========== ЗАГРУЗКА НОВОСТЕЙ ИЗ RSS ==========
async function loadNewsFromRSS() {
    const newsContainer = document.getElementById("newsList");
    if (newsContainer) {
        newsContainer.innerHTML = '<div style="text-align:center; padding:50px;">📡 Загрузка свежих новостей...</div>';
    }
    
    let allArticles = [];
    
    for (const feed of rssFeeds) {
        try {
            const response = await fetch(feed.url);
            const data = await response.json();
            
            if (data && data.items) {
                for (const item of data.items.slice(0, 4)) {
                    const title = cleanText(item.title);
                    const excerpt = cleanText(item.description || item.content || "").substring(0, 200);
                    const pubDate = item.pubDate;
                    const category = detectCategory(title, feed.category);
                    
                    // Генерируем полный текст на сайте (не ссылка на внешний источник!)
                    const fullText = generateFullText(title, excerpt, category);
                    
                    allArticles.push({
                        id: allArticles.length + 1,
                        title: title,
                        excerpt: excerpt + "...",
                        fullText: fullText,
                        category: category,
                        date: pubDate,
                        image: getRandomImage(),
                        views: Math.floor(Math.random() * 300) + 50
                    });
                }
            }
        } catch(error) {
            console.log("Ошибка RSS:", feed.name);
        }
    }
    
    // Сортируем по дате (новые сверху)
    allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (allArticles.length === 0) {
        allArticles = getFallbackNews();
    }
    
    newsDatabase = allArticles;
    renderNews();
}

// Запасные новости (если RSS недоступен)
function getFallbackNews() {
    return [
        {
            id: 1,
            title: "⚽ Реал Мадрид одержал волевую победу в дерби",
            excerpt: "Мадридский «Реал» в драматичном матче обыграл «Атлетико» со счётом 3:2...",
            fullText: "Реал Мадрид одержал волевую победу в дерби.\n\nМадридский «Реал» в драматичном матче обыграл «Атлетико» со счётом 3:2. Голы забили Винисиус, Беллингем и Модрич.\n\nЭта победа позволила «Реалу» укрепить лидерство в турнирной таблице. Болельщики уже называют этот матч одним из лучших в сезоне.\n\nСледите за обновлениями на нашем сайте!",
            category: "football",
            date: new Date().toISOString(),
            image: getRandomImage(),
            views: 156
        },
        {
            id: 2,
            title: "🥊 Ислам Махачев: «Готов защищать титул хоть завтра»",
            excerpt: "Чемпион UFC в лёгком весе Ислам Махачев заявил о готовности провести следующую защиту титула...",
            fullText: "Ислам Махачев: «Готов защищать титул хоть завтра».\n\nЧемпион UFC в лёгком весе Ислам Махачев заявил о готовности провести следующую защиту титула в ближайшее время.\n\n«Я в отличной форме. Мне не важен соперник — я готов драться с любым», — цитирует бойца ESPN.\n\nОжидается, что следующий бой Махачева может пройти уже в октябре этого года.",
            category: "ufc",
            date: new Date().toISOString(),
            image: getRandomImage(),
            views: 243
        }
    ];
}

// ========== ОТОБРАЖЕНИЕ НОВОСТЕЙ ==========
function getCategoryName(cat) {
    switch(cat) {
        case "football": return "⚽ Футбол";
        case "ufc": return "🥊 UFC/MMA";
        case "boxing": return "🥊 Бокс";
        default: return "🔥 Спорт";
    }
}

function renderNews() {
    let filtered = newsDatabase;
    if (currentCategory !== "all") {
        filtered = newsDatabase.filter(n => n.category === currentCategory);
    }
    
    const visibleNews = filtered.slice(0, visibleCount);
    const container = document.getElementById("newsList");
    const countSpan = document.getElementById("newsCount");
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    
    if (countSpan) {
        countSpan.textContent = `(${filtered.length} новостей)`;
    }
    
    if (loadMoreBtn) {
        loadMoreBtn.style.display = visibleCount < filtered.length ? "block" : "none";
    }
    
    if (!container) return;
    
    if (visibleNews.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:50px;">😢 Новостей пока нет. Зайдите позже!</div>';
        return;
    }
    
    container.innerHTML = "";
    for (const news of visibleNews) {
        const categoryName = getCategoryName(news.category);
        const dateFormatted = formatDate(news.date);
        
        const newsItem = document.createElement("div");
        newsItem.className = "news-item";
        newsItem.onclick = () => openNews(news.id);
        newsItem.innerHTML = `
            <div class="news-image" style="background-image: url('${news.image}');">
                <div class="news-category">${categoryName}</div>
            </div>
            <div class="news-content">
                <h3>${news.title}</h3>
                <div class="news-excerpt">${news.excerpt}</div>
                <div class="news-meta">
                    <span>📅 ${dateFormatted}</span>
                    <span>👁️ ${news.views} просмотров</span>
                </div>
            </div>
        `;
        container.appendChild(newsItem);
    }
}

// ========== ОТКРЫТИЕ ПОЛНОЙ НОВОСТИ (НА САЙТЕ, БЕЗ ВНЕШНИХ ССЫЛОК) ==========
function openNews(id) {
    const news = newsDatabase.find(n => n.id === id);
    if (!news) return;
    
    const modal = document.getElementById("newsModal");
    const modalBody = document.getElementById("modalBody");
    
    if (!modal || !modalBody) return;
    
    const categoryName = getCategoryName(news.category);
    const dateFormatted = formatDate(news.date);
    
    // Полный текст новости — без внешних ссылок!
    modalBody.innerHTML = `
        <img src="${news.image}" class="modal-img" alt="${news.title}">
        <div class="modal-title">${news.title}</div>
        <div style="margin-bottom:15px; color:#f97316; display:flex; gap:15px; flex-wrap:wrap;">
            <span>${categoryName}</span>
            <span>📅 ${dateFormatted}</span>
            <span>👁️ ${news.views + 1} просмотров</span>
        </div>
        <div style="line-height:1.6; font-size:1rem;">
            ${news.fullText.replace(/\n/g, '<br><br>')}
        </div>
        <div style="margin-top:25px; padding-top:15px; border-top:1px solid #1f2a3e; font-size:0.8rem; color:#6c7a91;">
            📍 Материал подготовлен редакцией SPORTEDGE
        </div>
    `;
    
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    
    // Увеличиваем счётчик
    news.views += 1;
}

function closeModal() {
    const modal = document.getElementById("newsModal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

function loadMoreNews() {
    let filtered = newsDatabase;
    if (currentCategory !== "all") {
        filtered = newsDatabase.filter(n => n.category === currentCategory);
    }
    if (visibleCount < filtered.length) {
        visibleCount += 5;
        renderNews();
    }
}

function setCategory(category) {
    currentCategory = category;
    visibleCount = 5;
    renderNews();
    
    const titles = {
        all: "📰 Все новости",
        football: "⚽ Новости футбола",
        ufc: "🥊 Новости UFC/MMA",
        boxing: "🥊 Новости бокса"
    };
    const titleEl = document.getElementById("sectionTitle");
    if (titleEl) titleEl.innerHTML = titles[category] || titles.all;
    
    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
        if (link.dataset.category === category) {
            link.classList.add("active");
        }
    });
}

function refreshNews() {
    visibleCount = 5;
    loadNewsFromRSS();
}

// ========== ЗАПУСК ==========
document.addEventListener("DOMContentLoaded", () => {
    loadNewsFromRSS();
    setInterval(() => loadNewsFromRSS(), 10 * 60 * 1000);
    
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            setCategory(link.dataset.category);
        });
    });
    
    window.onclick = function(event) {
        const modal = document.getElementById("newsModal");
        if (event.target === modal) closeModal();
    };
});

// Глобальные функции
window.loadMoreNews = loadMoreNews;
window.closeModal = closeModal;
window.refreshNews = refreshNews;
