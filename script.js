document.addEventListener('DOMContentLoaded', function() {

    // --- NOWA LOGIKA: CHOWAJĄCA SIĘ NAWIGACJA ---
    const nav = document.querySelector('nav');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Dodaj/usuń tło nawigacji, gdy nie jest na samej górze
        if (currentScrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Ukryj/pokaż nawigację na podstawie kierunku scrollowania
        if (lastScrollY < currentScrollY && currentScrollY > 100) {
            // Scroll w dół
            nav.classList.add('nav-hidden');
        } else {
            // Scroll w górę
            nav.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY; // Zaktualizuj ostatnią pozycję
    });


    // --- LOGIKA NAWIGACJI W ZAKŁADKACH (BEZ ZMIAN) ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });

    // --- LOGIKA EFEKTU PISANIA (BEZ ZMIAN) ---
    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        const words = ["Unity Developerem", "Indie Game Developerem", "Fanem Optymalizacji", "Programistą C#"];
        let wordIndex = 0, charIndex = 0, isDeleting = false;
        
        function type() {
            const currentWord = words[wordIndex];
            const currentChars = isDeleting ? currentWord.substring(0, charIndex--) : currentWord.substring(0, charIndex++);
            typingElement.textContent = currentChars;
            if (!isDeleting && charIndex === currentWord.length) { isDeleting = true; setTimeout(type, 2000); } 
            else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; setTimeout(type, 500); } 
            else { setTimeout(type, isDeleting ? 50 : 150); }
        }
        type();
    }

    // --- LOGIKA GRY SNAKE (BEZ ZMIAN) ---
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const startOverlay = document.getElementById('game-start-overlay');
    const startBtn = document.getElementById('start-game-btn');
    const gameOverOverlay = document.getElementById('game-over-overlay');
    const finalScoreElement = document.getElementById('final-score');
    const restartBtn = document.getElementById('restart-game-btn');

    const GRID_SIZE = 20;
    const SNAKE_COLOR = '#03DAC6';
    const FOOD_COLOR = '#BB86FC';

    let snake, food, direction, score, gameInterval;

    function init() { snake = [{ x: 10, y: 10 }]; food = {}; direction = 'right'; score = 0; scoreElement.textContent = score; gameOverOverlay.classList.remove('visible'); randomFoodPosition(); }
    function randomFoodPosition() { food.x = Math.floor(Math.random() * (canvas.width / GRID_SIZE)); food.y = Math.floor(Math.random() * (canvas.height / GRID_SIZE)); }
    function draw() { ctx.clearRect(0, 0, canvas.width, canvas.height); snake.forEach(part => drawRect(part.x, part.y, SNAKE_COLOR)); drawRect(food.x, food.y, FOOD_COLOR); }
    function drawRect(x, y, color) { ctx.fillStyle = color; ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE); ctx.strokeStyle = '#121212'; ctx.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE); }
    function update() {
        const head = { ...snake[0] };
        if (direction === 'up') head.y--;
        if (direction === 'down') head.y++;
        if (direction === 'left') head.x--;
        if (direction === 'right') head.x++;
        if (head.x < 0 || head.x * GRID_SIZE >= canvas.width || head.y < 0 || head.y * GRID_SIZE >= canvas.height || checkSnakeCollision(head)) { return gameOver(); }
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) { score++; scoreElement.textContent = score; randomFoodPosition(); } else { snake.pop(); }
        draw();
    }
    function checkSnakeCollision(head) { return snake.some((part, index) => index > 0 && part.x === head.x && part.y === head.y); }
    function changeDirection(e) {
        const key = e.key;
        if ((key === 'ArrowUp' || key.toLowerCase() === 'w') && direction !== 'down') direction = 'up';
        if ((key === 'ArrowDown' || key.toLowerCase() === 's') && direction !== 'up') direction = 'down';
        if ((key === 'ArrowLeft' || key.toLowerCase() === 'a') && direction !== 'right') direction = 'left';
        if ((key === 'ArrowRight' || key.toLowerCase() === 'd') && direction !== 'left') direction = 'right';
    }
    function startGame() { init(); startOverlay.classList.remove('visible'); gameInterval = setInterval(update, 100); document.addEventListener('keydown', changeDirection); }
    function gameOver() { clearInterval(gameInterval); finalScoreElement.textContent = score; gameOverOverlay.classList.add('visible'); document.removeEventListener('keydown', changeDirection); }
    
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', () => { gameOverOverlay.classList.remove('visible'); startGame(); });
});