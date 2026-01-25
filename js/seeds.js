// Популярные сиды
const popularSeeds = [
    {
        id: 1,
        name: "Горный Замок",
        description: "Спавн рядом с огромным горным замком и деревней",
        seed: "1234567890",
        features: ["Замок", "Деревня", "Горы", "Пещеры"]
    },
    {
        id: 2,
        name: "Океанский Архипелаг",
        description: "Красивые острова с подводными храмами",
        seed: "ocean123",
        features: ["Океан", "Острова", "Подводные храмы", "Кораллы"]
    },
    {
        id: 3,
        name: "Пустынный Оазис",
        description: "Оазис в пустыне с деревней и храмом",
        seed: "desert456",
        features: ["Пустыня", "Оазис", "Деревня", "Храм"]
    },
    {
        id: 4,
        name: "Лесной Данж",
        description: "Темный лес с множеством данжей",
        seed: "forest789",
        features: ["Темный лес", "Данжи", "Мансионы", "Пещеры"]
    },
    {
        id: 5,
        name: "Снежная Деревня",
        description: "Уютная деревня в снежном биоме",
        seed: "snow2024",
        features: ["Снег", "Деревня", "Иглу", "Горы"]
    },
    {
        id: 6,
        name: "Меса Плато",
        description: "Красивое плато с редкими ресурсами",
        seed: "mesa999",
        features: ["Меса", "Золото", "Пещеры", "Каньоны"]
    },
    {
        id: 7,
        name: "Джунгли Храма",
        description: "Храм в джунглях с сокровищами",
        seed: "jungle555",
        features: ["Джунгли", "Храм", "Сокровища", "Оцелоты"]
    },
    {
        id: 8,
        name: "Ледяной Шпиль",
        description: "Высокие ледяные шпили и иглу",
        seed: "ice777",
        features: ["Лед", "Иглу", "Пингвины", "Снег"]
    }
];

// Данные для карты (постройки и данжи)
const mapLocations = [
    { x: 100, y: 150, type: 'building', name: 'Замок', seed: '1234567890' },
    { x: 300, y: 200, type: 'dungeon', name: 'Подземелье', seed: '1234567890' },
    { x: 500, y: 100, type: 'village', name: 'Деревня', seed: '1234567890' },
    { x: 200, y: 400, type: 'dungeon', name: 'Пещера', seed: 'ocean123' },
    { x: 600, y: 300, type: 'building', name: 'Храм', seed: 'desert456' },
    { x: 400, y: 500, type: 'village', name: 'Оазис', seed: 'desert456' },
    { x: 150, y: 300, type: 'dungeon', name: 'Мансион', seed: 'forest789' },
    { x: 700, y: 200, type: 'building', name: 'Иглу', seed: 'snow2024' },
    { x: 350, y: 250, type: 'village', name: 'Снежная деревня', seed: 'snow2024' },
    { x: 550, y: 450, type: 'building', name: 'Шахта', seed: 'mesa999' }
];

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    renderSeeds();
    initMap();
    initSeedCreator();
    initSeedModal();
});

// Рендер сидов
function renderSeeds() {
    const seedsGrid = document.getElementById('seedsGrid');
    if (!seedsGrid) return;
    
    seedsGrid.innerHTML = '';
    
    popularSeeds.forEach((seed, index) => {
        const seedCard = document.createElement('div');
        seedCard.className = 'seed-card card-minecraft reveal-on-scroll';
        seedCard.style.cursor = 'pointer';
        seedCard.style.animationDelay = `${index * 0.1}s`;
        seedCard.innerHTML = `
            <div style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1rem;">
                <div style="font-size: 2.5rem; line-height: 1;">${getSeedIcon(seed.name)}</div>
                <div style="flex: 1;">
                    <h3 style="color: var(--mc-emerald); margin-bottom: 0.5rem; font-size: 1.3rem;">${seed.name}</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.6;">${seed.description}</p>
                </div>
            </div>
            <div class="seed-value" style="font-family: 'Courier New', monospace; background: var(--bg-darker); padding: 0.75rem; border-radius: 6px; color: var(--mc-diamond); font-size: 0.95rem; word-break: break-all; border: 1px solid var(--mc-diamond); text-align: center;">
                Сид: ${seed.seed}
            </div>
            <div style="margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${seed.features.map(f => `<span class="badge-minecraft" style="font-size: 0.85rem;">${f}</span>`).join('')}
            </div>
        `;
        seedCard.addEventListener('click', () => openSeedModal(seed));
        seedCard.addEventListener('mouseenter', () => {
            seedCard.style.transform = 'translateY(-8px) scale(1.02)';
        });
        seedCard.addEventListener('mouseleave', () => {
            seedCard.style.transform = 'translateY(0) scale(1)';
        });
        seedsGrid.appendChild(seedCard);
    });
}

function getSeedIcon(name) {
    const icons = {
        'Горный Замок': '🏔️',
        'Океанский Архипелаг': '🌊',
        'Пустынный Оазис': '🏜️',
        'Лесной Данж': '🌲',
        'Снежная Деревня': '❄️',
        'Меса Плато': '🏔️',
        'Джунгли Храма': '🌴',
        'Ледяной Шпиль': '🧊'
    };
    return icons[name] || '🌱';
}

// Модальное окно для сида
function initSeedModal() {
    const copyBtn = document.getElementById('copySeedBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const seedValue = document.querySelector('#modalBody .seed-value')?.textContent.replace('Сид: ', '');
            if (seedValue) {
                navigator.clipboard.writeText(seedValue).then(() => {
                    copyBtn.textContent = '✓ Скопировано!';
                    setTimeout(() => {
                        copyBtn.textContent = 'Копировать сид';
                    }, 2000);
                });
            }
        });
    }
}

function openSeedModal(seed) {
    const modal = document.getElementById('seedModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    modalTitle.textContent = seed.name;
    modalBody.innerHTML = `
        <p style="color: var(--text-secondary); margin-bottom: 1rem;">${seed.description}</p>
        <div class="seed-value" style="margin: 1rem 0; padding: 1rem; background: var(--bg-darker); border-radius: 8px; font-family: 'Courier New', monospace; color: var(--mc-diamond);">
            Сид: ${seed.seed}
        </div>
        <h4 style="margin-top: 1.5rem; color: var(--mc-emerald);">Особенности:</h4>
        <ul style="list-style: none; margin-top: 0.5rem;">
            ${seed.features.map(f => `<li style="padding: 0.5rem 0; color: var(--text-secondary);">✅ ${f}</li>`).join('')}
        </ul>
    `;
    
    showModal('seedModal');
}

// Создание своего сида
function initSeedCreator() {
    const generateBtn = document.getElementById('generateSeedBtn');
    const seedInput = document.getElementById('customSeedInput');
    const seedResult = document.getElementById('customSeedResult');
    
    if (!generateBtn || !seedInput || !seedResult) return;
    
    generateBtn.addEventListener('click', generateSeed);
    
    seedInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateSeed();
        }
    });
}

function generateSeed() {
    const seedInput = document.getElementById('customSeedInput');
    const seedResult = document.getElementById('customSeedResult');
    
    if (!seedInput || !seedResult) return;
    
    const input = seedInput.value.trim();
    
    if (!input) {
        alert('Пожалуйста, введите значение для сида');
        return;
    }
    
    // Показываем загрузку
    seedResult.style.display = 'block';
    seedResult.innerHTML = '<div class="loading" style="margin: 0 auto; display: block;"></div><p style="text-align: center; margin-top: 1rem; color: var(--text-secondary);">Генерация сида...</p>';
    
    // Имитация загрузки для красоты
    setTimeout(() => {
        // Генерируем сид на основе ввода
        let generatedSeed;
        if (!isNaN(input)) {
            generatedSeed = input;
        } else {
            generatedSeed = hashString(input);
        }
        
        // Получаем выбранные биомы
        const selectedBiomes = Array.from(document.querySelectorAll('.biome-filter:checked')).map(cb => cb.value);
        const selectedFeatures = Array.from(document.querySelectorAll('.feature-filter:checked')).map(cb => cb.value);
        
        // Генерируем биомы на основе фильтров
        const biomes = generateBiomes(selectedBiomes);
        
        // Генерируем особенности на основе фильтров
        const features = generateFeatures(selectedFeatures, selectedBiomes);
        
        seedResult.innerHTML = `
            <div class="animate-scale-in">
                <h4 style="color: var(--mc-emerald); margin-bottom: 1rem; text-align: center; font-size: 1.5rem;">
                    ✨ Ваш сид готов!
                </h4>
                <div class="seed-value" style="margin: 1.5rem 0; padding: 1.5rem; background: var(--bg-darker); border-radius: 8px; font-family: 'Courier New', monospace; color: var(--mc-diamond); font-size: 1.1rem; text-align: center; border: 2px solid var(--mc-diamond);">
                    Сид: ${generatedSeed}
                </div>
                
                ${biomes.length > 0 ? `
                    <div style="margin: 1.5rem 0;">
                        <h5 style="color: var(--mc-emerald); margin-bottom: 0.75rem;">🌍 Биомы:</h5>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            ${biomes.map(b => `<span class="badge-minecraft">${b}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${features.length > 0 ? `
                    <div style="margin: 1.5rem 0;">
                        <h5 style="color: var(--mc-diamond); margin-bottom: 0.75rem;">✨ Особенности:</h5>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            ${features.map(f => `<span class="badge-minecraft" style="background: var(--mc-diamond);">${f}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <button class="btn-minecraft btn-primary-mc" style="margin-top: 1.5rem; width: 100%;" onclick="copyCustomSeed('${generatedSeed}', this)">
                    📋 Копировать сид
                </button>
            </div>
        `;
    }, 800);
}

function generateBiomes(selectedBiomes) {
    const biomeNames = {
        'plains': 'Равнины',
        'forest': 'Лес',
        'desert': 'Пустыня',
        'ocean': 'Океан',
        'mountains': 'Горы',
        'snow': 'Снег',
        'jungle': 'Джунгли',
        'mesa': 'Меса',
        'swamp': 'Болото',
        'taiga': 'Тайга'
    };
    
    if (selectedBiomes.length === 0) {
        // Если ничего не выбрано, возвращаем все
        return Object.values(biomeNames);
    }
    
    // Возвращаем выбранные биомы + несколько случайных для разнообразия
    const result = selectedBiomes.map(b => biomeNames[b]).filter(Boolean);
    
    // Добавляем 1-2 случайных биома для разнообразия
    const allBiomes = Object.keys(biomeNames);
    const unselected = allBiomes.filter(b => !selectedBiomes.includes(b));
    if (unselected.length > 0 && Math.random() > 0.5) {
        const randomBiome = unselected[Math.floor(Math.random() * unselected.length)];
        result.push(biomeNames[randomBiome]);
    }
    
    return result;
}

function generateFeatures(selectedFeatures, selectedBiomes) {
    const featureNames = {
        'village': 'Деревни',
        'dungeon': 'Данжи',
        'temple': 'Храмы',
        'mansion': 'Мансионы',
        'stronghold': 'Крепости',
        'mineshaft': 'Шахты'
    };
    
    const result = [];
    
    // Добавляем выбранные особенности
    selectedFeatures.forEach(f => {
        if (featureNames[f]) {
            result.push(featureNames[f]);
        }
    });
    
    // Добавляем особенности на основе биомов
    if (selectedBiomes.includes('desert')) {
        if (!result.includes('Храмы')) result.push('Храмы');
    }
    if (selectedBiomes.includes('forest')) {
        if (!result.includes('Мансионы')) result.push('Мансионы');
    }
    if (selectedBiomes.includes('ocean')) {
        if (!result.includes('Подводные храмы')) result.push('Подводные храмы');
    }
    
    // Если ничего не выбрано, добавляем случайные
    if (result.length === 0) {
        const allFeatures = Object.values(featureNames);
        const count = Math.floor(Math.random() * 3) + 2;
        const shuffled = [...allFeatures].sort(() => 0.5 - Math.random());
        result.push(...shuffled.slice(0, count));
    }
    
    return result;
}

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString();
}

// Старая функция оставлена для совместимости
function generateRandomFeatures() {
    const allFeatures = [
        'Деревни', 'Данжи', 'Храмы', 'Мансионы', 'Пещеры', 
        'Океаны', 'Горы', 'Леса', 'Пустыни', 'Снежные биомы',
        'Острова', 'Каньоны', 'Редкие ресурсы', 'Подводные храмы'
    ];
    
    const count = Math.floor(Math.random() * 4) + 3;
    const shuffled = [...allFeatures].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function copyCustomSeed(seed, btn) {
    navigator.clipboard.writeText(seed).then(() => {
        btn.textContent = '✓ Скопировано!';
        setTimeout(() => {
            btn.textContent = 'Копировать сид';
        }, 2000);
    });
}

// Карта
let mapZoom = 1;
let mapOffsetX = 0;
let mapOffsetY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

function initMap() {
    const canvas = document.getElementById('mapCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = 600;
        drawMap();
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Контролы карты
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    const resetMap = document.getElementById('resetMap');
    
    if (zoomIn) zoomIn.addEventListener('click', () => {
        mapZoom = Math.min(mapZoom * 1.2, 3);
        drawMap();
    });
    
    if (zoomOut) zoomOut.addEventListener('click', () => {
        mapZoom = Math.max(mapZoom / 1.2, 0.5);
        drawMap();
    });
    
    if (resetMap) resetMap.addEventListener('click', () => {
        mapZoom = 1;
        mapOffsetX = 0;
        mapOffsetY = 0;
        drawMap();
    });
    
    // Перетаскивание карты
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX - mapOffsetX;
        dragStartY = e.clientY - mapOffsetY;
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            mapOffsetX = e.clientX - dragStartX;
            mapOffsetY = e.clientY - dragStartY;
            drawMap();
        }
    });
    
    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    canvas.addEventListener('mouseleave', () => {
        isDragging = false;
    });
    
    // Клик по локации
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - mapOffsetX) / mapZoom;
        const y = (e.clientY - rect.top - mapOffsetY) / mapZoom;
        
        mapLocations.forEach(loc => {
            const distance = Math.sqrt(Math.pow(x - loc.x, 2) + Math.pow(y - loc.y, 2));
            if (distance < 20) {
                alert(`Локация: ${loc.name}\nТип: ${getLocationTypeName(loc.type)}\nСид: ${loc.seed}`);
            }
        });
    });
    
    drawMap();
}

function drawMap() {
    const canvas = document.getElementById('mapCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    
    ctx.translate(mapOffsetX, mapOffsetY);
    ctx.scale(mapZoom, mapZoom);
    
    // Рисуем сетку
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < canvas.width / mapZoom + 100; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height / mapZoom + 100);
        ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height / mapZoom + 100; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width / mapZoom + 100, y);
        ctx.stroke();
    }
    
    // Рисуем локации
    mapLocations.forEach(loc => {
        let color;
        switch(loc.type) {
            case 'building':
                color = '#4CAF50';
                break;
            case 'dungeon':
                color = '#F44336';
                break;
            case 'village':
                color = '#2196F3';
                break;
            default:
                color = '#FFC107';
        }
        
        // Тень
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(loc.x + 2, loc.y + 2, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Маркер
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(loc.x, loc.y, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Обводка
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Название
        ctx.fillStyle = '#fff';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(loc.name, loc.x, loc.y - 15);
    });
    
    ctx.restore();
}

function getLocationTypeName(type) {
    const names = {
        'building': 'Постройка',
        'dungeon': 'Данж',
        'village': 'Деревня'
    };
    return names[type] || type;
}
