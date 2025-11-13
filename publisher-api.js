/**
 * Technology KSA - Publisher API
 * نظام نشر حقيقي يحفظ الملفات على الخادم
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Directories
const DIST_DIR = path.join(__dirname, 'dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');

// Ensure directories exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir(DIST_DIR);
ensureDir(ASSETS_DIR);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// PUBLISH PAGE
// ==========================================

app.post('/api/publish/page', (req, res) => {
  try {
    const { slug, html, title } = req.body;

    if (!slug || !html) {
      return res.status(400).json({
        success: false,
        error: 'Missing slug or html'
      });
    }

    // Determine file path
    const filename = slug === 'index' ? 'index.html' : `${slug}.html`;
    const filepath = path.join(DIST_DIR, filename);

    // Write file
    fs.writeFileSync(filepath, html, 'utf-8');

    const url = `http://127.0.0.1:8080/${slug === 'index' ? '' : filename}`;

    res.json({
      success: true,
      message: 'تم نشر الصفحة بنجاح',
      filename: filename,
      path: filepath,
      url: url,
      title: title
    });

    console.log(`✓ Published: ${filename}`);

  } catch (error) {
    console.error('Publish error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// PUBLISH POST
// ==========================================

app.post('/api/publish/post', (req, res) => {
  try {
    const { slug, html, title } = req.body;

    if (!slug || !html) {
      return res.status(400).json({
        success: false,
        error: 'Missing slug or html'
      });
    }

    // Create posts directory
    const postsDir = path.join(DIST_DIR, 'ar', 'blog', 'posts');
    ensureDir(postsDir);

    const filename = `${slug}.html`;
    const filepath = path.join(postsDir, filename);

    fs.writeFileSync(filepath, html, 'utf-8');

    const url = `http://127.0.0.1:8080/ar/blog/posts/${filename}`;

    res.json({
      success: true,
      message: 'تم نشر المقال بنجاح',
      filename: filename,
      path: filepath,
      url: url,
      title: title
    });

    console.log(`✓ Published post: ${filename}`);

  } catch (error) {
    console.error('Publish error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// PUBLISH BLOG INDEX
// ==========================================

app.post('/api/publish/blog-index', (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({
        success: false,
        error: 'Missing html'
      });
    }

    const blogDir = path.join(DIST_DIR, 'ar', 'blog');
    ensureDir(blogDir);

    const filepath = path.join(blogDir, 'index.html');
    fs.writeFileSync(filepath, html, 'utf-8');

    const url = 'http://127.0.0.1:8080/ar/blog/';

    res.json({
      success: true,
      message: 'تم نشر صفحة المدونة بنجاح',
      url: url
    });

    console.log('✓ Published blog index');

  } catch (error) {
    console.error('Publish error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// DELETE PAGE/POST
// ==========================================

app.post('/api/delete', (req, res) => {
  try {
    const { path: filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        error: 'Missing path'
      });
    }

    const fullPath = path.join(DIST_DIR, filePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      res.json({
        success: true,
        message: 'تم حذف الملف بنجاح'
      });
      console.log(`✓ Deleted: ${filePath}`);
    } else {
      res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// UPLOAD IMAGE
// ==========================================

app.post('/api/upload/image', (req, res) => {
  try {
    const { filename, data } = req.body;

    if (!filename || !data) {
      return res.status(400).json({
        success: false,
        error: 'Missing filename or data'
      });
    }

    const imagesDir = path.join(ASSETS_DIR, 'images', 'uploads');
    ensureDir(imagesDir);

    // Remove data URL prefix
    const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const filepath = path.join(imagesDir, filename);
    fs.writeFileSync(filepath, buffer);

    const url = `/assets/images/uploads/${filename}`;

    res.json({
      success: true,
      message: 'تم رفع الصورة بنجاح',
      url: url,
      filename: filename
    });

    console.log(`✓ Uploaded image: ${filename}`);

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// REBUILD ALL
// ==========================================

app.post('/api/rebuild-all', (req, res) => {
  try {
    const { pages, posts, settings, menus } = req.body;

    let results = {
      pages: 0,
      posts: 0,
      errors: []
    };

    // Build pages
    if (pages && Array.isArray(pages)) {
      pages.forEach(page => {
        try {
          const html = buildPageHTML(page, settings, menus);
          const filename = page.slug === 'index' ? 'index.html' : `${page.slug}.html`;
          const filepath = path.join(DIST_DIR, filename);
          fs.writeFileSync(filepath, html, 'utf-8');
          results.pages++;
        } catch (error) {
          results.errors.push(`Page ${page.slug}: ${error.message}`);
        }
      });
    }

    // Build posts
    if (posts && Array.isArray(posts)) {
      const postsDir = path.join(DIST_DIR, 'ar', 'blog', 'posts');
      ensureDir(postsDir);

      posts.forEach(post => {
        try {
          const html = buildPostHTML(post, settings, menus);
          const filepath = path.join(postsDir, `${post.slug}.html`);
          fs.writeFileSync(filepath, html, 'utf-8');
          results.posts++;
        } catch (error) {
          results.errors.push(`Post ${post.slug}: ${error.message}`);
        }
      });

      // Build blog index
      try {
        const blogHtml = buildBlogIndexHTML(posts, settings, menus);
        const blogDir = path.join(DIST_DIR, 'ar', 'blog');
        ensureDir(blogDir);
        fs.writeFileSync(path.join(blogDir, 'index.html'), blogHtml, 'utf-8');
      } catch (error) {
        results.errors.push(`Blog index: ${error.message}`);
      }
    }

    res.json({
      success: true,
      message: 'تم إعادة بناء الموقع بنجاح',
      results: results
    });

    console.log(`✓ Rebuilt: ${results.pages} pages, ${results.posts} posts`);

  } catch (error) {
    console.error('Rebuild error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function buildPageHTML(page, settings, menus) {
  const headerMenu = menus.find(m => m.location === 'header' || m.id === 'main-menu');
  const navHtml = buildNavigation(headerMenu);
  const contentHtml = buildPageContent(page);
  const footerHtml = buildFooter(settings, menus);

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.metaTitle || page.title}</title>
  <meta name="description" content="${page.metaDescription || ''}">
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <header class="site-header">
    <nav class="nav-container">
      <div class="nav-logo">
        <a href="/"><img src="${settings.logo || '/assets/images/logo.png'}" alt="${settings.siteName}"></a>
      </div>
      <ul class="nav-menu">${navHtml}</ul>
    </nav>
  </header>
  <main class="site-main">${contentHtml}</main>
  ${footerHtml}
  <script src="/assets/js/main.js"></script>
</body>
</html>`;
}

function buildPostHTML(post, settings, menus) {
  const headerMenu = menus.find(m => m.location === 'header' || m.id === 'main-menu');
  const navHtml = buildNavigation(headerMenu);
  const footerHtml = buildFooter(settings, menus);

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.metaTitle || post.title}</title>
  <meta name="description" content="${post.metaDescription || post.excerpt}">
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <header class="site-header">
    <nav class="nav-container">
      <div class="nav-logo">
        <a href="/"><img src="${settings.logo || '/assets/images/logo.png'}" alt="${settings.siteName}"></a>
      </div>
      <ul class="nav-menu">${navHtml}</ul>
    </nav>
  </header>
  <main class="site-main">
    <article class="post-single container">
      <header class="post-header">
        <h1>${post.title}</h1>
        <div class="post-meta">
          <span>${post.date}</span>
          <span>${post.category}</span>
        </div>
      </header>
      ${post.featuredImage ? `<img src="${post.featuredImage}" alt="${post.imageAlt || post.title}">` : ''}
      <div class="post-content">${post.content}</div>
    </article>
  </main>
  ${footerHtml}
  <script src="/assets/js/main.js"></script>
</body>
</html>`;
}

function buildBlogIndexHTML(posts, settings, menus) {
  const headerMenu = menus.find(m => m.location === 'header' || m.id === 'main-menu');
  const navHtml = buildNavigation(headerMenu);
  const footerHtml = buildFooter(settings, menus);

  const publishedPosts = posts.filter(p => p.status === 'published');
  const postsHtml = publishedPosts.map(post => `
    <article class="post-card">
      ${post.featuredImage ? `<img src="${post.featuredImage}" alt="${post.title}">` : ''}
      <h2><a href="/ar/blog/posts/${post.slug}.html">${post.title}</a></h2>
      <p>${post.excerpt}</p>
      <a href="/ar/blog/posts/${post.slug}.html" class="btn btn-primary">اقرأ المزيد</a>
    </article>
  `).join('');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>المدونة - ${settings.siteName || 'Technology KSA'}</title>
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <header class="site-header">
    <nav class="nav-container">
      <div class="nav-logo">
        <a href="/"><img src="${settings.logo || '/assets/images/logo.png'}" alt="${settings.siteName}"></a>
      </div>
      <ul class="nav-menu">${navHtml}</ul>
    </nav>
  </header>
  <main class="site-main">
    <div class="container">
      <h1>المدونة</h1>
      <div class="posts-grid">${postsHtml}</div>
    </div>
  </main>
  ${footerHtml}
  <script src="/assets/js/main.js"></script>
</body>
</html>`;
}

function buildNavigation(menu) {
  if (!menu || !menu.items) return '<li><a href="/">الرئيسية</a></li>';
  return menu.items.map(item => `<li><a href="${item.url}">${item.title}</a></li>`).join('');
}

function buildPageContent(page) {
  if (!page.layout || page.layout.length === 0) {
    return `<div class="container"><h1>${page.title}</h1></div>`;
  }
  return page.layout.map(item => item.html || '').join('');
}

function buildFooter(settings, menus) {
  const year = new Date().getFullYear();
  return `
  <footer class="site-footer">
    <div class="container">
      <p>&copy; ${year} ${settings.siteName || 'Technology KSA'}. جميع الحقوق محفوظة.</p>
    </div>
  </footer>`;
}

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(`\n✓ Publisher API running on http://localhost:${PORT}`);
  console.log(`✓ Ready to publish pages and posts\n`);
});
