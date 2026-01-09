/* ============================================
   PARADISE LIGHTBOX CAROUSEL
   Full screen image viewer for project cards
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    // 1. Create Lightbox HTML if it doesn't exist
    if (!document.querySelector('.lightbox-overlay')) {
        const lightboxHTML = `
            <div class="lightbox-overlay" id="lightbox">
                <button class="lightbox-close" aria-label="Close">&times;</button>
                <button class="lightbox-prev" aria-label="Previous">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <div class="lightbox-content">
                    <div class="lightbox-image-wrapper">
                        <img src="" alt="Gallery Image" class="lightbox-image" id="lightboxImg">
                    </div>
                </div>
                <button class="lightbox-next" aria-label="Next">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }

    // Elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    // State
    let currentImages = [];
    let currentIndex = 0;

    // Functions
    function openLightbox(images, startIndex = 0) {
        currentImages = images;
        currentIndex = startIndex;
        updateImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        setTimeout(() => {
            lightboxImg.src = ''; // Clear image after transition
        }, 300);
    }

    function updateImage() {
        // Fade out slightly
        lightboxImg.style.opacity = '0.5';

        setTimeout(() => {
            lightboxImg.src = currentImages[currentIndex].src;
            lightboxImg.alt = currentImages[currentIndex].alt;

            // Fade in when loaded
            lightboxImg.onload = function () {
                lightboxImg.style.opacity = '1';
            };
        }, 150);
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateImage();
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateImage();
    }

    // Event Listeners

    // Open on Card Click
    const villaCards = document.querySelectorAll('.villa-card');

    villaCards.forEach(card => {
        card.addEventListener('click', function (e) {
            // Get images from the hidden .carousel-data div
            const carouselData = this.querySelector('.carousel-data');

            if (carouselData) {
                const imgs = Array.from(carouselData.querySelectorAll('img')).map(img => ({
                    src: img.src,
                    alt: img.alt || 'Project Image'
                }));

                if (imgs.length > 0) {
                    openLightbox(imgs, 0);
                }
            }
        });
    });

    // Controls
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

    // Close on overlay click
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
});
