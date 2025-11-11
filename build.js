#!/usr/bin/env node

/**
 * Technology KSA - Static Site Generator (SSG)
 * Build system to compile templates and generate static HTML pages
 */

const fs = require('fs');
const path = require('path');

// ==========================================
// CONFIGURATION
// ==========================================

const CONFIG = {
  rootDir: __dirname,
  configFile: 'pages.config.json',
  outputDir: 'dist',
  templatesDir: 'templates',
  partialsDir: 'templates/partials',
  assetsDir: 'assets',
  adminDir: 'admin'
};

// ==========================================
// UTILITIES
// ==========================================

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m',   // Red
    reset: '\x1b[0m'
  };

  const icons = {
    info: 'ℹ',
    success: '✓',
    warning: '⚠',
    error: '✗'
  };

  console.log(`${colors[type]}${icons[type]} ${message}${colors.reset}`);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`Created directory: ${dir}`, 'success');
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
    log(`Error reading file: ${filePath}`, 'error');
    return '';
  }
}

function writeFile(filePath, content) {
  try {
    const dir = path.dirname(filePath);
    ensureDir(dir);
    fs.writeFileSync(filePath, content, 'utf-8');
    log(`Generated: ${filePath}`, 'success');
    return true;
  } catch (error) {
    log(`Error writing file: ${filePath} - ${error.message}`, 'error');
    return false;
  }
}

function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    log(`Cleaned directory: ${dir}`, 'success');
  }
}

// ==========================================
// TEMPLATE ENGINE
// ==========================================

class TemplateEngine {
  constructor(config) {
    this.config = config;
    this.partials = {};
    this.loadPartials();
  }

  loadPartials() {
    const partialsPath = path.join(CONFIG.rootDir, CONFIG.partialsDir);

    if (!fs.existsSync(partialsPath)) {
      log('Partials directory not found, will use inline templates', 'warning');
      this.createDefaultPartials();
      return;
    }

    const files = fs.readdirSync(partialsPath);

    files.forEach(file => {
      if (file.endsWith('.html')) {
        const name = file.replace('.html', '');
        const content = readFile(path.join(partialsPath, file));
        this.partials[name] = content;
        log(`Loaded partial: ${name}`, 'info');
      }
    });
  }

  createDefaultPartials() {
    // Create default header
    this.partials['header'] = this.getDefaultHeader();
    this.partials['footer'] = this.getDefaultFooter();
    this.partials['nav'] = this.getDefaultNav();
  }

  getDefaultHeader() {
    return `<!DOCTYPE html>
<html lang="{{lang}}" dir="{{dir}}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{{description}}">
  <meta name="keywords" content="{{keywords}}">
  <meta name="author" content="{{siteName}}">

  <!-- Open Graph -->
  <meta property="og:title" content="{{title}}">
  <meta property="og:description" content="{{description}}">
  <meta property="og:url" content="{{url}}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="{{logo}}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{{title}}">
  <meta name="twitter:description" content="{{description}}">

  <title>{{title}}</title>

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/assets/images/favicon.png">

  <!-- Styles -->
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>`;
  }

  getDefaultNav() {
    return `  <header class="site-header">
    <nav class="nav-container">
      <div class="nav-logo">
        <a href="/">
          <img src="{{logo}}" alt="{{siteName}}">
        </a>
      </div>
      <ul class="nav-menu">
        {{navItems}}
      </ul>
      <div class="nav-toggle">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  </header>`;
  }

  getDefaultFooter() {
    return `  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <div class="footer-col">
          <h3>{{siteName}}</h3>
          <p>{{description}}</p>
        </div>
        <div class="footer-col">
          <h4>روابط سريعة</h4>
          <ul>
            {{footerLinks}}
          </ul>
        </div>
        <div class="footer-col">
          <h4>تواصل معنا</h4>
          <p>{{contactEmail}}</p>
          <p>{{contactPhone}}</p>
        </div>
        <div class="footer-col">
          <h4>تابعنا</h4>
          <div class="social-links">
            {{socialLinks}}
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{year}} {{siteName}}. جميع الحقوق محفوظة.</p>
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="/assets/js/main.js"></script>
  <script src="/assets/js/site-loader.js"></script>
</body>
</html>`;
  }

  compile(template, data) {
    let compiled = template;

    // Replace all {{variable}} with data
    for (const [key, value] of Object.entries(data)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      compiled = compiled.replace(regex, value || '');
    }

    // Remove any remaining unreplaced variables
    compiled = compiled.replace(/{{[^}]+}}/g, '');

    return compiled;
  }

  render(page, data = {}) {
    const pageData = {
      ...data,
      lang: page.lang || 'ar',
      dir: page.lang === 'ar' ? 'rtl' : 'ltr',
      title: page.title,
      description: page.description,
      url: `${this.config.site.url}/${page.slug}`,
      siteName: this.config.site.name,
      logo: this.config.site.logo,
      year: new Date().getFullYear(),
      navItems: this.renderNavItems(this.config.navigation.main),
      footerLinks: this.renderFooterLinks(this.config.navigation.footer),
      socialLinks: this.renderSocialLinks(this.config.social),
      contactEmail: this.config.contact.email,
      contactPhone: this.config.contact.phone,
      keywords: 'تطوير مواقع, تطبيقات, السعودية'
    };

    // Build full HTML
    let html = '';

    // Header
    html += this.compile(this.partials['header'] || '', pageData);

    // Navigation
    html += this.compile(this.partials['nav'] || '', pageData);

    // Main content
    html += `\n  <main class="site-main">\n`;

    // Add sections
    if (page.sections && page.sections.length > 0) {
      page.sections.forEach(section => {
        html += this.renderSection(section, pageData);
      });
    } else {
      // Default content
      html += `    <div class="container">
      <h1>${page.title}</h1>
      <div id="dynamic-content" data-page="${page.id}">
        <!-- Content will be loaded dynamically -->
      </div>
    </div>\n`;
    }

    html += `  </main>\n`;

    // Footer
    html += this.compile(this.partials['footer'] || '', pageData);

    return html;
  }

  renderSection(sectionId, data) {
    const sectionFile = path.join(CONFIG.rootDir, CONFIG.partialsDir, 'sections', `${sectionId}.html`);

    if (fs.existsSync(sectionFile)) {
      const content = readFile(sectionFile);
      return this.compile(content, data);
    }

    // Default section placeholder
    return `    <section id="${sectionId}" class="section">
      <div class="container" data-section="${sectionId}">
        <!-- ${sectionId} content -->
      </div>
    </section>\n`;
  }

  renderNavItems(items) {
    return items.map(item =>
      `<li><a href="${item.url}"><i class="fas fa-${item.icon}"></i> ${item.label}</a></li>`
    ).join('\n        ');
  }

  renderFooterLinks(items) {
    return items.map(item =>
      `<li><a href="${item.url}">${item.label}</a></li>`
    ).join('\n            ');
  }

  renderSocialLinks(social) {
    const links = [];
    for (const [platform, url] of Object.entries(social)) {
      if (url) {
        links.push(`<a href="${url}" target="_blank" rel="noopener"><i class="fab fa-${platform}"></i></a>`);
      }
    }
    return links.join('\n            ');
  }
}

// ==========================================
// SITE BUILDER
// ==========================================

class SiteBuilder {
  constructor() {
    this.config = null;
    this.templateEngine = null;
    this.stats = {
      pages: 0,
      errors: 0,
      warnings: 0
    };
  }

  async build() {
    log('Starting build process...', 'info');
    console.log('');

    try {
      // Load configuration
      this.loadConfig();

      // Initialize template engine
      this.templateEngine = new TemplateEngine(this.config);

      // Clean output directory
      if (this.config.build.cleanBeforeBuild) {
        cleanDir(CONFIG.outputDir);
      }

      // Create output directory
      ensureDir(CONFIG.outputDir);

      // Build pages
      this.buildPages();

      // Copy assets
      this.copyAssets();

      // Copy admin (if exists)
      this.copyAdmin();

      // Generate sitemap
      if (this.config.build.generateSitemap) {
        this.generateSitemap();
      }

      // Generate robots.txt
      if (this.config.build.generateRobots) {
        this.generateRobots();
      }

      // Show stats
      console.log('');
      log('Build completed!', 'success');
      log(`Pages generated: ${this.stats.pages}`, 'info');
      if (this.stats.warnings > 0) {
        log(`Warnings: ${this.stats.warnings}`, 'warning');
      }
      if (this.stats.errors > 0) {
        log(`Errors: ${this.stats.errors}`, 'error');
      }

    } catch (error) {
      log(`Build failed: ${error.message}`, 'error');
      console.error(error);
      process.exit(1);
    }
  }

  loadConfig() {
    const configPath = path.join(CONFIG.rootDir, CONFIG.configFile);

    if (!fs.existsSync(configPath)) {
      throw new Error(`Configuration file not found: ${configPath}`);
    }

    const configContent = readFile(configPath);
    this.config = JSON.parse(configContent);

    log('Configuration loaded', 'success');
  }

  buildPages() {
    log('Building pages...', 'info');

    this.config.pages.forEach(page => {
      try {
        // Build Arabic version
        const htmlAr = this.templateEngine.render({ ...page, lang: 'ar' });
        const filePathAr = this.getPagePath(page, 'ar');

        if (writeFile(filePathAr, htmlAr)) {
          this.stats.pages++;
        } else {
          this.stats.errors++;
        }

        // Build English version (if needed)
        if (this.config.site.languages.includes('en')) {
          const htmlEn = this.templateEngine.render({ ...page, lang: 'en' });
          const filePathEn = this.getPagePath(page, 'en');

          if (writeFile(filePathEn, htmlEn)) {
            this.stats.pages++;
          } else {
            this.stats.errors++;
          }
        }

      } catch (error) {
        log(`Error building page ${page.id}: ${error.message}`, 'error');
        this.stats.errors++;
      }
    });
  }

  getPagePath(page, lang = 'ar') {
    const slug = lang === 'ar' ? page.slugAr : page.slug;

    if (!slug || slug === '') {
      // Root page (index)
      return path.join(CONFIG.rootDir, CONFIG.outputDir, 'index.html');
    }

    // Create directory for the page
    const pageDir = path.join(CONFIG.rootDir, CONFIG.outputDir, slug);
    ensureDir(pageDir);

    return path.join(pageDir, 'index.html');
  }

  copyAssets() {
    log('Copying assets...', 'info');

    const assetsSource = path.join(CONFIG.rootDir, CONFIG.assetsDir);
    const assetsDest = path.join(CONFIG.rootDir, CONFIG.outputDir, CONFIG.assetsDir);

    if (fs.existsSync(assetsSource)) {
      copyDir(assetsSource, assetsDest);
      log('Assets copied successfully', 'success');
    } else {
      log('Assets directory not found', 'warning');
      this.stats.warnings++;
    }
  }

  copyAdmin() {
    log('Copying admin panel...', 'info');

    const adminSource = path.join(CONFIG.rootDir, CONFIG.adminDir);
    const adminDest = path.join(CONFIG.rootDir, CONFIG.outputDir, CONFIG.adminDir);

    if (fs.existsSync(adminSource)) {
      copyDir(adminSource, adminDest);
      log('Admin panel copied successfully', 'success');
    } else {
      log('Admin directory not found', 'warning');
      this.stats.warnings++;
    }
  }

  generateSitemap() {
    log('Generating sitemap.xml...', 'info');

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    this.config.pages.forEach(page => {
      const url = page.slug ? `${this.config.site.url}/${page.slug}` : this.config.site.url;
      const priority = page.priority || 0.5;

      xml += '  <url>\n';
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>${priority}</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    const sitemapPath = path.join(CONFIG.rootDir, CONFIG.outputDir, 'sitemap.xml');
    writeFile(sitemapPath, xml);
  }

  generateRobots() {
    log('Generating robots.txt...', 'info');

    let robots = 'User-agent: *\n';
    robots += 'Allow: /\n';
    robots += `Sitemap: ${this.config.site.url}/sitemap.xml\n`;

    const robotsPath = path.join(CONFIG.rootDir, CONFIG.outputDir, 'robots.txt');
    writeFile(robotsPath, robots);
  }
}

// ==========================================
// MAIN EXECUTION
// ==========================================

async function main() {
  const builder = new SiteBuilder();
  await builder.build();
}

// Check if running as script
if (require.main === module) {
  main();
}

module.exports = { SiteBuilder, TemplateEngine };
