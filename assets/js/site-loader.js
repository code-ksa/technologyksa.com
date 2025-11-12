/**
 * Technology KSA - Site Loader
 * يحمل الإعدادات والقوائم ديناميكياً من localStorage
 * يضمن اتصال جميع الصفحات بنظام إدارة المحتوى
 */

class SiteLoader {
  constructor() {
    this.settings = {};
    this.menus = {};
    this.pages = [];
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================

  init() {
    this.loadSettings();
    this.loadMenus();
    this.loadPages();
    this.applySettings();
    this.renderHeader();
    this.renderFooter();
    this.updateAllLinks();
  }

  // ==========================================
  // DATA LOADING
  // ==========================================

  loadSettings() {
    const stored = localStorage.getItem('techksa_site_settings');
    this.settings = stored ? JSON.parse(stored) : this.getDefaultSettings();
  }

  loadMenus() {
    const stored = localStorage.getItem('techksa_menus');
    const menusArray = stored ? JSON.parse(stored) : [];

    // Convert array to object for easy access by location
    this.menus = {};
    menusArray.forEach(menu => {
      this.menus[menu.location] = menu;
    });
  }

  loadPages() {
    const stored = localStorage.getItem('techksa_pages');
    this.pages = stored ? JSON.parse(stored) : [];
  }

  getDefaultSettings() {
    return {
      siteName: 'تكنولوجيا السعودية',
      siteNameEn: 'Technology KSA',
      siteDescription: 'شركة تكنولوجيا السعودية - وكالة رقمية رائدة',
      logo: '/assets/images/logo.png',
      logoLight: '/assets/images/logo-light.png',
      logoDark: '/assets/images/logo-dark.png',
      phone: '+966 50 123 4567',
      email: 'info@technologyksa.com',
      whatsapp: '+966501234567',
      address: 'الرياض، المملكة العربية السعودية',
      socialMedia: {
        facebook: 'https://facebook.com/',
        twitter: 'https://twitter.com/',
        linkedin: 'https://linkedin.com/',
        instagram: 'https://instagram.com/',
        youtube: 'https://youtube.com/'
      },
      headerTheme: 'auto',
      headerPosition: 'static',
      showSearch: 'yes',
      showLanguageSwitcher: 'yes',
      headerCtaText: 'احجز استشارة',
      headerCtaLink: '#contact',
      footerCopyright: `© ${new Date().getFullYear()} تكنولوجيا السعودية. جميع الحقوق محفوظة.`
    };
  }

  // ==========================================
  // APPLY SETTINGS
  // ==========================================

  applySettings() {
    // Update document title
    if (this.settings.siteName) {
      const pageTitle = document.querySelector('title');
      if (pageTitle && !pageTitle.textContent.includes('|')) {
        document.title = `${pageTitle.textContent} | ${this.settings.siteName}`;
      }
    }

    // Update meta description
    if (this.settings.siteDescription) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = this.settings.siteDescription;
    }

    // Update favicon
    if (this.settings.favicon) {
      let favicon = document.querySelector('link[rel="icon"]');
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = this.settings.favicon;
    }

    // Apply header position
    if (this.settings.headerPosition) {
      const header = document.querySelector('.site-header');
      if (header) {
        header.classList.remove('header-static', 'header-fixed', 'header-sticky');
        header.classList.add(`header-${this.settings.headerPosition}`);
      }
    }
  }

  // ==========================================
  // HEADER RENDERING
  // ==========================================

  renderHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const headerMenu = this.menus['header'];
    const menuHTML = headerMenu ? this.renderMenuItems(headerMenu.items) : this.getDefaultMenuHTML();

    // Determine logo based on theme
    let logoSrc = this.settings.logo;
    if (this.settings.headerTheme === 'dark' && this.settings.logoDark) {
      logoSrc = this.settings.logoDark;
    } else if (this.settings.headerTheme === 'light' && this.settings.logoLight) {
      logoSrc = this.settings.logoLight;
    }

    header.innerHTML = `
      <div class="container">
        <nav class="navbar">
          <a href="/" class="logo">
            <img src="${logoSrc}" alt="${this.settings.siteName}">
          </a>

          <ul class="nav-menu" id="navMenu">
            ${menuHTML}
          </ul>

          <div class="nav-actions">
            ${this.settings.showSearch === 'yes' ? `
              <button class="btn-icon" id="searchBtn" aria-label="البحث">
                <i class="fas fa-search"></i>
              </button>
            ` : ''}
            ${this.settings.showLanguageSwitcher === 'yes' ? `
              <button class="btn-icon" id="langBtn" aria-label="تبديل اللغة">
                <i class="fas fa-globe"></i>
              </button>
            ` : ''}
            ${this.settings.headerCtaText ? `
              <a href="${this.settings.headerCtaLink}" class="btn btn-primary">
                ${this.settings.headerCtaText}
              </a>
            ` : ''}
            <button class="menu-toggle" id="menuToggle" aria-label="القائمة">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </div>
    `;

    // Add mobile menu toggle functionality
    this.initMobileMenu();
  }

  getDefaultMenuHTML() {
    return `
      <li><a href="/" class="active">الرئيسية</a></li>
      <li><a href="/services">خدماتنا</a></li>
      <li><a href="/portfolio">أعمالنا</a></li>
      <li><a href="/blog">المدونة</a></li>
      <li><a href="#contact">اتصل بنا</a></li>
    `;
  }

  renderMenuItems(items) {
    if (!items || items.length === 0) return this.getDefaultMenuHTML();

    return items.map(item => `
      <li><a href="${item.url}">${item.title}</a></li>
    `).join('');
  }

  // ==========================================
  // FOOTER RENDERING
  // ==========================================

  renderFooter() {
    const footer = document.querySelector('.site-footer');
    if (!footer) return;

    const footerLayout = this.settings.footerLayout || '3-columns';
    const columnsCount = parseInt(footerLayout.charAt(0));

    let columnsHTML = '';
    for (let i = 1; i <= columnsCount; i++) {
      const menu = this.menus[`footer-${i}`];
      const menuId = this.settings[`footerMenu${i}`];

      // Find menu by ID if specified in settings
      const selectedMenu = menuId ?
        Object.values(this.menus).find(m => m.id === menuId) :
        menu;

      if (selectedMenu && selectedMenu.items && selectedMenu.items.length > 0) {
        columnsHTML += `
          <div class="footer-column">
            <h4>${selectedMenu.name}</h4>
            <ul class="footer-links">
              ${selectedMenu.items.map(item => `
                <li><a href="${item.url}">${item.title}</a></li>
              `).join('')}
            </ul>
          </div>
        `;
      }
    }

    footer.innerHTML = `
      ${this.settings.showFooterCta === 'yes' ? `
        <div class="footer-cta">
          <div class="container">
            <h3>هل أنت جاهز لبدء مشروعك؟</h3>
            <p>تواصل معنا اليوم واحصل على استشارة مجانية</p>
            <a href="${this.settings.headerCtaLink || '#contact'}" class="btn btn-primary">
              ${this.settings.headerCtaText || 'تواصل معنا'}
            </a>
          </div>
        </div>
      ` : ''}

      <div class="container">
        <div class="footer-content">
          <div class="footer-column">
            <div class="footer-brand">
              <img src="${this.settings.logo}" alt="${this.settings.siteName}">
              <p>${this.settings.siteDescription || ''}</p>
            </div>
            <div class="footer-contact">
              ${this.settings.phone ? `<p><i class="fas fa-phone"></i> ${this.settings.phone}</p>` : ''}
              ${this.settings.email ? `<p><i class="fas fa-envelope"></i> ${this.settings.email}</p>` : ''}
              ${this.settings.address ? `<p><i class="fas fa-map-marker-alt"></i> ${this.settings.address}</p>` : ''}
            </div>
          </div>

          ${columnsHTML}

          <div class="footer-column">
            <h4>تابعنا</h4>
            <div class="social-links">
              ${this.renderSocialLinks()}
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>${this.settings.footerCopyright || `© ${new Date().getFullYear()} ${this.settings.siteName}. جميع الحقوق محفوظة.`}</p>
        </div>
      </div>
    `;
  }

  renderSocialLinks() {
    const social = this.settings.socialMedia || {};
    let html = '';

    if (social.facebook) html += `<a href="${social.facebook}" target="_blank" rel="noopener"><i class="fab fa-facebook"></i></a>`;
    if (social.twitter) html += `<a href="${social.twitter}" target="_blank" rel="noopener"><i class="fab fa-twitter"></i></a>`;
    if (social.linkedin) html += `<a href="${social.linkedin}" target="_blank" rel="noopener"><i class="fab fa-linkedin"></i></a>`;
    if (social.instagram) html += `<a href="${social.instagram}" target="_blank" rel="noopener"><i class="fab fa-instagram"></i></a>`;
    if (social.youtube) html += `<a href="${social.youtube}" target="_blank" rel="noopener"><i class="fab fa-youtube"></i></a>`;

    return html;
  }

  // ==========================================
  // MOBILE MENU
  // ==========================================

  initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
          navMenu.classList.remove('active');
          menuToggle.classList.remove('active');
        }
      });
    }
  }

  // ==========================================
  // LINK UPDATES
  // ==========================================

  updateAllLinks() {
    // Highlight current page in navigation (Clean URLs)
    const currentPath = window.location.pathname;

    document.querySelectorAll('.nav-menu a, .footer-links a').forEach(link => {
      const href = link.getAttribute('href');

      // Handle root page
      if (currentPath === '/' || currentPath === '/index.html' || currentPath === '/index') {
        if (href === '/' || href === '/index' || href === 'index.html') {
          link.classList.add('active');
        }
      }
      // Handle other pages
      else {
        // Remove trailing slash and .html for comparison
        const cleanPath = currentPath.replace(/\/$/, '').replace(/\.html$/, '');
        const cleanHref = href.replace(/\/$/, '').replace(/\.html$/, '');

        if (cleanHref === cleanPath || href === currentPath) {
          link.classList.add('active');
        }
      }
    });

    // Add WhatsApp functionality if available
    if (this.settings.whatsapp) {
      document.querySelectorAll('a[href*="whatsapp"]').forEach(link => {
        if (!link.getAttribute('href').startsWith('https://')) {
          link.href = `https://wa.me/${this.settings.whatsapp.replace(/[^0-9]/g, '')}`;
        }
      });
    }
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  getSetting(key, defaultValue = '') {
    return this.settings[key] || defaultValue;
  }

  getMenu(location) {
    return this.menus[location] || null;
  }

  getPage(slug) {
    return this.pages.find(p => p.slug === slug);
  }
}

// ==========================================
// AUTO-INITIALIZE
// ==========================================

let siteLoader;

document.addEventListener('DOMContentLoaded', () => {
  siteLoader = new SiteLoader();
  siteLoader.init();
});

// Make available globally
if (typeof window !== 'undefined') {
  window.SiteLoader = SiteLoader;
  window.siteLoader = siteLoader;
}
