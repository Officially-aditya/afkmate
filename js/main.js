/**
 * AFKmate Website - Main JavaScript
 * Handles navigation, FAQ accordion, scroll effects, and interactions
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================

    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const faqItems = document.querySelectorAll('.faq-item');
    const faqQuestions = document.querySelectorAll('.faq-question');

    // ============================================
    // Mobile Navigation
    // ============================================

    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking a nav link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // Close mobile menu on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // ============================================
    // Navbar Scroll Effect
    // ============================================

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // ============================================
    // FAQ Accordion
    // ============================================

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            // Add clicked effect for 0.5 seconds
            question.classList.add('clicked');
            setTimeout(() => {
                question.classList.remove('clicked');
            }, 500);

            // Close all other FAQ items
            faqItems.forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            faqItem.classList.toggle('active');
            question.setAttribute('aria-expanded', !isExpanded);
        });
    });

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Intersection Observer for Animations
    // ============================================

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .step, .pricing-card, .faq-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        animateOnScroll.observe(el);
    });

    // Add animation class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // Pricing Button Handlers
    // ============================================

    const premiumBtn = document.getElementById('premiumBtn');
    const teamBtn = document.getElementById('teamBtn');

    if (premiumBtn) {
        premiumBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Show upgrade modal or redirect to checkout
            showNotification('Premium checkout coming soon! Install the extension and use command "AFKmate: Activate Premium"');
        });
    }

    if (teamBtn) {
        teamBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Open email client or contact form
            window.location.href = 'mailto:team@afkmate.dev?subject=Team%20Plan%20Inquiry';
        });
    }

    // ============================================
    // Notification System
    // ============================================

    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            max-width: 400px;
            padding: 16px 20px;
            background: #4f5c78;
            color: #f0f8ff;
            border-radius: 8px;
            box-shadow: 0 10px 15px rgba(79, 92, 120, 0.2);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #f0f8ff;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
            opacity: 0.8;
        `;

        // Add animation keyframes
        if (!document.querySelector('#notification-styles')) {
            const notificationStyles = document.createElement('style');
            notificationStyles.id = 'notification-styles';
            notificationStyles.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(notificationStyles);
        }

        document.body.appendChild(notification);

        // Close button handler
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto-close after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // ============================================
    // Keyboard Navigation
    // ============================================

    document.addEventListener('keydown', (e) => {
        // Close mobile menu on Escape
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // ============================================
    // Form Validation (for future forms)
    // ============================================

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // ============================================
    // Analytics Events (placeholder)
    // ============================================

    function trackEvent(eventName, eventData = {}) {
        // Placeholder for analytics tracking
        // Replace with your analytics provider (e.g., Google Analytics, Mixpanel)
        console.log('Track Event:', eventName, eventData);

        // Example: Google Analytics 4
        // gtag('event', eventName, eventData);
    }

    // Track CTA clicks
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('cta_click', {
                button_text: btn.textContent.trim(),
                page_section: btn.closest('section')?.id || 'unknown'
            });
        });
    });

    // ============================================
    // Performance: Lazy Load Images
    // ============================================

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // Scrambled Text Animation (Vanilla JS)
    // Inspired by Tom Miller from the GSAP community
    // https://codepen.io/creativeocean/pen/NPWLwJM
    // ============================================

    class ScrambledText {
        constructor(element) {
            this.root = element;
            this.paragraph = element.querySelector('p');

            // Get configuration from data attributes
            this.radius = parseFloat(element.dataset.radius) || 100;
            this.duration = parseFloat(element.dataset.duration) || 1.2;
            this.speed = parseFloat(element.dataset.speed) || 0.5;
            this.scrambleChars = element.dataset.chars || '.:';

            this.chars = [];
            this.animations = new Map();
            this.handleMove = this.handleMove.bind(this);

            this.init();
        }

        init() {
            if (!this.paragraph) {
                console.warn('ScrambledText: paragraph not found');
                return;
            }

            // Split text into individual character spans
            const text = this.paragraph.textContent;
            this.paragraph.innerHTML = '';

            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = char;
                span.dataset.content = char;
                span.style.display = 'inline-block';
                span.style.willChange = 'transform';

                this.paragraph.appendChild(span);
                this.chars.push(span);
            }

            // Add pointer move listener
            this.root.addEventListener('pointermove', this.handleMove);
        }

        getRandomChar() {
            return this.scrambleChars[Math.floor(Math.random() * this.scrambleChars.length)];
        }

        handleMove(e) {
            if (!this.chars.length) return;

            this.chars.forEach(char => {
                const originalChar = char.dataset.content;

                // Skip spaces
                if (originalChar === ' ') return;

                const rect = char.getBoundingClientRect();
                const charCenterX = rect.left + rect.width / 2;
                const charCenterY = rect.top + rect.height / 2;

                const dx = e.clientX - charCenterX;
                const dy = e.clientY - charCenterY;
                const distance = Math.hypot(dx, dy);

                if (distance < this.radius) {
                    // Cancel any existing animation for this character
                    if (this.animations.has(char)) {
                        cancelAnimationFrame(this.animations.get(char).rafId);
                    }

                    const normalizedDistance = 1 - (distance / this.radius);
                    const animDuration = this.duration * normalizedDistance * 1000; // Convert to ms

                    this.scrambleChar(char, originalChar, animDuration);
                }
            });
        }

        scrambleChar(charElement, finalChar, duration) {
            const startTime = performance.now();
            const scrambleInterval = 50 / this.speed; // Time between scramble updates

            let lastScrambleTime = 0;

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Scramble effect - show random chars until near the end
                if (progress < 0.8) {
                    if (currentTime - lastScrambleTime > scrambleInterval) {
                        charElement.textContent = this.getRandomChar();
                        lastScrambleTime = currentTime;
                    }
                } else {
                    // Reveal original character
                    charElement.textContent = finalChar;
                }

                if (progress < 1) {
                    const rafId = requestAnimationFrame(animate);
                    this.animations.set(charElement, { rafId });
                } else {
                    // Ensure final character is shown
                    charElement.textContent = finalChar;
                    this.animations.delete(charElement);
                }
            };

            const rafId = requestAnimationFrame(animate);
            this.animations.set(charElement, { rafId });
        }

        destroy() {
            this.root.removeEventListener('pointermove', this.handleMove);

            // Cancel all ongoing animations
            this.animations.forEach(({ rafId }) => {
                cancelAnimationFrame(rafId);
            });
            this.animations.clear();

            // Restore original text
            if (this.paragraph && this.chars.length) {
                const originalText = this.chars.map(c => c.dataset.content).join('');
                this.paragraph.textContent = originalText;
            }
        }
    }

    // Initialize scrambled text animations
    function initScrambledText() {
        const containers = document.querySelectorAll('.scrambled-text-container');
        const instances = [];

        containers.forEach(container => {
            const instance = new ScrambledText(container);
            instances.push(instance);
        });

        // Store instances for potential cleanup
        window.scrambledTextInstances = instances;
    }

    // ============================================
    // Initialize
    // ============================================

    function init() {
        // Initial navbar state
        updateNavbar();

        // Initialize scrambled text animation
        initScrambledText();

        // Log initialization
        console.log('AFKmate website initialized');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
