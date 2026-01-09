/* ============================================
   NEXTGEN BALI - JavaScript
   Smooth interactions and animations
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ==================== NAVBAR SCROLL EFFECT ====================
    const navbar = document.querySelector('.navbar');

    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);

    // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================== MOBILE MENU TOGGLE ====================
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarLinks = document.querySelector('.navbar-links');

    if (navbarToggle) {
        navbarToggle.addEventListener('click', function () {
            navbarLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // ==================== FAQ ACCORDION ====================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function () {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // ==================== TESTIMONIAL CAROUSEL ====================
    const testimonialAvatars = document.querySelectorAll('.testimonial-avatar');
    const testimonialText = document.querySelector('.testimonial-text');
    const testimonialAuthor = document.querySelector('.testimonial-author');

    const testimonials = [
        {
            text: "Ik heb NEXTGEN vergeleken met andere bedrijven. Niets tegen hen, hun projecten zijn totaal anders. Maar uiteindelijk koos ik voor NEXTGEN omdat het een compleet pakket is. Het is alsof je een hotelkamer koopt waar die kamer wordt verhuurd, schoongemaakt, onderhouden — je hoeft je nergens zorgen over te maken. Eerlijk gezegd ziet alles er echt goed uit. Het enige wat ik kan zeggen is dat ik me vandaag rustig voel. Ik voel me op mijn gemak. Ik denk echt dat ik geen fout heb gemaakt.",
            author: "Marco van der Berg",
            role: "Investor"
        },
        {
            text: "From the first consultation to the final handover, the NEXTGEN team has been exceptional. Their transparency and regular updates made the entire process stress-free. I never felt worried because I always knew exactly what was happening with my investment.",
            author: "Sarah Johnson",
            role: "Investor"
        },
        {
            text: "We were hesitant about investing overseas, but NEXTGEN's professionalism put us at ease. Their on-site presence and management team made all the difference. We've already recommended them to friends and family.",
            author: "Thomas & Lisa",
            role: "Investors"
        }
    ];

    testimonialAvatars.forEach((avatar, index) => {
        avatar.addEventListener('click', function () {
            // Update active state
            testimonialAvatars.forEach(a => a.classList.remove('active'));
            this.classList.add('active');

            // Update testimonial content with fade effect
            if (testimonialText && testimonialAuthor) {
                testimonialText.style.opacity = '0';
                testimonialAuthor.style.opacity = '0';

                setTimeout(() => {
                    testimonialText.textContent = testimonials[index].text;
                    testimonialAuthor.innerHTML = `${testimonials[index].author}<span>${testimonials[index].role}</span>`;
                    testimonialText.style.opacity = '1';
                    testimonialAuthor.style.opacity = '1';
                }, 300);
            }
        });
    });

    // ==================== SCROLL ANIMATIONS ====================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in, .stagger-children').forEach(el => {
        observer.observe(el);
    });

    // Add fade-in class to sections for animation
    document.querySelectorAll('section > .container > *:first-child').forEach(el => {
        if (!el.classList.contains('fade-in')) {
            el.classList.add('fade-in');
            observer.observe(el);
        }
    });

    // ==================== VIDEO PLAY BUTTONS ====================
    const videoButtons = document.querySelectorAll('.video-play-btn');

    videoButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            // In a real implementation, this would open a video modal
            // For now, we'll just add a visual feedback
            this.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'translate(-50%, -50%) scale(1.1)';
            }, 150);

            // You can add video modal logic here
            console.log('Video play clicked - implement modal here');
        });
    });

    // ==================== STATS COUNTER ANIMATION ====================
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);

        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + (element.dataset.suffix || '');
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + (element.dataset.suffix || '');
            }
        }

        updateCounter();
    }

    // Observe stats for counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.hero-stat-number, .stat-number, .construction-stat-number, .team-stat-number');
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    const match = text.match(/(\d+)/);
                    if (match && !stat.dataset.animated) {
                        const number = parseInt(match[1]);
                        const suffix = text.replace(match[1], '');
                        stat.dataset.suffix = suffix;
                        stat.dataset.animated = 'true';
                        animateCounter(stat, number);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.hero-stats, .construction-stats, .team-stats').forEach(el => {
        statsObserver.observe(el);
    });

    // ==================== PARALLAX EFFECT FOR HERO ====================
    const heroSection = document.querySelector('.hero');

    if (heroSection) {
        window.addEventListener('scroll', function () {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                const heroVisual = heroSection.querySelector('.hero-visual');
                if (heroVisual) {
                    heroVisual.style.transform = `translateY(${scrolled * 0.1}px)`;
                }
            }
        });
    }

    // ==================== WHATSAPP FLOAT VISIBILITY ====================
    const whatsappFloat = document.querySelector('.whatsapp-float');

    if (whatsappFloat) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                whatsappFloat.style.opacity = '1';
                whatsappFloat.style.pointerEvents = 'auto';
            } else {
                whatsappFloat.style.opacity = '0';
                whatsappFloat.style.pointerEvents = 'none';
            }
        });

        // Initial state
        whatsappFloat.style.opacity = '0';
        whatsappFloat.style.transition = 'opacity 0.3s ease';
        whatsappFloat.style.pointerEvents = 'none';
    }

    // ==================== PROJECT CARDS HOVER EFFECT ====================
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // ==================== CONSOLE WELCOME MESSAGE ====================
    console.log('%c NEXTGEN Bali ', 'background: #2C2C2C; color: #fff; font-size: 20px; padding: 10px 20px; border-radius: 4px;');
    console.log('%c Professional Real Estate Development ', 'color: #5D7A6B; font-size: 12px;');

});
