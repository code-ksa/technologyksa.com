#!/usr/bin/env node

/**
 * Technology KSA - Enhanced Static Site Generator
 * Reads data from CMS and generates complete static pages
 */

const fs = require('fs');
const path = require('path');

// ==========================================
// CONFIGURATION
// ==========================================

const CONFIG = {
  rootDir: __dirname,
  dataFile: 'data.json',
  configFile: 'pages.config.json',
  outputDir: 'dist',
  templatesDir: 'templates',
  assetsDir: 'assets',
  adminDir: 'admin'
};

// ==========================================
// UTILITIES
// ==========================================

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };

  const icons = { info: 'ℹ', success: '✓', warning: '⚠', error: '✗' };
  console.log(`${colors[type]}${icons[type]} ${message}${colors.reset}`);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyDir(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    return '';
  }
}

function writeFile(filePath, content) {
  try {
    const dir = path.dirname(filePath);
    ensureDir(dir);
    fs.writeFileSync(filePath, content, 'utf-8');
    log(`Generated: ${filePath.replace(CONFIG.rootDir, '')}`, 'success');
    return true;
  } catch (error) {
    log(`Error: ${filePath} - ${error.message}`, 'error');
    return false;
  }
}

function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    log(`Cleaned: ${dir}`, 'success');
  }
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-\u0600-\u06FF]+/g, '')
    .replace(/\-\-+/g, '-');
}

// ==========================================
// TEMPLATE ENGINE
// ==========================================

class TemplateEngine {
  constructor(config, data) {
    this.config = config;
    this.data = data || {};
    this.headerFooterSettings = data.headerFooterSettings || null;
    this.menus = data.menus || null;
  }

  getBaseHTML(page, content) {
    const lang = page.lang || 'ar';
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Use custom header/footer if available
    const headerHTML = this.renderHeader();
    const footerHTML = this.renderFooter();

    return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${page.description || ''}">
  <meta name="keywords" content="${page.keywords || 'تقنية, مواقع, تطبيقات'}">

  <!-- Open Graph -->
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description || ''}">
  <meta property="og:url" content="${this.config.site?.url || ''}/${page.slug || ''}">
  <meta property="og:type" content="website">

  <title>${page.title}</title>

  <link rel="icon" type="image/png" href="/assets/images/favicon.png">
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>

${headerHTML}

  <!-- Main Content -->
  <main class="site-main">
${content}
  </main>

${footerHTML}

  <script src="/assets/js/main.js"></script>
  <script src="/assets/js/site-loader.js"></script>
  <script>
    function toggleMenu() {
      document.querySelector('.nav-menu').classList.toggle('active');
    }
  </script>
</body>
</html>`;
  }

  renderHeader(assetPath = '') {
    const settings = this.headerFooterSettings?.header || {};
    const logo = this.headerFooterSettings?.logo || {};

    // Logo HTML - always use absolute paths
    let logoImageUrl = '';
    if (logo.imageUrl) {
      if (logo.imageUrl.startsWith('http') || logo.imageUrl.startsWith('/')) {
        logoImageUrl = logo.imageUrl;
      } else {
        logoImageUrl = '/' + logo.imageUrl.replace(/^\.\//, '');
      }
    }
    const logoHTML = logo.type === 'image' && logoImageUrl
      ? `<img src="${logoImageUrl}" alt="${logo.text || 'Logo'}" style="width:${logo.width || 150}px;height:${logo.height || 50}px;">`
      : `<span class="logo-text">${logo.text || this.config.site?.name || 'Technology KSA'}</span>`;

    // CTA Button
    const ctaHTML = settings.showCTA
      ? `<a href="${settings.ctaLink || '/contact'}" class="btn btn-${settings.ctaStyle || 'primary'}">${settings.ctaText || 'اتصل بنا'}</a>`
      : '';

    // Header styles
    const headerStyles = settings.enabled ? `
      background-color: ${settings.backgroundColor || '#ffffff'};
      color: ${settings.textColor || '#333333'};
      height: ${settings.height || 80}px;
    ` : '';

    return `  <!-- Header -->
  <header class="site-header ${settings.sticky ? 'sticky' : ''}" style="${headerStyles}">
    <nav class="nav-container">
      <div class="nav-logo">
        <a href="/">${logoHTML}</a>
      </div>
      <ul class="nav-menu" id="main-menu">
        ${this.renderMenu()}
      </ul>
      ${ctaHTML}
      <div class="nav-toggle" onclick="toggleMenu()">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  </header>`;
  }

  renderFooter() {
    const settings = this.headerFooterSettings?.footer || {};
    const company = settings.company || {};
    const year = new Date().getFullYear();
    const copyright = (settings.copyrightText || '© {year} Technology KSA. جميع الحقوق محفوظة.').replace('{year}', year);

    // Footer styles
    const footerStyles = settings.enabled ? `
      background-color: ${settings.backgroundColor || '#1a1a1a'};
      color: ${settings.textColor || '#ffffff'};
    ` : '';

    return `  <!-- Footer -->
  <footer class="site-footer" style="${footerStyles}">
    <div class="footer-container">
      <div class="footer-grid">
        <div class="footer-col">
          <h3>${company.name || this.config.site?.name || 'Technology KSA'}</h3>
          <p>${company.description || this.config.site?.description || ''}</p>
        </div>
        <div class="footer-col">
          <h4>روابط سريعة</h4>
          <ul>
            ${this.renderFooterLinks()}
          </ul>
        </div>
        <div class="footer-col">
          <h4>تواصل معنا</h4>
          <p><i class="fas fa-envelope"></i> ${company.email || this.config.contact?.email || ''}</p>
          <p><i class="fas fa-phone"></i> ${company.phone || this.config.contact?.phone || ''}</p>
          ${company.address ? `<p><i class="fas fa-map-marker-alt"></i> ${company.address}</p>` : ''}
        </div>
        ${settings.showSocial ? `
        <div class="footer-col">
          <h4>تابعنا</h4>
          <div class="social-links">
            ${this.renderSocialLinks()}
          </div>
        </div>` : ''}
      </div>
      <div class="footer-bottom">
        <p>${copyright}</p>
      </div>
    </div>
  </footer>`;
  }

  renderMenu() {
    // Use custom menus if available
    if (this.menus && this.menus.primary) {
      return this.renderMenuItems(this.menus.primary.items);
    }

    // Fallback to config
    if (!this.config.navigation?.main) return '';

    return this.config.navigation.main.map(item =>
      `<li><a href="${item.url}"><i class="fas fa-${item.icon}"></i> ${item.label}</a></li>`
    ).join('\n        ');
  }

  renderMenuItems(items, level = 0) {
    if (!items || items.length === 0) return '';

    return items.sort((a, b) => a.order - b.order).map(item => {
      const icon = item.icon ? `<i class="fas fa-${item.icon}"></i> ` : '';
      const hasChildren = item.children && item.children.length > 0;

      let html = `<li class="menu-item${hasChildren ? ' has-submenu' : ''}">`;
      html += `<a href="${item.url}" target="${item.target || '_self'}" class="${item.classes || ''}">${icon}${item.label}</a>`;

      if (hasChildren && level < 2) {
        html += `<ul class="submenu">`;
        html += this.renderMenuItems(item.children, level + 1);
        html += `</ul>`;
      }

      html += `</li>`;
      return html;
    }).join('\n        ');
  }

  renderFooterLinks() {
    // Use custom footer menu if available
    if (this.menus && this.menus.footer) {
      return this.menus.footer.items.sort((a, b) => a.order - b.order).map(item =>
        `<li><a href="${item.url}">${item.label}</a></li>`
      ).join('\n            ');
    }

    // Fallback to config
    if (!this.config.navigation?.footer) return '';

    return this.config.navigation.footer.map(item =>
      `<li><a href="${item.url}">${item.label}</a></li>`
    ).join('\n            ');
  }

  renderSocialLinks() {
    // Use custom social links if available
    const social = this.headerFooterSettings?.footer?.social || this.config.social || {};

    const links = [];
    for (const [platform, url] of Object.entries(social)) {
      if (url) {
        links.push(`<a href="${url}" target="_blank" rel="noopener noreferrer"><i class="fab fa-${platform}"></i></a>`);
      }
    }
    return links.join('\n            ');
  }

  renderHomePage() {
    return `
    <section class="hero-section">
      <div class="container">
        <div class="hero-content" data-section="hero">
          <h1>مرحباً بك في ${this.config.site?.name || 'Technology KSA'}</h1>
          <p>${this.config.site?.description || 'شركة تقنية سعودية رائدة'}</p>
          <div class="hero-buttons">
            <a href="/services" class="btn btn-primary">خدماتنا</a>
            <a href="/contact" class="btn btn-secondary">اتصل بنا</a>
          </div>
        </div>
      </div>
    </section>

    <section class="features-section" data-section="features">
      <div class="container">
        <h2>خدماتنا</h2>
        <div class="features-grid">
          <!-- Content loaded dynamically -->
        </div>
      </div>
    </section>

    <section class="stats-section" data-section="stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">${this.data.projects?.length || 0}</span>
            <span class="stat-label">مشروع مكتمل</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${this.data.services?.length || 0}</span>
            <span class="stat-label">خدمة متميزة</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${new Date().getFullYear() - 2020}</span>
            <span class="stat-label">سنوات خبرة</span>
          </div>
        </div>
      </div>
    </section>`;
  }

  renderBlogPage() {
    const posts = this.data.posts || [];

    let content = `
    <section class="blog-hero">
      <div class="container">
        <h1>المدونة</h1>
        <p>آخر الأخبار والمقالات التقنية</p>
      </div>
    </section>

    <section class="blog-grid-section">
      <div class="container">
        <div class="blog-grid">`;

    if (posts.length === 0) {
      content += `
          <div class="empty-state">
            <p>لا توجد مقالات بعد</p>
          </div>`;
    } else {
      posts.forEach(post => {
        if (post.status === 'published') {
          content += `
          <article class="blog-card">
            <div class="blog-image">
              <img src="${post.featuredImage || '/assets/images/default-post.jpg'}" alt="${post.title}">
            </div>
            <div class="blog-content">
              <div class="blog-meta">
                <span class="blog-category">${post.category || 'عام'}</span>
                <span class="blog-date">${new Date(post.date).toLocaleDateString('ar-SA')}</span>
              </div>
              <h3><a href="/blog/${post.slug}">${post.title}</a></h3>
              <p>${post.excerpt || ''}</p>
              <a href="/blog/${post.slug}" class="read-more">اقرأ المزيد →</a>
            </div>
          </article>`;
        }
      });
    }

    content += `
        </div>
      </div>
    </section>`;

    return content;
  }

  renderServicesPage() {
    const services = this.data.services || [];

    let content = `
    <section class="services-hero">
      <div class="container">
        <h1>خدماتنا</h1>
        <p>نقدم مجموعة متكاملة من الخدمات التقنية</p>
      </div>
    </section>

    <section class="services-grid-section">
      <div class="container">
        <div class="services-grid">`;

    if (services.length === 0) {
      content += `
          <div class="empty-state">
            <p>لا توجد خدمات بعد</p>
          </div>`;
    } else {
      services.forEach(service => {
        content += `
          <div class="service-card">
            <div class="service-icon">
              <i class="fas fa-${service.icon || 'code'}"></i>
            </div>
            <h3>${service.title}</h3>
            <p>${service.description || ''}</p>
            <a href="/services/${service.slug}" class="btn btn-outline">التفاصيل</a>
          </div>`;
      });
    }

    content += `
        </div>
      </div>
    </section>`;

    return content;
  }

  renderPortfolioPage() {
    const projects = this.data.projects || [];

    let content = `
    <section class="portfolio-hero">
      <div class="container">
        <h1>أعمالنا</h1>
        <p>مشاريع نفتخر بإنجازها</p>
      </div>
    </section>

    <section class="portfolio-grid-section">
      <div class="container">
        <div class="portfolio-grid">`;

    if (projects.length === 0) {
      content += `
          <div class="empty-state">
            <p>لا توجد مشاريع بعد</p>
          </div>`;
    } else {
      projects.forEach(project => {
        content += `
          <div class="portfolio-item">
            <div class="portfolio-image">
              <img src="${project.image || '/assets/images/default-project.jpg'}" alt="${project.title}">
            </div>
            <div class="portfolio-overlay">
              <h3>${project.title}</h3>
              <p>${project.category || ''}</p>
              <a href="/portfolio/${project.slug}" class="btn btn-primary">عرض المشروع</a>
            </div>
          </div>`;
      });
    }

    content += `
        </div>
      </div>
    </section>`;

    return content;
  }

  renderContactPage() {
    return `
    <section class="contact-hero">
      <div class="container">
        <h1>اتصل بنا</h1>
        <p>نسعد بتواصلك معنا</p>
      </div>
    </section>

    <section class="contact-section">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-form-wrapper">
            <h2>أرسل لنا رسالة</h2>
            <form class="contact-form" id="contactForm">
              <div class="form-group">
                <label>الاسم</label>
                <input type="text" name="name" required>
              </div>
              <div class="form-group">
                <label>البريد الإلكتروني</label>
                <input type="email" name="email" required>
              </div>
              <div class="form-group">
                <label>الهاتف</label>
                <input type="tel" name="phone">
              </div>
              <div class="form-group">
                <label>الرسالة</label>
                <textarea name="message" rows="5" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary">إرسال</button>
            </form>
          </div>

          <div class="contact-info">
            <h2>معلومات الاتصال</h2>
            <div class="info-item">
              <i class="fas fa-envelope"></i>
              <div>
                <strong>البريد الإلكتروني</strong>
                <p>${this.config.contact?.email || ''}</p>
              </div>
            </div>
            <div class="info-item">
              <i class="fas fa-phone"></i>
              <div>
                <strong>الهاتف</strong>
                <p>${this.config.contact?.phone || ''}</p>
              </div>
            </div>
            <div class="info-item">
              <i class="fas fa-map-marker-alt"></i>
              <div>
                <strong>العنوان</strong>
                <p>${this.config.contact?.address || ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  renderSinglePost(post) {
    return `
    <article class="single-post">
      <div class="container">
        <div class="post-header">
          <h1>${post.title}</h1>
          <div class="post-meta">
            <span><i class="fas fa-calendar"></i> ${new Date(post.date).toLocaleDateString('ar-SA')}</span>
            <span><i class="fas fa-user"></i> ${post.author || 'Admin'}</span>
            <span><i class="fas fa-folder"></i> ${post.category || 'عام'}</span>
          </div>
        </div>

        ${post.featuredImage ? `
        <div class="post-featured-image">
          <img src="${post.featuredImage}" alt="${post.title}">
        </div>
        ` : ''}

        <div class="post-content">
          ${post.content || ''}
        </div>

        ${post.tags && post.tags.length > 0 ? `
        <div class="post-tags">
          ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
        </div>
        ` : ''}
      </div>
    </article>`;
  }
}

// ==========================================
// SITE BUILDER
// ==========================================

class EnhancedSiteBuilder {
  constructor() {
    this.config = null;
    this.data = null;
    this.templateEngine = null;
    this.stats = { pages: 0, errors: 0, warnings: 0 };
  }

  async build() {
    log('Starting enhanced build...', 'info');
    console.log('');

    try {
      // Load configuration
      this.loadConfig();

      // Load data
      this.loadData();

      // Initialize template engine
      this.templateEngine = new TemplateEngine(this.config, this.data);

      // Clean and create output
      cleanDir(CONFIG.outputDir);
      ensureDir(CONFIG.outputDir);

      // Build static pages
      this.buildStaticPages();

      // Build dynamic pages (blog posts, services, etc)
      this.buildDynamicPages();

      // Copy assets
      this.copyAssets();

      // Copy admin
      this.copyAdmin();

      // Generate sitemap & robots
      this.generateSitemap();
      this.generateRobots();

      // Show stats
      console.log('');
      log('Build completed!', 'success');
      log(`Pages: ${this.stats.pages}`, 'info');
      if (this.stats.warnings > 0) log(`Warnings: ${this.stats.warnings}`, 'warning');
      if (this.stats.errors > 0) log(`Errors: ${this.stats.errors}`, 'error');

    } catch (error) {
      log(`Build failed: ${error.message}`, 'error');
      console.error(error);
      process.exit(1);
    }
  }

  loadConfig() {
    const configPath = path.join(CONFIG.rootDir, CONFIG.configFile);

    if (!fs.existsSync(configPath)) {
      throw new Error('Configuration file not found');
    }

    this.config = JSON.parse(readFile(configPath));
    log('Configuration loaded', 'success');
  }

  loadData() {
    const dataPath = path.join(CONFIG.rootDir, CONFIG.dataFile);

    if (fs.existsSync(dataPath)) {
      this.data = JSON.parse(readFile(dataPath));
      log('Data loaded from data.json', 'success');
      log(`Posts: ${this.data.posts?.length || 0}, Services: ${this.data.services?.length || 0}, Projects: ${this.data.projects?.length || 0}`, 'info');

      // Check for header/footer settings and menus
      if (this.data.headerFooterSettings) {
        log('Custom header/footer settings found', 'info');
      }
      if (this.data.menus) {
        log(`Menus found: ${Object.keys(this.data.menus).length}`, 'info');
      }
    } else {
      this.data = { posts: [], services: [], projects: [], pages: [] };
      log('No data.json found, using empty data', 'warning');
      this.stats.warnings++;
    }
  }

  buildStaticPages() {
    log('Building static pages...', 'info');

    const pages = [
      { id: 'home', slug: '', title: 'Technology KSA - الرئيسية', render: () => this.templateEngine.renderHomePage() },
      { id: 'blog', slug: 'blog', title: 'المدونة - Technology KSA', render: () => this.templateEngine.renderBlogPage() },
      { id: 'services', slug: 'services', title: 'خدماتنا - Technology KSA', render: () => this.templateEngine.renderServicesPage() },
      { id: 'portfolio', slug: 'portfolio', title: 'أعمالنا - Technology KSA', render: () => this.templateEngine.renderPortfolioPage() },
      { id: 'contact', slug: 'contact', title: 'اتصل بنا - Technology KSA', render: () => this.templateEngine.renderContactPage() }
    ];

    pages.forEach(page => {
      try {
        const content = page.render();
        const html = this.templateEngine.getBaseHTML(page, content);
        const filePath = page.slug
          ? path.join(CONFIG.outputDir, page.slug, 'index.html')
          : path.join(CONFIG.outputDir, 'index.html');

        if (writeFile(filePath, html)) {
          this.stats.pages++;
        }
      } catch (error) {
        log(`Error building ${page.id}: ${error.message}`, 'error');
        this.stats.errors++;
      }
    });
  }

  buildDynamicPages() {
    log('Building dynamic pages...', 'info');

    // Build individual blog posts
    if (this.data.posts && this.data.posts.length > 0) {
      this.data.posts.forEach(post => {
        if (post.status === 'published' && post.slug) {
          try {
            const content = this.templateEngine.renderSinglePost(post);
            const html = this.templateEngine.getBaseHTML({
              slug: `blog/${post.slug}`,
              title: `${post.title} - Technology KSA`,
              description: post.excerpt || post.title,
              keywords: post.tags?.join(', ') || ''
            }, content);

            const filePath = path.join(CONFIG.outputDir, 'blog', post.slug, 'index.html');
            if (writeFile(filePath, html)) {
              this.stats.pages++;
            }
          } catch (error) {
            log(`Error building post ${post.slug}: ${error.message}`, 'error');
            this.stats.errors++;
          }
        }
      });
    }

    // TODO: Build individual service and project pages
  }

  copyAssets() {
    log('Copying assets...', 'info');
    const src = path.join(CONFIG.rootDir, CONFIG.assetsDir);
    const dest = path.join(CONFIG.outputDir, CONFIG.assetsDir);

    if (fs.existsSync(src)) {
      copyDir(src, dest);
      log('Assets copied', 'success');
    }
  }

  copyAdmin() {
    log('Copying admin...', 'info');
    const src = path.join(CONFIG.rootDir, CONFIG.adminDir);
    const dest = path.join(CONFIG.outputDir, CONFIG.adminDir);

    if (fs.existsSync(src)) {
      copyDir(src, dest);
      log('Admin copied', 'success');
    }
  }

  generateSitemap() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Static pages
    const pages = ['', 'blog', 'services', 'portfolio', 'contact'];
    pages.forEach(slug => {
      const url = slug ? `${this.config.site.url}/${slug}` : this.config.site.url;
      xml += `  <url><loc>${url}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
    });

    // Blog posts
    if (this.data.posts) {
      this.data.posts.forEach(post => {
        if (post.status === 'published' && post.slug) {
          xml += `  <url><loc>${this.config.site.url}/blog/${post.slug}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;
        }
      });
    }

    xml += '</urlset>';
    writeFile(path.join(CONFIG.outputDir, 'sitemap.xml'), xml);
  }

  generateRobots() {
    const content = `User-agent: *\nAllow: /\nSitemap: ${this.config.site.url}/sitemap.xml\n`;
    writeFile(path.join(CONFIG.outputDir, 'robots.txt'), content);
  }
}

// ==========================================
// MAIN
// ==========================================

async function main() {
  const builder = new EnhancedSiteBuilder();
  await builder.build();
}

if (require.main === module) {
  main();
}

module.exports = { EnhancedSiteBuilder };
