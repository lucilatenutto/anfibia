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
                    
                    const clampedViewportLeft = Math.max(barWidth/2 + 10, Math.min(window.innerWidth - barWidth/2 - 10, rect.left + rect.width / 2));
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

    function saveHighlightToLocalStorage(text) {
        let saved = JSON.parse(localStorage.getItem('anfibia_highlights') || '[]');
        if (!saved.includes(text)) {
            saved.push(text);
            localStorage.setItem('anfibia_highlights', JSON.stringify(saved));
        }
    }

    // Restore highlights from localStorage on load
    function restoreHighlights() {
        const saved = JSON.parse(localStorage.getItem('anfibia_highlights') || '[]');
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

            let savedNotes = JSON.parse(localStorage.getItem('anfibia_personal_notes') || '[]');
            savedNotes.push(personalNote);
            localStorage.setItem('anfibia_personal_notes', JSON.stringify(savedNotes));
            
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

    // Publish Annotation as Comment
    if (btnPublishComment) {
        btnPublishComment.addEventListener('click', () => {
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
            let localComments = JSON.parse(localStorage.getItem('anfibia_comments') || '[]');
            localComments.push(newComment);
            localStorage.setItem('anfibia_comments', JSON.stringify(localComments));

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
    }

    // Submit direct comment
    if (btnSubmitDirectComment && directCommentText) {
        btnSubmitDirectComment.addEventListener('click', (e) => {
            e.preventDefault();
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
            let localComments = JSON.parse(localStorage.getItem('anfibia_comments') || '[]');
            localComments.push(newComment);
            localStorage.setItem('anfibia_comments', JSON.stringify(localComments));

            // Append to DOM
            addCommentToDOM(newComment, true);

            // Clear inputs
            directCommentText.value = "";
            if (directCommentAuthor) directCommentAuthor.value = "";

            showToast("¡Comentario enviado con éxito!");
        });
    }

    // Load persistent comments
    function loadSavedComments() {
        const localComments = JSON.parse(localStorage.getItem('anfibia_comments') || '[]');
        localComments.forEach(comment => {
            addCommentToDOM(comment);
        });
        updateCommentsCount();
    }

    // Draw and download beautiful 9:16 Instagram Story card
    if (btnDownloadIGCard && instagramStoryCanvas) {
        btnDownloadIGCard.addEventListener('click', () => {
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
    }

    // Initialize Active Reading features
    restoreHighlights();
    loadSavedComments();

    // 4.5. BOTTOM-RIGHT FLOATING BUTTONS CONTROLLER
    const floatLoveBtn = document.getElementById('floatLoveBtn');
    const floatShareBtn = document.getElementById('floatShareBtn');
    const floatAnnotateBtn = document.getElementById('floatAnnotateBtn');

    if (floatLoveBtn) {
        // Restore favorite state from localStorage
        const isFav = localStorage.getItem('anfibia_patagonia_fav') === 'true';
        if (isFav) {
            floatLoveBtn.classList.add('active');
            const icon = floatLoveBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-heart';
            }
        }

        floatLoveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentlyFav = floatLoveBtn.classList.contains('active');
            const icon = floatLoveBtn.querySelector('i');

            if (!currentlyFav) {
                floatLoveBtn.classList.add('active');
                if (icon) {
                    icon.className = 'fas fa-heart';
                }
                localStorage.setItem('anfibia_patagonia_fav', 'true');
                showToast("¡Añadido a favoritos!");
            } else {
                floatLoveBtn.classList.remove('active');
                if (icon) {
                    icon.className = 'far fa-heart';
                }
                localStorage.setItem('anfibia_patagonia_fav', 'false');
                showToast("Eliminado de favoritos.");
            }
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

    if (floatAnnotateBtn) {
        floatAnnotateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Check if there is an active text selection
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            
            if (selectedText.length > 5) {
                openAnnotationModalWithText(selectedText);
            } else {
                // Open modal for general annotation (no text selection)
                openAnnotationModalWithText("");
            }
        });
    }

    // 5. MOBILE MENU BUTTON ACTION
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            showToast("Menú móvil: ¡Próximamente disponible en este prototipo!");
        });
    }
});
