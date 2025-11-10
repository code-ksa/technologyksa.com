/**
 * Technology KSA - Theme Toggle System
 * Handles Dark/Light mode switching
 */

(function() {
  'use strict';

  class ThemeManager {
    constructor() {
      this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
      this.init();
    }

    init() {
      this.applyTheme(this.currentTheme);
      this.setupEventListeners();
    }

    setupEventListeners() {
      const themeToggle = document.getElementById('themeToggle');
      if (themeToggle) {
        themeToggle.addEventListener('click', () => {
          this.toggleTheme();
        });
      }
    }

    toggleTheme() {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      this.applyTheme(this.currentTheme);
      this.saveTheme(this.currentTheme);
    }

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);

      // Update toggle button state
      const themeToggle = document.getElementById('themeToggle');
      if (themeToggle) {
        themeToggle.setAttribute('aria-label',
          theme === 'light' ? 'تبديل إلى الوضع الداكن' : 'تبديل إلى الوضع الفاتح'
        );
      }
    }

    getStoredTheme() {
      return localStorage.getItem('theme');
    }

    saveTheme(theme) {
      localStorage.setItem('theme', theme);
    }

    getSystemTheme() {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    }
  }

  // Initialize Theme Manager
  document.addEventListener('DOMContentLoaded', function() {
    new ThemeManager();
  });

  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    });
  }

})();
