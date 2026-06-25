/* ==========================================================================
   REVISTA ANFIBIA REDESIGN - INTERACTIVITY SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. CAROUSEL / SLIDER LOGIC
        const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const sliderWrapper = document.querySelector('.slider-wrapper');
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

        // Scroll the wrapper to the active slide on mobile
        if (sliderWrapper && sliderWrapper.scrollWidth > sliderWrapper.clientWidth) {
            const activeSlide = slides[currentSlide];
            if (activeSlide) {
                sliderWrapper.scrollTo({
                    left: activeSlide.offsetLeft,
                    behavior: 'smooth'
                });
            }
        }
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

    // Reset slide show timer
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

    // Sync swipe gestures on mobile slider to update dots
    if (sliderWrapper) {
        let isScrolling;
        sliderWrapper.addEventListener('scroll', () => {
            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(() => {
                const width = sliderWrapper.clientWidth;
                if (width > 0 && sliderWrapper.scrollWidth > width) {
                    const newSlideIndex = Math.round(sliderWrapper.scrollLeft / width);
                    if (newSlideIndex !== currentSlide) {
                        currentSlide = newSlideIndex;

                        // Update active classes on slides
                        slides.forEach((slide, idx) => {
                            if (idx === currentSlide) {
                                slide.classList.add('active');
                            } else {
                                slide.classList.remove('active');
                            }
                        });

                        // Update active classes on dots
                        dots.forEach((dot, idx) => {
                            if (idx === currentSlide) {
                                dot.classList.add('active');
                            } else {
                                dot.classList.remove('active');
                            }
                        });

                        resetSlideShow();
                    }
                }
            }, 100);
        });
    }

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

    // "Ver Más" Button for TEXTOS section (3-stage toggle flow)
    const loadMoreTextos = document.getElementById('loadMoreTextos');
    if (loadMoreTextos) {
        loadMoreTextos.addEventListener('click', (e) => {
            e.preventDefault();
            const hiddenCards = document.querySelectorAll('.more-textos-card');
            const relatedCards = document.querySelectorAll('.related-textos-card');
            const currentText = loadMoreTextos.textContent.trim();

            if (currentText === 'Ver Más') {
                // Stage 1 -> 2: Show middle cards
                if (hiddenCards.length > 0) {
                    hiddenCards.forEach(card => {
                        card.style.display = 'flex';
                        card.style.opacity = '0';
                        card.style.transition = 'opacity 0.4s ease';
                        setTimeout(() => {
                            card.style.opacity = '1';
                        }, 10);
                    });
                }
                
                if (relatedCards.length > 0) {
                    loadMoreTextos.textContent = 'Ver Crónicas Relacionadas';
                } else {
                    loadMoreTextos.textContent = 'Ver Menos';
                }
                showToast("Mostrando más ensayos de TEXTOS");
            } else if (currentText === 'Ver Crónicas Relacionadas') {
                // Stage 2 -> 3: Show related cards
                if (relatedCards.length > 0) {
                    relatedCards.forEach(card => {
                        card.style.display = 'flex';
                        card.style.opacity = '0';
                        card.style.transition = 'opacity 0.4s ease';
                        setTimeout(() => {
                            card.style.opacity = '1';
                        }, 10);
                    });
                }
                loadMoreTextos.textContent = 'Cerrar Archivo';
                showToast("Abriendo crónicas relacionadas");
            } else {
                // Stage 3 -> 1: Collapse all and reset
                if (hiddenCards.length > 0) {
                    hiddenCards.forEach(card => {
                        card.style.display = 'none';
                        card.style.opacity = '0';
                    });
                }
                if (relatedCards.length > 0) {
                    relatedCards.forEach(card => {
                        card.style.display = 'none';
                        card.style.opacity = '0';
                    });
                }
                loadMoreTextos.textContent = 'Ver Más';
                showToast("Cerrando archivo de TEXTOS");
            }
        });
    }

    // Toggle the mini-section for related subhero chronicles
    const subheroMoreTrigger = document.getElementById('subheroMoreTrigger');
    const subheroMoreSection = document.getElementById('subheroMoreSection');

    if (subheroMoreTrigger && subheroMoreSection) {
        subheroMoreTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            const isHidden = subheroMoreSection.style.display === 'none';
            const textEl = subheroMoreTrigger.querySelector('span');

            if (isHidden) {
                subheroMoreSection.style.display = 'block';
                subheroMoreSection.style.opacity = '0';
                subheroMoreSection.style.transition = 'opacity 0.4s ease';
                setTimeout(() => {
                    subheroMoreSection.style.opacity = '1';
                    subheroMoreSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 10);
                subheroMoreTrigger.classList.add('active');
                if (textEl) textEl.textContent = 'Ocultar Crónicas';
                showToast("Abriendo archivo de crónicas");
            } else {
                subheroMoreSection.style.display = 'none';
                subheroMoreTrigger.classList.remove('active');
                if (textEl) textEl.textContent = 'Ver Crónicas Relacionadas';
                showToast("Cerrando archivo de crónicas");
            }
        });
    }

    // Attach to all love buttons
    const loveBtns = document.querySelectorAll('.love-btn');
    loveBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            requireAuth(() => {
                const articleData = extractCardData(btn);
                toggleFavorite(articleData);
            });
        });
    });


    // 3.5. READING PROGRESS BAR FOR ARTICLES (VERTICAL GAUGE WITH HANDLE & SECTION TICKS)
    const vertProgressBar = document.getElementById('verticalProgressBar');
    const vertProgressHandle = document.getElementById('verticalProgressHandle');
    const vertProgressTrack = document.querySelector('.vertical-progress-track');
    const vertProgressContainer = document.querySelector('.vertical-progress-container');

    if (vertProgressBar && vertProgressHandle && vertProgressTrack) {
        let tickData = [];
        let scrollTimeout;

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

                // Show progress bar on scroll and fade out after 2s of inactivity
                if (vertProgressContainer) {
                    vertProgressContainer.classList.add('visible');
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(() => {
                        vertProgressContainer.classList.remove('visible');
                    }, 2000);
                }
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


    // 4. ACTIVE READING TOOL (TEXT HIGHLIGHTS, ANNOTATIONS MODAL, CANVAS INSTAGRAM GENERATOR, COMMENTS)
    const selectionBar = document.getElementById('selectionBar');
    const btnHighlight = document.getElementById('btnHighlight');
    const btnAnnotate = document.getElementById('btnAnnotate');
    const annotationModal = document.getElementById('annotationModal');
    const closeAnnotationModal = document.getElementById('closeAnnotationModal');

    // Modal Form Elements
    const modalQuoteDisplay = document.getElementById('modalQuoteDisplay');
    const annotationAuthorInput = document.getElementById('annotationAuthorInput');
    const annotationTextInput = document.getElementById('annotationTextInput');

    // Preview Elements
    const igCardPreview = document.getElementById('igCardPreview');
    const previewQuoteText = document.getElementById('previewQuoteText');
    const previewNoteText = document.getElementById('previewNoteText');
    const previewAuthor = document.getElementById('previewAuthor');
    const themeDots = document.querySelectorAll('.theme-dot');

    // Action Buttons in Modal
    const btnSavePersonalNote = document.getElementById('btnSavePersonalNote');
    const btnPublishComment = document.getElementById('btnPublishComment');
    const btnDownloadIGCard = document.getElementById('btnDownloadIGCard');
    const instagramStoryCanvas = document.getElementById('instagramStoryCanvas');

    // Comments elements
    const commentsList = document.getElementById('commentsList');
    const commentsCountEl = document.getElementById('commentsCount');
    const directCommentAuthor = document.getElementById('directCommentAuthor');
    const directCommentText = document.getElementById('directCommentText');
    const btnSubmitDirectComment = document.getElementById('btnSubmitDirectComment');

    let currentSelectedText = "";
    let currentSelectedRange = null;
    let selectedTheme = "peach"; // default theme

    // Hide selection bar
    function hideSelectionBar() {
        if (selectionBar) {
            selectionBar.classList.remove('active');
        }
    }

    // Listening for text selection in the document
    if (selectionBar) {
        document.addEventListener('mouseup', handleTextSelection);
        document.addEventListener('touchend', handleTextSelection);

        // Hide selection bar if clicked elsewhere
        document.addEventListener('mousedown', (e) => {
            if (selectionBar.contains(e.target)) return;
            // If click is outside selection bar and not selecting text
            setTimeout(() => {
                const sel = window.getSelection();
                if (sel.isCollapsed) {
                    hideSelectionBar();
                }
            }, 100);
        });
    }

    function handleTextSelection() {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        const articleBody = document.querySelector('.article-body-container');

        if (!articleBody) return;

        // Ensure we selected something longer than 5 chars, and it's inside the article body
        if (selectedText.length > 5 && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);

            if (articleBody.contains(range.commonAncestorContainer)) {
                currentSelectedText = selectedText;
                currentSelectedRange = range.cloneRange();

                // Position selection bar above selection
                const rects = range.getClientRects();
                if (rects.length > 0) {
                    // Use the first rect to position the bar above it
                    const rect = rects[0];
                    const barWidth = 180; // approximate width of the bar

                    const clampedViewportLeft = Math.max(barWidth / 2 + 10, Math.min(window.innerWidth - barWidth / 2 - 10, rect.left + rect.width / 2));
                    selectionBar.style.left = `${clampedViewportLeft + window.scrollX}px`;
                    selectionBar.style.top = `${rect.top + window.scrollY - 10}px`;
                    selectionBar.classList.add('active');
                }
            } else {
                hideSelectionBar();
            }
        } else {
            // Only hide selection bar if user actually clicked elsewhere and cleared selection
            setTimeout(() => {
                if (window.getSelection().isCollapsed) {
                    hideSelectionBar();
                }
            }, 50);
        }
    }

    // Highlight text event
    if (btnHighlight) {
        btnHighlight.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!currentSelectedRange) return;

            highlightRange(currentSelectedRange, currentSelectedText);
            hideSelectionBar();
            window.getSelection().removeAllRanges();
            showToast("Texto resaltado y guardado en tu sesión.");
        });
    }

    // Wrap selection in a highlight span
    function highlightRange(range, text) {
        const span = document.createElement('span');
        span.className = 'article-highlight';
        span.title = "Cita destacada. Haz clic para anotar.";

        try {
            range.surroundContents(span);
        } catch (e) {
            // Fallback for complex cross-element selections
            const fragment = range.extractContents();
            span.appendChild(fragment);
            range.insertNode(span);
        }

        // Click to open annotation modal on an existing highlight
        span.addEventListener('click', (e) => {
            e.stopPropagation();
            openAnnotationModalWithText(text);
        });

        // Persistent save of highlighted text strings
        saveHighlightToLocalStorage(text);
    }

    function getHighlightsKey() {
        return window.location.pathname.includes('geopolitica.html') ? 'anfibia_highlights_geopolitica' : 'anfibia_highlights';
    }

    function saveHighlightToLocalStorage(text) {
        const key = getHighlightsKey();
        let saved = JSON.parse(localStorage.getItem(key) || '[]');
        if (!saved.includes(text)) {
            saved.push(text);
            localStorage.setItem(key, JSON.stringify(saved));
        }
    }

    // Restore highlights from localStorage on load
    function restoreHighlights() {
        const key = getHighlightsKey();
        const saved = JSON.parse(localStorage.getItem(key) || '[]');
        if (saved.length === 0) return;

        const paragraphs = document.querySelectorAll('.article-body-container p.article-paragraph, .article-body-container p.dialog-line');
        paragraphs.forEach(p => {
            let html = p.innerHTML;
            saved.forEach(text => {
                if (html.includes(text) && !html.includes(`class="article-highlight"`)) {
                    // Safe wrap to avoid messing up existing tags (works for raw text matches)
                    const escapedText = text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                    const regex = new RegExp(`(${escapedText})`, 'g');
                    html = html.replace(regex, `<span class="article-highlight" title="Cita destacada. Haz clic para anotar.">$1</span>`);
                }
            });
            p.innerHTML = html;
        });

        // Reattach click events to newly generated highlight spans
        document.querySelectorAll('.article-highlight').forEach(span => {
            span.addEventListener('click', (e) => {
                e.stopPropagation();
                openAnnotationModalWithText(span.textContent);
            });
        });
    }

    // Trigger Annotate from selection bar
    if (btnAnnotate) {
        btnAnnotate.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!currentSelectedText) return;

            openAnnotationModalWithText(currentSelectedText);
            hideSelectionBar();
            window.getSelection().removeAllRanges();
        });
    }

    function openAnnotationModalWithText(text) {
        currentSelectedText = text || "";

        // Populate fields
        if (modalQuoteDisplay) {
            if (currentSelectedText) {
                modalQuoteDisplay.textContent = `"${currentSelectedText}"`;
                modalQuoteDisplay.style.display = "block";
                const label = modalQuoteDisplay.previousElementSibling;
                if (label) label.style.display = "block";
            } else {
                modalQuoteDisplay.style.display = "none";
                const label = modalQuoteDisplay.previousElementSibling;
                if (label) label.style.display = "none";
            }
        }
        if (previewQuoteText) {
            const quoteIcon = document.querySelector('.ig-card-quotes');
            const divider = document.querySelector('.ig-card-divider');
            if (currentSelectedText) {
                previewQuoteText.textContent = currentSelectedText.length > 250 ? `“${currentSelectedText.substring(0, 247)}...”` : `“${currentSelectedText}”`;
                previewQuoteText.style.display = "block";
                if (quoteIcon) quoteIcon.style.display = "block";
                if (divider) divider.style.display = "block";
            } else {
                previewQuoteText.style.display = "none";
                if (quoteIcon) quoteIcon.style.display = "none";
                if (divider) divider.style.display = "none";
            }
        }
        if (annotationTextInput) {
            annotationTextInput.value = "";
        }
        if (previewNoteText) {
            previewNoteText.textContent = "Escribe tus pensamientos en el formulario para ver tu anotación aquí...";
        }

        // Restore saved author name
        const savedAuthor = localStorage.getItem('anfibia_author');
        if (savedAuthor && annotationAuthorInput) {
            annotationAuthorInput.value = savedAuthor;
            if (previewAuthor) previewAuthor.textContent = savedAuthor;
        }

        if (annotationModal) {
            annotationModal.classList.add('active');
        }
    }

    // Close Modal
    if (closeAnnotationModal) {
        closeAnnotationModal.addEventListener('click', () => {
            annotationModal.classList.remove('active');
        });
    }

    // Real-time Card Preview binding
    if (annotationAuthorInput) {
        annotationAuthorInput.addEventListener('input', () => {
            const authorVal = annotationAuthorInput.value.trim() || "Lector Anfibia";
            if (previewAuthor) {
                previewAuthor.textContent = authorVal;
            }
            localStorage.setItem('anfibia_author', authorVal);
        });
    }

    if (annotationTextInput) {
        annotationTextInput.addEventListener('input', () => {
            const noteVal = annotationTextInput.value.trim() || "Escribe tus pensamientos en el formulario para ver tu anotación aquí...";
            if (previewNoteText) {
                previewNoteText.textContent = noteVal;
            }
        });
    }

    // IG Theme selection
    themeDots.forEach(dot => {
        dot.addEventListener('click', () => {
            themeDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');

            selectedTheme = dot.getAttribute('data-theme');

            // Update preview card theme class
            if (igCardPreview) {
                igCardPreview.className = `ig-card-preview theme-${selectedTheme}`;
            }
        });
    });

    // Save Personal Note (Local storage only)
    if (btnSavePersonalNote) {
        btnSavePersonalNote.addEventListener('click', () => {
            const author = annotationAuthorInput.value.trim() || "Lector Anfibia";
            const note = annotationTextInput.value.trim();

            if (!note) {
                showToast("Por favor, redacta una nota antes de guardar.");
                return;
            }

            const personalNote = {
                id: Date.now(),
                quote: currentSelectedText,
                author: author,
                note: note,
                theme: selectedTheme,
                date: new Date().toLocaleDateString('es-ES')
            };

            const notesKey = window.location.pathname.includes('geopolitica.html') ? 'anfibia_personal_notes_geopolitica' : 'anfibia_personal_notes';
            let savedNotes = JSON.parse(localStorage.getItem(notesKey) || '[]');
            savedNotes.push(personalNote);
            localStorage.setItem(notesKey, JSON.stringify(savedNotes));

            // Also color text as highlighted
            if (currentSelectedRange) {
                highlightRange(currentSelectedRange, currentSelectedText);
            }

            annotationModal.classList.remove('active');
            showToast("¡Nota personal guardada con éxito en tu sesión!");
        });
    }

    // Post comment dynamically
    function addCommentToDOM(comment, animate = false) {
        if (!commentsList) return;

        const card = document.createElement('div');
        card.className = `comment-card ${comment.quote ? 'highlight-comment' : ''}`;
        if (animate) {
            card.style.opacity = 0;
            card.style.transform = 'translateY(15px)';
        }

        let innerHTML = "";

        if (comment.quote) {
            innerHTML += `
                <div class="comment-badge"><i class="fas fa-highlighter"></i> CITA DESTACADA</div>
                <blockquote class="comment-blockquote">
                    "${comment.quote}"
                </blockquote>
            `;
        }

        innerHTML += `
            <div class="comment-header-meta">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-date">${comment.date}</span>
            </div>
            <div class="comment-body">
                ${comment.body}
            </div>
        `;

        card.innerHTML = innerHTML;
        commentsList.appendChild(card);

        if (animate) {
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = 1;
                card.style.transform = 'translateY(0)';
            }, 50);
        }

        updateCommentsCount();
    }

    function updateCommentsCount() {
        if (!commentsCountEl || !commentsList) return;
        const total = commentsList.querySelectorAll('.comment-card').length;
        commentsCountEl.textContent = `${total} comentario${total === 1 ? '' : 's'}`;
    }

    function getCommentsKey() {
        return window.location.pathname.includes('geopolitica.html') ? 'anfibia_comments_geopolitica' : 'anfibia_comments';
    }

    // Publish Annotation as Comment
    if (btnPublishComment) {
        btnPublishComment.addEventListener('click', () => {
            requireAuth(() => {
                const author = annotationAuthorInput.value.trim() || "Lector Anónimo";
                const note = annotationTextInput.value.trim();

                if (!note) {
                    showToast("Por favor, escribe una anotación antes de comentar.");
                    return;
                }

                const newComment = {
                    id: Date.now(),
                    author: author,
                    date: 'Hace un momento',
                    body: note,
                    quote: currentSelectedText
                };

                // Save to localStorage for persistence
                const commentsKey = getCommentsKey();
                let localComments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
                localComments.push(newComment);
                localStorage.setItem(commentsKey, JSON.stringify(localComments));

                // Append to DOM
                addCommentToDOM(newComment, true);

                // If selected text was fresh selection, apply highlight
                if (currentSelectedRange) {
                    highlightRange(currentSelectedRange, currentSelectedText);
                }

                // Close modal & scroll to comments
                annotationModal.classList.remove('active');
                showToast("¡Anotación publicada como comentario!");

                setTimeout(() => {
                    const commentSec = document.querySelector('.comments-section-container');
                    if (commentSec) {
                        commentSec.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 400);
            });
        });
    }

    // Submit direct comment
    if (btnSubmitDirectComment && directCommentText) {
        btnSubmitDirectComment.addEventListener('click', (e) => {
            e.preventDefault();
            requireAuth(() => {
                const author = (directCommentAuthor && directCommentAuthor.value.trim()) || "Lector Anónimo";
                const body = directCommentText.value.trim();

                if (!body) {
                    showToast("Por favor, escribe un mensaje para comentar.");
                    return;
                }

                const newComment = {
                    id: Date.now(),
                    author: author,
                    date: 'Hace un momento',
                    body: body,
                    quote: null
                };

                // Save to localStorage
                const commentsKey = getCommentsKey();
                let localComments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
                localComments.push(newComment);
                localStorage.setItem(commentsKey, JSON.stringify(localComments));

                // Append to DOM
                addCommentToDOM(newComment, true);

                // Clear inputs
                directCommentText.value = "";
                if (directCommentAuthor) directCommentAuthor.value = "";

                showToast("¡Comentario enviado con éxito!");
            });
        });
    }

    // Load persistent comments
    function loadSavedComments() {
        const localComments = JSON.parse(localStorage.getItem(getCommentsKey()) || '[]');
        localComments.forEach(comment => {
            addCommentToDOM(comment);
        });
        updateCommentsCount();
    }

    // Draw and download beautiful 9:16 Instagram Story card
    if (btnDownloadIGCard && instagramStoryCanvas) {
        btnDownloadIGCard.addEventListener('click', () => {
            requireAuth(() => {
                const author = annotationAuthorInput.value.trim() || "Lector Anfibia";
                const note = annotationTextInput.value.trim() || "Notas de lectura en Revista Anfibia";
                const quote = currentSelectedText || "Fragmento de la crónica";

                const ctx = instagramStoryCanvas.getContext('2d');
                const width = 1080;
                const height = 1920;

                // 1. Draw Theme Background Gradient
                const gradient = ctx.createLinearGradient(0, 0, 0, height);
                if (selectedTheme === "peach") {
                    gradient.addColorStop(0, '#f15a24');
                    gradient.addColorStop(0.5, '#ff7543');
                    gradient.addColorStop(1, '#072113');
                } else if (selectedTheme === "forest") {
                    gradient.addColorStop(0, '#072113');
                    gradient.addColorStop(0.6, '#17422c');
                    gradient.addColorStop(1, '#08100b');
                } else { // dark
                    gradient.addColorStop(0, '#151515');
                    gradient.addColorStop(0.5, '#2a2a2a');
                    gradient.addColorStop(1, '#050505');
                }
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);

                // 2. Draw Subtle Graphic Accents
                // Draw Anfibia Header Watermark
                ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
                ctx.font = '800 80px "Bebas Neue", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('REVISTA ANFIBIA', width / 2, 230);

                // Word wrap helper inside canvas
                function wrapTextCanvas(context, text, x, y, maxWidth, lineHeight) {
                    const words = text.split(' ');
                    let line = '';
                    let currentY = y;
                    for (let n = 0; n < words.length; n++) {
                        let testLine = line + words[n] + ' ';
                        let metrics = context.measureText(testLine);
                        let testWidth = metrics.width;
                        if (testWidth > maxWidth && n > 0) {
                            context.fillText(line, x, currentY);
                            line = words[n] + ' ';
                            currentY += lineHeight;
                        } else {
                            line = testLine;
                        }
                    }
                    context.fillText(line, x, currentY);
                    return currentY + lineHeight;
                }

                let nextY = 520;

                if (quote && quote.trim() !== "") {
                    // Draw Quotes Graphic
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
                    ctx.font = 'italic 180px "Lora", Georgia, serif';
                    ctx.textAlign = 'left';
                    ctx.fillText('“', 120, 470);

                    // 3. Draw Selected Quote Text
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                    ctx.font = 'italic 44px "Lora", Georgia, serif';
                    ctx.textAlign = 'left';

                    // Truncate quote if too long to prevent overflowing
                    let truncatedQuote = quote;
                    if (truncatedQuote.length > 280) {
                        truncatedQuote = truncatedQuote.substring(0, 275) + '...';
                    }

                    nextY = wrapTextCanvas(ctx, `"${truncatedQuote}"`, 120, 520, 840, 68);

                    // 4. Draw Divider Line
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(120, nextY + 30);
                    ctx.lineTo(240, nextY + 30);
                    ctx.stroke();

                    nextY = nextY + 130;
                }

                // 5. Draw User's Personal Note
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.font = '500 38px "Montserrat", sans-serif';
                ctx.textAlign = 'left';
                wrapTextCanvas(ctx, note, 120, nextY, 840, 58);

                // 6. Draw Footer Branding & Credits
                // Divider above footer
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(120, 1690);
                ctx.lineTo(960, 1690);
                ctx.stroke();

                // Footer Text
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.font = '700 28px "Montserrat", sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(author.toUpperCase(), 120, 1755);

                ctx.textAlign = 'right';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fillText('REVISTAANFIBIA.ORG', 960, 1755);

                // 7. Trigger Direct Image Download
                try {
                    const dataURL = instagramStoryCanvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.download = `anfibia-lectura-${Date.now()}.png`;
                    link.href = dataURL;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    showToast("¡Historia de Instagram descargada! Súbela a tus Stories.");
                } catch (err) {
                    console.error("Canvas export failed:", err);
                    showToast("Error al exportar la imagen. Inténtalo de nuevo.");
                }
            });
        });
    }

    // Initialize Active Reading features
    restoreHighlights();
    loadSavedComments();

    // 4.5. BOTTOM-RIGHT FLOATING BUTTONS CONTROLLER
    const floatLoveBtn = document.getElementById('floatLoveBtn');
    const floatShareBtn = document.getElementById('floatShareBtn');
    const floatAnnotateBtn = document.getElementById('floatAnnotateBtn');

    if (floatLoveBtn) {
        floatLoveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            requireAuth(() => {
                const articleData = extractActivePageData();
                toggleFavorite(articleData);
            });
        });
    }

    if (floatShareBtn) {
        floatShareBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast("Enlace de la crónica copiado al portapapeles.");
            }).catch(() => {
                showToast("No se pudo copiar el enlace.");
            });
        });
    }


    // 5. MOBILE MENU DRAWER LOGIC
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
    const menuBackdrop = document.getElementById('menuBackdrop');

    if (menuToggle && mobileMenuDrawer && menuBackdrop) {
        // Toggle drawer open/close
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuDrawer.classList.toggle('active');
            menuBackdrop.classList.toggle('active');
            
            if (mobileMenuDrawer.classList.contains('active')) {
                document.body.style.overflow = 'hidden'; // prevent page scroll
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close drawer (clicking backdrop)
        menuBackdrop.addEventListener('click', () => {
            mobileMenuDrawer.classList.remove('active');
            menuBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close drawer (Escape key)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenuDrawer.classList.contains('active')) {
                mobileMenuDrawer.classList.remove('active');
                menuBackdrop.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Mobile Dropdown Accordion Toggle
        const dropdownToggles = mobileMenuDrawer.querySelectorAll('.mobile-dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const parent = toggle.closest('.mobile-nav-item-dropdown');
                if (parent) {
                    // Close other dropdowns (accordion style)
                    mobileMenuDrawer.querySelectorAll('.mobile-nav-item-dropdown').forEach(item => {
                        if (item !== parent) {
                            item.classList.remove('open');
                        }
                    });
                    
                    parent.classList.toggle('open');
                }
            });
        });
    }


    // ==========================================================================
    // 7. USER AUTHENTICATION & RESTRICTIONS SYSTEM
    // ==========================================================================
    
    let pendingAction = null;

    // DOM Elements for Auth
    const authModal = document.getElementById('authModal');
    const closeAuthModalLogin = document.getElementById('closeAuthModalLogin');
    const closeAuthModalRegister = document.getElementById('closeAuthModalRegister');
    const btnGoToRegister = document.getElementById('btnGoToRegister');
    const btnGoToLogin = document.getElementById('btnGoToLogin');
    
    const btnSubmitLogin = document.getElementById('btnSubmitLogin');
    const btnSubmitRegister = document.getElementById('btnSubmitRegister');
    const btnStartSession = document.getElementById('btnStartSession');
    const btnStartRegister = document.getElementById('btnStartRegister');
    
    const authLoginUser = document.getElementById('authLoginUser');
    const authLoginPassword = document.getElementById('authLoginPassword');
    const authRegisterUsername = document.getElementById('authRegisterUsername');
    const authRegisterEmail = document.getElementById('authRegisterEmail');
    const authRegisterPassword = document.getElementById('authRegisterPassword');

    const authPanels = {
        login: document.getElementById('authPanelLogin'),
        register: document.getElementById('authPanelRegister'),
        loginSuccess: document.getElementById('authPanelLoginSuccess'),
        registerSuccess: document.getElementById('authPanelRegisterSuccess')
    };

    function openAuthModal(panelName = 'login') {
        if (!authModal) return;
        authModal.classList.add('active');
        
        // Hide all panels, show the requested one
        Object.keys(authPanels).forEach(key => {
            if (authPanels[key]) {
                if (key === panelName) {
                    authPanels[key].classList.add('active');
                } else {
                    authPanels[key].classList.remove('active');
                }
            }
        });
    }

    function closeAuthModal() {
        if (!authModal) return;
        authModal.classList.remove('active');
        // Reset forms
        if (authLoginUser) authLoginUser.value = "";
        if (authLoginPassword) authLoginPassword.value = "";
        if (authRegisterUsername) authRegisterUsername.value = "";
        if (authRegisterEmail) authRegisterEmail.value = "";
        if (authRegisterPassword) authRegisterPassword.value = "";
    }

    // Bind Close Buttons
    if (closeAuthModalLogin) closeAuthModalLogin.addEventListener('click', closeAuthModal);
    if (closeAuthModalRegister) closeAuthModalRegister.addEventListener('click', closeAuthModal);
    
    // Toggle between login and register
    if (btnGoToRegister) {
        btnGoToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthModal('register');
        });
    }
    if (btnGoToLogin) {
        btnGoToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthModal('login');
        });
    }

    // Simulated Authentication Logic
    function isUserLoggedIn() {
        return localStorage.getItem('anfibia_logged_in') === 'true';
    }

    function requireAuth(actionCallback) {
        if (isUserLoggedIn()) {
            actionCallback();
        } else {
            pendingAction = actionCallback;
            openAuthModal('login');
        }
    }

    // Submit Login Form
    if (btnSubmitLogin) {
        btnSubmitLogin.addEventListener('click', (e) => {
            e.preventDefault();
            const userVal = authLoginUser.value.trim();
            const passVal = authLoginPassword.value.trim();
            
            if (!userVal || !passVal) {
                showToast("Por favor complete todos los campos.");
                return;
            }
            if (passVal.length < 4) {
                showToast("La contraseña debe tener al menos 4 caracteres.");
                return;
            }

            // Simulate successful login
            localStorage.setItem('anfibia_logged_in', 'true');
            localStorage.setItem('anfibia_username', userVal.split('@')[0]);
            updateAccountUI();
            openAuthModal('loginSuccess');
        });
    }

    // Submit Register Form
    if (btnSubmitRegister) {
        btnSubmitRegister.addEventListener('click', (e) => {
            e.preventDefault();
            const userVal = authRegisterUsername.value.trim();
            const emailVal = authRegisterEmail.value.trim();
            const passVal = authRegisterPassword.value.trim();
            
            if (!userVal || !emailVal || !passVal) {
                showToast("Por favor complete todos los campos.");
                return;
            }
            if (!emailVal.includes('@')) {
                showToast("Ingrese un correo electrónico válido.");
                return;
            }
            if (passVal.length < 4) {
                showToast("La contraseña debe tener al menos 4 caracteres.");
                return;
            }

            // Simulate successful registration
            localStorage.setItem('anfibia_logged_in', 'true');
            localStorage.setItem('anfibia_username', userVal);
            updateAccountUI();
            openAuthModal('registerSuccess');
        });
    }

    // Comenzar buttons
    function handleComenzar() {
        closeAuthModal();
        syncAllFavoriteButtons(); // Sync UI after login/register
        
        // History updates after login
        if (typeof renderHistoryList === 'function') renderHistoryList();
        if (typeof renderContinueReading === 'function') renderContinueReading();
        if (typeof renderHomeHistory === 'function') renderHomeHistory();
        if (typeof checkAndRestoreScroll === 'function') checkAndRestoreScroll();

        if (pendingAction) {
            const actionToRun = pendingAction;
            pendingAction = null;
            setTimeout(actionToRun, 300);
        }
    }

    if (btnStartSession) btnStartSession.addEventListener('click', handleComenzar);
    if (btnStartRegister) btnStartRegister.addEventListener('click', handleComenzar);

    // Update Account UI text dynamically
    function updateAccountUI() {
        const desktopAccountLinks = document.querySelectorAll('.nav-item-account');
        const mobileAccountLinks = document.querySelectorAll('.mobile-account-btn');
        const isLoggedIn = isUserLoggedIn();
        const username = localStorage.getItem('anfibia_username') || "Usuario";
        
        desktopAccountLinks.forEach(link => {
            if (isLoggedIn) {
                link.innerHTML = `<i class="far fa-user-circle"></i> Hola, ${username}`;
            } else {
                link.innerHTML = `<i class="far fa-user-circle"></i> Tu Cuenta`;
            }
        });

        mobileAccountLinks.forEach(link => {
            if (isLoggedIn) {
                const textSpan = link.querySelector('span');
                if (textSpan) textSpan.textContent = `Hola, ${username.toUpperCase()}`;
            } else {
                const textSpan = link.querySelector('span');
                if (textSpan) textSpan.textContent = "Tu Cuenta Anfibia";
            }
        });
    }

    // ==========================================================================
    // 8. FAVORITES DRAWER & SYNC CONTROLLER
    // ==========================================================================
    const favoritesDrawerOverlay = document.getElementById('favoritesDrawerOverlay');
    const closeFavoritesDrawer = document.getElementById('closeFavoritesDrawer');
    const favoritesList = document.getElementById('favoritesList');

    function openFavoritesDrawer() {
        if (!favoritesDrawerOverlay) return;
        renderFavoritesList();
        favoritesDrawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeFavoritesDrawerFunc() {
        if (!favoritesDrawerOverlay) return;
        favoritesDrawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeFavoritesDrawer) {
        closeFavoritesDrawer.addEventListener('click', closeFavoritesDrawerFunc);
    }

    if (favoritesDrawerOverlay) {
        favoritesDrawerOverlay.addEventListener('click', (e) => {
            if (e.target === favoritesDrawerOverlay) {
                closeFavoritesDrawerFunc();
            }
        });
    }

    function getFavoritesKey() {
        const username = localStorage.getItem('anfibia_username') || 'global';
        return `anfibia_favorites_${username}`;
    }

    function getFavorites() {
        if (localStorage.getItem('anfibia_logged_in') !== 'true') return [];
        return JSON.parse(localStorage.getItem(getFavoritesKey()) || '[]');
    }

    function saveFavorites(favorites) {
        localStorage.setItem(getFavoritesKey(), JSON.stringify(favorites));
    }

    function extractCardData(btn) {
        const card = btn.closest('.anfibia-card, .compact-card, .grid-card, .subhero-card, .community-fav-card');
        if (!card) return null;

        if (card.classList.contains('community-fav-card')) {
            const titleEl = card.querySelector('.community-fav-title a');
            const title = titleEl ? titleEl.textContent.trim() : "Artículo";
            const url = titleEl ? titleEl.getAttribute('href') : "#";
            
            const imgEl = card.querySelector('.community-fav-img-wrapper img');
            const image = imgEl ? imgEl.getAttribute('src') : "";

            const kickerEl = card.querySelector('.community-fav-kicker');
            const kicker = kickerEl ? kickerEl.textContent.trim() : "";

            const badge = "CRÓNICA";

            const authorEl = card.querySelector('.community-fav-author');
            let author = "";
            if (authorEl) {
                author = authorEl.textContent.replace(/Por:\s*/i, '').trim();
            }

            const id = card.getAttribute('data-article-id') || (url && url !== '#' ? url.replace('.html', '') : title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

            return { id, title, kicker, url, image, badge, author };
        }

        const titleEl = card.querySelector('.card-headline a, .card-title a, .compact-title a, .subhero-card-title a');
        const title = titleEl ? titleEl.textContent.trim() : "Artículo";
        const url = titleEl ? titleEl.getAttribute('href') : "#";
        
        const imgEl = card.querySelector('.card-image, .subhero-card-img, img');
        const image = imgEl ? imgEl.getAttribute('src') : "";

        const kickerEl = card.querySelector('.card-kicker, .subhero-card-kicker');
        const kicker = kickerEl ? kickerEl.textContent.trim() : "";

        const badgeEl = card.querySelector('.card-badge-flush');
        const badge = badgeEl ? badgeEl.textContent.trim() : (card.querySelector('.badge-ensayo') ? "ENSAYO" : "CRÓNICA");

        const creditsEl = card.querySelector('.card-credits, .subhero-card-credits');
        let author = "";
        if (creditsEl) {
            const authorEl = creditsEl.querySelector('.credit-author, .credit-author-white');
            if (authorEl) {
                author = authorEl.textContent.trim();
            } else {
                const match = creditsEl.textContent.match(/Por:\s*([^|]+)/i);
                author = match ? match[1].trim() : creditsEl.textContent.trim();
            }
        }
        
        const id = url && url !== '#' ? url.replace('.html', '') : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        return { id, title, kicker, url, image, badge, author };
    }

    function extractActivePageData() {
        const titleEl = document.querySelector('.article-main-title');
        if (!titleEl) return null;

        const title = titleEl.textContent.trim();
        const url = window.location.pathname.split('/').pop() || "index.html";
        
        const imgEl = document.querySelector('.article-featured-image');
        const image = imgEl ? imgEl.getAttribute('src') : "";

        const kickerEl = document.querySelector('.article-kicker');
        const kicker = kickerEl ? kickerEl.textContent.trim() : "";

        const badgeEl = document.querySelector('.article-badge');
        const badge = badgeEl ? badgeEl.textContent.trim() : "ARTÍCULO";

        const authorEl = document.querySelector('.article-credits-centered .credit-name');
        const author = authorEl ? authorEl.textContent.trim() : "";

        const id = url.replace('.html', '');

        return { id, title, kicker, url, image, badge, author };
    }

    function toggleFavorite(articleData) {
        if (!articleData) return;
        
        let favorites = getFavorites();
        const index = favorites.findIndex(item => item.id === articleData.id);
        
        if (index === -1) {
            favorites.push(articleData);
            saveFavorites(favorites);
            showToast(`Agregado a favoritos: "${articleData.title}"`);
        } else {
            favorites.splice(index, 1);
            saveFavorites(favorites);
            showToast(`Eliminado de favoritos: "${articleData.title}"`);
        }
        
        syncAllFavoriteButtons();
        if (favoritesDrawerOverlay && favoritesDrawerOverlay.classList.contains('active')) {
            renderFavoritesList();
        }
    }

    function syncAllFavoriteButtons() {
        const loggedIn = isUserLoggedIn();
        const favorites = getFavorites();
        const favIds = favorites.map(item => item.id);
        
        // Sync normal card love buttons
        const loveBtns = document.querySelectorAll('.love-btn:not(.community-fav-card .love-btn)');
        loveBtns.forEach(btn => {
            const data = extractCardData(btn);
            const icon = btn.querySelector('i');
            if (!loggedIn || !data || !favIds.includes(data.id)) {
                btn.classList.remove('loved');
                if (icon) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                }
            } else {
                btn.classList.add('loved');
                if (icon) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                }
            }
        });

        // Sync community favorites counts and buttons
        const communityFavCards = document.querySelectorAll('.community-fav-card');
        communityFavCards.forEach(card => {
            const id = card.getAttribute('data-article-id');
            const countEl = card.querySelector('.fav-count');
            const btn = card.querySelector('.love-btn');
            const icon = btn.querySelector('i');
            
            let baseCount = 0;
            if (id === 'patagonia') baseCount = 2154;
            else if (id === 'geopolitica') baseCount = 1421;
            else if (id === 'con-el-indio-se-murio-mi-juventud') baseCount = 892;
            
            if (loggedIn && favIds.includes(id)) {
                if (countEl) countEl.textContent = (baseCount + 1).toLocaleString('es-ES');
                btn.classList.add('loved');
                if (icon) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                }
            } else {
                if (countEl) countEl.textContent = baseCount.toLocaleString('es-ES');
                btn.classList.remove('loved');
                if (icon) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                }
            }
        });
        
        const floatLoveBtn = document.getElementById('floatLoveBtn');
        if (floatLoveBtn) {
            const data = extractActivePageData();
            const icon = floatLoveBtn.querySelector('i');
            if (!loggedIn || !data || !favIds.includes(data.id)) {
                floatLoveBtn.classList.remove('active');
                if (icon) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                }
            } else {
                floatLoveBtn.classList.add('active');
                if (icon) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                }
            }
        }
    }

    // ==========================================================================
    // 9. COMMUNITY ANNOTATIONS & POPOVER CONTROLLER
    // ==========================================================================
    function openCommunityPopover(el, author, note) {
        let popover = document.getElementById('communityPopover');
        if (!popover) {
            popover = document.createElement('div');
            popover.className = 'community-popover';
            popover.id = 'communityPopover';
            popover.innerHTML = `
                <div class="popover-header">
                    <span class="popover-author"></span>
                    <button class="popover-close">&times;</button>
                </div>
                <div class="popover-body"></div>
            `;
            document.body.appendChild(popover);
            
            popover.querySelector('.popover-close').addEventListener('click', () => {
                popover.classList.remove('active');
            });
        }
        
        const authorText = author ? `${author} resaltó esto` : "Un lector resaltó esto";
        popover.querySelector('.popover-author').innerHTML = `<i class="fas fa-highlighter"></i> ${authorText}`;
        
        const bodyEl = popover.querySelector('.popover-body');
        if (note) {
            bodyEl.textContent = `"${note}"`;
            bodyEl.style.display = 'block';
        } else {
            bodyEl.style.display = 'none';
        }
        
        const rect = el.getBoundingClientRect();
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
        
        popover.style.left = `${rect.left + rect.width / 2 + scrollX}px`;
        popover.style.top = `${rect.top + scrollY - 10}px`;
        
        popover.classList.add('active');
    }

    // Attach hover listeners to community highlights and assign color themes (peach, purple, teal)
    const commHighlights = document.querySelectorAll('.community-highlight');
    const themes = ['theme-peach', 'theme-purple', 'theme-teal'];
    let hoverTimeout = null;

    commHighlights.forEach((el, index) => {
        el.setAttribute('data-index', index);
        
        // Dynamically add color theme class based on index
        const theme = themes[index % themes.length];
        el.classList.add(theme);
        
        // Show tooltip on hover (mouseenter)
        el.addEventListener('mouseenter', (e) => {
            if (!document.body.classList.contains('show-highlights')) return;
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
                hoverTimeout = null;
            }
            const author = el.getAttribute('data-author') || "";
            const note = el.getAttribute('data-note') || "";
            openCommunityPopover(el, author, note);
        });

        // Hide tooltip when mouse leaves the highlighted span (mouseleave)
        el.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => {
                const popover = document.getElementById('communityPopover');
                if (popover) {
                    popover.classList.remove('active');
                }
            }, 300); // 300ms delay to prevent flickering and allow user to hover over tooltip itself
        });
    });

    // Keep popover open if user hovers directly over the popover container
    document.addEventListener('mouseover', (e) => {
        const popover = document.getElementById('communityPopover');
        if (popover && popover.contains(e.target)) {
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
                hoverTimeout = null;
            }
        }
    });

    // Close popover when mouse leaves the popover container
    document.addEventListener('mouseout', (e) => {
        const popover = document.getElementById('communityPopover');
        if (popover && popover.contains(e.target)) {
            const related = e.relatedTarget;
            if (!related || (!popover.contains(related) && !related.closest('.community-highlight'))) {
                hoverTimeout = setTimeout(() => {
                    popover.classList.remove('active');
                }, 300);
            }
        }
    });

    // Close community popover when clicking elsewhere (fallback support)
    document.addEventListener('mousedown', (e) => {
        const popover = document.getElementById('communityPopover');
        if (popover && !popover.contains(e.target) && !e.target.closest('.community-highlight')) {
            popover.classList.remove('active');
        }
    });

    function initializeHighlightsToggle() {
        const floatAnnotateBtn = document.getElementById('floatAnnotateBtn');
        if (!floatAnnotateBtn) return;

        // Enable community highlights by default on load
        document.body.classList.add('show-highlights');
        floatAnnotateBtn.classList.add('active');

        floatAnnotateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isShowing = document.body.classList.toggle('show-highlights');
            floatAnnotateBtn.classList.toggle('active', isShowing);

            if (isShowing) {
                showToast("Destacados de la comunidad visibles");
            } else {
                showToast("Destacados ocultos (Lectura Limpia)");
                // Force close popover if active
                const popover = document.getElementById('communityPopover');
                if (popover) {
                    popover.classList.remove('active');
                }
            }
        });
    }

    function initializeReadingGuideToggle() {
        const guideToggleBtn = document.getElementById('activeReadingGuideToggle');
        const guideContainer = document.getElementById('activeReadingGuide');
        
        if (guideToggleBtn && guideContainer) {
            guideToggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isExpanded = guideContainer.classList.toggle('expanded');
                guideToggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            });
        }
    }

    function renderFavoritesList() {
        if (!favoritesList) return;
        
        const favorites = getFavorites();
        
        if (favorites.length === 0) {
            favoritesList.innerHTML = `
                <div class="favorites-empty-state">
                    <i class="far fa-heart"></i>
                    <p>No tienes artículos guardados en favoritos.</p>
                    <span style="font-size: 0.75rem; opacity: 0.7; text-align: center;">¡Explora nuestras crónicas y agrégalas!</span>
                </div>
            `;
            return;
        }
        
        let html = '';
        favorites.forEach(item => {
            const displayUrl = item.url && item.url !== '#' ? item.url : '#';
            const displayImg = item.image || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=150';
            
            html += `
                <div class="favorite-item-card" data-id="${item.id}">
                    <div class="favorite-item-img-container">
                        <img src="${displayImg}" alt="${item.title}" class="favorite-item-img">
                    </div>
                    <div class="favorite-item-info">
                        <div class="favorite-item-top">
                            <span class="favorite-item-kicker">${item.kicker || item.badge || 'Artículo'}</span>
                            <h4 class="favorite-item-title"><a href="${displayUrl}">${item.title}</a></h4>
                        </div>
                        <div class="favorite-item-footer">
                            <span class="favorite-item-author">${item.author ? 'Por ' + item.author : ''}</span>
                            <button class="favorite-remove-btn" data-id="${item.id}" title="Eliminar de favoritos">
                                <i class="fas fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        favoritesList.innerHTML = html;
        
        const removeBtns = favoritesList.querySelectorAll('.favorite-remove-btn');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                const favorites = getFavorites();
                const article = favorites.find(item => item.id === id);
                if (article) {
                    toggleFavorite(article);
                }
            });
        });
    }

    // Intercept Account clicks (Logout option if logged in)
    const allAccountLinks = document.querySelectorAll('.nav-item-account, .mobile-account-btn');
    allAccountLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isUserLoggedIn()) {
                if (confirm("¿Deseas cerrar tu sesión de Revista Anfibia?")) {
                    localStorage.removeItem('anfibia_logged_in');
                    localStorage.removeItem('anfibia_username');
                    updateAccountUI();
                    syncAllFavoriteButtons();
                    closeFavoritesDrawerFunc();
                    
                    // History resets on logout
                    closeHistoryDrawerFunc();
                    if (continueReadingSection) continueReadingSection.style.display = 'none';
                    const homeHistorySection = document.getElementById('homeHistorySection');
                    if (homeHistorySection) homeHistorySection.style.display = 'none';
                    const scrollRestoreToast = document.getElementById('scrollRestoreToast');
                    if (scrollRestoreToast) scrollRestoreToast.classList.remove('active');
                    
                    showToast("Sesión cerrada correctamente.");
                }
            } else {
                openAuthModal('login');
            }
        });
    });

    // Intercept Favoritos and Historial links
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        const text = link.textContent.trim().toLowerCase();
        if (text === 'favoritos' || text === '.favoritos' || text === 'favoritos/guardados' || text === 'historial' || text === '.historial') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                requireAuth(() => {
                    if (text.includes('favoritos')) {
                        openFavoritesDrawer();
                    } else {
                        openHistoryDrawer();
                    }
                });
            });
        }
    });

    // ==========================================================================
    // 10. READING HISTORY & CONTINUE READING CONTROLLER
    // ==========================================================================
    const historyDrawerOverlay = document.getElementById('historyDrawerOverlay');
    const closeHistoryDrawer = document.getElementById('closeHistoryDrawer');
    const historyList = document.getElementById('historyList');
    const btnClearAllHistory = document.getElementById('btnClearAllHistory');
    const continueReadingSection = document.getElementById('continueReadingSection');
    const continueReadingGrid = document.getElementById('continueReadingGrid');

    function openHistoryDrawer() {
        if (!historyDrawerOverlay) return;
        renderHistoryList();
        historyDrawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeHistoryDrawerFunc() {
        if (!historyDrawerOverlay) return;
        historyDrawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeHistoryDrawer) {
        closeHistoryDrawer.addEventListener('click', closeHistoryDrawerFunc);
    }

    if (historyDrawerOverlay) {
        historyDrawerOverlay.addEventListener('click', (e) => {
            if (e.target === historyDrawerOverlay) {
                closeHistoryDrawerFunc();
            }
        });
    }

    if (btnClearAllHistory) {
        btnClearAllHistory.addEventListener('click', () => {
            if (confirm("¿Estás seguro de que deseas limpiar todo tu historial de lectura?")) {
                clearAllHistory();
                showToast("Historial limpio.");
                renderHistoryList();
                renderContinueReading();
                renderHomeHistory();
            }
        });
    }

    function getHistoryKey() {
        const username = localStorage.getItem('anfibia_username') || 'global';
        return `anfibia_history_${username}`;
    }

    function getHistory() {
        if (localStorage.getItem('anfibia_logged_in') !== 'true') return [];
        return JSON.parse(localStorage.getItem(getHistoryKey()) || '[]');
    }

    function saveHistoryItem(articleData, progress, scrollY) {
        if (localStorage.getItem('anfibia_logged_in') !== 'true') return;
        let history = getHistory();
        history = history.filter(item => item.id !== articleData.id);
        
        history.unshift({
            ...articleData,
            progress: Math.round(progress),
            scrollY: scrollY,
            lastRead: new Date().toISOString()
        });

        if (history.length > 20) {
            history = history.slice(0, 20);
        }

        localStorage.setItem(getHistoryKey(), JSON.stringify(history));
    }

    function removeHistoryItem(id) {
        if (localStorage.getItem('anfibia_logged_in') !== 'true') return;
        let history = getHistory();
        history = history.filter(item => item.id !== id);
        localStorage.setItem(getHistoryKey(), JSON.stringify(history));
    }

    function clearAllHistory() {
        if (localStorage.getItem('anfibia_logged_in') !== 'true') return;
        localStorage.removeItem(getHistoryKey());
    }

    function getCurrentArticleData() {
        const container = document.querySelector('.article-header-section');
        if (!container) return null;

        const titleEl = container.querySelector('.article-main-title');
        const title = titleEl ? titleEl.textContent.trim() : "";

        const kickerEl = container.querySelector('.article-kicker');
        const kicker = kickerEl ? kickerEl.textContent.trim() : "";

        const badgeEl = container.querySelector('.article-badge');
        const badge = badgeEl ? badgeEl.textContent.trim() : "";

        const imgEl = container.querySelector('.article-featured-image');
        const image = imgEl ? imgEl.getAttribute('src') : "";

        const path = window.location.pathname.split('/').pop() || "index.html";
        const url = path.includes('.html') ? path : path + '.html';

        const authorEl = container.querySelector('.credit-name');
        const author = authorEl ? authorEl.textContent.trim() : "";

        const id = url.replace('.html', '');

        return { id, title, kicker, url, image, badge, author };
    }

    function renderHistoryList() {
        if (!historyList) return;
        
        const history = getHistory();
        
        if (history.length === 0) {
            historyList.innerHTML = `
                <div class="history-empty-state">
                    <i class="far fa-clock"></i>
                    <p>No tienes artículos en tu historial de lectura.</p>
                    <span style="font-size: 0.75rem; opacity: 0.7; text-align: center;">¡Tus artículos comenzados aparecerán aquí!</span>
                </div>
            `;
            return;
        }
        
        let html = '';
        history.forEach(item => {
            const displayUrl = item.url && item.url !== '#' ? item.url : '#';
            const displayImg = item.image || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=150';
            
            let progressText = `${item.progress}% leído`;
            if (item.progress >= 95) {
                progressText = '<span style="color: #4cd2ff; font-weight: bold;"><i class="fas fa-check-circle"></i> Completado</span>';
            }
            
            html += `
                <div class="history-item-card" data-id="${item.id}">
                    <div class="history-item-img-container">
                        <img src="${displayImg}" alt="${item.title}" class="history-item-img">
                    </div>
                    <div class="history-item-info">
                        <div class="history-item-top">
                            <span class="history-item-kicker">${item.kicker || item.badge || 'Artículo'}</span>
                            <h4 class="history-item-title"><a href="${displayUrl}">${item.title}</a></h4>
                        </div>
                        <div class="reading-progress-container">
                            <div class="progress-label-row">
                                <span>Progreso</span>
                                <span class="progress-pct-value">${progressText}</span>
                            </div>
                            <div class="progress-bar-track">
                                <div class="progress-bar-fill" style="width: ${item.progress}%"></div>
                            </div>
                        </div>
                        <div class="history-item-footer">
                            <span class="history-item-date">${item.author ? 'Por ' + item.author : ''}</span>
                            <button class="history-remove-btn" data-id="${item.id}" title="Eliminar del historial">
                                <i class="fas fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        historyList.innerHTML = html;
        
        const removeBtns = historyList.querySelectorAll('.history-remove-btn');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                removeHistoryItem(id);
                renderHistoryList();
                renderContinueReading();
                renderHomeHistory();
            });
        });
    }

    function renderContinueReading() {
        if (!continueReadingSection || !continueReadingGrid) return;
        
        const history = getHistory();
        const inProgress = history.filter(item => item.progress >= 5 && item.progress < 95);
        
        if (inProgress.length === 0) {
            continueReadingSection.style.display = 'none';
            return;
        }
        
        continueReadingSection.style.display = 'block';
        
        let html = '';
        inProgress.forEach(item => {
            const displayUrl = item.url && item.url !== '#' ? item.url : '#';
            
            html += `
                <article class="continue-fav-card">
                    <div>
                        <div class="progress-label-row">
                            <span style="color: var(--color-anfibia-peach); font-weight: 700;">${item.badge || 'ARTÍCULO'}</span>
                        </div>
                        <h3 class="card-headline" style="font-size: 1.6rem; margin: 8px 0 12px 0; line-height: 1.15; font-family: var(--font-heading);">
                            <a href="${displayUrl}" style="color: var(--color-black); text-decoration: none; transition: color 0.2s ease;">${item.title}</a>
                        </h3>
                        <p style="font-family: var(--font-literary); font-size: 0.85rem; color: #555; margin-bottom: 16px;">
                            ${item.kicker || ''}
                        </p>
                    </div>
                    <div>
                        <div class="reading-progress-container">
                            <div class="progress-label-row">
                                <span>Progreso de lectura</span>
                                <span class="progress-pct-value">${item.progress}%</span>
                            </div>
                            <div class="progress-bar-track">
                                <div class="progress-bar-fill" style="width: ${item.progress}%"></div>
                            </div>
                        </div>
                        <a href="${displayUrl}" class="btn-resume-reading">Retomar lectura</a>
                    </div>
                </article>
            `;
        });
        
        continueReadingGrid.innerHTML = html;
    }

    function renderHomeHistory() {
        const homeHistorySection = document.getElementById('homeHistorySection');
        const homeHistoryGrid = document.getElementById('homeHistoryGrid');
        if (!homeHistorySection || !homeHistoryGrid) return;
        
        const history = getHistory();
        // Exclude items that are already shown in "Continúa Leyendo" (5% to 95%)
        const nonInProgress = history.filter(item => item.progress < 5 || item.progress >= 95);
        
        if (nonInProgress.length === 0) {
            homeHistorySection.style.display = 'none';
            return;
        }
        
        homeHistorySection.style.display = 'block';
        
        let html = '';
        nonInProgress.slice(0, 6).forEach(item => {
            const displayUrl = item.url && item.url !== '#' ? item.url : '#';
            
            let btnText = "Retomar lectura";
            let progressText = `${item.progress}% leído`;
            if (item.progress >= 95) {
                btnText = "Volver a leer";
                progressText = '<span style="color: #5856d6; font-weight: bold;"><i class="fas fa-check-circle"></i> Completado</span>';
            }
            
            html += `
                <article class="continue-fav-card">
                    <div>
                        <div class="progress-label-row">
                            <span style="color: var(--color-anfibia-peach); font-weight: 700;">${item.badge || 'ARTÍCULO'}</span>
                        </div>
                        <h3 class="card-headline" style="font-size: 1.6rem; margin: 8px 0 12px 0; line-height: 1.15; font-family: var(--font-heading);">
                            <a href="${displayUrl}" style="color: var(--color-black); text-decoration: none; transition: color 0.2s ease;">${item.title}</a>
                        </h3>
                        <p style="font-family: var(--font-literary); font-size: 0.85rem; color: #555; margin-bottom: 16px;">
                            ${item.kicker || ''}
                        </p>
                    </div>
                    <div>
                        <div class="reading-progress-container">
                            <div class="progress-label-row">
                                <span>Progreso de lectura</span>
                                <span class="progress-pct-value">${progressText}</span>
                            </div>
                            <div class="progress-bar-track">
                                <div class="progress-bar-fill" style="width: ${item.progress}%"></div>
                            </div>
                        </div>
                        <a href="${displayUrl}" class="btn-resume-reading">${btnText}</a>
                    </div>
                </article>
            `;
        });
        
        homeHistoryGrid.innerHTML = html;
    }

    function trackScrollProgress() {
        if (!isUserLoggedIn()) return;
        const articleData = getCurrentArticleData();
        if (!articleData) return;

        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) return;

        const progress = Math.min((scrollTop / docHeight) * 100, 100);
        saveHistoryItem(articleData, progress, scrollTop);
    }

    function checkAndRestoreScroll() {
        if (!isUserLoggedIn()) return;
        const articleData = getCurrentArticleData();
        if (!articleData) return;

        const history = getHistory();
        const saved = history.find(item => item.id === articleData.id);
        if (saved && saved.scrollY > 100 && saved.progress < 95) {
            setTimeout(() => {
                window.scrollTo({
                    top: saved.scrollY,
                    behavior: 'smooth'
                });
                showScrollRestoreToast(saved.progress);
            }, 800);
        }
    }

    function showScrollRestoreToast(progress) {
        const scrollRestoreToast = document.getElementById('scrollRestoreToast');
        const scrollRestoreMsg = document.getElementById('scrollRestoreMsg');
        const btnToastRestart = document.getElementById('btnToastRestart');
        const closeRestoreToast = document.getElementById('closeRestoreToast');

        if (!scrollRestoreToast) return;
        if (scrollRestoreMsg) {
            scrollRestoreMsg.innerHTML = `<i class="fas fa-redo"></i> Lectura retomada al <strong>${progress}%</strong>`;
        }
        scrollRestoreToast.classList.add('active');

        const autoDismiss = setTimeout(() => {
            scrollRestoreToast.classList.remove('active');
        }, 6000);

        if (closeRestoreToast) {
            closeRestoreToast.onclick = () => {
                clearTimeout(autoDismiss);
                scrollRestoreToast.classList.remove('active');
            };
        }

        if (btnToastRestart) {
            btnToastRestart.onclick = () => {
                clearTimeout(autoDismiss);
                scrollRestoreToast.classList.remove('active');
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                const articleData = getCurrentArticleData();
                if (articleData) {
                    saveHistoryItem(articleData, 0, 0);
                }
            };
        }
    }

    // Bind scroll progress tracker
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            trackScrollProgress();
        }, 500);
    });

    // Run UI update on load
    updateAccountUI();
    syncAllFavoriteButtons();
    renderContinueReading();
    renderHomeHistory();
    renderHistoryList();
    checkAndRestoreScroll();
    initializeHighlightsToggle();
    initializeReadingGuideToggle();
});
