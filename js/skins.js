// Скины для Minecraft
const skins = [
    {
        id: 1,
        name: "Герой Меча",
        description: "Крутой скин воина с мечом",
        category: "hero",
        image: "https://via.placeholder.com/64x64/4CAF50/ffffff?text=Hero",
        downloadUrl: "#"
    },
    {
        id: 2,
        name: "Аниме Девушка",
        description: "Милая аниме персонаж",
        category: "anime",
        image: "https://via.placeholder.com/64x64/FF69B4/ffffff?text=Anime",
        downloadUrl: "#"
    },
    {
        id: 3,
        name: "Дракон",
        description: "Мощный дракон",
        category: "fantasy",
        image: "https://via.placeholder.com/64x64/FFD700/000000?text=Dragon",
        downloadUrl: "#"
    },
    {
        id: 4,
        name: "Киберпанк",
        description: "Футуристический скин",
        category: "gaming",
        image: "https://via.placeholder.com/64x64/00BCD4/ffffff?text=Cyber",
        downloadUrl: "#"
    },
    {
        id: 5,
        name: "Рыцарь",
        description: "Благородный рыцарь в доспехах",
        category: "hero",
        image: "https://via.placeholder.com/64x64/757575/ffffff?text=Knight",
        downloadUrl: "#"
    },
    {
        id: 6,
        name: "Сакура",
        description: "Аниме скин с сакурой",
        category: "anime",
        image: "https://via.placeholder.com/64x64/FFB6C1/ffffff?text=Sakura",
        downloadUrl: "#"
    },
    {
        id: 7,
        name: "Эльф",
        description: "Магический эльф",
        category: "fantasy",
        image: "https://via.placeholder.com/64x64/9C27B0/ffffff?text=Elf",
        downloadUrl: "#"
    },
    {
        id: 8,
        name: "Геймер",
        description: "Скин в стиле геймера",
        category: "gaming",
        image: "https://via.placeholder.com/64x64/F44336/ffffff?text=Gamer",
        downloadUrl: "#"
    },
    {
        id: 9,
        name: "Ниндзя",
        description: "Скрытный ниндзя",
        category: "hero",
        image: "https://via.placeholder.com/64x64/212121/ffffff?text=Ninja",
        downloadUrl: "#"
    },
    {
        id: 10,
        name: "Кавайи",
        description: "Супер милый аниме скин",
        category: "anime",
        image: "https://via.placeholder.com/64x64/E91E63/ffffff?text=Kawaii",
        downloadUrl: "#"
    },
    {
        id: 11,
        name: "Маг",
        description: "Могущественный маг",
        category: "fantasy",
        image: "https://via.placeholder.com/64x64/3F51B5/ffffff?text=Wizard",
        downloadUrl: "#"
    },
    {
        id: 12,
        name: "Стример",
        description: "Скин стримера",
        category: "gaming",
        image: "https://via.placeholder.com/64x64/FF5722/ffffff?text=Stream",
        downloadUrl: "#"
    }
];

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    renderSkins('all');
    initFilterButtons();
    initSkinModal();
});

// Рендер скинов
function renderSkins(filter) {
    const skinsGrid = document.getElementById('skinsGrid');
    if (!skinsGrid) return;
    
    skinsGrid.innerHTML = '';
    
    const filteredSkins = filter === 'all' 
        ? skins 
        : skins.filter(s => s.category === filter);
    
    filteredSkins.forEach(skin => {
        const skinCard = document.createElement('div');
        skinCard.className = 'skin-card card-minecraft';
        skinCard.style.cursor = 'pointer';
        skinCard.innerHTML = `
            <div style="text-align: center;">
                <div style="width: 128px; height: 128px; margin: 0 auto 1rem; background: var(--bg-darker); border: 2px solid var(--border-color); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 3rem;">
                    🎨
                </div>
                <h3 style="color: var(--mc-emerald); margin-bottom: 0.5rem;">${skin.name}</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">${skin.description}</p>
                <span class="badge-minecraft">${getCategoryName(skin.category)}</span>
            </div>
        `;
        skinCard.addEventListener('click', () => openSkinModal(skin));
        skinsGrid.appendChild(skinCard);
    });
}

// Инициализация кнопок фильтра
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            renderSkins(filter);
        });
    });
}

// Модальное окно для скина
function initSkinModal() {
    const downloadBtn = document.getElementById('downloadSkinBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const skinName = document.getElementById('skinModalTitle')?.textContent;
            alert(`Скачивание скина: ${skinName}\n\nВ реальном приложении здесь будет ссылка на скачивание файла скина.`);
        });
    }
}

function openSkinModal(skin) {
    const modal = document.getElementById('skinModal');
    const modalTitle = document.getElementById('skinModalTitle');
    const modalBody = document.getElementById('skinModalBody');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    modalTitle.textContent = skin.name;
    modalBody.innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
            <div style="width: 200px; height: 200px; margin: 0 auto; background: var(--bg-darker); border: 2px solid var(--border-color); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 5rem;">
                🎨
            </div>
        </div>
        <p style="color: var(--text-secondary); margin-bottom: 1rem; text-align: center;">${skin.description}</p>
        <div style="text-align: center;">
            <span class="badge-minecraft">${getCategoryName(skin.category)}</span>
        </div>
    `;
    
    showModal('skinModal');
}

function getCategoryName(category) {
    const names = {
        'hero': 'Герои',
        'anime': 'Аниме',
        'fantasy': 'Фэнтези',
        'gaming': 'Игровые'
    };
    return names[category] || category;
}
