/* ==========================================
   PARADISE NEXTGEN BALI - ADMIN JS
   Complete CMS functionality - FIXED VERSION
   ========================================== */

class ParadiseAdmin {
    constructor() {
        this.content = {};
        this.isDirty = false;
        this.init();
    }

    async init() {
        await this.loadContent();
        console.log('Content loaded:', this.content);
        this.setupNavigation();
        this.setupAccordions();
        this.renderDynamicSections();
        this.populateAllFields();
        this.setupForms();
        this.setupMediaUploads();
        this.setupHeroModeToggle();
        this.setupButtons();
        this.showToast('Content geladen!', 'success');
    }

    // ==================== CONTENT LOADING ====================
    async loadContent() {
        // First try localStorage
        const savedDraft = localStorage.getItem('paradise-content-draft-v2');
        if (savedDraft) {
            try {
                this.content = JSON.parse(savedDraft);
                console.log('Loaded from localStorage');
                return;
            } catch (e) {
                console.error('Failed to parse localStorage', e);
            }
        }

        // Try to fetch JSON file
        try {
            const response = await fetch('../data/content-published.json');
            if (response.ok) {
                this.content = await response.json();
                console.log('Loaded from JSON file');
                return;
            }
        } catch (error) {
            console.log('Fetch failed, using embedded default content');
        }

        // Use hardcoded default content that matches the site
        this.content = this.getDefaultContent();
    }

    getDefaultContent() {
        return {
            "home": {
                "hero": {
                    "title": "IF YOU CAN DREAM IT,<br>WE CAN BUILD IT",
                    "media": {
                        "mode": "video",
                        "image": {
                            "src": "assets/images/hero-uluwatu.jpg",
                            "alt": "Luxury villa in Bali"
                        },
                        "video": {
                            "src": "assets/videos/website-movie.mp4",
                            "poster": "assets/images/hero-uluwatu.jpg"
                        }
                    }
                }
            },
            "villas": {
                "header": {
                    "title": "Our Residential Projects",
                    "subtitle": "Architectural excellence in the heart of Bali"
                },
                "tabs": ["CUSTOM VILLA", "LUXURY VILLA", "PRESIDENTIAL VILLA"],
                "cards": [
                    {
                        "title": "CUSTOM VILLA",
                        "image": {
                            "src": "assets/images/villa_custom_1766177184636.png",
                            "alt": "Custom Villa"
                        }
                    },
                    {
                        "title": "LUXURY VILLA",
                        "image": {
                            "src": "assets/images/villa_luxury_1766177197924.png",
                            "alt": "Luxury Villa"
                        }
                    },
                    {
                        "title": "PRESIDENTIAL VILLA",
                        "image": {
                            "src": "assets/images/villa_presidential_1766177211044.png",
                            "alt": "Presidential Villa"
                        }
                    }
                ]
            },
            "masterplan": {
                "title": "PREMIUM",
                "subtitle": "Paradise Villas in Bali",
                "leftImage": {
                    "src": "assets/images/living-room.jpg",
                    "alt": "Premium Interior"
                },
                "planImage": {
                    "src": "assets/images/paradise-masterplan.png",
                    "alt": "Paradise Villas Masterplan"
                }
            },
            "features": {
                "header": {
                    "title": "Why Choose Paradise",
                    "subtitle": "Six pillars of excellence that define our commitment to your investment"
                },
                "cards": [
                    {
                        "number": "01",
                        "title": "In-House Development",
                        "description": "Our dedicated team manages every aspect of your investment – from design to construction to final delivery.",
                        "image": {
                            "src": "assets/images/feature_inhouse_dev_1766176560105.png",
                            "alt": "In-House Development"
                        }
                    },
                    {
                        "number": "02",
                        "title": "Premium Locations",
                        "description": "We select only the finest locations in Bali, creating destinations with resort-level amenities and services.",
                        "image": {
                            "src": "assets/images/feature_premium_location_1766176574202.png",
                            "alt": "Premium Locations"
                        }
                    },
                    {
                        "number": "03",
                        "title": "Full Transparency",
                        "description": "Regular updates, clear communication, and direct reporting. We believe in building trust through openness.",
                        "image": {
                            "src": "assets/images/feature_transparency_1766176589212.png",
                            "alt": "Full Transparency"
                        }
                    },
                    {
                        "number": "04",
                        "title": "Property Management",
                        "description": "After completion, our team handles everything – rentals, maintenance, cleaning, and guest services.",
                        "image": {
                            "src": "assets/images/feature_management_1766176616637.png",
                            "alt": "Property Management"
                        }
                    },
                    {
                        "number": "05",
                        "title": "Legal Compliance",
                        "description": "Our team handles all legal and fiscal matters, ensuring full compliance while you focus on your portfolio.",
                        "image": {
                            "src": "assets/images/feature_legal_1766176631639.png",
                            "alt": "Legal Compliance"
                        }
                    },
                    {
                        "number": "06",
                        "title": "Long-term Vision",
                        "description": "We're here for the long term. With 5+ years commitment per project and a 5-year construction warranty.",
                        "image": {
                            "src": "assets/images/feature_longterm_1766176645509.png",
                            "alt": "Long-term Vision"
                        }
                    }
                ]
            },
            "architecture": {
                "title": "Architecture & Interiors",
                "paragraphs": [
                    "Every Paradise villa is designed with meticulous attention to detail. We blend contemporary architecture with Balinese craftsmanship, creating spaces that are both timeless and deeply connected to their tropical surroundings.",
                    "Our interiors feature natural materials, warm lighting, and carefully curated furnishings that create an atmosphere of refined luxury."
                ],
                "image": {
                    "src": "assets/images/interior-office.jpg",
                    "alt": "Premium Interior"
                }
            },
            "gallery": {
                "images": [
                    { "src": "assets/images/hero-uluwatu.jpg", "alt": "Villa Exterior" },
                    { "src": "assets/images/rooftop-terrace.jpg", "alt": "Rooftop Terrace" },
                    { "src": "assets/images/living-room.jpg", "alt": "Living Room" },
                    { "src": "assets/images/luxury-bathroom.jpg", "alt": "Luxury Bathroom" },
                    { "src": "assets/images/interior-office.jpg", "alt": "Interior" }
                ]
            },
            "cta": {
                "title": "Start Your Journey",
                "description": "Discover how PARADISE can turn your vision into reality. Our team is ready to guide you through every step.",
                "button": {
                    "label": "Request Information",
                    "href": "#contact"
                }
            },
            "navigation": {
                "logo": {
                    "src": "assets/images/ngh-logo-new.png",
                    "alt": "NGH Bali Property Group"
                },
                "links": [
                    { "label": "Home", "href": "#home" },
                    { "label": "Villas", "href": "#villas" },
                    { "label": "Masterplan", "href": "#masterplan" },
                    { "label": "About", "href": "#about" },
                    { "label": "Contact", "href": "#contact" }
                ]
            },
            "footer": {
                "brand": {
                    "name": "PARADISE",
                    "tagline": "by Next Gen",
                    "description": "Premium villa development in Bali. We combine architectural excellence with thoughtful hospitality to create extraordinary living spaces."
                },
                "navigation": [
                    { "label": "Home", "href": "#home" },
                    { "label": "Villas", "href": "#villas" },
                    { "label": "Masterplan", "href": "#masterplan" },
                    { "label": "About", "href": "#about" }
                ],
                "contact": {
                    "location": "Uluwatu, Bali",
                    "country": "Indonesia",
                    "email": "info@paradise-nextgen.com"
                },
                "social": {
                    "instagram": "#",
                    "linkedin": "#",
                    "youtube": "#"
                },
                "copyright": "© 2024 PARADISE by Next Gen. All rights reserved.",
                "tagline": "Designed with restraint and confidence."
            }
        };
    }

    // ==================== NAVIGATION ====================
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.switchPage(page);
                navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    switchPage(page) {
        const editors = document.querySelectorAll('.page-editor');
        editors.forEach(editor => editor.classList.remove('active'));
        const targetEditor = document.getElementById(`page-${page}`);
        if (targetEditor) targetEditor.classList.add('active');
    }

    // ==================== ACCORDIONS ====================
    setupAccordions() {
        console.log('Setting up accordion listeners (v3)');
        // Use event delegation for dynamic accordions
        document.body.addEventListener('click', (e) => {
            console.log('Click detected on:', e.target.tagName, e.target.className);

            const header = e.target.closest('.accordion-header');
            if (header) {
                console.log('Accordion header found!', header);
                const accordion = header.parentElement;

                // Toggle open class
                accordion.classList.toggle('open');
                console.log('Toggled accordion. New state open:', accordion.classList.contains('open'));

                // Prevent default if necessary (though it's a div)
                e.stopPropagation();
            }
        });
    }

    // ==================== FORMS ====================
    setupForms() {
        document.querySelectorAll('textarea[maxlength]').forEach(textarea => {
            const charCount = textarea.parentElement.querySelector('.char-count .current');
            if (charCount) {
                textarea.addEventListener('input', () => {
                    charCount.textContent = textarea.value.length;
                });
            }
        });

        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', () => {
                this.isDirty = true;
                this.updateStatusIndicator();
            });
        });
    }

    updateStatusIndicator() {
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');
        if (this.isDirty) {
            statusDot.className = 'status-dot draft';
            statusText.textContent = 'Unsaved changes';
        }
    }

    // ==================== POPULATE FIELDS ====================
    populateAllFields() {
        // Populate all inputs with data-key
        document.querySelectorAll('[data-key]').forEach(input => {
            const key = input.dataset.key;
            const value = this.getNestedValue(this.content, key);

            if (value !== undefined && value !== null) {
                if (input.tagName === 'TEXTAREA') {
                    input.value = value;
                } else if (input.tagName === 'INPUT') {
                    input.value = value;
                } else if (input.tagName === 'SELECT') {
                    input.value = value;
                }

                // Update char count
                const charCount = input.parentElement?.querySelector('.char-count .current');
                if (charCount && typeof value === 'string') {
                    charCount.textContent = value.length;
                }
            }
        });

        // Set hero media mode
        const mediaMode = this.getNestedValue(this.content, 'home.hero.media.mode') || 'video';
        this.setHeroMediaMode(mediaMode);

        // Load all image previews
        this.loadAllImagePreviews();
    }

    loadAllImagePreviews() {
        const imageMappings = [
            { key: 'home.hero.media.image.src', previewId: 'home-hero-image-preview' },
            { key: 'home.hero.media.video.src', previewId: 'home-hero-video-preview', isVideo: true },
            { key: 'masterplan.leftImage.src', previewId: 'masterplan-left-image-preview' },
            { key: 'masterplan.planImage.src', previewId: 'masterplan-plan-image-preview' },
            { key: 'architecture.image.src', previewId: 'architecture-image-preview' },
            { key: 'navigation.logo.src', previewId: 'nav-logo-preview' }
        ];

        imageMappings.forEach(mapping => {
            const src = this.getNestedValue(this.content, mapping.key);
            const preview = document.getElementById(mapping.previewId);
            if (src && preview) {
                preview.src = '../' + src;
            }
        });
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            if (current === null || current === undefined) return undefined;
            if (!isNaN(key)) return current[parseInt(key)];
            return current[key];
        }, obj);
    }

    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => {
            if (!isNaN(key)) return current[parseInt(key)];
            if (!current[key]) current[key] = {};
            return current[key];
        }, obj);

        if (!isNaN(lastKey)) {
            target[parseInt(lastKey)] = value;
        } else {
            target[lastKey] = value;
        }
    }

    // ==================== HERO MEDIA MODE ====================
    setupHeroModeToggle() {
        document.querySelectorAll('.toggle-btn[data-mode]').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                this.setHeroMediaMode(mode);
                this.isDirty = true;
                this.updateStatusIndicator();
            });
        });
    }

    setHeroMediaMode(mode) {
        document.querySelectorAll('.toggle-btn[data-mode]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        const videoSection = document.getElementById('hero-video-section');
        const imageSection = document.getElementById('hero-image-section');

        if (videoSection && imageSection) {
            if (mode === 'video') {
                videoSection.classList.remove('hidden');
                imageSection.classList.add('hidden');
            } else {
                videoSection.classList.add('hidden');
                imageSection.classList.remove('hidden');
            }
        }

        this.setNestedValue(this.content, 'home.hero.media.mode', mode);
    }

    // ==================== MEDIA UPLOADS ====================
    setupMediaUploads() {
        this.setupFileInput('home-hero-image-file', 'home.hero.media.image.src', 'home-hero-image-preview', 'image');
        this.setupFileInput('home-hero-video-file', 'home.hero.media.video.src', 'home-hero-video-preview', 'video');
        this.setupFileInput('masterplan-left-image-file', 'masterplan.leftImage.src', 'masterplan-left-image-preview', 'image');
        this.setupFileInput('masterplan-plan-image-file', 'masterplan.planImage.src', 'masterplan-plan-image-preview', 'image');
        this.setupFileInput('architecture-image-file', 'architecture.image.src', 'architecture-image-preview', 'image');
        this.setupFileInput('nav-logo-file', 'navigation.logo.src', 'nav-logo-preview', 'image');

        // Setup dynamic file inputs for villas, features, gallery
        this.setupDynamicFileInputs();
    }

    setupDynamicFileInputs() {
        // Villa images
        this.content.villas?.cards?.forEach((card, index) => {
            this.setupFileInput(`villa-image-${index}`, `villas.cards.${index}.image.src`, null, 'image');
        });

        // Feature images
        this.content.features?.cards?.forEach((card, index) => {
            this.setupFileInput(`feature-image-${index}`, `features.cards.${index}.image.src`, null, 'image');
        });

        // Gallery images
        this.content.gallery?.images?.forEach((img, index) => {
            this.setupFileInput(`gallery-image-${index}`, `gallery.images.${index}.src`, null, 'image');
        });
    }

    setupFileInput(inputId, contentKey, previewId, type) {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const maxSize = type === 'video' ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
            if (file.size > maxSize) {
                this.showToast(`Bestand te groot. Max: ${type === 'video' ? '50MB' : '5MB'}`, 'error');
                return;
            }

            const url = URL.createObjectURL(file);

            // Update preview if exists
            if (previewId) {
                const preview = document.getElementById(previewId);
                if (preview) preview.src = url;
            }

            // Also update the preview img in the parent container
            const container = input.closest('.media-upload');
            if (container) {
                const img = container.querySelector('img');
                if (img) img.src = url;
            }

            // Store path
            this.setNestedValue(this.content, contentKey, 'assets/images/' + file.name);

            this.isDirty = true;
            this.updateStatusIndicator();
            this.showToast('Bestand geüpload', 'success');
        });
    }

    // ==================== DYNAMIC SECTIONS ====================
    renderDynamicSections() {
        this.renderVillaCards();
        this.renderFeatureCards();
        this.renderGalleryImages();
        this.renderNavLinks();
    }

    renderVillaCards() {
        const container = document.getElementById('villas-cards-container');
        if (!container) return;

        const cards = this.content.villas?.cards || [];
        container.innerHTML = cards.map((card, index) => `
            <div class="accordion" data-section="villas.cards.${index}">
                <div class="accordion-header">
                    <span class="accordion-icon">▼</span>
                    <span class="accordion-title">Villa ${index + 1}: ${card.title || 'Untitled'}</span>
                </div>
                <div class="accordion-content">
                    <div class="card-editor">
                        <div class="form-group">
                            <label>Titel</label>
                            <input type="text" data-key="villas.cards.${index}.title" value="${this.escapeHtml(card.title || '')}" maxlength="30">
                        </div>
                        <div class="form-group">
                            <label>Afbeelding</label>
                            <div class="media-upload compact">
                                <input type="file" id="villa-image-${index}" accept="image/*" hidden>
                                <div class="media-preview image-preview small">
                                    <img src="../${card.image?.src || ''}" alt="Preview" onerror="this.style.display='none'">
                                </div>
                                <button class="btn btn-upload btn-sm" onclick="document.getElementById('villa-image-${index}').click()">📤 Upload</button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Alt Tekst</label>
                            <input type="text" data-key="villas.cards.${index}.image.alt" value="${this.escapeHtml(card.image?.alt || '')}" maxlength="100">
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderFeatureCards() {
        const container = document.getElementById('features-cards-container');
        if (!container) return;

        const cards = this.content.features?.cards || [];
        container.innerHTML = cards.map((card, index) => `
            <div class="accordion" data-section="features.cards.${index}">
                <div class="accordion-header">
                    <span class="accordion-icon">▼</span>
                    <span class="accordion-title">${card.number || '0' + (index + 1)}. ${card.title || 'Untitled'}</span>
                </div>
                <div class="accordion-content">
                    <div class="card-editor">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Nummer</label>
                                <input type="text" data-key="features.cards.${index}.number" value="${this.escapeHtml(card.number || '')}" maxlength="3">
                            </div>
                            <div class="form-group">
                                <label>Titel</label>
                                <input type="text" data-key="features.cards.${index}.title" value="${this.escapeHtml(card.title || '')}" maxlength="40">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Beschrijving</label>
                            <textarea data-key="features.cards.${index}.description" rows="3" maxlength="250">${this.escapeHtml(card.description || '')}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Afbeelding</label>
                            <div class="media-upload compact">
                                <input type="file" id="feature-image-${index}" accept="image/*" hidden>
                                <div class="media-preview image-preview small">
                                    <img src="../${card.image?.src || ''}" alt="Preview" onerror="this.style.display='none'">
                                </div>
                                <button class="btn btn-upload btn-sm" onclick="document.getElementById('feature-image-${index}').click()">📤 Upload</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderGalleryImages() {
        const container = document.getElementById('gallery-images-container');
        if (!container) return;

        const images = this.content.gallery?.images || [];
        container.innerHTML = images.map((image, index) => `
            <div class="gallery-item-editor">
                <input type="file" id="gallery-image-${index}" accept="image/*" hidden>
                <div class="media-preview image-preview" onclick="document.getElementById('gallery-image-${index}').click()" style="cursor:pointer">
                    <img src="../${image.src || ''}" alt="${this.escapeHtml(image.alt || '')}" onerror="this.style.display='none'">
                </div>
                <input type="text" data-key="gallery.images.${index}.alt" value="${this.escapeHtml(image.alt || '')}" placeholder="Alt tekst..." maxlength="100">
            </div>
        `).join('');
    }

    renderNavLinks() {
        const container = document.getElementById('nav-links-container');
        if (!container) return;

        const links = this.content.navigation?.links || [];
        container.innerHTML = `
            <label>Menu Links</label>
            ${links.map((link, index) => `
                <div class="form-row" style="margin-bottom: 8px;">
                    <input type="text" data-key="navigation.links.${index}.label" value="${this.escapeHtml(link.label || '')}" placeholder="Label" maxlength="20">
                    <select data-key="navigation.links.${index}.href">
                        <option value="#home" ${link.href === '#home' ? 'selected' : ''}>Home</option>
                        <option value="#villas" ${link.href === '#villas' ? 'selected' : ''}>Villas</option>
                        <option value="#masterplan" ${link.href === '#masterplan' ? 'selected' : ''}>Masterplan</option>
                        <option value="#about" ${link.href === '#about' ? 'selected' : ''}>About</option>
                        <option value="#contact" ${link.href === '#contact' ? 'selected' : ''}>Contact</option>
                    </select>
                </div>
            `).join('')}
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ==================== ACTION BUTTONS ====================
    setupButtons() {
        document.getElementById('btn-save-draft')?.addEventListener('click', () => this.saveDraft());
        document.getElementById('btn-preview')?.addEventListener('click', () => this.openPreview());
        document.getElementById('btn-publish')?.addEventListener('click', () => this.publish());
    }

    collectFormData() {
        document.querySelectorAll('[data-key]').forEach(input => {
            const key = input.dataset.key;
            let value = input.value;
            this.setNestedValue(this.content, key, value);
        });
    }

    async saveDraft() {
        this.collectFormData();

        try {
            // Try server API first
            const response = await fetch('/api/save-draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.content)
            });

            if (response.ok) {
                this.isDirty = false;
                document.querySelector('.status-dot').className = 'status-dot draft';
                document.querySelector('.status-text').textContent = 'Draft opgeslagen';
                this.showToast('Draft opgeslagen in bestand!', 'success');
            } else {
                throw new Error('Server niet beschikbaar');
            }
        } catch (error) {
            // Fallback to localStorage
            console.log('Server not available, using localStorage');
            localStorage.setItem('paradise-content-draft-v2', JSON.stringify(this.content));
            this.isDirty = false;
            document.querySelector('.status-dot').className = 'status-dot draft';
            document.querySelector('.status-text').textContent = 'Draft opgeslagen (lokaal)';
            this.showToast('Draft opgeslagen (lokaal)', 'success');
        }
    }

    openPreview() {
        this.collectFormData();
        localStorage.setItem('paradise-content-draft-v2', JSON.stringify(this.content));
        window.open('../index.html?preview=true', '_blank');
    }

    async publish() {
        this.collectFormData();

        try {
            // Try server API first
            const response = await fetch('/api/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.content)
            });

            if (response.ok) {
                this.isDirty = false;
                document.querySelector('.status-dot').className = 'status-dot published';
                document.querySelector('.status-text').textContent = 'Gepubliceerd';
                this.showToast('Gepubliceerd! Content is live.', 'success');
            } else {
                throw new Error('Server niet beschikbaar');
            }
        } catch (error) {
            // Fallback: download JSON file
            console.log('Server not available, downloading file');
            localStorage.setItem('paradise-content-published-v2', JSON.stringify(this.content));

            const blob = new Blob([JSON.stringify(this.content, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'content-published.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.isDirty = false;
            document.querySelector('.status-dot').className = 'status-dot published';
            document.querySelector('.status-text').textContent = 'Gepubliceerd (download)';

            this.showToast('Vervang data/content-published.json met het gedownloade bestand.', 'success');
        }
    }

    // ==================== TOAST ====================
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.className = `toast ${type} show`;
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.paradiseAdmin = new ParadiseAdmin();
});
