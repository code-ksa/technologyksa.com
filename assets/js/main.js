/**
 * Technology KSA - Main JavaScript
 * Core functionality for the website
 */

(function() {
  'use strict';

  // ============================================
  // INITIALIZATION
  // ============================================

  document.addEventListener('DOMContentLoaded', function() {
    initAOS();
    initNavigation();
    initCounters();
    initTestimonials();
    initPortfolioFilters();
    initForms();
    initScrollEffects();
    initSearch();
    initCookieBanner();
    hideLoadingOverlay();
  });

  // ============================================
  // LOADING OVERLAY
  // ============================================

  function hideLoadingOverlay() {
    setTimeout(() => {
      const overlay = document.getElementById('loadingOverlay');
      if (overlay) {
        overlay.classList.add('hidden');
      }
    }, 500);
  }

  // ============================================
  // AOS ANIMATION INITIALIZATION
  // ============================================

  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
      });
    }
  }

  // ============================================
  // NAVIGATION
  // ============================================

  function initNavigation() {
    const header = document.getElementById('header');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky header on scroll
    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    // Mobile menu toggle
    if (mobileMenuToggle && navMenu) {
      mobileMenuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.navbar')) {
        if (navMenu) navMenu.classList.remove('active');
        if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
      }
    });

    // Smooth scroll for anchor links
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });

            // Close mobile menu
            if (navMenu) navMenu.classList.remove('active');
            if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
          }
        }
      });
    });

    // Active link on scroll
    window.addEventListener('scroll', function() {
      const sections = document.querySelectorAll('section[id]');
      const scrollY = window.pageYOffset;

      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(l => l.classList.remove('active'));
          if (link) link.classList.add('active');
        }
      });
    });

    // Dropdown menu for mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      dropdown.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          this.classList.toggle('active');
        }
      });
    });
  }

  // ============================================
  // ANIMATED COUNTERS
  // ============================================

  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const speed = 200; // Animation speed

    const animateCounter = (counter) => {
      const target = +counter.getAttribute('data-count');
      const count = +counter.innerText;
      const increment = target / speed;

      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(() => animateCounter(counter), 1);
      } else {
        counter.innerText = target;
      }
    };

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  // ============================================
  // TESTIMONIALS CAROUSEL
  // ============================================

  function initTestimonials() {
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const indicators = document.getElementById('testimonialIndicators');

    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;

    // Create indicators
    if (indicators) {
      cards.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.classList.add('carousel-indicator');
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(indicator);
      });
    }

    function updateSlider() {
      const offset = -currentIndex * 100;
      track.style.transform = `translateX(${offset}%)`;

      // Update indicators
      if (indicators) {
        const allIndicators = indicators.querySelectorAll('.carousel-indicator');
        allIndicators.forEach((indicator, index) => {
          indicator.classList.toggle('active', index === currentIndex);
        });
      }
    }

    function goToSlide(index) {
      currentIndex = index;
      updateSlider();
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % cards.length;
      updateSlider();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      updateSlider();
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Auto-play
    setInterval(nextSlide, 5000);
  }

  // ============================================
  // PORTFOLIO FILTERS
  // ============================================

  function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');

        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Filter items
        portfolioItems.forEach(item => {
          const categories = item.getAttribute('data-category');

          if (filter === 'all' || categories.includes(filter)) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // ============================================
  // FORMS
  // ============================================

  function initForms() {
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', handleContactFormSubmit);
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', handleNewsletterFormSubmit);
    }
  }

  function handleContactFormSubmit(e) {
    e.preventDefault();

    const formMessage = document.getElementById('formMessage');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Basic validation
    if (!data.name || !data.email || !data.phone || !data.message) {
      showFormMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showFormMessage('يرجى إدخال بريد إلكتروني صحيح', 'error');
      return;
    }

    // Phone validation (Saudi format)
    const phoneRegex = /^(05|5)[0-9]{8}$/;
    if (!phoneRegex.test(data.phone)) {
      showFormMessage('يرجى إدخال رقم جوال صحيح (05XXXXXXXX)', 'error');
      return;
    }

    // Simulate form submission
    // In production, send to backend API
    console.log('Form data:', data);

    showFormMessage('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
    e.target.reset();
  }

  function handleNewsletterFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    // Simulate submission
    console.log('Newsletter email:', email);

    alert('تم الاشتراك بنجاح في النشرة البريدية!');
    e.target.reset();
  }

  function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
      formMessage.textContent = message;
      formMessage.className = `form-message ${type}`;
      formMessage.style.display = 'block';

      setTimeout(() => {
        formMessage.style.display = 'none';
      }, 5000);
    }
  }

  // ============================================
  // SCROLL EFFECTS
  // ============================================

  function initScrollEffects() {
    const scrollToTopBtn = document.getElementById('scrollToTop');

    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        if (scrollToTopBtn) scrollToTopBtn.classList.add('visible');
      } else {
        if (scrollToTopBtn) scrollToTopBtn.classList.remove('visible');
      }
    });

    // Scroll to top functionality
    if (scrollToTopBtn) {
      scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  // ============================================
  // SEARCH
  // ============================================

  function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('siteSearch');

    if (searchBtn && searchModal) {
      searchBtn.addEventListener('click', function() {
        searchModal.classList.add('active');
        setTimeout(() => searchInput.focus(), 100);
      });
    }

    if (searchClose) {
      searchClose.addEventListener('click', function() {
        searchModal.classList.remove('active');
      });
    }

    // Close on overlay click
    if (searchModal) {
      searchModal.querySelector('.search-modal-overlay').addEventListener('click', function() {
        searchModal.classList.remove('active');
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        searchModal.classList.remove('active');
      }
    });

    // Search functionality
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        const resultsContainer = document.getElementById('searchResults');

        if (query.length < 2) {
          resultsContainer.innerHTML = '<p class="search-hint">ابدأ بالكتابة للبحث...</p>';
          return;
        }

        // Simulate search results
        // In production, fetch from API or search engine
        const mockResults = [
          { title: 'تطوير المواقع', url: 'ar/services/web-development.html', type: 'خدمة' },
          { title: 'تطبيقات الجوال', url: 'ar/services/mobile-apps.html', type: 'خدمة' },
          { title: 'التسويق الرقمي', url: 'ar/services/digital-marketing.html', type: 'خدمة' },
          { title: 'أفضل استراتيجيات التسويق الرقمي', url: 'ar/blog/posts/digital-marketing-strategies-2025.html', type: 'مقال' }
        ];

        const filtered = mockResults.filter(item =>
          item.title.toLowerCase().includes(query)
        );

        if (filtered.length > 0) {
          resultsContainer.innerHTML = filtered.map(item => `
            <a href="${item.url}" class="search-result-item">
              <span class="result-type">${item.type}</span>
              <h4>${item.title}</h4>
            </a>
          `).join('');
        } else {
          resultsContainer.innerHTML = '<p class="search-hint">لا توجد نتائج</p>';
        }
      });
    }
  }

  // ============================================
  // COOKIE BANNER
  // ============================================

  function initCookieBanner() {
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');

    // Check if user has already responded to cookies
    const cookieConsent = localStorage.getItem('cookieConsent');

    if (!cookieConsent) {
      setTimeout(() => {
        cookieBanner.classList.add('visible');
      }, 2000);
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.classList.remove('visible');
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.remove('visible');
      });
    }
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  // Debounce function
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

  // Get cookie
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // Set cookie
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

})();
