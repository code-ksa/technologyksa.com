/**
 * Technology KSA - Language Switching System
 * Handles Arabic/English language switching with RTL/LTR support
 */

(function() {
  'use strict';

  class LanguageManager {
    constructor() {
      this.currentLang = this.getStoredLanguage() || this.detectLanguageFromURL() || 'ar';
      this.init();
    }

    init() {
      this.applyLanguage(this.currentLang);
      this.setupEventListeners();
    }

    setupEventListeners() {
      const langBtns = document.querySelectorAll('.lang-btn');
      langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const lang = e.target.dataset.lang;
          this.switchLanguage(lang);
        });
      });
    }

    switchLanguage(lang) {
      if (lang === this.currentLang) return;

      this.currentLang = lang;
      localStorage.setItem('preferred_language', lang);

      // Determine target URL
      const currentPath = window.location.pathname;
      let targetPath;

      if (lang === 'ar') {
        // Switch to Arabic
        if (currentPath.includes('/en/')) {
          targetPath = currentPath.replace('/en/', '/ar/');
        } else if (currentPath === '/' || currentPath === '/index.html') {
          // Already on Arabic homepage
          targetPath = '/';
        } else {
          targetPath = '/ar/';
        }
      } else {
        // Switch to English
        if (currentPath.includes('/ar/')) {
          targetPath = currentPath.replace('/ar/', '/en/');
        } else if (currentPath === '/' || currentPath === '/index.html') {
          targetPath = '/en/index.html';
        } else {
          targetPath = '/en/';
        }
      }

      // Redirect to target URL
      window.location.href = targetPath;
    }

    applyLanguage(lang) {
      const html = document.documentElement;

      if (lang === 'ar') {
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
        document.body.classList.add('rtl');
        document.body.classList.remove('ltr');
      } else {
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
        document.body.classList.add('ltr');
        document.body.classList.remove('rtl');
      }

      // Update active button state
      document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
      });
    }

    detectLanguageFromURL() {
      const path = window.location.pathname;
      if (path.includes('/ar/')) {
        return 'ar';
      } else if (path.includes('/en/')) {
        return 'en';
      } else if (path === '/' || path === '/index.html') {
        return 'ar'; // Root is Arabic
      }
      return null;
    }

    getStoredLanguage() {
      return localStorage.getItem('preferred_language');
    }

    detectBrowserLanguage() {
      const browserLang = navigator.language || navigator.userLanguage;
      return browserLang.startsWith('ar') ? 'ar' : 'en';
    }
  }

  // Initialize Language Manager
  document.addEventListener('DOMContentLoaded', function() {
    new LanguageManager();
  });

})();
