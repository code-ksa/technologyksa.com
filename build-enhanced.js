#!/usr/bin/env node

/**
 * Technology KSA - Enhanced Build System
 * نظام بناء محسّن يدعم النظام الجديد
 *
 * الميزات:
 * - قراءة البيانات من localStorage (محاكاة)
 * - بناء صفحات ديناميكية للمدونة والخدمات
 * - تحديث القوائم تلقائياً
 * - دعم الصور من IndexedDB
 */

const fs = require('fs');
const path = require('path');

// ==========================================
// CONFIGURATION
// ==========================================

const CONFIG = {
  rootDir: __dirname,
  distDir: 'dist',
  templatesDir: 'templates',
  pagesDataFile: 'pages-data.json', // Will be exported from admin
  postsDataFile: 'posts-data.json',
  menusDataFile: 'menus-data.json',
  settingsDataFile: 'settings-data.json'
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
  }
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    return null;
  }
}

function writeFile(filePath, content) {
  try {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    log(`Error writing file: ${filePath} - ${error.message}`, 'error');
    return false;
  }
}

// ==========================================
// DATA LOADER
// ==========================================

class DataLoader {
  constructor() {
    this.pages = [];
    this.posts = [];
    this.menus = [];
    this.settings = {};
  }

  loadData() {
    // Load pages
    const pagesFile = path.join(CONFIG.rootDir, CONFIG.pagesDataFile);
    if (fs.existsSync(pagesFile)) {
      this.pages = JSON.parse(readFile(pagesFile));
      log(`Loaded ${this.pages.length} pages`, 'success');
    } else {
      log('No pages data file found. Run export from admin first.', 'warning');
    }

    // Load posts
    const postsFile = path.join(CONFIG.rootDir, CONFIG.postsDataFile);
    if (fs.existsSync(postsFile)) {
      this.posts = JSON.parse(readFile(postsFile));
      log(`Loaded ${this.posts.length} posts`, 'success');
    }

    // Load menus
    const menusFile = path.join(CONFIG.rootDir, CONFIG.menusDataFile);
    if (fs.existsSync(menusFile)) {
      this.menus = JSON.parse(readFile(menusFile));
      log(`Loaded ${this.menus.length} menus`, 'success');
    }

    // Load settings
    const settingsFile = path.join(CONFIG.rootDir, CONFIG.settingsDataFile);
    if (fs.existsSync(settingsFile)) {
      this.settings = JSON.parse(readFile(settingsFile));
      log('Settings loaded', 'success');
    }
  }
}

// ==========================================
// TEMPLATE ENGINE
// ==========================================

class EnhancedTemplateEngine {
  constructor(data) {
    this.data = data;
  }

  compile(template, vars = {}) {
    let result = template;

    // Replace variables
    for (const [key, value] of Object.entries(vars)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value || '');
    }

    // Remove unreplaced variables
    result = result.replace(/{{[^}]+}}/g, '');

    return result;
  }

  buildPage(page) {
    const headerMenu = this.data.menus.find(m => m.location === 'header');

    const vars = {
      title: page.title,
      metaTitle: page.metaTitle || page.title,
      metaDescription: page.metaDescription || '',
      siteName: this.data.settings.siteName || 'تكنولوجيا السعودية',
      year: new Date().getFullYear(),
      navigation: this.buildNavigation(headerMenu),
      content: page.content || '',
      footer: this.buildFooter()
    };

    const template = this.getPageTemplate();
    return this.compile(template, vars);
  }

  buildNavigation(menu) {
    if (!menu || !menu.items) return '';

    return menu.items.map(item =>
      `<li><a href="${item.url}">${item.title}</a></li>`
    ).join('\n');
  }

  buildFooter() {
    const year = new Date().getFullYear();
    const siteName = this.data.settings.siteName || 'تكنولوجيا السعودية';

    return `
      <footer class="site-footer">
        <div class="container">
          <p>&copy; ${year} ${siteName}. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    `;
  }

  buildBlogIndex() {
    const publishedPosts = this.data.posts.filter(p => p.status === 'published');

    const postsHtml = publishedPosts.map(post => `
      <article class="post-card">
        <h2><a href="/ar/blog/posts/${post.slug}.html">${post.title}</a></h2>
        <p>${post.excerpt}</p>
        <div class="post-meta">
          <span>${post.date}</span>
          <span>${post.category}</span>
        </div>
      </article>
    `).join('\n');

    return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>المدونة - ${this.data.settings.siteName || 'تكنولوجيا السعودية'}</title>
  <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
  <header class="site-header">
    <nav>
      ${this.buildNavigation(this.data.menus.find(m => m.location === 'header'))}
    </nav>
  </header>

  <main class="blog-index">
    <div class="container">
      <h1>المدونة</h1>
      <div class="posts-grid">
        ${postsHtml}
      </div>
    </div>
  </main>

  ${this.buildFooter()}

  <script src="/assets/js/main.js"></script>
  <script src="/assets/js/core-system.js"></script>
</body>
</html>
    `;
  }

  buildPostPage(post) {
    return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.metaTitle || post.title}</title>
  <meta name="description" content="${post.metaDescription || post.excerpt}">
  <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
  <header class="site-header">
    <nav>
      ${this.buildNavigation(this.data.menus.find(m => m.location === 'header'))}
    </nav>
  </header>

  <main class="post-single">
    <article class="container">
      <header class="post-header">
        <h1>${post.title}</h1>
        <div class="post-meta">
          <span>تاريخ النشر: ${post.date}</span>
          <span>التصنيف: ${post.category}</span>
          <span>وقت القراءة: ${post.readTime || '5'} دقائق</span>
        </div>
      </header>

      ${post.featuredImage ? `
        <div class="post-featured-image">
          <img src="${post.featuredImage}" alt="${post.imageAlt || post.title}">
        </div>
      ` : ''}

      <div class="post-content">
        ${post.content}
      </div>
    </article>
  </main>

  ${this.buildFooter()}

  <script src="/assets/js/main.js"></script>
</body>
</html>
    `;
  }

  getPageTemplate() {
    return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{metaTitle}}</title>
  <meta name="description" content="{{metaDescription}}">
  <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
  <header class="site-header">
    <nav>
      <ul>{{navigation}}</ul>
    </nav>
  </header>

  <main>
    {{content}}
  </main>

  {{footer}}

  <script src="/assets/js/main.js"></script>
  <script src="/assets/js/core-system.js"></script>
</body>
</html>
    `;
  }
}

// ==========================================
// ENHANCED BUILDER
// ==========================================

class EnhancedBuilder {
  constructor() {
    this.dataLoader = new DataLoader();
    this.stats = {
      pages: 0,
      posts: 0,
      errors: 0
    };
  }

  async build() {
    log('Starting enhanced build...', 'info');
    console.log('');

    try {
      // Load data
      this.dataLoader.loadData();

      // Create template engine
      const engine = new EnhancedTemplateEngine(this.dataLoader);

      // Build pages
      this.buildPages(engine);

      // Build blog
      this.buildBlog(engine);

      // Show stats
      console.log('');
      log('Build completed!', 'success');
      log(`Pages: ${this.stats.pages}`, 'info');
      log(`Posts: ${this.stats.posts}`, 'info');

      if (this.stats.errors > 0) {
        log(`Errors: ${this.stats.errors}`, 'error');
      }

    } catch (error) {
      log(`Build failed: ${error.message}`, 'error');
      console.error(error);
      process.exit(1);
    }
  }

  buildPages(engine) {
    log('Building pages...', 'info');

    const publishedPages = this.dataLoader.pages.filter(p => p.status === 'published');

    publishedPages.forEach(page => {
      try {
        const html = engine.buildPage(page);
        const filePath = path.join(CONFIG.distDir, page.slug || 'index', 'index.html');

        if (writeFile(filePath, html)) {
          this.stats.pages++;
          log(`Built: ${page.slug || 'index'}`, 'success');
        } else {
          this.stats.errors++;
        }
      } catch (error) {
        log(`Error building page ${page.slug}: ${error.message}`, 'error');
        this.stats.errors++;
      }
    });
  }

  buildBlog(engine) {
    log('Building blog...', 'info');

    // Build blog index
    const indexHtml = engine.buildBlogIndex();
    const indexPath = path.join(CONFIG.distDir, 'ar', 'blog', 'index.html');

    if (writeFile(indexPath, indexHtml)) {
      log('Built: blog index', 'success');
    }

    // Build individual posts
    const publishedPosts = this.dataLoader.posts.filter(p => p.status === 'published');

    publishedPosts.forEach(post => {
      try {
        const html = engine.buildPostPage(post);
        const filePath = path.join(CONFIG.distDir, 'ar', 'blog', 'posts', `${post.slug}.html`);

        if (writeFile(filePath, html)) {
          this.stats.posts++;
          log(`Built post: ${post.slug}`, 'success');
        } else {
          this.stats.errors++;
        }
      } catch (error) {
        log(`Error building post ${post.slug}: ${error.message}`, 'error');
        this.stats.errors++;
      }
    });
  }
}

// ==========================================
// MAIN
// ==========================================

async function main() {
  const builder = new EnhancedBuilder();
  await builder.build();
}

if (require.main === module) {
  main();
}

module.exports = { EnhancedBuilder };
