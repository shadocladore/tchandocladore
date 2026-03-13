/**
 * TCHANDO CLADORE PORTFOLIO
 * JavaScript Vanilla ES6+
 * Développeur Full Stack MERN & DevOps
 */

// ============================================
// DOM ELEMENTS
// ============================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;
const contactForm = document.getElementById('contactForm');
const testimonialPrev = document.querySelector('.testimonial-prev');
const testimonialNext = document.querySelector('.testimonial-next');
const testimonialCards = document.querySelectorAll('.testimonial-card');

// ============================================
// THEME MANAGEMENT
// ============================================

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        html.classList.add('light-mode');
    }
}

themeToggle.addEventListener('click', () => {
    html.classList.toggle('light-mode');
    const isLight = html.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// ============================================
// HAMBURGER MENU
// ============================================

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const isActive = navMenu.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isActive);
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', false);
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll(
    '.project-card, .skill-card, .devops-card, .highlight, .testimonial-card'
).forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// ============================================
// TESTIMONIALS SLIDER
// ============================================

let currentTestimonialIndex = 0;
const testimonialsPerView = getTestimonialsPerView();

function getTestimonialsPerView() {
    if (window.innerWidth < 768) return 1;
    return 3;
}

function showTestimonial(index) {
    const totalCards = testimonialCards.length;
    
    // Clamp index between 0 and available slides
    currentTestimonialIndex = Math.max(0, Math.min(index, totalCards - testimonialsPerView));
    
    testimonialCards.forEach((card, i) => {
        card.style.opacity = '0.5';
        card.style.transform = 'scale(0.95)';
        
        if (i >= currentTestimonialIndex && i < currentTestimonialIndex + testimonialsPerView) {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }
    });
}

testimonialPrev.addEventListener('click', () => {
    showTestimonial(currentTestimonialIndex - 1);
});

testimonialNext.addEventListener('click', () => {
    showTestimonial(currentTestimonialIndex + 1);
});

window.addEventListener('resize', () => {
    const newTestimonialsPerView = getTestimonialsPerView();
    if (newTestimonialsPerView !== testimonialsPerView) {
        showTestimonial(currentTestimonialIndex);
    }
});

// Initialize testimonials
showTestimonial(0);

// ============================================
// FORM VALIDATION
// ============================================

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const clearError = (fieldId) => {
    const errorElement = document.getElementById(`${fieldId}Error`);
    if (errorElement) {
        errorElement.textContent = '';
    }
};

const showError = (fieldId, message) => {
    const errorElement = document.getElementById(`${fieldId}Error`);
    if (errorElement) {
        errorElement.textContent = message;
    }
};

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const feedback = document.getElementById('formFeedback');

    let isValid = true;

    // Clear previous errors
    ['name', 'email', 'subject', 'message'].forEach(field => clearError(field));
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    // Validate
    if (!name || name.length < 2) {
        showError('name', 'Le nom doit contenir au moins 2 caractères');
        isValid = false;
    }

    if (!email || !validateEmail(email)) {
        showError('email', 'Veuillez entrer un email valide');
        isValid = false;
    }

    if (!subject || subject.length < 3) {
        showError('subject', 'Le sujet doit contenir au moins 3 caractères');
        isValid = false;
    }

    if (!message || message.length < 10) {
        showError('message', 'Le message doit contenir au moins 10 caractères');
        isValid = false;
    }

    if (isValid) {
        feedback.classList.add('success');
        feedback.textContent = '✓ Message envoyé avec succès ! Je vous répondrai bientôt.';
        
        contactForm.reset();
        
        setTimeout(() => {
            feedback.classList.remove('success');
            feedback.textContent = '';
        }, 5000);
    }
});

// ============================================
// SMOOTH FOCUS EFFECT ON INPUTS
// ============================================

const inputs = document.querySelectorAll('input, textarea');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.borderColor = 'var(--primary)';
    });

    input.addEventListener('blur', function() {
        this.parentElement.style.borderColor = '';
    });
});

// ============================================
// SMOOTH SCROLL NAVIGATION
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// PROGRESS BARS ANIMATION
// ============================================

window.addEventListener('load', () => {
    document.querySelectorAll('.skill-level').forEach(fill => {
        const width = fill.style.width;
        fill.style.width = '0';
        setTimeout(() => {
            fill.style.width = width;
        }, 100);
    });
});

// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', false);
    }
    
    // Testimonials navigation with arrow keys
    if (e.key === 'ArrowLeft') {
        testimonialPrev.click();
    }
    if (e.key === 'ArrowRight') {
        testimonialNext.click();
    }
});

// ============================================
// INITIALIZATION
// ============================================

initTheme();

console.log('✓ Portfolio Tchando Cladore - Initialized');
