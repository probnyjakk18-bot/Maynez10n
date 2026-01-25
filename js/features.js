// Фишки для Minecraft
const features = [
    {
        id: 1,
        title: "Быстрое строительство",
        description: "Используйте клавишу Shift для быстрого размещения блоков. Удерживайте Shift и кликайте - блоки будут ставиться автоматически.",
        category: "building",
        icon: "🏗️"
    },
    {
        id: 2,
        title: "Автоматическая ферма",
        description: "Создайте автоматическую ферму с помощью воды и воронок. Вода будет собирать урожай, а воронки - транспортировать в сундуки.",
        category: "survival",
        icon: "🌾"
    },
    {
        id: 3,
        title: "Редстоун часы",
        description: "Создайте простой редстоун таймер используя компаратор и редстоун блок. Идеально для автоматических систем.",
        category: "redstone",
        icon: "⏰"
    },
    {
        id: 4,
        title: "PvP тактика",
        description: "В PvP используйте крит-удары (прыжок + удар). Крит-удары наносят на 50% больше урона!",
        category: "pvp",
        icon: "⚔️"
    },
    {
        id: 5,
        title: "Скрытые проходы",
        description: "Используйте картины или таблички для создания скрытых проходов. Прикрепите картину к блоку с проходом.",
        category: "building",
        icon: "🖼️"
    },
    {
        id: 6,
        title: "Эффективная добыча",
        description: "Используйте TNT для быстрой добычи ресурсов. Создайте TNT дупликатор для бесконечного TNT.",
        category: "survival",
        icon: "💎"
    },
    {
        id: 7,
        title: "Редстоун лифт",
        description: "Создайте вертикальный лифт используя поршни и редстоун. Быстрый способ перемещения между этажами.",
        category: "redstone",
        icon: "⬆️"
    },
    {
        id: 8,
        title: "Комбо в PvP",
        description: "Используйте комбинацию ударов и отталкивания. Ударьте врага, оттолкните, снова ударьте - он не сможет ответить.",
        category: "pvp",
        icon: "🎯"
    },
    {
        id: 9,
        title: "Декоративные элементы",
        description: "Используйте лестницы, плиты и кнопки для создания детализированных построек. Экспериментируйте с текстурами!",
        category: "building",
        icon: "🎨"
    },
    {
        id: 10,
        title: "Автоматическая печь",
        description: "Создайте автоматическую печь с воронками. Верхняя воронка - для топлива, боковая - для предметов, нижняя - для готовых.",
        category: "survival",
        icon: "🔥"
    },
    {
        id: 11,
        title: "Редстоун дверь",
        description: "Создайте секретную дверь активируемую редстоуном. Используйте липкий поршень для скрытия входа.",
        category: "redstone",
        icon: "🚪"
    },
    {
        id: 12,
        title: "PvP экипировка",
        description: "Всегда носите с собой зелья регенерации и золотые яблоки. Они спасут вас в критических ситуациях.",
        category: "pvp",
        icon: "🍎"
    }
];

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    renderFeatures('all');
    initCategoryButtons();
});

// Рендер фишек
function renderFeatures(category) {
    const featuresList = document.getElementById('featuresList');
    if (!featuresList) return;
    
    featuresList.innerHTML = '';
    
    const filteredFeatures = category === 'all' 
        ? features 
        : features.filter(f => f.category === category);
    
    filteredFeatures.forEach(feature => {
        const featureCard = document.createElement('div');
        featureCard.className = 'feature-item card-minecraft';
        featureCard.innerHTML = `
            <div style="display: flex; align-items: start; gap: 1rem;">
                <div style="font-size: 3rem;">${feature.icon || '✨'}</div>
                <div style="flex: 1;">
                    <h3 style="color: var(--mc-emerald); margin-bottom: 0.5rem; font-size: 1.3rem;">
                        ${feature.title || feature.name}
                    </h3>
                    <p style="color: var(--text-secondary); line-height: 1.8;">
                        ${feature.description}
                    </p>
                    <span class="badge-minecraft" style="margin-top: 0.5rem; display: inline-block;">
                        ${getCategoryName(feature.category)}
                    </span>
                </div>
            </div>
        `;
        featuresList.appendChild(featureCard);
    });
}

// Инициализация кнопок категорий
function initCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Убираем активный класс у всех
            categoryButtons.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс к нажатой
            btn.classList.add('active');
            // Фильтруем фишки
            const category = btn.getAttribute('data-category');
            renderFeatures(category);
        });
    });
}

function getCategoryName(category) {
    const names = {
        'building': 'Строительство',
        'survival': 'Выживание',
        'redstone': 'Редстоун',
        'pvp': 'PvP'
    };
    return names[category] || category;
}
