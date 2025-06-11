document.addEventListener('DOMContentLoaded', function() {

    // --- Dynamiczna data w stopce ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // --- Animacja pisania ---
    const typingElement = document.querySelector('.typing-effect');
    const words = ["Unity Developerem", "Indie Game Developerem", "Fanem Optymalizacji", "Programistą C#"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        const currentChars = isDeleting 
            ? currentWord.substring(0, charIndex--) 
            : currentWord.substring(0, charIndex++);
        
        typingElement.textContent = currentChars;

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 150);
        }
    }
    type();

    // --- Animacja na Scroll ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .hero').forEach(el => observer.observe(el));

    // --- Logika Terminala ---
    const terminal = document.getElementById('terminal');
    const toggleButton = document.getElementById('terminal-toggle');
    const closeButton = document.getElementById('terminal-close');
    const output = document.getElementById('terminal-output');
    const input = document.getElementById('terminal-input');

    toggleButton.addEventListener('click', () => terminal.classList.toggle('hidden'));
    closeButton.addEventListener('click', () => terminal.classList.add('hidden'));

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = input.value.trim().toLowerCase();
            const prompt = `<p><span class="command">C:\\Users\\Guest>${command}</span></p>`;
            output.innerHTML += prompt;

            handleCommand(command);

            input.value = '';
            output.scrollTop = output.scrollHeight;
        }
    });

    function handleCommand(cmd) {
        let response = '';
        switch (cmd) {
            case 'help':
                response = `<p>Dostępne komendy: 'about', 'skills', 'projects', 'contact', 'clear'</p>`;
                break;
            case 'about':
                response = `<p>Michał Rusinek - Game Developer z pasją do tworzenia gier. Główne technologie: Unity, C#, C++.</p>`;
                break;
            case 'skills':
                response = `<p>C#, C++, Python, Unity, URP, DOTS/ECS, Gameplay Systems, AI, Fizyka, Git, Blender...</p>`;
                break;

            case 'projects':
                 response = `<p>Aktualnie pracuję nad narzędziami proceduralnego AI. Więcej projektów znajdziesz na moim GitHubie (link wkrótce!).</p>`;
                 break;
            case 'contact':
                response = `<p>Napisz do mnie: <a href="mailto:rusineczek1@gmail.com">rusineczek1@gmail.com</a></p>`;
                break;
            case 'clear':
                output.innerHTML = '';
                return;
            default:
                response = `<p class="error">Nieznana komenda: '${cmd}'. Wpisz 'help' po pomoc.</p>`;
        }
        output.innerHTML += response;
    }
});
