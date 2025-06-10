document.addEventListener('DOMContentLoaded', function() {

    // --- LOGIKA NAWIGACJI W ZAKŁADKACH ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            
            // 1. Aktualizuj, który link jest aktywny (dla stylu CSS)
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // 2. Pokaż wybraną sekcję, ukryj resztę
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });


    // --- LOGIKA EFEKTU PISANIA NA MASZYNIE ---
    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        const words = ["Unity Developerem", "Indie Game Developerem", "Fanem Optymalizacji", "Programistą C#"];
        let wordIndex = 0, charIndex = 0, isDeleting = false;
        
        function type() {
            const currentWord = words[wordIndex];
            const currentChars = isDeleting 
                ? currentWord.substring(0, charIndex--) 
                : currentWord.substring(0, charIndex++);
            
            typingElement.textContent = currentChars;

            if (!isDeleting && charIndex === currentWord.length) {
                // Słowo wpisane, zacznij usuwać po chwili
                isDeleting = true; 
                setTimeout(type, 2000);
            } else if (isDeleting && charIndex === 0) {
                // Słowo usunięte, przejdź do następnego
                isDeleting = false; 
                wordIndex = (wordIndex + 1) % words.length; 
                setTimeout(type, 500);
            } else {
                // Kontynuuj pisanie/usuwanie
                setTimeout(type, isDeleting ? 50 : 150);
            }
        }
        type();
    }


    // --- LOGIKA GRY SNAKE ---
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

    function init() {
        // Inicjalizacja stanu początkowego gry
        snake = [{ x: 10, y: 10 }]; // Wąż zaczyna na środku
        food = {};
        direction = 'right';
        score = 0;
        scoreElement.textContent = score;
        gameOverOverlay.classList.remove('visible');
        randomFoodPosition();
    }

    function randomFoodPosition() {
        // Umieść jedzenie w losowym miejscu na siatce
        food.x = Math.floor(Math.random() * (canvas.width / GRID_SIZE));
        food.y = Math.floor(Math.random() * (canvas.height / GRID_SIZE));
    }
    
    function draw() {
        // Wyczyść płótno i narysuj wszystko od nowa
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        snake.forEach(part => drawRect(part.x, part.y, SNAKE_COLOR));
        drawRect(food.x, food.y, FOOD_COLOR);
    }
    
    function drawRect(x, y, color) {
        // Funkcja pomocnicza do rysowania kwadratów
        ctx.fillStyle = color;
        ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        ctx.strokeStyle = '#121212';
        ctx.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }

    function update() {
        // Główna pętla gry
        const head = { ...snake[0] }; // Stwórz nową głowę węża

        // Przesuń głowę w zależności od kierunku
        if (direction === 'up') head.y--;
        if (direction === 'down') head.y++;
        if (direction === 'left') head.x--;
        if (direction === 'right') head.x++;
        
        // Sprawdź kolizje
        if (head.x < 0 || head.x * GRID_SIZE >= canvas.width || head.y < 0 || head.y * GRID_SIZE >= canvas.height || checkSnakeCollision(head)) {
            return gameOver();
        }

        snake.unshift(head); // Dodaj nową głowę na początek węża
        
        // Sprawdź, czy wąż zjadł jedzenie
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreElement.textContent = score;
            randomFoodPosition();
        } else {
            snake.pop(); // Jeśli nie zjadł, usuń ogon
        }
        
        draw();
    }

    function checkSnakeCollision(head) {
        // Sprawdź, czy głowa zderzyła się z resztą ciała
        return snake.some((part, index) => index > 0 && part.x === head.x && part.y === head.y);
    }
    
    function changeDirection(e) {
        // Zmień kierunek węża na podstawie wciśniętego klawisza
        const key = e.key;
        if ((key === 'ArrowUp' || key.toLowerCase() === 'w') && direction !== 'down') direction = 'up';
        if ((key === 'ArrowDown' || key.toLowerCase() === 's') && direction !== 'up') direction = 'down';
        if ((key === 'ArrowLeft' || key.toLowerCase() === 'a') && direction !== 'right') direction = 'left';
        if ((key === 'ArrowRight' || key.toLowerCase() === 'd') && direction !== 'left') direction = 'right';
    }

    function startGame() {
        init();
        startOverlay.classList.remove('visible');
        gameInterval = setInterval(update, 100); // Uruchom pętlę gry co 100ms
        document.addEventListener('keydown', changeDirection);
    }

    function gameOver() {
        clearInterval(gameInterval); // Zatrzymaj pętlę gry
        finalScoreElement.textContent = score;
        gameOverOverlay.classList.add('visible');
        document.removeEventListener('keydown', changeDirection);
    }

    // Nasłuchiwanie na przyciski startu i restartu gry
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', () => {
        gameOverOverlay.classList.remove('visible');
        startGame();
    });
});
