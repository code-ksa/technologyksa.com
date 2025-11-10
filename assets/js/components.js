/**
 * Technology KSA - Reusable Components System
 * نظام المكونات القابلة لإعادة الاستخدام
 */

class ComponentsManager {
  constructor() {
    this.settings = this.loadSettings();
  }

  loadSettings() {
    const stored = localStorage.getItem('techksa_site_settings');
    return stored ? JSON.parse(stored) : this.getDefaultSettings();
  }

  getDefaultSettings() {
    return {
      siteName: 'تكنولوجيا السعودية',
      siteNameEn: 'Technology KSA',
      logo: 'assets/images/logo.png',
      phone: '+966 50 123 4567',
      email: 'info@technologyksa.com',
      address: 'الرياض، المملكة العربية السعودية',
      socialMedia: {
        facebook: '#',
        twitter: '#',
        linkedin: '#',
        instagram: '#',
        youtube: '#'
      }
    };
  }

  // ==========================================
  // HEADER COMPONENT
  // ==========================================

  renderHeader(currentPage = 'home') {
    const isHomePage = currentPage === 'home';
    const baseUrl = isHomePage ? '' : '../../';

    return `
      <!-- Header/Navigation -->
      <header class="header" id="header">
        <nav class="navbar container">
          <!-- Logo -->
          <a href="${baseUrl}index.html" class="logo">
            <img src="${baseUrl}${this.settings.logo}" alt="${this.settings.siteName}" class="logo-img" onerror="this.style.display='none'">
            <span class="logo-text">${this.settings.siteName}</span>
          </a>

          <!-- Main Navigation -->
          <ul class="nav-menu" id="navMenu">
            <li><a href="${baseUrl}index.html#home" class="nav-link ${currentPage === 'home' ? 'active' : ''}">الرئيسية</a></li>
            <li><a href="${baseUrl}index.html#about" class="nav-link">من نحن</a></li>
            <li class="dropdown">
              <a href="${baseUrl}index.html#services" class="nav-link">خدماتنا <i class="fas fa-chevron-down"></i></a>
              <div class="dropdown-menu" id="servicesDropdown">
                <!-- Services will be loaded dynamically -->
              </div>
            </li>
            <li><a href="${baseUrl}ar/portfolio/" class="nav-link ${currentPage === 'portfolio' ? 'active' : ''}">أعمالنا</a></li>
            <li><a href="${baseUrl}ar/blog/" class="nav-link ${currentPage === 'blog' ? 'active' : ''}">المدونة</a></li>
            <li><a href="${baseUrl}index.html#contact" class="nav-link">اتصل بنا</a></li>
          </ul>

          <!-- Right Side Actions -->
          <div class="nav-actions">
            <!-- Search Icon -->
            <button class="search-btn" id="searchBtn" aria-label="بحث">
              <i class="fas fa-search"></i>
            </button>

            <!-- Language Switcher -->
            <div class="language-switcher">
              <button class="lang-btn active" data-lang="ar">عربي</button>
              <button class="lang-btn" data-lang="en">EN</button>
            </div>

            <!-- Theme Toggle (Dark/Light) -->
            <button class="theme-toggle" id="themeToggle" aria-label="تبديل الوضع">
              <i class="fas fa-sun sun-icon"></i>
              <i class="fas fa-moon moon-icon"></i>
            </button>

            <!-- Mobile Menu Toggle -->
            <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="القائمة">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </header>
    `;
  }

  // ==========================================
  // FOOTER COMPONENT
  // ==========================================

  renderFooter(currentPage = 'home') {
    const isHomePage = currentPage === 'home';
    const baseUrl = isHomePage ? '' : '../../';

    return `
      <!-- Footer -->
      <footer class="footer">
        <div class="footer-main">
          <div class="container">
            <div class="footer-grid">
              <!-- Company Info -->
              <div class="footer-column">
                <a href="${baseUrl}index.html" class="footer-logo">
                  <img src="${baseUrl}${this.settings.logo}" alt="${this.settings.siteName}" onerror="this.style.display='none'">
                  <span>${this.settings.siteName}</span>
                </a>
                <p class="footer-description">
                  شركة تكنولوجيا السعودية - وكالة رقمية رائدة متخصصة في تقديم حلول تقنية شاملة ومتكاملة منذ 2010
                </p>

                <div class="footer-social">
                  <a href="${this.settings.socialMedia.facebook}" class="social-link" aria-label="Facebook">
                    <i class="fab fa-facebook-f"></i>
                  </a>
                  <a href="${this.settings.socialMedia.twitter}" class="social-link" aria-label="Twitter">
                    <i class="fab fa-twitter"></i>
                  </a>
                  <a href="${this.settings.socialMedia.linkedin}" class="social-link" aria-label="LinkedIn">
                    <i class="fab fa-linkedin-in"></i>
                  </a>
                  <a href="${this.settings.socialMedia.instagram}" class="social-link" aria-label="Instagram">
                    <i class="fab fa-instagram"></i>
                  </a>
                  <a href="${this.settings.socialMedia.youtube}" class="social-link" aria-label="YouTube">
                    <i class="fab fa-youtube"></i>
                  </a>
                </div>
              </div>

              <!-- Quick Links -->
              <div class="footer-column">
                <h3 class="footer-title">روابط سريعة</h3>
                <ul class="footer-links">
                  <li><a href="${baseUrl}index.html">الرئيسية</a></li>
                  <li><a href="${baseUrl}index.html#about">من نحن</a></li>
                  <li><a href="${baseUrl}index.html#services">خدماتنا</a></li>
                  <li><a href="${baseUrl}ar/portfolio/">أعمالنا</a></li>
                  <li><a href="${baseUrl}ar/blog/">المدونة</a></li>
                  <li><a href="${baseUrl}index.html#contact">اتصل بنا</a></li>
                </ul>
              </div>

              <!-- Services -->
              <div class="footer-column">
                <h3 class="footer-title">خدماتنا</h3>
                <ul class="footer-links" id="footerServices">
                  <!-- Services will be loaded dynamically -->
                </ul>
              </div>

              <!-- Newsletter -->
              <div class="footer-column">
                <h3 class="footer-title">النشرة البريدية</h3>
                <p class="newsletter-description">
                  اشترك في نشرتنا البريدية لتصلك آخر الأخبار والعروض
                </p>
                <form class="newsletter-form" id="newsletterForm">
                  <div class="newsletter-input-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="بريدك الإلكتروني"
                      required
                      aria-label="البريد الإلكتروني"
                    >
                    <button type="submit" class="btn-subscribe" aria-label="اشتراك">
                      <i class="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </form>

                <div class="footer-contact">
                  <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span dir="ltr">${this.settings.phone}</span>
                  </div>
                  <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>${this.settings.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="container">
            <div class="footer-bottom-content">
              <p class="copyright">
                © ${new Date().getFullYear()} ${this.settings.siteName}. جميع الحقوق محفوظة.
              </p>
              <ul class="footer-legal">
                <li><a href="${baseUrl}ar/privacy-policy.html">سياسة الخصوصية</a></li>
                <li><a href="${baseUrl}ar/terms.html">الشروط والأحكام</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <!-- WhatsApp Floating Button -->
      <a
        href="https://wa.me/${this.settings.phone.replace(/\s+/g, '')}?text=مرحباً%20بكم%20في%20${encodeURIComponent(this.settings.siteName)}"
        class="whatsapp-float"
        target="_blank"
        aria-label="WhatsApp"
      >
        <i class="fab fa-whatsapp"></i>
        <span class="whatsapp-pulse"></span>
      </a>

      <!-- Scroll to Top Button -->
      <button class="scroll-to-top" id="scrollToTop" aria-label="العودة للأعلى">
        <i class="fas fa-arrow-up"></i>
      </button>
    `;
  }

  // ==========================================
  // SIDEBAR COMPONENT
  // ==========================================

  renderSidebar(options = {}) {
    const {
      showSearch = true,
      showCategories = true,
      showRecentPosts = true,
      showTags = true,
      type = 'blog' // blog, services, portfolio
    } = options;

    let categoriesHTML = '';
    let recentItemsHTML = '';
    let tagsHTML = '';

    if (showCategories) {
      const categories = this.getCategories(type);
      categoriesHTML = `
        <div class="sidebar-widget">
          <h3 class="sidebar-widget-title">التصنيفات</h3>
          <ul class="sidebar-categories">
            ${categories.map(cat => `
              <li>
                <a href="#" data-category="${cat.slug}">
                  <span>${cat.name}</span>
                  <span class="count">(${cat.count})</span>
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }

    if (showRecentPosts) {
      const recentItems = this.getRecentItems(type);
      recentItemsHTML = `
        <div class="sidebar-widget">
          <h3 class="sidebar-widget-title">${type === 'blog' ? 'أحدث المقالات' : 'أحدث المشاريع'}</h3>
          <ul class="sidebar-recent-posts">
            ${recentItems.map(item => `
              <li>
                <a href="${item.url}">
                  ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
                  <div class="recent-post-content">
                    <h4>${item.title}</h4>
                    <span class="date"><i class="fas fa-calendar"></i> ${item.date}</span>
                  </div>
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }

    if (showTags) {
      const tags = this.getTags(type);
      tagsHTML = `
        <div class="sidebar-widget">
          <h3 class="sidebar-widget-title">الوسوم</h3>
          <div class="sidebar-tags">
            ${tags.map(tag => `
              <a href="#" class="tag" data-tag="${tag.slug}">${tag.name}</a>
            `).join('')}
          </div>
        </div>
      `;
    }

    return `
      <aside class="sidebar" id="sidebar">
        ${showSearch ? `
          <div class="sidebar-widget sidebar-search">
            <form class="sidebar-search-form">
              <input type="text" placeholder="ابحث هنا..." id="sidebarSearch">
              <button type="submit" aria-label="بحث">
                <i class="fas fa-search"></i>
              </button>
            </form>
          </div>
        ` : ''}

        ${categoriesHTML}
        ${recentItemsHTML}
        ${tagsHTML}

        <!-- CTA Widget -->
        <div class="sidebar-widget sidebar-cta">
          <div class="sidebar-cta-content">
            <i class="fas fa-rocket"></i>
            <h3>هل لديك مشروع؟</h3>
            <p>تواصل معنا الآن واحصل على استشارة مجانية</p>
            <a href="../../index.html#contact" class="btn btn-primary btn-block">
              تواصل معنا
              <i class="fas fa-arrow-left"></i>
            </a>
          </div>
        </div>
      </aside>
    `;
  }

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  getCategories(type) {
    // This will be populated dynamically from localStorage
    if (type === 'blog') {
      return [
        { name: 'الكل', slug: 'all', count: 0 },
        { name: 'تسويق رقمي', slug: 'digital-marketing', count: 0 },
        { name: 'تطوير ويب', slug: 'web-development', count: 0 },
        { name: 'تطبيقات جوال', slug: 'mobile-apps', count: 0 }
      ];
    }
    return [];
  }

  getRecentItems(type) {
    // This will be populated dynamically from localStorage
    return [];
  }

  getTags(type) {
    // This will be populated dynamically from localStorage
    return [
      { name: 'React', slug: 'react' },
      { name: 'JavaScript', slug: 'javascript' },
      { name: 'WordPress', slug: 'wordpress' },
      { name: 'SEO', slug: 'seo' }
    ];
  }

  // ==========================================
  // DYNAMIC CONTENT LOADING
  // ==========================================

  loadDynamicServices() {
    const services = JSON.parse(localStorage.getItem('techksa_services') || '[]');

    // Load into header dropdown
    const dropdown = document.getElementById('servicesDropdown');
    if (dropdown && services.length > 0) {
      dropdown.innerHTML = services.slice(0, 6).map(service => `
        <a href="ar/services/service.html?id=${service.id}" class="dropdown-item">
          <i class="${service.icon || 'fas fa-briefcase'}"></i>
          <div>
            <h4>${service.name}</h4>
            <p>${service.description.substring(0, 50)}...</p>
          </div>
        </a>
      `).join('');
    }

    // Load into footer
    const footerServices = document.getElementById('footerServices');
    if (footerServices && services.length > 0) {
      footerServices.innerHTML = services.slice(0, 6).map(service => `
        <li><a href="ar/services/service.html?id=${service.id}">${service.name}</a></li>
      `).join('');
    }
  }

  // ==========================================
  // INIT COMPONENT SYSTEM
  // ==========================================

  init(currentPage = 'home') {
    // Inject Header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
      headerPlaceholder.innerHTML = this.renderHeader(currentPage);
    }

    // Inject Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = this.renderFooter(currentPage);
    }

    // Inject Sidebar if exists
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if (sidebarPlaceholder) {
      const sidebarType = sidebarPlaceholder.dataset.type || 'blog';
      sidebarPlaceholder.innerHTML = this.renderSidebar({ type: sidebarType });
    }

    // Load dynamic content
    this.loadDynamicServices();

    // Initialize newsletter form
    this.initNewsletterForm();
  }

  initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        // Here you would typically send to a backend
        alert('شكراً لاشتراكك! سنرسل لك آخر الأخبار على: ' + email);
        form.reset();
      });
    }
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ComponentsManager;
}
