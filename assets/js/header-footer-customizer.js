/**
 * Technology KSA - Header & Footer Customizer
 * نظام تخصيص الهيدر والفوتر
 */

class HeaderFooterCustomizer {
  constructor() {
    this.settings = this.loadSettings();
    this.init();
  }

  init() {
    console.log('Header/Footer Customizer initialized');
  }

  // ==========================================
  // SETTINGS MANAGEMENT
  // ==========================================

  loadSettings() {
    const defaultSettings = {
      // Logo Settings
      logo: {
        type: 'image', // 'image' or 'text'
        imageUrl: '/assets/images/logo.png',
        text: 'Technology KSA',
        width: 150,
        height: 50
      },

      // Header Settings
      header: {
        enabled: true,
        style: 'default', // 'default', 'transparent', 'fixed'
        backgroundColor: '#ffffff',
        textColor: '#333333',
        height: 80,
        sticky: true,
        showSearch: true,
        showLanguage: true,
        showCTA: true,
        ctaText: 'اتصل بنا',
        ctaLink: '/contact',
        ctaStyle: 'primary' // 'primary', 'secondary', 'outline'
      },

      // Footer Settings
      footer: {
        enabled: true,
        style: 'default', // 'default', 'minimal', 'full'
        backgroundColor: '#1a1a1a',
        textColor: '#ffffff',
        columns: 4,
        showSocial: true,
        showNewsletter: true,
        copyrightText: '© {year} Technology KSA. جميع الحقوق محفوظة.',

        // Company Info
        company: {
          name: 'Technology KSA',
          description: 'شركة تقنية سعودية رائدة في تطوير الحلول الرقمية',
          email: 'info@technologyksa.com',
          phone: '+966 XX XXX XXXX',
          address: 'الرياض، المملكة العربية السعودية'
        },

        // Social Links
        social: {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: '',
          youtube: '',
          snapchat: '',
          tiktok: '',
          github: ''
        }
      }
    };

    const saved = localStorage.getItem('techksa_header_footer_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  }

  saveSettings() {
    localStorage.setItem('techksa_header_footer_settings', JSON.stringify(this.settings));
    this.applySettings();
  }

  // ==========================================
  // LOGO MANAGEMENT
  // ==========================================

  updateLogo(logoData) {
    this.settings.logo = { ...this.settings.logo, ...logoData };
    this.saveSettings();
  }

  uploadLogo(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject('يرجى اختيار ملف صورة صحيح');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.settings.logo.type = 'image';
        this.settings.logo.imageUrl = e.target.result;
        this.saveSettings();
        resolve(e.target.result);
      };
      reader.onerror = () => reject('فشل تحميل الصورة');
      reader.readAsDataURL(file);
    });
  }

  removeLogo() {
    this.settings.logo.type = 'text';
    this.settings.logo.imageUrl = '';
    this.saveSettings();
  }

  // ==========================================
  // HEADER CUSTOMIZATION
  // ==========================================

  updateHeader(headerData) {
    this.settings.header = { ...this.settings.header, ...headerData };
    this.saveSettings();
  }

  toggleHeaderSticky(enabled) {
    this.settings.header.sticky = enabled;
    this.saveSettings();
  }

  // ==========================================
  // FOOTER CUSTOMIZATION
  // ==========================================

  updateFooter(footerData) {
    this.settings.footer = { ...this.settings.footer, ...footerData };
    this.saveSettings();
  }

  updateCompanyInfo(companyData) {
    this.settings.footer.company = { ...this.settings.footer.company, ...companyData };
    this.saveSettings();
  }

  updateSocialLinks(socialData) {
    this.settings.footer.social = { ...this.settings.footer.social, ...socialData };
    this.saveSettings();
  }

  // ==========================================
  // APPLY SETTINGS (PREVIEW)
  // ==========================================

  applySettings() {
    // Apply Header styles
    const header = document.querySelector('.site-header');
    if (header && this.settings.header.enabled) {
      header.style.backgroundColor = this.settings.header.backgroundColor;
      header.style.color = this.settings.header.textColor;
      header.style.height = `${this.settings.header.height}px`;

      if (this.settings.header.sticky) {
        header.classList.add('sticky-header');
      } else {
        header.classList.remove('sticky-header');
      }
    }

    // Apply Logo
    const logo = document.querySelector('.nav-logo img, .nav-logo');
    if (logo) {
      if (this.settings.logo.type === 'image' && this.settings.logo.imageUrl) {
        if (logo.tagName === 'IMG') {
          logo.src = this.settings.logo.imageUrl;
          logo.style.width = `${this.settings.logo.width}px`;
          logo.style.height = `${this.settings.logo.height}px`;
        }
      } else {
        // Text logo
        if (logo.tagName !== 'IMG') {
          logo.textContent = this.settings.logo.text;
        }
      }
    }

    // Apply Footer styles
    const footer = document.querySelector('.site-footer');
    if (footer && this.settings.footer.enabled) {
      footer.style.backgroundColor = this.settings.footer.backgroundColor;
      footer.style.color = this.settings.footer.textColor;
    }

    // Trigger custom event
    window.dispatchEvent(new CustomEvent('headerFooterUpdated', {
      detail: this.settings
    }));
  }

  // ==========================================
  // EXPORT/IMPORT
  // ==========================================

  exportSettings() {
    const dataStr = JSON.stringify(this.settings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `header-footer-settings-${Date.now()}.json`;
    link.href = url;
    link.click();
  }

  importSettings(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target.result);
          this.settings = settings;
          this.saveSettings();
          resolve(settings);
        } catch (error) {
          reject('ملف غير صحيح');
        }
      };
      reader.onerror = () => reject('فشل قراءة الملف');
      reader.readAsText(file);
    });
  }

  // ==========================================
  // RESET
  // ==========================================

  reset() {
    localStorage.removeItem('techksa_header_footer_settings');
    this.settings = this.loadSettings();
    this.applySettings();
  }

  // ==========================================
  // PREVIEW
  // ==========================================

  generateHeaderHTML() {
    const logo = this.settings.logo.type === 'image' && this.settings.logo.imageUrl
      ? `<img src="${this.settings.logo.imageUrl}" alt="${this.settings.logo.text}" style="width:${this.settings.logo.width}px;height:${this.settings.logo.height}px;">`
      : `<span class="logo-text">${this.settings.logo.text}</span>`;

    const cta = this.settings.header.showCTA
      ? `<a href="${this.settings.header.ctaLink}" class="btn btn-${this.settings.header.ctaStyle}">${this.settings.header.ctaText}</a>`
      : '';

    return `
      <header class="site-header ${this.settings.header.sticky ? 'sticky' : ''}"
              style="background-color:${this.settings.header.backgroundColor};color:${this.settings.header.textColor};height:${this.settings.header.height}px;">
        <nav class="nav-container">
          <div class="nav-logo">
            <a href="/">${logo}</a>
          </div>
          <ul class="nav-menu" id="main-menu">
            <!-- Menu items will be loaded here -->
          </ul>
          ${cta}
        </nav>
      </header>
    `;
  }

  generateFooterHTML() {
    const year = new Date().getFullYear();
    const copyright = this.settings.footer.copyrightText.replace('{year}', year);

    const socialLinks = Object.entries(this.settings.footer.social)
      .filter(([_, url]) => url)
      .map(([platform, url]) => `<a href="${url}" target="_blank"><i class="fab fa-${platform}"></i></a>`)
      .join('');

    return `
      <footer class="site-footer" style="background-color:${this.settings.footer.backgroundColor};color:${this.settings.footer.textColor};">
        <div class="footer-container">
          <div class="footer-grid">
            <div class="footer-col">
              <h3>${this.settings.footer.company.name}</h3>
              <p>${this.settings.footer.company.description}</p>
            </div>
            <div class="footer-col">
              <h4>تواصل معنا</h4>
              <p><i class="fas fa-envelope"></i> ${this.settings.footer.company.email}</p>
              <p><i class="fas fa-phone"></i> ${this.settings.footer.company.phone}</p>
              <p><i class="fas fa-map-marker-alt"></i> ${this.settings.footer.company.address}</p>
            </div>
            ${this.settings.footer.showSocial ? `
            <div class="footer-col">
              <h4>تابعنا</h4>
              <div class="social-links">${socialLinks}</div>
            </div>` : ''}
          </div>
          <div class="footer-bottom">
            <p>${copyright}</p>
          </div>
        </div>
      </footer>
    `;
  }
}

// Initialize
if (typeof window !== 'undefined') {
  window.HeaderFooterCustomizer = HeaderFooterCustomizer;
}
