// ==============================
// ИГРА "БЕГИ ОТ СОСЕДА"
// Полная рабочая версия
// ==============================

// Элементы DOM
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverDiv = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');
const timeElement = document.getElementById('time');
const bestTimeElement = document.getElementById('bestTime');
const neighborSpeedElement = document.getElementById('neighborSpeed');
const screamSound = document.getElementById('screamSound');

// Создаем базовый звук скримера, если нет файла
if (!screamSound.src) {
    // Создаем скример звук с помощью Web Audio API
    function createScreamSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 1);
        } catch (e) {
            console.log("Не удалось создать звук:", e);
        }
    }
    
    // Привязываем функцию к элементу audio
    screamSound.play = createScreamSound;
}

// Настройки игры
const GAME = {
    running: true,
    gameTime: 0,
    bestTime: localStorage.getItem('bestTime') || 0,
    neighborBaseSpeed: 2.5,
    neighborSpeed: 2.5,
    speedIncreaseInterval: 10000, // Увеличивать скорость каждые 10 секунд
    lastSpeedIncrease: 0
};

// Игрок
const PLAYER = {
    x: canvas.width / 4,
    y: canvas.height / 2,
    size: 25,
    color: '#00ff00',
    speed: 6,
    trail: []
};

// Сосед
const NEIGHBOR = {
    x: canvas.width * 3/4,
    y: canvas.height / 2,
    size: 40,
    color: '#ff0000',
    eyesColor: '#ffff00',
    mouthColor: '#880000',
    trail: []
};

// Ключи управления
const KEYS = {};

// ==============================
// ФУНКЦИИ ОТРИСОВКИ
// ==============================

// Рисуем игрока
function drawPlayer() {
    // Хвост игрока
    for (let i = 0; i < PLAYER.trail.length; i++) {
        const alpha = i / PLAYER.trail.length * 0.5;
        ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(PLAYER.trail[i].x, PLAYER.trail[i].y, PLAYER.size/2 * (i/PLAYER.trail.length), 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Тело игрока
    ctx.fillStyle = PLAYER.color;
    ctx.beginPath();
    ctx.arc(PLAYER.x, PLAYER.y, PLAYER.size/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Глаза игрока
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(PLAYER.x - 5, PLAYER.y - 5, 3, 0, Math.PI * 2);
    ctx.arc(PLAYER.x + 5, PLAYER.y - 5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Улыбка игрока
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(PLAYER.x, PLAYER.y + 3, 8, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
}

// Рисуем соседа
function drawNeighbor() {
    // Хвост соседа
    for (let i = 0; i < NEIGHBOR.trail.length; i++) {
        const alpha = i / NEIGHBOR.trail.length * 0.3;
        ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(NEIGHBOR.trail[i].x, NEIGHBOR.trail[i].y, NEIGHBOR.size/2 * (i/NEIGHBOR.trail.length), 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Тело соседа
    ctx.fillStyle = NEIGHBOR.color;
    ctx.beginPath();
    ctx.arc(NEIGHBOR.x, NEIGHBOR.y, NEIGHBOR.size/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Глаза соседа (злые)
    ctx.fillStyle = NEIGHBOR.eyesColor;
    ctx.beginPath();
    ctx.arc(NEIGHBOR.x - 10, NEIGHBOR.y - 10, 6, 0, Math.PI * 2);
    ctx.arc(NEIGHBOR.x + 10, NEIGHBOR.y - 10, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Зрачки
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(NEIGHBOR.x - 10, NEIGHBOR.y - 10, 2, 0, Math.PI * 2);
    ctx.arc(NEIGHBOR.x + 10, NEIGHBOR.y - 10, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Рот соседа (злой)
    ctx.fillStyle = NEIGHBOR.mouthColor;
    ctx.beginPath();
    ctx.ellipse(NEIGHBOR.x, NEIGHBOR.y + 10, 12, 8, 0, 0, Math.PI);
    ctx.fill();
    
    // Зубы
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 5; i++) {
        ctx.fillRect(NEIGHBOR.x - 10 + i * 4, NEIGHBOR.y + 10, 2, 5);
    }
}

// Рисуем фон с сеткой
function drawBackground() {
    // Темный фон
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Сетка
    ctx.strokeStyle = '#003300';
    ctx.lineWidth = 1;
    
    // Вертикальные линии
    for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Горизонтальные линии
    for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Рисуем миникарту
function drawMinimap() {
    const mapSize = 150;
    const mapX = canvas.width - mapSize - 10;
    const mapY = 10;
    
    // Фон миникарты
    ctx.fillStyle = 'rgba(0, 20, 0, 0.8)';
    ctx.fillRect(mapX, mapY, mapSize, mapSize);
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(mapX, mapY, mapSize, mapSize);
    
    // Игрок на карте
    const playerMapX = mapX + (PLAYER.x / canvas.width) * mapSize;
    const playerMapY = mapY + (PLAYER.y / canvas.height) * mapSize;
    ctx.fillStyle = PLAYER.color;
    ctx.beginPath();
    ctx.arc(playerMapX, playerMapY, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Сосед на карте
    const neighborMapX = mapX + (NEIGHBOR.x / canvas.width) * mapSize;
    const neighborMapY = mapY + (NEIGHBOR.y / canvas.height) * mapSize;
    ctx.fillStyle = NEIGHBOR.color;
    ctx.beginPath();
    ctx.arc(neighborMapX, neighborMapY, 6, 0, Math.PI * 2);
    ctx.fill();
}

// Рисуем всю сцену
function draw() {
    drawBackground();
    drawPlayer();
    drawNeighbor();
    drawMinimap();
    
    // Отображаем расстояние до соседа
    const dx = PLAYER.x - NEIGHBOR.x;
    const dy = PLAYER.y - NEIGHBOR.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Предупреждение, если сосед близко
    if (distance < 200) {
        ctx.fillStyle = `rgba(255, ${Math.floor(distance)}, 0, 0.3)`;
        ctx.beginPath();
        ctx.arc(PLAYER.x, PLAYER.y, 200, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = distance < 100 ? '#ff0000' : '#ff8800';
        ctx.font = 'bold 16px Courier New';
        ctx.fillText(`СОСЕД БЛИЗКО! ${Math.floor(distance)}px`, 10, 30);
    }
    
    // Таймер в углу
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 20px Courier New';
    ctx.fillText(`Время: ${GAME.gameTime.toFixed(1)}с`, 10, canvas.height - 10);
}

// ==============================
// ЛОГИКА ИГРЫ
// ==============================

// Обновляем позицию игрока
function updatePlayer() {
    // Добавляем текущую позицию в хвост
    PLAYER.trail.push({x: PLAYER.x, y: PLAYER.y});
    if (PLAYER.trail.length > 15) {
        PLAYER.trail.shift();
    }
    
    // Движение
    let moved = false;
    
    if (KEYS['ArrowUp'] || KEYS['w'] || KEYS['W']) {
        PLAYER.y -= PLAYER.speed;
        moved = true;
    }
    if (KEYS['ArrowDown'] || KEYS['s'] || KEYS['S']) {
        PLAYER.y += PLAYER.speed;
        moved = true;
    }
    if (KEYS['ArrowLeft'] || KEYS['a'] || KEYS['A']) {
        PLAYER.x -= PLAYER.speed;
        moved = true;
    }
    if (KEYS['ArrowRight'] || KEYS['d'] || KEYS['D']) {
        PLAYER.x += PLAYER.speed;
        moved = true;
    }
    
    // Ограничиваем движение границами
    PLAYER.x = Math.max(PLAYER.size/2, Math.min(canvas.width - PLAYER.size/2, PLAYER.x));
    PLAYER.y = Math.max(PLAYER.size/2, Math.min(canvas.height - PLAYER.size/2, PLAYER.y));
    
    // Если не двигались, уменьшаем хвост
    if (!moved && PLAYER.trail.length > 0) {
        PLAYER.trail.shift();
    }
}

// Обновляем позицию соседа
function updateNeighbor() {
    // Добавляем текущую позицию в хвост
    NEIGHBOR.trail.push({x: NEIGHBOR.x, y: NEIGHBOR.y});
    if (NEIGHBOR.trail.length > 10) {
        NEIGHBOR.trail.shift();
    }
    
    // Преследование игрока
    const dx = PLAYER.x - NEIGHBOR.x;
    const dy = PLAYER.y - NEIGHBOR.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
        NEIGHBOR.x += (dx / distance) * GAME.neighborSpeed;
        NEIGHBOR.y += (dy / distance) * GAME.neighborSpeed;
    }
    
    // Иногда добавляем случайное движение для реалистичности
    if (Math.random() < 0.02) {
        NEIGHBOR.x += (Math.random() - 0.5) * 30;
        NEIGHBOR.y += (Math.random() - 0.5) * 30;
    }
    
    // Ограничиваем движение границами
    NEIGHBOR.x = Math.max(NEIGHBOR.size/2, Math.min(canvas.width - NEIGHBOR.size/2, NEIGHBOR.x));
    NEIGHBOR.y = Math.max(NEIGHBOR.size/2, Math.min(canvas.height - NEIGHBOR.size/2, NEIGHBOR.y));
}

// Проверка столкновения
function checkCollision() {
    const dx = PLAYER.x - NEIGHBOR.x;
    const dy = PLAYER.y - NEIGHBOR.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = PLAYER.size/2 + NEIGHBOR.size/2;
    
    return distance < minDistance;
}

// Обновляем статистику
function updateStats() {
    timeElement.textContent = GAME.gameTime.toFixed(1);
    bestTimeElement.textContent = GAME.bestTime;
    neighborSpeedElement.textContent = GAME.neighborSpeed.toFixed(2);
}

// Увеличиваем скорость соседа со временем
function increaseNeighborSpeed() {
    const now = Date.now();
    if (now - GAME.lastSpeedIncrease > GAME.speedIncreaseInterval) {
        GAME.neighborSpeed += 0.2;
        GAME.lastSpeedIncrease = now;
        
        // Мигание индикатора скорости
        neighborSpeedElement.style.color = '#ff0000';
        setTimeout(() => {
            neighborSpeedElement.style.color = '#00ff88';
        }, 500);
    }
}

// Конец игры
function gameOver() {
    GAME.running = false;
    
    // Проигрываем звук
    screamSound.play();
    
    // Обновляем лучший результат
    if (GAME.gameTime > GAME.bestTime) {
        GAME.bestTime = GAME.gameTime.toFixed(1);
        localStorage.setItem('bestTime', GAME.bestTime);
        bestTimeElement.textContent = GAME.bestTime;
    }
    
    // Показываем экран проигрыша
    gameOverDiv.style.display = 'block';
    
    // Добавляем эффект тряски
    canvas.style.transform = 'translate(5px, 5px)';
    setTimeout(() => {
        canvas.style.transform = 'translate(-5px, -5px)';
        setTimeout(() => {
            canvas.style.transform = 'translate(0, 0)';
        }, 50);
    }, 50);
}

// Перезапуск игры
function restartGame() {
    // Сбрасываем позиции
    PLAYER.x = canvas.width / 4;
    PLAYER.y = canvas.height / 2;
    PLAYER.trail = [];
    
    NEIGHBOR.x = canvas.width * 3/4;
    NEIGHBOR.y = canvas.height / 2;
    NEIGHBOR.trail = [];
    
    // Сбрасываем настройки
    GAME.running = true;
    GAME.gameTime = 0;
    GAME.neighborSpeed = GAME.neighborBaseSpeed;
    GAME.lastSpeedIncrease = Date.now();
    
    // Прячем экран проигрыша
    gameOverDiv.style.display = 'none';
    
    // Обновляем статистику
    updateStats();
    
    // Запускаем игровой цикл
    gameLoop();
}

// Игровой цикл
function gameLoop() {
    if (!GAME.running) return;
    
    // Обновляем время
    GAME.gameTime += 0.1;
    
    // Обновляем позиции
    updatePlayer();
    updateNeighbor();
    
    // Увеличиваем скорость соседа
    increaseNeighborSpeed();
    
    // Проверяем столкновение
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    // Обновляем статистику
    updateStats();
    
    // Отрисовываем
    draw();
    
    // Следующий кадр
    requestAnimationFrame(gameLoop);
}

// ==============================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ==============================

// Управление клавиатурой
window.addEventListener('keydown', (e) => {
    KEYS[e.key] = true;
    
    // Перезапуск по R
    if (e.key === 'r' || e.key === 'R' || e.key === 'к' || e.key === 'К') {
        if (!GAME.running) {
            restartGame();
        }
    }
    
    // Пауза по P
    if (e.key === 'p' || e.key === 'P' || e.key === 'з' || e.key === 'З') {
        GAME.running = !GAME.running;
        if (GAME.running) {
            gameLoop();
        }
    }
});

window.addEventListener('keyup', (e) => {
    KEYS[e.key] = false;
});

// Управление кнопкой перезапуска
restartBtn.addEventListener('click', restartGame);

// ==============================
// ЗАПУСК ИГРЫ
// ==============================

// Инициализация
function init() {
    // Устанавливаем лучший результат
    bestTimeElement.textContent = GAME.bestTime;
    
    // Запускаем игру
    gameLoop();
    
    console.log("Игра 'Беги от соседа' запущена!");
    console.log("Управление: Стрелки или WASD для движения");
    console.log("R - перезапуск, P - пауза");
}

// Запускаем при загрузке
window.addEventListener('load', init);