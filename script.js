/* ==========================================================================
   REVISTA ANFIBIA REDESIGN - INTERACTIVITY SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. CAROUSEL / SLIDER LOGIC
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        // Handle out of bounds indexes
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        // Toggle active classes on slides
        slides.forEach((slide, idx) => {
            if (idx === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Toggle active classes on dot indicators
        dots.forEach((dot, idx) => {
            if (idx === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Auto rotate every 6 seconds
    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 6000);
    }

    function resetSlideShow() {
        clearInterval(slideInterval);
        startSlideShow();
    }

    // Event listeners for prev/next buttons
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetSlideShow();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSlideShow();
        });
    }

    // Event listeners for dots indicators
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            showSlide(idx);
            resetSlideShow();
        });
    });

    // Start slideshow on load
    startSlideShow();


    // 2. SEARCH OVERLAY TOGGLE
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn && searchOverlay && closeSearch) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            setTimeout(() => searchInput.focus(), 300); // Focus input after animation
        });

        closeSearch.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });

        // Close search on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
            }
        });
    }


    // 3. TOAST NOTIFICATION & SHARE CLICK HANDLING
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    function showToast(message) {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = message;
        toast.classList.add('show');

        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Attach to all share buttons
    const shareBtns = document.querySelectorAll('.share-btn, .share-btn-compact');
    shareBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Find the closest card title
            const card = btn.closest('.grid-card, .compact-card');
            let articleTitle = "Artículo";
            if (card) {
                const titleEl = card.querySelector('.card-title, .compact-title');
                if (titleEl) {
                    articleTitle = titleEl.textContent.trim();
                }
            }

            // Simulate copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast(`Enlace copiado: "${articleTitle}"`);
            }).catch(() => {
                // Fallback if clipboard fails (e.g. non-https context)
                showToast(`Enlace simulado para "${articleTitle}"`);
            });
        });
    });


    // 4. MOBILE MENU BUTTON ACTION
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            showToast("Menú móvil: ¡Próximamente disponible en este prototipo!");
        });
    }
});
