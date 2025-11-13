/**
 * Technology KSA - Frontend Builder
 * نظام بناء الصفحات تلقائياً من جانب العميل
 * بدون الحاجة لـ Node.js!
 */

class FrontendBuilder {
  constructor() {
    this.settings = {};
    this.menus = [];
    this.pages = [];
    this.posts = [];
  }

  /**
   * Initialize builder
   */
  async init() {
    this.loadData();
  }

  /**
   * Load data from storage
   */
  loadData() {
    if (window.storage) {
      this.settings = storage.get('site_settings', {});
      this.menus = storage.get('menus', []);
      this.pages = storage.get('pages', []);
      this.posts = storage.get('blog_posts', []);
    } else {
      this.settings = JSON.parse(localStorage.getItem('techksa_site_settings') || '{}');
      this.menus = JSON.parse(localStorage.getItem('techksa_menus') || '[]');
      this.pages = JSON.parse(localStorage.getItem('techksa_pages') || '[]');
      this.posts = JSON.parse(localStorage.getItem('techksa_blog_posts') || '[]');
    }
  }

  /**
   * Build single page
   */
  buildPage(page) {
    const headerMenu = this.menus.find(m => m.location === 'header' || m.id === 'main-menu');
    const footerMenus = this.menus.filter(m => m.location && m.location.startsWith('footer'));

    // Build navigation
    const navHtml = this.buildNavigation(headerMenu);

    // Build footer
    const footerHtml = this.buildFooter(footerMenus);

    // Build content from layout
    const contentHtml = this.buildPageContent(page);

    // Generate full HTML
    const html = this.getPageTemplate({
      title: page.title,
      metaTitle: page.metaTitle || page.title,
      metaDescription: page.metaDescription || '',
      siteName: this.settings.siteName || 'تكنولوجيا السعودية',
      navigation: navHtml,
      content: contentHtml,
      footer: footerHtml,
      slug: page.slug
    });

    return html;
  }

  /**
   * Build navigation from menu
   */
  buildNavigation(menu) {
    if (!menu || !menu.items || menu.items.length === 0) {
      return '<li><a href="/">الرئيسية</a></li>';
    }

    return menu.items.map(item => {
      return `<li><a href="${item.url}">${item.title}</a></li>`;
    }).join('\n        ');
  }

  /**
   * Build page content from layout
   */
  buildPageContent(page) {
    if (!page.layout || page.layout.length === 0) {
      return `
        <div class="container">
          <div class="page-header">
            <h1>${page.title}</h1>
          </div>
          <div class="page-content">
            <p>المحتوى سيظهر هنا بعد استخدام Page Builder</p>
          </div>
        </div>
      `;
    }

    // Sort layout by order
    const sortedLayout = [...page.layout].sort((a, b) => (a.order || 0) - (b.order || 0));

    return sortedLayout.map(item => item.html || '').join('\n    ');
  }

  /**
   * Build footer
   */
  buildFooter(footerMenus) {
    const year = new Date().getFullYear();
    const siteName = this.settings.siteName || 'تكنولوجيا السعودية';

    let footerColumnsHtml = '';

    // Build footer columns from menus
    footerMenus.forEach(menu => {
      if (menu.items && menu.items.length > 0) {
        const linksHtml = menu.items.map(item =>
          `<li><a href="${item.url}">${item.title}</a></li>`
        ).join('\n            ');

        footerColumnsHtml += `
        <div class="footer-col">
          <h4>${menu.name}</h4>
          <ul>
            ${linksHtml}
          </ul>
        </div>
        `;
      }
    });

    return `
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <div class="footer-col">
          <h3>${siteName}</h3>
          <p>${this.settings.siteDescription || ''}</p>
        </div>
        ${footerColumnsHtml}
        <div class="footer-col">
          <h4>تواصل معنا</h4>
          <p>${this.settings.email || ''}</p>
          <p>${this.settings.phone || ''}</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${year} ${siteName}. جميع الحقوق محفوظة.</p>
      </div>
    </div>
  </footer>
    `;
  }

  /**
   * Get page template
   */
  getPageTemplate(data) {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.metaTitle}</title>
  <meta name="description" content="${data.metaDescription}">

  <!-- Open Graph -->
  <meta property="og:title" content="${data.metaTitle}">
  <meta property="og:description" content="${data.metaDescription}">
  <meta property="og:type" content="website">

  <!-- Styles -->
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <header class="site-header">
    <nav class="nav-container">
      <div class="nav-logo">
        <a href="/">
          <img src="${this.settings.logo || '/assets/images/logo.png'}" alt="${data.siteName}">
        </a>
      </div>
      <ul class="nav-menu">
        ${data.navigation}
      </ul>
      <div class="nav-toggle">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  </header>

  <main class="site-main">
    ${data.content}
  </main>

  ${data.footer}

  <!-- Scripts -->
  <script src="/assets/js/main.js"></script>
  <script src="/assets/js/site-loader.js"></script>
</body>
</html>`;
  }

  /**
   * Build and save page to file
   */
  async buildAndSavePage(page) {
    try {
      const html = this.buildPage(page);

      // Create blob
      const blob = new Blob([html], { type: 'text/html' });

      // Determine filename
      const filename = page.slug === 'index' || !page.slug
        ? 'index.html'
        : `${page.slug}.html`;

      // Download file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      return {
        success: true,
        filename: filename,
        url: `/${page.slug || 'index'}`,
        message: 'تم بناء الصفحة بنجاح!'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Build blog index page
   */
  buildBlogIndex() {
    const publishedPosts = this.posts.filter(p => p.status === 'published');
    const headerMenu = this.menus.find(m => m.location === 'header' || m.id === 'main-menu');

    const postsHtml = publishedPosts.map(post => `
      <article class="post-card">
        ${post.featuredImage ? `
          <div class="post-thumbnail">
            <img src="${post.featuredImage}" alt="${post.imageAlt || post.title}">
          </div>
        ` : ''}
        <div class="post-content">
          <h2><a href="/ar/blog/posts/${post.slug}.html">${post.title}</a></h2>
          <div class="post-meta">
            <span><i class="fas fa-calendar"></i> ${post.date}</span>
            <span><i class="fas fa-folder"></i> ${post.category}</span>
            ${post.readTime ? `<span><i class="fas fa-clock"></i> ${post.readTime} دقائق</span>` : ''}
          </div>
          <p>${post.excerpt}</p>
          <a href="/ar/blog/posts/${post.slug}.html" class="btn btn-primary">اقرأ المزيد</a>
        </div>
      </article>
    `).join('\n      ');

    const navHtml = this.buildNavigation(headerMenu);
    const footerHtml = this.buildFooter(this.menus.filter(m => m.location && m.location.startsWith('footer')));

    const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>المدونة - ${this.settings.siteName || 'تكنولوجيا السعودية'}</title>
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <header class="site-header">
    <nav class="nav-container">
      <div class="nav-logo">
        <a href="/">
          <img src="${this.settings.logo || '/assets/images/logo.png'}" alt="${this.settings.siteName}">
        </a>
      </div>
      <ul class="nav-menu">
        ${navHtml}
      </ul>
    </nav>
  </header>

  <main class="site-main">
    <div class="container">
      <div class="page-header">
        <h1>المدونة</h1>
        <p>آخر المقالات والأخبار</p>
      </div>

      <div class="posts-grid">
        ${postsHtml || '<p>لا توجد مقالات منشورة حالياً.</p>'}
      </div>
    </div>
  </main>

  ${footerHtml}

  <script src="/assets/js/main.js"></script>
</body>
</html>`;

    return html;
  }

  /**
   * Show success modal with page link
   */
  showSuccessModal(page, message) {
    const pageUrl = `/${page.slug || 'index'}.html`;

    // Create modal HTML
    const modalHtml = `
      <div id="successModal" class="modal active" style="z-index: 10000;">
        <div class="modal-overlay" onclick="closeSuccessModal()"></div>
        <div class="modal-content" style="max-width: 500px;">
          <div class="modal-header" style="background: var(--success-color); color: white;">
            <h3><i class="fas fa-check-circle"></i> ${message}</h3>
            <button class="modal-close" onclick="closeSuccessModal()" style="color: white;">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div style="text-align: center; padding: 2rem;">
              <i class="fas fa-check-circle" style="font-size: 4rem; color: var(--success-color); margin-bottom: 1rem;"></i>
              <h2 style="margin-bottom: 1rem;">${page.title}</h2>
              <p style="margin-bottom: 1.5rem;">الصفحة جاهزة للعرض!</p>

              <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <small style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">رابط الصفحة:</small>
                <code style="font-size: 1.1rem; color: var(--primary-color);">${pageUrl}</code>
              </div>

              <div style="display: flex; gap: 1rem; justify-content: center;">
                <a href="${pageUrl}" target="_blank" class="btn btn-success" style="flex: 1;">
                  <i class="fas fa-external-link-alt"></i> فتح الصفحة
                </a>
                <button onclick="downloadPage('${page.id}')" class="btn btn-primary" style="flex: 1;">
                  <i class="fas fa-download"></i> تحميل HTML
                </button>
              </div>

              <p style="margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                <i class="fas fa-info-circle"></i> تم حفظ الصفحة في localStorage.<br>
                لنشرها على الموقع الحقيقي، قم بتحميل الملف ورفعه للخادم.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Remove old modal if exists
    const oldModal = document.getElementById('successModal');
    if (oldModal) oldModal.remove();

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }
}

// Global instance
let frontendBuilder;

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    frontendBuilder = new FrontendBuilder();
    frontendBuilder.init();
  });
} else {
  frontendBuilder = new FrontendBuilder();
  frontendBuilder.init();
}

// Helper functions
function closeSuccessModal() {
  const modal = document.getElementById('successModal');
  if (modal) modal.remove();
}

function downloadPage(pageId) {
  if (!frontendBuilder) return;

  const page = frontendBuilder.pages.find(p => p.id === pageId);
  if (page) {
    frontendBuilder.buildAndSavePage(page);
  }
}

// Export
if (typeof window !== 'undefined') {
  window.FrontendBuilder = FrontendBuilder;
  window.frontendBuilder = frontendBuilder;
}
