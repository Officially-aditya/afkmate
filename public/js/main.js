/**
 * AFKmate — Main JavaScript
 * Lenis Smooth Scroll + GSAP ScrollTrigger + 3D Effects + Theme Toggle
 */

(function () {
    'use strict';

    // ============================================
    // Theme Toggle
    // ============================================

    const THEME_KEY = 'afkmate-theme';

    function getPreferredTheme() {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored) return stored;
        return 'dark';
    }

    function setTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem(THEME_KEY, theme);
    }

    setTheme(getPreferredTheme());

    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'light' ? 'dark' : 'light');
        });
    });

    // ============================================
    // Lenis Smooth Scroll
    // ============================================

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // ============================================
    // DOM Elements
    // ============================================

    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const codeWindow = document.getElementById('codeWindow');

    // ============================================
    // Mobile Navigation
    // ============================================

    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        const isOpen = navLinks.classList.contains('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
        if (isOpen) {
            lenis.stop();
        } else {
            lenis.start();
        }
    }

    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
        lenis.start();
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    closeMobileMenu();
                }
            });
        });
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // ============================================
    // Navbar Scroll Effect
    // ============================================

    if (navbar) {
        ScrollTrigger.create({
            trigger: 'body',
            start: 'top -50px',
            onEnter: () => navbar.classList.add('scrolled'),
            onLeaveBack: () => navbar.classList.remove('scrolled'),
        });
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target, {
                    offset: -72,
                    duration: 1.2,
                });
            }
        });
    });

    // ============================================
    // Hero Animations
    // ============================================

    const heroTl = gsap.timeline({ delay: 0.2 });

    heroTl
        .from('.hero-badge', {
            y: -30,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
        })
        .from(
            '.title-line',
            {
                y: 60,
                opacity: 0,
                rotateX: -15,
                duration: 0.9,
                stagger: 0.15,
                ease: 'power3.out',
            },
            '-=0.3'
        )
        .from(
            '.hero-description',
            {
                y: 40,
                opacity: 0,
                duration: 0.7,
                ease: 'power3.out',
            },
            '-=0.5'
        )
        .from(
            '.hero-cta .btn',
            {
                y: 30,
                opacity: 0,
                scale: 0.9,
                duration: 0.6,
                stagger: 0.1,
                ease: 'back.out(1.7)',
            },
            '-=0.4'
        )
        .from(
            '.hero-stats .stat, .hero-stats .stat-divider',
            {
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power2.out',
            },
            '-=0.3'
        )
        .from(
            '.code-window',
            {
                x: 80,
                opacity: 0,
                rotateY: -15,
                scale: 0.9,
                duration: 1,
                ease: 'power3.out',
            },
            '-=0.8'
        )
        .from(
            '.float-element',
            {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'back.out(2)',
            },
            '-=0.5'
        );

    // ============================================
    // 3D Mouse Parallax on Code Window
    // ============================================

    if (codeWindow) {
        const heroVisual = codeWindow.closest('.hero-visual');

        if (heroVisual) {
            heroVisual.addEventListener('mousemove', (e) => {
                const rect = heroVisual.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 8;
                const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -5;

                gsap.to(codeWindow, {
                    rotateY: rotateY,
                    rotateX: rotateX,
                    duration: 0.5,
                    ease: 'power2.out',
                    transformPerspective: 1200,
                });

                gsap.to('.float-element', {
                    x: -rotateY * 2,
                    y: rotateX * 2,
                    duration: 0.6,
                    stagger: 0.05,
                    ease: 'power2.out',
                });
            });

            heroVisual.addEventListener('mouseleave', () => {
                gsap.to(codeWindow, {
                    rotateY: 0,
                    rotateX: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                });
                gsap.to('.float-element', {
                    x: 0,
                    y: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                });
            });
        }
    }

    // ============================================
    // Feature Cards — Scroll + 3D Tilt
    // ============================================

    const featureCards = gsap.utils.toArray('.feature-card');

    featureCards.forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 60,
            opacity: 0,
            scale: 0.92,
            rotateX: 8,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateY = ((x - centerX) / centerX) * 6;
            const rotateX = ((y - centerY) / centerY) * -4;

            gsap.to(card, {
                rotateY: rotateY,
                rotateX: rotateX,
                duration: 0.3,
                ease: 'power2.out',
                transformPerspective: 800,
            });

            const shine = card.querySelector('.card-shine');
            if (shine) {
                const percentX = (x / rect.width) * 100;
                shine.style.background = `linear-gradient(
                    ${115 + (percentX - 50)}deg,
                    transparent 0%,
                    transparent 35%,
                    rgba(255, 255, 255, 0.03) 42%,
                    rgba(255, 255, 255, 0.08) 50%,
                    rgba(255, 255, 255, 0.03) 58%,
                    transparent 65%,
                    transparent 100%
                )`;
                shine.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateY: 0,
                rotateX: 0,
                duration: 0.5,
                ease: 'power3.out',
            });
            const shine = card.querySelector('.card-shine');
            if (shine) {
                shine.style.opacity = '0';
            }
        });
    });

    // ============================================
    // How It Works — Step Reveal + Timeline
    // ============================================

    const steps = gsap.utils.toArray('.step');

    const timelineProgress = document.getElementById('timelineProgress');
    if (timelineProgress) {
        gsap.to(timelineProgress, {
            scrollTrigger: {
                trigger: '.steps-container',
                start: 'top 60%',
                end: 'bottom 40%',
                scrub: 0.5,
            },
            strokeDashoffset: 0,
            ease: 'none',
        });
    }

    steps.forEach((step, i) => {
        gsap.from(step, {
            scrollTrigger: {
                trigger: step,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
            x: i % 2 === 0 ? -60 : 60,
            y: 30,
            opacity: 0,
            rotateY: i % 2 === 0 ? -8 : 8,
            duration: 0.9,
            ease: 'power3.out',
        });

        gsap.from(step.querySelector('.step-number'), {
            scrollTrigger: {
                trigger: step,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
            scale: 0,
            rotation: -90,
            duration: 0.6,
            delay: 0.3,
            ease: 'back.out(2)',
        });

        const icon = step.querySelector('.step-icon');
        if (icon) {
            gsap.from(icon, {
                scrollTrigger: {
                    trigger: step,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
                scale: 0,
                rotation: 180,
                duration: 0.6,
                delay: 0.4,
                ease: 'back.out(1.7)',
            });
        }
    });

    // ============================================
    // Pricing Cards — Scroll + 3D Tilt
    // ============================================

    const pricingCards = gsap.utils.toArray('.pricing-card');

    pricingCards.forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 80,
            opacity: 0,
            scale: 0.88,
            rotateX: 10,
            duration: 0.9,
            delay: i * 0.15,
            ease: 'power3.out',
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateY = ((x - centerX) / centerX) * 5;
            const rotateX = ((y - centerY) / centerY) * -3;

            gsap.to(card, {
                rotateY: rotateY,
                rotateX: rotateX,
                duration: 0.3,
                ease: 'power2.out',
                transformPerspective: 800,
            });

            const shine = card.querySelector('.card-shine');
            if (shine) {
                const percentX = (x / rect.width) * 100;
                shine.style.background = `linear-gradient(
                    ${115 + (percentX - 50)}deg,
                    transparent 0%,
                    transparent 35%,
                    rgba(255, 255, 255, 0.03) 42%,
                    rgba(255, 255, 255, 0.08) 50%,
                    rgba(255, 255, 255, 0.03) 58%,
                    transparent 65%,
                    transparent 100%
                )`;
                shine.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateY: 0,
                rotateX: 0,
                duration: 0.5,
                ease: 'power3.out',
            });
            const shine = card.querySelector('.card-shine');
            if (shine) {
                shine.style.opacity = '0';
            }
        });
    });

    // ============================================
    // FAQ — Slide in + Accordion
    // ============================================

    const faqItems = gsap.utils.toArray('.faq-item');

    faqItems.forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 88%',
                toggleActions: 'play none none none',
            },
            x: i % 2 === 0 ? -40 : 40,
            opacity: 0,
            duration: 0.7,
            delay: i * 0.08,
            ease: 'power3.out',
        });
    });

    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            faqItem.classList.toggle('active');
            question.setAttribute('aria-expanded', !isExpanded);
        });
    });

    // ============================================
    // CTA Section — Scale + Glow
    // ============================================

    gsap.from('.cta-content', {
        scrollTrigger: {
            trigger: '.cta',
            start: 'top 75%',
            toggleActions: 'play none none none',
        },
        y: 60,
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: 'power3.out',
    });

    gsap.from('.cta-glow', {
        scrollTrigger: {
            trigger: '.cta',
            start: 'top 75%',
            toggleActions: 'play none none none',
        },
        scale: 0,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
        ease: 'power2.out',
    });

    // ============================================
    // Footer — Staggered Reveal
    // ============================================

    gsap.from('.footer-grid > *', {
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 85%',
            toggleActions: 'play none none none',
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
    });

    gsap.from('.footer-bottom', {
        scrollTrigger: {
            trigger: '.footer-bottom',
            start: 'top 95%',
            toggleActions: 'play none none none',
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
    });

    // ============================================
    // Section Titles — Parallax
    // ============================================

    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
        });
    });

    gsap.utils.toArray('.section-description').forEach(desc => {
        gsap.from(desc, {
            scrollTrigger: {
                trigger: desc,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            y: 30,
            opacity: 0,
            duration: 0.7,
            delay: 0.15,
            ease: 'power3.out',
        });
    });

    // ============================================
    // Parallax Backgrounds on Scroll
    // ============================================

    gsap.utils.toArray('.hero-orb').forEach(orb => {
        gsap.to(orb, {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            },
            y: -100,
            ease: 'none',
        });
    });

    // ============================================
    // Pricing Button Handlers
    // ============================================

    const premiumBtn = document.getElementById('premiumBtn');
    const powerBtn = document.getElementById('powerBtn');

    if (premiumBtn) {
        premiumBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Install the extension and run "AFKmate: View Plans / Manage Subscription" from the Command Palette.');
        });
    }

    if (powerBtn) {
        powerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Install the extension and run "AFKmate: View Plans / Manage Subscription" from the Command Palette.');
        });
    }

    // ============================================
    // Notification System
    // ============================================

    function showNotification(message) {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close" aria-label="Close">&times;</button>
        `;

        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            maxWidth: '420px',
            padding: '16px 20px',
            background: 'rgba(121, 183, 145, 0.15)',
            backdropFilter: 'blur(16px)',
            color: '#f1f5f9',
            border: '1px solid rgba(121, 183, 145, 0.3)',
            borderRadius: '12px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: '10000',
            fontSize: '0.9rem',
            lineHeight: '1.5',
        });

        gsap.set(notification, { x: 120, opacity: 0 });
        document.body.appendChild(notification);
        gsap.to(notification, { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });

        const closeBtn = notification.querySelector('.notification-close');
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            color: '#f1f5f9',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0',
            lineHeight: '1',
            opacity: '0.7',
            flexShrink: '0',
        });

        const dismiss = () => {
            gsap.to(notification, {
                x: 120,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => notification.remove(),
            });
        };

        closeBtn.addEventListener('click', dismiss);
        setTimeout(dismiss, 5000);
    }

    // ============================================
    // Keyboard Navigation
    // ============================================

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
})();
