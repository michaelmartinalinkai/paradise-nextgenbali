/**
 * Living Background Animation
 * Creates a smooth, flowing gradient animation like liquid sand
 */
(function () {
    'use strict';

    // Find the target section
    const section = document.querySelector('.living-sand');
    if (!section) return;

    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.className = 'living-sand-canvas';
    canvas.style.cssText = `
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
    `;

    // Insert canvas at the beginning of the section
    const bg = section.querySelector('.living-sand-bg');
    if (bg) {
        bg.innerHTML = '';
        bg.appendChild(canvas);
    } else {
        section.insertBefore(canvas, section.firstChild);
    }

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    // Colors in the beige/sand palette
    const colors = [
        { r: 227, g: 218, b: 207 },  // Base beige #E3DACF
        { r: 232, g: 224, b: 214 },  // Light highlight #E8E0D6
        { r: 216, g: 205, b: 191 },  // Deep sand #D8CDBF
        { r: 240, g: 234, b: 226 },  // Cream #F0EAE2
        { r: 207, g: 195, b: 179 }   // Warm shadow #CFC3B3
    ];

    // Flowing orb class
    class FlowingOrb {
        constructor(index) {
            this.index = index;
            this.color = colors[index % colors.length];
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 0.4 + 0.3; // 30-70% of canvas size
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.2;
            this.phase = Math.random() * Math.PI * 2;
        }

        update() {
            // Gentle flowing motion
            this.x += this.speedX + Math.sin(time * 0.0005 + this.phase) * 0.5;
            this.y += this.speedY + Math.cos(time * 0.0003 + this.phase) * 0.3;

            // Wrap around edges
            const size = Math.min(canvas.width, canvas.height) * this.size;
            if (this.x < -size) this.x = canvas.width + size;
            if (this.x > canvas.width + size) this.x = -size;
            if (this.y < -size) this.y = canvas.height + size;
            if (this.y > canvas.height + size) this.y = -size;
        }

        draw() {
            const size = Math.min(canvas.width, canvas.height) * this.size;
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, size
            );

            const { r, g, b } = this.color;
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.8)`);
            gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.4)`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create orbs
    const orbs = [];
    for (let i = 0; i < 5; i++) {
        orbs.push(new FlowingOrb(i));
    }

    // Resize handler
    function resize() {
        const rect = section.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Reset orb positions after resize
        orbs.forEach(orb => {
            orb.x = Math.random() * canvas.width;
            orb.y = Math.random() * canvas.height;
        });
    }

    // Animation loop
    function animate() {
        time++;

        // Fill with base color
        ctx.fillStyle = '#E3DACF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw orbs
        orbs.forEach(orb => {
            orb.update();
            orb.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    // Initialize
    resize();
    window.addEventListener('resize', resize);

    // Start animation
    animate();

    // Pause when not visible (performance optimization)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animate();
            } else {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
    }, { threshold: 0.1 });

    observer.observe(section);

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        cancelAnimationFrame(animationId);
        animationId = null;
        // Just draw once, no animation
        ctx.fillStyle = '#E3DACF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        orbs.forEach(orb => orb.draw());
    }
})();
