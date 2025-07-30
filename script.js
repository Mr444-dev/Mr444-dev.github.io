document.addEventListener('DOMContentLoaded', function() {
    // Add page-loaded class for fade-in animation
    document.body.classList.add('page-loaded');

    // Initialize AOS
    AOS.init({
        duration: 800, // values from 0 to 3000, with step 50ms
        easing: 'ease-in-out', // default easing for AOS animations
        once: true, // whether animation should happen only once - while scrolling down
        mirror: false, // whether elements should animate out while scrolling past them
    });

    // --- MODUŁ: THEME TOGGLE ---
    const themeToggleBtn = document.getElementById('fixed-theme-toggle'); // Updated ID
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // SVG Icons
    const sunIcon = '☀️'; // Reverted to emoji
    const moonIcon = '🌙'; // Reverted to emoji

    // Define particle colors for different themes
    const defaultParticleConfig = {
        particleColor: '#03DAC6', // Corrected to match app.js initial primary color
        lineColor: '#ffffff'      // Original line color for dark mode (matches app.js)
    };

    const lightModeParticleConfig = {
        particleColor: '#333333', // Darker particle color for light mode
        lineColor: '#555555'      // Darker line color for light mode
    };

    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            if (themeToggleBtn) themeToggleBtn.innerHTML = moonIcon; // Moon icon to switch to dark

            // Update particles.js colors for light mode
            if (window.pJSDom && pJSDom.length > 0 && typeof hexToRgb === 'function') {
                const pJS_instance = pJSDom[0];
                if (pJS_instance && pJS_instance.pJS && pJS_instance.pJS.particles) {
                    pJS_instance.pJS.particles.color.value = lightModeParticleConfig.particleColor;
                    pJS_instance.pJS.particles.line_linked.color = lightModeParticleConfig.lineColor;
                    pJS_instance.pJS.particles.line_linked.color_rgb_line = hexToRgb(lightModeParticleConfig.lineColor);
                }
            }

        } else { // 'dark'
            document.body.classList.remove('light-mode');
            if (themeToggleBtn) themeToggleBtn.innerHTML = sunIcon; // Sun icon to switch to light

            // Update particles.js colors for dark mode (revert to original)
            if (window.pJSDom && pJSDom.length > 0 && typeof hexToRgb === 'function') {
                const pJS_instance = pJSDom[0];
                if (pJS_instance && pJS_instance.pJS && pJS_instance.pJS.particles) {
                    pJS_instance.pJS.particles.color.value = defaultParticleConfig.particleColor;
                    pJS_instance.pJS.particles.line_linked.color = defaultParticleConfig.lineColor;
                    pJS_instance.pJS.particles.line_linked.color_rgb_line = hexToRgb(defaultParticleConfig.lineColor);
                }
            }
        }
        // particles.js should pick up these changes in its next animation frame.
    }

    // Load saved theme or use system preference or default to dark
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) { // If no theme is stored in localStorage (e.g., first visit)
        currentTheme = 'dark'; // Default to dark mode
    }
    // Default to dark if localStorage had an invalid value
    if (currentTheme !== 'light' && currentTheme !== 'dark') {
        currentTheme = 'dark';
    }

    // Apply the determined theme (from localStorage or the default 'dark')
    applyTheme(currentTheme);

    // The theme toggle button will still allow changing the theme and
    // will save the new preference to localStorage.
    // The toggle button's logic correctly determines the next theme
    // based on the current body class.


    // --- MODUŁ: HOME PAGE SPECIFIC PARTICLE INTERACTIONS (SIMPLIFIED) ---
    const currentPathForParticles = window.location.pathname;
    const isHomePageForParticles = currentPathForParticles.endsWith('/') || currentPathForParticles.endsWith('index.html');

    if (isHomePageForParticles) {
        const pJSInitIntervalHome = setInterval(() => {
            if (window.pJSDom && window.pJSDom.length > 0 && window.pJSDom[0].pJS) {
                clearInterval(pJSInitIntervalHome);
                const pJS_instance_home = window.pJSDom[0].pJS;

                // Set specific interactions for Home page
                pJS_instance_home.interactivity.events.onhover.mode = 'bubble'; // Or 'grab'
                pJS_instance_home.interactivity.modes.bubble.size = 20; // Adjust bubble size
                pJS_instance_home.interactivity.modes.bubble.distance = 100;


                pJS_instance_home.interactivity.events.onclick.mode = 'push'; // Or 'remove'
                
                // If particles.js was previously running a custom loop, ensure it's stopped
                // and the default loop is (re)started if necessary.
                // However, particles.js manages its own loop. We just change config.
                // If you had a custom cancelRequestAnimFrame for pJS_instance_home.fn.drawAnimFrame,
                // ensure it's not interfering or re-enable the default draw if you had stopped it.
                // For this simplification, we assume particles.js default loop is fine.

                console.log("Home page particle interactions set to bubble/push.");
            }
        }, 100);
    }
    // Removed complex seeker virus and infection spread logic


    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // Listen for changes in system preference
    prefersDarkScheme.addEventListener('change', (e) => {
        // Only update if no theme is explicitly saved by the user
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // --- MODUŁ 1: PROFESJONALNA NAWIGACJA ---
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const logoLink = document.querySelector('nav .logo'); // Get the logo link
    let lastScrollY = window.scrollY;

    // Logika chowania się paska nawigacji
    window.addEventListener('scroll', () => {
        if (lastScrollY < window.scrollY && window.scrollY > 100) {
            nav.classList.add('nav-hidden');
        } else {
            nav.classList.remove('nav-hidden');
        }
        nav.classList.toggle('scrolled', window.scrollY > 50);
        lastScrollY = window.scrollY;
    });

    // Logika podświetlania aktywnego linku na podstawie bieżącej strony URL
    const currentPagePath = window.location.pathname;
    let currentPageName = currentPagePath.split("/").pop();
    if (currentPageName === "" && currentPagePath.endsWith("/")) { // Handles root of a directory like /HTML/
        currentPageName = "index.html";
    } else if (currentPageName === "") { // Handles true root like example.com/
        currentPageName = "index.html";
    }


    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        // More robust check for active link, considering relative paths
        const linkPath = new URL(linkHref, window.location.href).pathname;
        let linkPageName = linkPath.split("/").pop();

        if (linkPageName === "" && linkPath.endsWith("/")) {
            linkPageName = "index.html";
        } else if (linkPageName === "") {
            linkPageName = "index.html";
        }

        if (linkPageName === currentPageName) {
            // Further check if paths are truly equivalent for deeply nested structures
            if (linkPath === currentPagePath) {
                link.classList.add('active');
            } else if (currentPagePath.endsWith(linkPageName) && linkPath.endsWith(linkPageName)) {
                // Fallback for simple cases where only filename matters and paths are similar depth
                const currentDirs = currentPagePath.substring(0, currentPagePath.lastIndexOf('/'));
                const linkDirs = linkPath.substring(0, linkPath.lastIndexOf('/'));
                if (currentDirs === linkDirs || currentPageName === 'index.html' && linkPageName === 'index.html') {
                    link.classList.add('active');
                }
            }
        }
    });
    // If no link is active and current page is index.html, try to activate the "Home" or "Start" link
    if (!document.querySelector('.nav-link.active') && currentPageName === "index.html") {
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref.endsWith('index.html') || link.textContent.toLowerCase() === 'home' || link.textContent.toLowerCase() === 'start') {
                link.classList.add('active');
            }
        });
    }

    // --- MODUŁ: PAGE TRANSITION LOADER ---
    // Create loader elements dynamically
    const loaderContainer = document.createElement('div');
    loaderContainer.id = 'page-transition-loader';

    const loaderBarTrack = document.createElement('div'); // New track element
    loaderBarTrack.id = 'page-transition-loader-track';

    const loaderProgress = document.createElement('div');
    loaderProgress.id = 'page-transition-loader-progress';

    loaderBarTrack.appendChild(loaderProgress); // Progress bar is inside the track
    loaderContainer.appendChild(loaderBarTrack); // Track is inside the main container
    document.body.appendChild(loaderContainer);
    // Initially hide it
    loaderContainer.style.display = 'none';

    // --- Page Transition on Navigation Click ---
    // Variables nav, navLinks, and logoLink are already defined in the outer scope (MODUŁ 1)

    const allNavElements = [];
    if (logoLink) allNavElements.push(logoLink); // Uses outer scope logoLink
    navLinks.forEach(nl => allNavElements.push(nl)); // Uses outer scope navLinks

    allNavElements.forEach(link => {
        if (link) {
            link.addEventListener('click', function(event) {
                const href = this.getAttribute('href');

                // Check if it's an external link, hash link, mailto, or tel
                const isExternalOrHash = href && (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http://') || href.startsWith('https://'));

                // For relative paths, ensure it's not an http/https link to the same domain but treated as external
                let isSameDomainExternal = false;
                if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
                    try {
                        const targetOrigin = new URL(href).origin;
                        if (targetOrigin !== window.location.origin) {
                            isSameDomainExternal = true;
                        }
                    } catch (e) {
                        // Invalid URL, treat as potentially external or let browser handle
                    }
                }


                if (href && !isExternalOrHash && !isSameDomainExternal) {
                    const targetUrl = new URL(href, window.location.href);
                    // Prevent transition if it's the same page
                    if (targetUrl.href !== window.location.href) {
                        event.preventDefault();

                        // Show and animate loader
                        loaderProgress.style.transition = 'width 0s'; // Disable transition for reset
                        loaderProgress.style.width = '0%'; // Reset width

                        // Force reflow to apply the 0% width immediately
                        void loaderProgress.offsetWidth;

                        loaderProgress.style.transition = 'width 0.18s ease-out'; // Re-enable transition
                        loaderContainer.style.display = 'block'; // Show the loader
                        loaderProgress.style.width = '100%'; // Animate to 100%

                        document.body.classList.remove('page-loaded'); // Trigger fade-out

                        setTimeout(() => {
                            window.location.href = href;
                            // The loader will disappear with the page navigation
                        }, 200); // Matches your existing timeout for page fade
                    }
                }
            });
        }
    });

    // --- MODUŁ 2: ANIMACJA POJAWIANIA SIĘ SEKCJI PRZY PRZEWIJANIU (REMOVED) ---
    // const revealObserver = new IntersectionObserver((entries, observer) => {
    //     entries.forEach(entry => {
    //         if (entry.isIntersecting) {
    //             entry.target.classList.add('visible');
    //             // Opcjonalnie: odkomentuj poniższą linię, jeśli animacja ma się wykonać tylko raz
    //             // observer.unobserve(entry.target);
    //         }
    //     });
    // }, { threshold: 0.1 });

    // document.querySelectorAll('.reveal').forEach(el => {
    //     revealObserver.observe(el);
    // });

    // --- MODUŁ 3: EFEKT PISANIA NA MASZYNIE (działa tylko jeśli element .typing-effect jest na stronie) ---
    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        const words = ["Unity Developer", "Indie Game Developer", "Optimization Fan", "C# Programmer"];
        let wordIndex = 0, charIndex = 0, isDeleting = false;
        function type() {
            const currentWord = words[wordIndex];
            const currentChars = isDeleting ? currentWord.substring(0, charIndex--) : currentWord.substring(0, charIndex++);
            typingElement.textContent = currentChars;
            // Change this condition:
            if (!isDeleting && charIndex > currentWord.length) { // Was: charIndex === currentWord.length
                isDeleting = true; setTimeout(type, 2000);
            }
            else if (isDeleting && charIndex === 0) {
                isDeleting = false; wordIndex = (wordIndex + 1) % words.length; setTimeout(type, 500);
            }
            else {
                setTimeout(type, isDeleting ? 50 : 150);
            }
        }
        type();
    }

    // --- MODUŁ 4: GRA SNAKE (działa tylko jeśli elementy gry są na stronie) ---
    const canvas = document.getElementById('snake-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        const startOverlay = document.getElementById('game-start-overlay');
        const startBtn = document.getElementById('start-game-btn');
        const gameOverOverlay = document.getElementById('game-over-overlay');
        const finalScoreElement = document.getElementById('final-score');
        const restartBtn = document.getElementById('restart-game-btn');
        const GRID_SIZE = 20, SNAKE_COLOR = '#03DAC6', FOOD_COLOR = '#BB86FC';
        let snake, food, direction, score, gameInterval;

        function init() {
            snake = [{ x: 10, y: 10 }];
            food = {};
            direction = 'right';
            score = 0;
            if(scoreElement) scoreElement.textContent = score;
            if(gameOverOverlay) gameOverOverlay.classList.remove('visible');
            randomFoodPosition();
            draw();
        }
        function randomFoodPosition() {
            food.x = Math.floor(Math.random() * (canvas.width / GRID_SIZE));
            food.y = Math.floor(Math.random() * (canvas.height / GRID_SIZE));
        }
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            snake.forEach(part => drawRect(part.x, part.y, SNAKE_COLOR));
            drawRect(food.x, food.y, FOOD_COLOR);
        }
        function drawRect(x, y, color) {
            ctx.fillStyle = color;
            ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            ctx.strokeStyle = '#121212';
            ctx.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
        function update() {
            const head = { ...snake[0] };
            if (direction === 'up') head.y--;
            if (direction === 'down') head.y++;
            if (direction === 'left') head.x--;
            if (direction === 'right') head.x++;

            // Check collision with walls
            if (head.x < 0 || head.x >= canvas.width / GRID_SIZE || head.y < 0 || head.y >= canvas.height / GRID_SIZE) {
                gameOver();
                return;
            }

            // Check collision with self
            if (snake.some(part => part.x === head.x && part.y === head.y)) {
                gameOver();
                return;
            }

            snake.unshift(head);

            // Check collision with food
            if (head.x === food.x && head.y === food.y) {
                score++;
                if(scoreElement) scoreElement.textContent = score;
                randomFoodPosition();
            } else {
                snake.pop();
            }

            draw();
        }

        function gameOver() {
            clearInterval(gameInterval);
            if(finalScoreElement) finalScoreElement.textContent = score;
            if(gameOverOverlay) gameOverOverlay.classList.add('visible');
        }

        function startGame() {
            init();
            if(startOverlay) startOverlay.classList.remove('visible');
            gameInterval = setInterval(update, 150);
        }

        // Initialize keyboard controls
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
            if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
            if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
            if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
        });

        // Add event listeners for buttons
        if(startBtn) startBtn.addEventListener('click', startGame);
        if(restartBtn) restartBtn.addEventListener('click', startGame);

        // Initial setup
        init();
        if(startOverlay) startOverlay.classList.add('visible');
    }

    // --- MODUŁ 5: GALERIA ZDJĘĆ ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryModal = document.getElementById('gallery-modal');
    
    if (galleryItems.length > 0 && galleryModal) {
        const modalImg = galleryModal.querySelector('img');
        const modalCaption = galleryModal.querySelector('.caption');
        const closeBtn = galleryModal.querySelector('.close');
        
        // Funkcja otwierająca modal z danym obrazem i podpisem
        function openModal(src, caption) {
            modalImg.src = src;
            modalCaption.textContent = caption;
            galleryModal.classList.add('visible');
        }
        
        // Dodanie obsługi kliknięcia dla każdego elementu galerii
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('img').src;
                const imgCaption = item.getAttribute('data-caption') || '';
                openModal(imgSrc, imgCaption);
            });
        });
        
        // Zamykanie modalu
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                galleryModal.classList.remove('visible');
            });
        }
        
        // Zamykanie modalu po kliknięciu poza obrazem
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                galleryModal.classList.remove('visible');
            }
        });
    }

    // --- MODUŁ 6: FORMULARZ KONTAKTOWY ---
    const contactForm = document.querySelector('.contact-form');
    const thankYouPanel = document.getElementById('thank-you-panel');
    const closeThankYouPanelBtn = document.getElementById('close-thank-you-panel');

    if (contactForm && thankYouPanel && closeThankYouPanelBtn) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default browser submission
            
            // const formData = new FormData(contactForm); // Keep for potential local processing/logging if needed
            // const formAction = contactForm.getAttribute('action'); // No longer needed

            // Show a loading state on the submit button (optional)
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            // Simulate a delay for sending
            setTimeout(() => {
                thankYouPanel.classList.add('visible');
                contactForm.reset();
                
                // Restore submit button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, 1000); // Simulate 1 second delay

            // Removed fetch logic for Formspree
            // fetch(formAction, {
            //     method: 'POST',
            //     body: formData,
            //     headers: {
            //         'Accept': 'application/json'
            //     }
            // }).then(response => {
            //     if (response.ok) {
            //         thankYouPanel.classList.add('visible');
            //         contactForm.reset();
            //     } else {
            //         response.json().then(data => {
            //             if (Object.hasOwn(data, 'errors')) {
            //                 alert(data["errors"].map(error => error["message"]).join(", "));
            //             } else {
            //                 alert('Oops! There was a problem submitting your form. Please try again.');
            //             }
            //         });
            //     }
            // }).catch(error => {
            //     console.error('Error submitting form:', error);
            //     alert('Oops! There was a problem submitting your form. Please check your network connection and try again.');
            // }).finally(() => {
            //     // Restore submit button
            //     submitBtn.innerHTML = originalBtnText;
            //     submitBtn.disabled = false;
            // });
        });

        closeThankYouPanelBtn.addEventListener('click', () => {
            thankYouPanel.classList.remove('visible');
        });

        // Optional: Close panel by clicking outside of it
        thankYouPanel.addEventListener('click', (e) => {
            if (e.target === thankYouPanel) {
                thankYouPanel.classList.remove('visible');
            }
        });
    }

    // --- MODUŁ: CUSTOM MOUSE HOLD PARTICLE INTERACTION (NON-HOME PAGES) ---
    let isMouseDownForGravity = false;
    let gravityMouseX = 0;
    let gravityMouseY = 0;
    let gravityRAFId = null;

    const particleCanvas = document.querySelector('#particles-js .particles-js-canvas-el');

    function applyGravityPull() {
        if (!isMouseDownForGravity || isHomePageForParticles || !window.pJSDom || !window.pJSDom[0] || !window.pJSDom[0].pJS) {
            if (gravityRAFId) {
                cancelAnimationFrame(gravityRAFId);
                gravityRAFId = null;
            }
            return;
        }

        const pJS_instance = window.pJSDom[0].pJS;
        const particles = pJS_instance.particles.array;
        const G = 60; // Gravitational constant - adjust for strength (higher is stronger)
        const minInteractionDistanceSq = 50*50; // Squared min distance to prevent extreme forces
        const maxSpeed = 4; // Max speed particles can be pulled towards cursor

        particles.forEach(p => {
            const dx = gravityMouseX - p.x;
            const dy = gravityMouseY - p.y;
            const distSq = dx * dx + dy * dy;

            if (distSq > minInteractionDistanceSq) { 
                const dist = Math.sqrt(distSq);
                const forceMagnitude = G / distSq; 

                let ax = dx / dist; 
                let ay = dy / dist; 
                
                p.vx += ax * forceMagnitude;
                p.vy += ay * forceMagnitude;

                const currentSpeedSq = p.vx * p.vx + p.vy * p.vy;
                if (currentSpeedSq > maxSpeed * maxSpeed) {
                    const currentSpeed = Math.sqrt(currentSpeedSq);
                    p.vx = (p.vx / currentSpeed) * maxSpeed;
                    p.vy = (p.vy / currentSpeed) * maxSpeed;
                }
            } else if (distSq > 0 && distSq <= minInteractionDistanceSq) {
                // If very close, just try to gently move it or stop it to prevent overshooting
                const dist = Math.sqrt(distSq);
                const dampingFactor = 0.5; // How quickly it stops when very close
                p.vx *= dampingFactor;
                p.vy *= dampingFactor;
                 // Gently nudge towards cursor if not directly on it
                if (dist > 1) {
                    p.vx += (dx / dist) * 0.1;
                    p.vy += (dy / dist) * 0.1;
                }
            }
        });

        gravityRAFId = requestAnimationFrame(applyGravityPull);
    }

    if (particleCanvas) {
        particleCanvas.addEventListener('mousedown', (e) => {
            if (e.button === 0 && !isHomePageForParticles && window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) { 
                isMouseDownForGravity = true;
                const pJS_instance = window.pJSDom[0].pJS;
                // Ensure mouse coordinates are scaled by pxRatio if retina display
                gravityMouseX = e.offsetX * (pJS_instance.canvas.pxratio || 1);
                gravityMouseY = e.offsetY * (pJS_instance.canvas.pxratio || 1);
                
                if (!gravityRAFId) { 
                    applyGravityPull();
                }
            }
        });

        particleCanvas.addEventListener('mousemove', (e) => {
            if (isMouseDownForGravity && !isHomePageForParticles && window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
                const pJS_instance = window.pJSDom[0].pJS;
                gravityMouseX = e.offsetX * (pJS_instance.canvas.pxratio || 1);
                gravityMouseY = e.offsetY * (pJS_instance.canvas.pxratio || 1);
            }
        });

        window.addEventListener('mouseup', (e) => { // Listen on window to catch mouseup outside canvas
            if (e.button === 0 && isMouseDownForGravity) { 
                isMouseDownForGravity = false;
                // The RAF loop will stop itself in the next call to applyGravityPull
            }
        });
    }

    // --- MODUŁ 7: ANIMACJA ŁADOWANIA STRONY ---
    // Already handled by the initial script in the <head> section
});