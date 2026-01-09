/* ==========================================
   PARADISE NEXTGEN BALI - CONTENT LOADER
   Loads content from JSON and populates page
   ========================================== */

class ContentLoader {
    constructor() {
        this.content = null;
        this.isPreview = window.location.search.includes('preview=true');
        this.init();
    }

    async init() {
        await this.loadContent();
        this.populatePage();
    }

    async loadContent() {
        try {
            if (this.isPreview) {
                // Load draft from localStorage
                const draft = localStorage.getItem('paradise-content-draft-v2');
                if (draft) {
                    this.content = JSON.parse(draft);
                    console.log('Preview mode: Loaded draft content');
                    this.showPreviewBanner();
                    return;
                }
            }

            // Try published content from localStorage first
            const published = localStorage.getItem('paradise-content-published-v2');
            if (published) {
                this.content = JSON.parse(published);
                console.log('Loaded published content from localStorage');
                return;
            }

            // Fall back to JSON file
            const response = await fetch('data/content-published.json');
            if (response.ok) {
                this.content = await response.json();
                console.log('Loaded content from JSON file');
            }
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    showPreviewBanner() {
        const banner = document.createElement('div');
        banner.id = 'preview-banner';
        banner.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: linear-gradient(90deg, #D97706, #F59E0B);
                color: white;
                text-align: center;
                padding: 12px;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                font-weight: 600;
                font-size: 14px;
                z-index: 10000;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            ">
                👁️ PREVIEW MODE - This is draft content. Changes are not published yet.
                <button onclick="window.close()" style="
                    margin-left: 20px;
                    background: white;
                    color: #D97706;
                    border: none;
                    padding: 6px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                ">Close Preview</button>
            </div>
        `;
        document.body.insertBefore(banner, document.body.firstChild);
        document.body.style.paddingTop = '48px';
    }

    getNestedValue(path) {
        if (!this.content) return null;
        return path.split('.').reduce((obj, key) => {
            if (obj === null || obj === undefined) return null;
            if (!isNaN(key)) return obj[parseInt(key)];
            return obj[key];
        }, this.content);
    }

    populatePage() {
        if (!this.content) {
            console.log('No content to populate');
            return;
        }

        // === NAVIGATION ===
        // DISABLED: Navigation is now hardcoded in HTML to prevent localStorage 
        // from overwriting with stale cached data. Do NOT re-enable.
        // this.populateNavigation();

        // === HERO ===
        this.populateHero();

        // === VILLAS ===
        this.populateVillas();

        // === MASTERPLAN ===
        // DISABLED: Masterplan section is static/hardcoded. Legacy code.
        // this.populateMasterplan();

        // === FEATURES ===
        this.populateFeatures();

        // === ARCHITECTURE ===
        this.populateArchitecture();

        // === GALLERY ===
        this.populateGallery();

        // === CTA ===
        this.populateCTA();

        // === FOOTER ===
        this.populateFooter();

        console.log('Content populated successfully');
    }

    populateNavigation() {
        const nav = this.content.navigation;
        if (!nav) return;

        // Logo
        const logoImg = document.querySelector('.navbar-logo img');
        if (logoImg && nav.logo?.src) {
            logoImg.src = nav.logo.src;
            logoImg.alt = nav.logo.alt || 'Logo';
        }

        // Nav links
        const navLinks = document.querySelector('.navbar-links');
        if (navLinks && nav.links) {
            navLinks.innerHTML = nav.links.map(link =>
                `<li><a href="${link.href}">${link.label}</a></li>`
            ).join('');
        }
    }

    populateHero() {
        const hero = this.content.home?.hero;
        if (!hero) return;

        // ONLY update title - NEVER touch video/media elements
        // Video is hardcoded in index.html and must not be modified
        const heroTitle = document.querySelector('.hero-video-overlay h1');
        if (heroTitle && hero.title) {
            heroTitle.innerHTML = hero.title;
        }

        // IMPORTANT: Do NOT modify hero media. Video is static in HTML.
        // Any hero-bg-image elements are legacy and should be removed
        const heroSection = document.querySelector('.hero-video');
        if (heroSection) {
            const legacyImages = heroSection.querySelectorAll('.hero-bg-image');
            legacyImages.forEach(img => img.remove());
        }

        // Ensure video element is visible and playing
        const videoEl = document.getElementById('heroVideo');
        if (videoEl) {
            videoEl.style.display = 'block';
            videoEl.play().catch(() => { });
        }
    }

    populateVillas() {
        const villas = this.content.villas;
        if (!villas) return;

        // Header
        const headerTitle = document.querySelector('.villa-header h2');
        const headerSubtitle = document.querySelector('.villa-header p');
        if (headerTitle && villas.header?.title) headerTitle.textContent = villas.header.title;
        if (headerSubtitle && villas.header?.subtitle) headerSubtitle.textContent = villas.header.subtitle;

        // Tabs
        const tabs = document.querySelectorAll('.villa-tab');
        if (tabs.length && villas.tabs) {
            tabs.forEach((tab, i) => {
                if (villas.tabs[i]) tab.textContent = villas.tabs[i];
            });
        }

        // Cards
        const cards = document.querySelectorAll('.villa-card');
        if (cards.length && villas.cards) {
            cards.forEach((card, i) => {
                const cardData = villas.cards[i];
                if (!cardData) return;

                const title = card.querySelector('.villa-card-title');
                const img = card.querySelector('.villa-card-image img');

                if (title && cardData.title) title.textContent = cardData.title;
                if (img && cardData.image?.src) {
                    img.src = cardData.image.src;
                    img.alt = cardData.image.alt || cardData.title || '';
                }
            });
        }
    }

    populateMasterplan() {
        const mp = this.content.masterplan;
        if (!mp) return;

        const title = document.querySelector('.masterplan-right h2');
        const subtitle = document.querySelector('.masterplan-right .subtitle');
        const leftImg = document.querySelector('.masterplan-left .photo-frame img');
        const planImg = document.querySelector('.masterplan-image img');

        if (title && mp.title) title.textContent = mp.title;
        if (subtitle && mp.subtitle) subtitle.textContent = mp.subtitle;
        if (leftImg && mp.leftImage?.src) {
            leftImg.src = mp.leftImage.src;
            leftImg.alt = mp.leftImage.alt || '';
        }
        if (planImg && mp.planImage?.src) {
            planImg.src = mp.planImage.src;
            planImg.alt = mp.planImage.alt || '';
        }
    }

    populateFeatures() {
        const features = this.content.features;
        if (!features) return;

        // Header
        const headerTitle = document.querySelector('.features-header h2');
        const headerSubtitle = document.querySelector('.features-header p');
        if (headerTitle && features.header?.title) headerTitle.textContent = features.header.title;
        if (headerSubtitle && features.header?.subtitle) headerSubtitle.textContent = features.header.subtitle;

        // Cards
        const cards = document.querySelectorAll('.feature-card');
        if (cards.length && features.cards) {
            cards.forEach((card, i) => {
                const cardData = features.cards[i];
                if (!cardData) return;

                const num = card.querySelector('.feature-num');
                const title = card.querySelector('h3');
                const desc = card.querySelector('.feature-card-content p');
                const img = card.querySelector('.feature-card-image img');

                if (num && cardData.number) num.textContent = cardData.number;
                if (title && cardData.title) title.textContent = cardData.title;
                if (desc && cardData.description) desc.textContent = cardData.description;
                if (img && cardData.image?.src) {
                    img.src = cardData.image.src;
                    img.alt = cardData.image.alt || cardData.title || '';
                }
            });
        }
    }

    populateArchitecture() {
        const arch = this.content.architecture;
        if (!arch) return;

        const title = document.querySelector('.architecture-content h2');
        const paragraphs = document.querySelectorAll('.architecture-content p');
        const img = document.querySelector('.architecture-image img');

        if (title && arch.title) title.textContent = arch.title;
        if (paragraphs.length && arch.paragraphs) {
            paragraphs.forEach((p, i) => {
                if (arch.paragraphs[i]) p.textContent = arch.paragraphs[i];
            });
        }
        if (img && arch.image?.src) {
            img.src = arch.image.src;
            img.alt = arch.image.alt || '';
        }
    }

    populateGallery() {
        const gallery = this.content.gallery;
        if (!gallery?.images) return;

        const items = document.querySelectorAll('.gallery-item img');
        items.forEach((img, i) => {
            const imageData = gallery.images[i];
            if (imageData) {
                img.src = imageData.src;
                img.alt = imageData.alt || '';
            }
        });
    }

    populateCTA() {
        const cta = this.content.cta;
        if (!cta) return;

        const section = document.querySelector('.cta-section');
        if (!section) return;

        const title = section.querySelector('h2');
        const desc = section.querySelector('p');
        const btn = section.querySelector('.btn');

        if (title && cta.title) title.textContent = cta.title;
        if (desc && cta.description) desc.textContent = cta.description;
        if (btn && cta.button) {
            if (cta.button.label) btn.textContent = cta.button.label;
            if (cta.button.href) btn.href = cta.button.href;
        }
    }

    populateFooter() {
        const footer = this.content.footer;
        if (!footer) return;

        // Brand
        const brandLogo = document.querySelector('.footer-logo');
        if (brandLogo && footer.brand) {
            brandLogo.innerHTML = `${footer.brand.name}<span>${footer.brand.tagline}</span>`;
        }

        const brandDesc = document.querySelector('.footer-description');
        if (brandDesc && footer.brand?.description) {
            brandDesc.textContent = footer.brand.description;
        }

        // Contact
        const contactList = document.querySelectorAll('.footer-column:nth-child(3) .footer-links li');
        if (contactList.length >= 3 && footer.contact) {
            if (footer.contact.location) contactList[0].textContent = footer.contact.location;
            if (footer.contact.country) contactList[1].textContent = footer.contact.country;
            if (footer.contact.email) {
                contactList[2].innerHTML = `<a href="mailto:${footer.contact.email}">${footer.contact.email}</a>`;
            }
        }

        // Social
        const socialLinks = document.querySelectorAll('.footer-column:nth-child(4) .footer-links a');
        if (socialLinks.length >= 3 && footer.social) {
            if (footer.social.instagram) socialLinks[0].href = footer.social.instagram;
            if (footer.social.linkedin) socialLinks[1].href = footer.social.linkedin;
            if (footer.social.youtube) socialLinks[2].href = footer.social.youtube;
        }

        // Copyright
        const copyright = document.querySelector('.footer-bottom p:first-child');
        const tagline = document.querySelector('.footer-bottom p:last-child');
        if (copyright && footer.copyright) copyright.textContent = footer.copyright;
        if (tagline && footer.tagline) tagline.textContent = footer.tagline;
    }
}

// Initialize content loader
document.addEventListener('DOMContentLoaded', () => {
    window.contentLoader = new ContentLoader();
});
