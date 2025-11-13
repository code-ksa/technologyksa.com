/**
 * Technology KSA - Core Publisher
 * النظام الأساسي المتكامل للنشر الحقيقي
 */

class CorePublisher {
  constructor() {
    this.apiUrl = 'http://localhost:3001/api';
    this.siteUrl = 'http://127.0.0.1:8080';
    this.publishing = false;
  }

  /**
   * Check if API is available
   */
  async checkAPI() {
    try {
      const response = await fetch(`${this.apiUrl}/health`).catch(() => null);
      return response && response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Publish page to server
   */
  async publishPage(page) {
    try {
      if (this.publishing) {
        throw new Error('عملية نشر جارية بالفعل');
      }

      this.publishing = true;

      // Build HTML
      const html = this.buildPageHTML(page);

      // Check if API is available
      const apiAvailable = await this.checkAPI();

      if (apiAvailable) {
        // Publish via API
        const response = await fetch(`${this.apiUrl}/publish/page`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: page.slug || 'index',
            html: html,
            title: page.title
          })
        });

        const result = await response.json();

        if (result.success) {
          this.publishing = false;
          return {
            success: true,
            url: result.url,
            filename: result.filename,
            message: 'تم نشر الصفحة على الخادم بنجاح!',
            published: true
          };
        } else {
          throw new Error(result.error || 'فشل النشر');
        }

      } else {
        // Fallback: Download HTML
        this.publishing = false;
        return {
          success: true,
          html: html,
          filename: `${page.slug || 'index'}.html`,
          message: 'API غير متاح. قم بتحميل الملف يدوياً.',
          published: false
        };
      }

    } catch (error) {
      this.publishing = false;
      throw error;
    }
  }

  /**
   * Publish post to server
   */
  async publishPost(post) {
    try {
      if (this.publishing) {
        throw new Error('عملية نشر جارية بالفعل');
      }

      this.publishing = true;

      const html = this.buildPostHTML(post);
      const apiAvailable = await this.checkAPI();

      if (apiAvailable) {
        const response = await fetch(`${this.apiUrl}/publish/post`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: post.slug,
            html: html,
            title: post.title
          })
        });

        const result = await response.json();

        if (result.success) {
          this.publishing = false;
          return {
            success: true,
            url: result.url,
            message: 'تم نشر المقال على الخادم بنجاح!',
            published: true
          };
        } else {
          throw new Error(result.error || 'فشل النشر');
        }

      } else {
        this.publishing = false;
        return {
          success: true,
          html: html,
          filename: `${post.slug}.html`,
          message: 'API غير متاح. قم بتحميل الملف يدوياً.',
          published: false
        };
      }

    } catch (error) {
      this.publishing = false;
      throw error;
    }
  }

  /**
   * Rebuild entire site
   */
  async rebuildAll() {
    try {
      const pages = this.getPages();
      const posts = this.getPosts();
      const settings = this.getSettings();
      const menus = this.getMenus();

      const apiAvailable = await this.checkAPI();

      if (apiAvailable) {
        const response = await fetch(`${this.apiUrl}/rebuild-all`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pages: pages.filter(p => p.status === 'published'),
            posts: posts.filter(p => p.status === 'published'),
            settings: settings,
            menus: menus
          })
        });

        const result = await response.json();

        if (result.success) {
          return {
            success: true,
            message: `تم بناء الموقع بنجاح!\nالصفحات: ${result.results.pages}\nالمقالات: ${result.results.posts}`,
            results: result.results
          };
        } else {
          throw new Error(result.error || 'فشل البناء');
        }

      } else {
        throw new Error('Publisher API غير متاح. يرجى تشغيل: npm run publish-api');
      }

    } catch (error) {
      throw error;
    }
  }

  /**
   * Build page HTML
   */
  buildPageHTML(page) {
    const settings = this.getSettings();
    const menus = this.getMenus();
    const headerMenu = menus.find(m => m.location === 'header' || m.id === 'main-menu');

    const navHtml = this.buildNavigation(headerMenu);
    const contentHtml = this.buildPageContent(page);
    const footerHtml = this.buildFooter(settings, menus);

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.metaTitle || page.title}</title>
  <meta name="description" content="${page.metaDescription || ''}">
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <header class="site-header">
    <nav class="nav-container">
      <div class="nav-logo">
        <a href="/">
          <img src="${settings.logo || '/assets/images/logo.png'}" alt="${settings.siteName || 'Technology KSA'}">
        </a>
      </div>
      <ul class="nav-menu">
        ${navHtml}
      </ul>
      <div class="nav-toggle">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  </header>

  <main class="site-main">
    ${contentHtml}
  </main>

  ${footerHtml}

  <script src="/assets/js/main.js"></script>
</body>
</html>`;
  }

  /**
   * Build post HTML
   */
  buildPostHTML(post) {
    const settings = this.getSettings();
    const menus = this.getMenus();
    const headerMenu = menus.find(m => m.location === 'header' || m.id === 'main-menu');
    const navHtml = this.buildNavigation(headerMenu);
    const footerHtml = this.buildFooter(settings, menus);

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.metaTitle || post.title}</title>
  <meta name="description" content="${post.metaDescription || post.excerpt}">
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <header class="site-header">
    <nav class="nav-container">
      <div class="nav-logo">
        <a href="/">
          <img src="${settings.logo || '/assets/images/logo.png'}" alt="${settings.siteName || 'Technology KSA'}">
        </a>
      </div>
      <ul class="nav-menu">
        ${navHtml}
      </ul>
    </nav>
  </header>

  <main class="site-main">
    <article class="post-single container">
      <header class="post-header">
        <h1>${post.title}</h1>
        <div class="post-meta">
          <span><i class="fas fa-calendar"></i> ${post.date}</span>
          <span><i class="fas fa-folder"></i> ${post.category}</span>
          ${post.readTime ? `<span><i class="fas fa-clock"></i> ${post.readTime} دقائق</span>` : ''}
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

  ${footerHtml}

  <script src="/assets/js/main.js"></script>
</body>
</html>`;
  }

  /**
   * Build navigation
   */
  buildNavigation(menu) {
    if (!menu || !menu.items || menu.items.length === 0) {
      return '<li><a href="/">الرئيسية</a></li>';
    }

    return menu.items.map(item =>
      `<li><a href="${item.url}">${item.title}</a></li>`
    ).join('\n        ');
  }

  /**
   * Build page content
   */
  buildPageContent(page) {
    if (!page.layout || page.layout.length === 0) {
      return `
        <div class="container">
          <div class="page-header">
            <h1>${page.title}</h1>
          </div>
          <div class="page-content">
            <p>قم باستخدام Page Builder لإضافة المحتوى</p>
          </div>
        </div>
      `;
    }

    const sortedLayout = [...page.layout].sort((a, b) => (a.order || 0) - (b.order || 0));
    return sortedLayout.map(item => item.html || '').join('\n    ');
  }

  /**
   * Build footer
   */
  buildFooter(settings, menus) {
    const year = new Date().getFullYear();
    const siteName = settings.siteName || 'تكنولوجيا السعودية';

    const footerMenus = menus.filter(m => m.location && m.location.startsWith('footer'));
    let footerColumnsHtml = '';

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
          <p>${settings.siteDescription || ''}</p>
        </div>
        ${footerColumnsHtml}
        <div class="footer-col">
          <h4>تواصل معنا</h4>
          <p>${settings.email || ''}</p>
          <p>${settings.phone || ''}</p>
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
   * Get data from storage
   */
  getPages() {
    if (window.storage) {
      return storage.get('pages', []);
    }
    return JSON.parse(localStorage.getItem('techksa_pages') || '[]');
  }

  getPosts() {
    if (window.storage) {
      return storage.get('blog_posts', []);
    }
    return JSON.parse(localStorage.getItem('techksa_blog_posts') || '[]');
  }

  getSettings() {
    if (window.storage) {
      return storage.get('site_settings', {});
    }
    return JSON.parse(localStorage.getItem('techksa_site_settings') || '{}');
  }

  getMenus() {
    if (window.storage) {
      return storage.get('menus', []);
    }
    return JSON.parse(localStorage.getItem('techksa_menus') || '[]');
  }
}

// Global instance
const corePublisher = new CorePublisher();

// Export
if (typeof window !== 'undefined') {
  window.CorePublisher = CorePublisher;
  window.corePublisher = corePublisher;
}
