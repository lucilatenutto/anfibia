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

    // Start slideshow on load if slides exist
    if (slides.length > 0) {
        startSlideShow();
    }


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

    // Attach to all share buttons (supporting new anfibia-card, subhero-card, and classic grids)
    const shareBtns = document.querySelectorAll('.share-btn, .share-btn-compact');
    shareBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Find the closest card title
            const card = btn.closest('.grid-card, .compact-card, .anfibia-card, .subhero-card');
            let articleTitle = "Artículo";
            if (card) {
                const titleEl = card.querySelector('.card-title, .compact-title, .card-headline, .subhero-card-title');
                if (titleEl) {
                    articleTitle = titleEl.textContent.trim();
                }
            }

            // Simulate copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast(`Enlace copiado: "${articleTitle}"`);
            }).catch(() => {
                // Fallback if clipboard fails
                showToast(`Enlace simulado para "${articleTitle}"`);
            });
        });
    });

    // Attach to subhero navigation controls
    const subheroPrev = document.getElementById('subheroPrev');
    const subheroNext = document.getElementById('subheroNext');
    if (subheroPrev && subheroNext) {
        subheroPrev.addEventListener('click', () => {
            showToast("Sección Especial: Mostrando inicio de 'Las Despedidas'");
        });
        subheroNext.addEventListener('click', () => {
            showToast("Sección Especial: No hay más artículos en esta sección");
        });
    }

    // Attach to all love buttons
    const loveBtns = document.querySelectorAll('.love-btn');
    loveBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const card = btn.closest('.grid-card, .compact-card, .anfibia-card');
            let articleTitle = "Artículo";
            if (card) {
                const titleEl = card.querySelector('.card-title, .compact-title, .card-headline');
                if (titleEl) {
                    articleTitle = titleEl.textContent.trim();
                }
            }

            // Toggle active state
            btn.classList.toggle('loved');
            const icon = btn.querySelector('i');
            
            if (btn.classList.contains('loved')) {
                if (icon) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                }
                showToast(`Agregado a favoritos: "${articleTitle}"`);
            } else {
                if (icon) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                }
                showToast(`Eliminado de favoritos: "${articleTitle}"`);
            }
        });
    });


    // 3.5. READING PROGRESS BAR FOR ARTICLES (VERTICAL GAUGE WITH HANDLE & SECTION TICKS)
    const vertProgressBar = document.getElementById('verticalProgressBar');
    const vertProgressHandle = document.getElementById('verticalProgressHandle');
    const vertProgressTrack = document.querySelector('.vertical-progress-track');
    
    if (vertProgressBar && vertProgressHandle && vertProgressTrack) {
        let tickData = [];

        // Function to create section ticks dynamically
        function setupTicks() {
            // Remove any old ticks first
            const oldTicks = vertProgressTrack.querySelectorAll('.progress-tick');
            oldTicks.forEach(t => t.remove());
            tickData = [];

            const subheadings = document.querySelectorAll('.article-body-container h3.article-subheading');
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            
            if (docHeight <= 0) return;

            subheadings.forEach((heading) => {
                // Get absolute position of the subheading minus offset for sticky header (72px + breathing room = ~90px)
                const headingTop = heading.getBoundingClientRect().top + window.scrollY;
                const targetScroll = headingTop - 90;
                const percent = Math.max(0, Math.min(100, (targetScroll / docHeight) * 100));

                // Create tick element
                const tick = document.createElement('div');
                tick.className = 'progress-tick';
                tick.style.top = percent + '%';

                // Create tooltip
                const tooltip = document.createElement('span');
                tooltip.className = 'progress-tooltip';
                tooltip.textContent = heading.textContent.replace(/::after/g, '').trim();
                tick.appendChild(tooltip);

                // Click to scroll smoothly
                tick.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.scrollTo({
                        top: targetScroll,
                        behavior: 'smooth'
                    });
                });

                vertProgressTrack.appendChild(tick);

                tickData.push({
                    element: tick,
                    targetPercent: percent
                });
            });
        }

        // Update progress height, handle, and ticks active states
        function updateProgress() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            
            if (docHeight > 0) {
                const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
                
                // Update bar height and handle position
                vertProgressBar.style.height = scrollPercent + '%';
                vertProgressHandle.style.top = scrollPercent + '%';

                // Highlight active ticks
                tickData.forEach(tick => {
                    if (scrollPercent >= tick.targetPercent - 1) { // 1% buffer
                        tick.element.classList.add('active');
                    } else {
                        tick.element.classList.remove('active');
                    }
                });
            }
        }

        // Initialize ticks on load and when images are loaded
        setupTicks();
        window.addEventListener('load', setupTicks);
        
        // Handle scroll and resize events
        window.addEventListener('scroll', updateProgress);
        window.addEventListener('resize', () => {
            setupTicks();
            updateProgress();
        });
    }


    // 4. MOBILE MENU BUTTON ACTION
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            showToast("Menú móvil: ¡Próximamente disponible en este prototipo!");
        });
    }
});
