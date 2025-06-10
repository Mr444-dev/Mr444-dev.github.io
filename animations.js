document.addEventListener("DOMContentLoaded", function() {

    // --- Dynamiczna data w stopce ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Animacja pojawiania się sekcji przy przewijaniu ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('hidden');
            }
        });
    }, {
        threshold: 0.1 // Uruchom animację, gdy 10% elementu jest widoczne
    });

    const hiddenElements = document.querySelectorAll('.content-section');
    hiddenElements.forEach(el => observer.observe(el));

});
