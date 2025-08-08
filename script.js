// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = navToggle.querySelectorAll('.bar');
        bars[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : '';
        bars[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        bars[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(7px, -6px)' : '';
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const bars = navToggle.querySelectorAll('.bar');
            bars[0].style.transform = '';
            bars[1].style.opacity = '1';
            bars[2].style.transform = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('active');
            const bars = navToggle.querySelectorAll('.bar');
            bars[0].style.transform = '';
            bars[1].style.opacity = '1';
            bars[2].style.transform = '';
        }
    });
});

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Add stagger effect for multiple elements
                const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                entry.target.style.animationDelay = `${delay}ms`;
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navbar background on scroll
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(13, 12, 29, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(13, 12, 29, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Button hover effects
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Card hover effects
function initCardEffects() {
    const cards = document.querySelectorAll('.feature-card, .content-card, .team-member, .advantage-card, .faq-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Form enhancements
function initFormEnhancements() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea, select');
    
    // Add floating label effect
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentNode.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value !== '') {
            input.parentNode.classList.add('focused');
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            submitButton.textContent = 'Message Sent!';
            submitButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.background = '';
                form.reset();
            }, 2000);
        }, 1500);
    });
}

// Parallax effect for hero elements (disabled - using Galaxy background)
function initParallaxEffects() {
    // Galaxy background handles its own animations
    return;
}

// Text typing effect
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const text = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);
}

// Counter animation
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number, .response-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const increment = target / 200;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + (counter.textContent.includes('%') ? '%' : counter.textContent.includes('+') ? '+' : counter.textContent.includes('hrs') ? 'hrs' : '');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = counter.dataset.originalText || counter.textContent;
            }
        };
        
        counter.dataset.originalText = counter.textContent;
        updateCounter();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Cursor trail effect
function initCursorTrail() {
    const trail = [];
    const trailLength = 20;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-dot';
        dot.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: linear-gradient(135deg, var(--color-main), var(--color-secondary));
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: ${1 - i / trailLength};
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }
    
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    const updateTrail = () => {
        trail.forEach((dot, index) => {
            const nextDot = trail[index + 1] || { offsetLeft: mouseX, offsetTop: mouseY };
            
            dot.style.left = nextDot.offsetLeft + 'px';
            dot.style.top = nextDot.offsetTop + 'px';
            
            if (index === 0) {
                dot.style.left = mouseX + 'px';
                dot.style.top = mouseY + 'px';
            }
        });
        
        requestAnimationFrame(updateTrail);
    };
    
    updateTrail();
}

// Initialize Galaxy background
function initGalaxyBackground() {
    const galaxyContainer = document.getElementById('galaxy-container');
    if (galaxyContainer && window.Galaxy) {
        new Galaxy(galaxyContainer, {
            focal: [0.5, 0.5],
            rotation: [1.0, 0.0],
            starSpeed: 0.3,
            density: 0.8,
            hueShift: 140,
            speed: 0.8,
            mouseInteraction: true,
            glowIntensity: 0.4,
            saturation: 0.2,
            mouseRepulsion: true,
            repulsionStrength: 1.5,
            twinkleIntensity: 0.4,
            rotationSpeed: 0.05,
            transparent: false
        });
    }
}

// Initialize Cubes animation
function initCubesAnimation() {
    const cubesContainer = document.getElementById('cubes-container');
    if (cubesContainer && window.Cubes && window.gsap) {
        new Cubes(cubesContainer, {
            gridSize: 8,
            cubeSize: null,
            maxAngle: 35,
            radius: 2.5,
            easing: "power3.out",
            duration: { enter: 0.4, leave: 0.8 },
            cellGap: { col: 8, row: 8 },
            borderStyle: `1px solid ${getComputedStyle(document.documentElement).getPropertyValue('--color-main').trim()}`,
            faceColor: getComputedStyle(document.documentElement).getPropertyValue('--color-support').trim(),
            shadow: `0 0 10px rgba(177, 140, 255, 0.3)`,
            autoAnimate: true,
            rippleOnClick: true,
            rippleColor: getComputedStyle(document.documentElement).getPropertyValue('--color-main').trim(),
            rippleSpeed: 1.5
        });
    }
}

// Initialize all effects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initSmoothScrolling();
    initNavbarScroll();
    initButtonEffects();
    initCardEffects();
    initFormEnhancements();
    initParallaxEffects();
    initCounterAnimation();
    initGalaxyBackground();
    initCubesAnimation();
    
    // Optional: Enable cursor trail on desktop only
    if (window.innerWidth > 768) {
        initCursorTrail();
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll-heavy functions
window.addEventListener('scroll', debounce(initNavbarScroll, 10));