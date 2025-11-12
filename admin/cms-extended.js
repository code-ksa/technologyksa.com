/**
 * Technology KSA CMS - Extended Functions
 * Page Builder, Publish, Preview & Build Functions
 */

// ==========================================
// PAGE BUILDER MANAGER
// ==========================================

class PageBuilderManager {
  constructor() {
    this.currentPage = null;
    this.pageLayout = [];
    this.componentsLibrary = {};
  }

  init() {
    this.loadComponentsLibrary();
    this.initDragAndDrop();
  }

  loadComponentsLibrary() {
    // Define available components
    this.componentsLibrary = {
      hero: [
        {
          id: 'hero-centered',
          name: 'Hero مركّز',
          preview: '<div class="hero-section centered"><h1>العنوان الرئيسي</h1><p>وصف قصير</p><button>ابدأ الآن</button></div>',
          html: `<section class="hero-section" data-component="hero-centered">
  <div class="container">
    <div class="hero-content text-center">
      <h1 class="hero-title">مرحباً بك في موقعنا</h1>
      <p class="hero-description">نقدم أفضل الحلول التقنية</p>
      <div class="hero-buttons">
        <a href="#" class="btn btn-primary">ابدأ الآن</a>
        <a href="#" class="btn btn-secondary">المزيد</a>
      </div>
    </div>
  </div>
</section>`
        },
        {
          id: 'hero-split',
          name: 'Hero مقسّم',
          preview: '<div class="hero-section split"><div><h1>العنوان</h1><p>الوصف</p></div><div>[صورة]</div></div>',
          html: `<section class="hero-section hero-split" data-component="hero-split">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-md-6">
        <h1 class="hero-title">حلول تقنية متطورة</h1>
        <p class="hero-description">نساعدك على تحقيق أهدافك الرقمية</p>
        <a href="#" class="btn btn-primary">تواصل معنا</a>
      </div>
      <div class="col-md-6">
        <img src="/assets/images/hero-image.jpg" alt="Hero Image" class="img-fluid">
      </div>
    </div>
  </div>
</section>`
        }
      ],
      cta: [
        {
          id: 'cta-simple',
          name: 'CTA بسيط',
          preview: '<div class="cta-section"><h2>جاهز للبدء؟</h2><button>ابدأ الآن</button></div>',
          html: `<section class="cta-section" data-component="cta-simple">
  <div class="container">
    <div class="cta-content text-center">
      <h2>جاهز للبدء؟</h2>
      <p>انضم إلى عملائنا المميزين اليوم</p>
      <a href="/contact" class="btn btn-primary btn-lg">تواصل معنا الآن</a>
    </div>
  </div>
</section>`
        }
      ],
      features: [
        {
          id: 'features-grid-3',
          name: 'Features Grid (3 أعمدة)',
          preview: '<div class="features-grid"><div>[ميزة 1]</div><div>[ميزة 2]</div><div>[ميزة 3]</div></div>',
          html: `<section class="features-section" data-component="features-grid-3">
  <div class="container">
    <div class="section-header text-center">
      <h2>خدماتنا المميزة</h2>
      <p>نقدم مجموعة شاملة من الحلول التقنية</p>
    </div>
    <div class="features-grid">
      <div class="feature-item">
        <div class="feature-icon"><i class="fas fa-code"></i></div>
        <h3>تطوير المواقع</h3>
        <p>تصميم وتطوير مواقع احترافية</p>
      </div>
      <div class="feature-item">
        <div class="feature-icon"><i class="fas fa-mobile-alt"></i></div>
        <h3>تطبيقات الجوال</h3>
        <p>تطبيقات iOS و Android</p>
      </div>
      <div class="feature-item">
        <div class="feature-icon"><i class="fas fa-chart-line"></i></div>
        <h3>التسويق الرقمي</h3>
        <p>استراتيجيات تسويق فعالة</p>
      </div>
    </div>
  </div>
</section>`
        }
      ],
      testimonials: [
        {
          id: 'testimonials-slider',
          name: 'شهادات العملاء',
          preview: '<div class="testimonials"><div>[شهادة 1]</div><div>[شهادة 2]</div></div>',
          html: `<section class="testimonials-section" data-component="testimonials-slider">
  <div class="container">
    <div class="section-header text-center">
      <h2>ماذا يقول عملاؤنا</h2>
    </div>
    <div class="testimonials-grid">
      <div class="testimonial-item">
        <p>"خدمة ممتازة واحترافية عالية"</p>
        <div class="author">
          <strong>محمد أحمد</strong>
          <span>الرئيس التنفيذي</span>
        </div>
      </div>
      <div class="testimonial-item">
        <p>"فريق رائع وتنفيذ سريع"</p>
        <div class="author">
          <strong>سارة علي</strong>
          <span>مديرة المشاريع</span>
        </div>
      </div>
    </div>
  </div>
</section>`
        }
      ],
      stats: [
        {
          id: 'stats-4col',
          name: 'إحصائيات (4 أعمدة)',
          preview: '<div class="stats-grid"><div>100+</div><div>50+</div><div>1000+</div><div>5+</div></div>',
          html: `<section class="stats-section" data-component="stats-4col">
  <div class="container">
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-number">100+</span>
        <span class="stat-label">مشروع مكتمل</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">50+</span>
        <span class="stat-label">عميل سعيد</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">1000+</span>
        <span class="stat-label">ساعة عمل</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">5+</span>
        <span class="stat-label">سنوات خبرة</span>
      </div>
    </div>
  </div>
</section>`
        }
      ],
      contact: [
        {
          id: 'contact-form',
          name: 'نموذج اتصال',
          preview: '<div class="contact-form"><form>[نموذج]</form></div>',
          html: `<section class="contact-section" data-component="contact-form">
  <div class="container">
    <div class="section-header text-center">
      <h2>تواصل معنا</h2>
      <p>نسعد بتواصلك معنا</p>
    </div>
    <div class="contact-form-wrapper">
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
          <label>الرسالة</label>
          <textarea name="message" rows="5" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">إرسال</button>
      </form>
    </div>
  </div>
</section>`
        }
      ]
    };
  }

  renderComponentsToSidebar() {
    // Render hero components
    const heroContainer = document.getElementById('heroComponents');
    if (heroContainer) {
      heroContainer.innerHTML = this.componentsLibrary.hero.map(comp => `
        <div class="component-item draggable" data-component-id="${comp.id}" data-component-type="hero" draggable="true">
          <div class="component-preview">${comp.preview}</div>
          <div class="component-name">${comp.name}</div>
        </div>
      `).join('');
    }

    // Render CTA components
    const ctaContainer = document.getElementById('ctaComponents');
    if (ctaContainer) {
      ctaContainer.innerHTML = this.componentsLibrary.cta.map(comp => `
        <div class="component-item draggable" data-component-id="${comp.id}" data-component-type="cta" draggable="true">
          <div class="component-preview">${comp.preview}</div>
          <div class="component-name">${comp.name}</div>
        </div>
      `).join('');
    }

    // Render Features components
    const featuresContainer = document.getElementById('featuresComponents');
    if (featuresContainer) {
      featuresContainer.innerHTML = this.componentsLibrary.features.map(comp => `
        <div class="component-item draggable" data-component-id="${comp.id}" data-component-type="features" draggable="true">
          <div class="component-preview">${comp.preview}</div>
          <div class="component-name">${comp.name}</div>
        </div>
      `).join('');
    }

    // Render Testimonials components
    const testimonialsContainer = document.getElementById('testimonialsComponents');
    if (testimonialsContainer) {
      testimonialsContainer.innerHTML = this.componentsLibrary.testimonials.map(comp => `
        <div class="component-item draggable" data-component-id="${comp.id}" data-component-type="testimonials" draggable="true">
          <div class="component-preview">${comp.preview}</div>
          <div class="component-name">${comp.name}</div>
        </div>
      `).join('');
    }

    // Render Stats components
    const statsContainer = document.getElementById('statsComponents');
    if (statsContainer) {
      statsContainer.innerHTML = this.componentsLibrary.stats.map(comp => `
        <div class="component-item draggable" data-component-id="${comp.id}" data-component-type="stats" draggable="true">
          <div class="component-preview">${comp.preview}</div>
          <div class="component-name">${comp.name}</div>
        </div>
      `).join('');
    }

    // Render Contact components
    const contactContainer = document.getElementById('contactComponents');
    if (contactContainer) {
      contactContainer.innerHTML = this.componentsLibrary.contact.map(comp => `
        <div class="component-item draggable" data-component-id="${comp.id}" data-component-type="contact" draggable="true">
          <div class="component-preview">${comp.preview}</div>
          <div class="component-name">${comp.name}</div>
        </div>
      `).join('');
    }
  }

  initDragAndDrop() {
    const canvas = document.getElementById('pageCanvas');
    if (!canvas) return;

    // Enable drag and drop
    canvas.addEventListener('dragover', (e) => {
      e.preventDefault();
      canvas.classList.add('drag-over');
    });

    canvas.addEventListener('dragleave', () => {
      canvas.classList.remove('drag-over');
    });

    canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      canvas.classList.remove('drag-over');

      const componentType = e.dataTransfer.getData('component-type');
      const componentId = e.dataTransfer.getData('component-id');

      this.addComponentToCanvas(componentType, componentId);
    });

    // Setup draggable items
    document.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('draggable')) {
        e.dataTransfer.setData('component-type', e.target.dataset.componentType);
        e.dataTransfer.setData('component-id', e.target.dataset.componentId);
      }
    });
  }

  addComponentToCanvas(type, id) {
    const component = this.componentsLibrary[type]?.find(c => c.id === id);
    if (!component) return;

    const canvas = document.getElementById('pageCanvas');
    const emptyState = canvas.querySelector('.canvas-empty');
    if (emptyState) {
      emptyState.style.display = 'none';
    }

    const componentElement = document.createElement('div');
    componentElement.className = 'canvas-component';
    componentElement.dataset.componentId = id;
    componentElement.dataset.componentType = type;
    componentElement.innerHTML = `
      <div class="component-toolbar">
        <button class="btn-icon" onclick="moveComponentUp(this)" title="تحريك لأعلى">
          <i class="fas fa-arrow-up"></i>
        </button>
        <button class="btn-icon" onclick="moveComponentDown(this)" title="تحريك لأسفل">
          <i class="fas fa-arrow-down"></i>
        </button>
        <button class="btn-icon" onclick="editComponent(this)" title="تعديل">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-icon btn-danger" onclick="removeComponent(this)" title="حذف">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="component-content">
        ${component.html}
      </div>
    `;

    canvas.appendChild(componentElement);

    // Add to layout
    this.pageLayout.push({
      id: id,
      type: type,
      html: component.html,
      order: this.pageLayout.length
    });

    this.showNotification('تم إضافة العنصر بنجاح', 'success');
  }

  showNotification(message, type = 'info') {
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    `;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999999;
      background: ${type === 'success' ? '#10B981' : type === 'error' ? '#ef4444' : '#0066FF'};
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      animation: slideDown 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideUp 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Global instance
let pageBuilderManager = null;

// ==========================================
// PAGE BUILDER FUNCTIONS
// ==========================================

function initPageBuilder() {
  if (!pageBuilderManager) {
    pageBuilderManager = new PageBuilderManager();
    pageBuilderManager.init();
  }
  pageBuilderManager.renderComponentsToSidebar();
  loadPageForBuilder();
}

function loadPageForBuilder() {
  // Get pages from localStorage
  const pagesData = localStorage.getItem('techksa_pages');
  const pages = pagesData ? JSON.parse(pagesData) : [];

  if (pages.length === 0) {
    pageBuilderManager.showNotification('لا توجد صفحات. قم بإنشاء صفحة أولاً من قسم "الصفحات"', 'warning');
    // Show empty canvas
    const canvas = document.getElementById('pageCanvas');
    if (canvas) {
      const emptyState = canvas.querySelector('.canvas-empty');
      if (emptyState) emptyState.style.display = 'flex';
    }
    return;
  }

  // Load first page by default
  pageBuilderManager.currentPage = pages[0];
  const currentPageNameEl = document.getElementById('currentPageName');
  if (currentPageNameEl) {
    currentPageNameEl.textContent = pages[0].title;
  }

  // Load existing layout if available
  if (pages[0].layout && pages[0].layout.length > 0) {
    pageBuilderManager.pageLayout = pages[0].layout;
    renderExistingLayout();
  }
}

function renderExistingLayout() {
  const canvas = document.getElementById('pageCanvas');
  const emptyState = canvas.querySelector('.canvas-empty');
  if (emptyState) emptyState.style.display = 'none';

  // Clear canvas
  Array.from(canvas.children).forEach(child => {
    if (!child.classList.contains('canvas-empty')) {
      child.remove();
    }
  });

  // Render layout
  pageBuilderManager.pageLayout.forEach(item => {
    const componentElement = document.createElement('div');
    componentElement.className = 'canvas-component';
    componentElement.dataset.componentId = item.id;
    componentElement.dataset.componentType = item.type;
    componentElement.innerHTML = `
      <div class="component-toolbar">
        <button class="btn-icon" onclick="moveComponentUp(this)">
          <i class="fas fa-arrow-up"></i>
        </button>
        <button class="btn-icon" onclick="moveComponentDown(this)">
          <i class="fas fa-arrow-down"></i>
        </button>
        <button class="btn-icon" onclick="editComponent(this)">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-icon btn-danger" onclick="removeComponent(this)">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="component-content">
        ${item.html}
      </div>
    `;
    canvas.appendChild(componentElement);
  });
}

function selectPage() {
  // Get pages from localStorage
  const pagesData = localStorage.getItem('techksa_pages');
  const pages = pagesData ? JSON.parse(pagesData) : [];

  if (pages.length === 0) {
    pageBuilderManager.showNotification('لا توجد صفحات. أضف صفحة جديدة أولاً!', 'warning');
    return;
  }

  const pagesList = pages.map(page => `
    <div class="page-select-item" onclick="loadPageToBuilder('${page.id}')">
      <h4>${page.title}</h4>
      <p><code>/${page.slug}</code></p>
      <small style="color: #6b7280;">${page.layout?.length || 0} عناصر</small>
    </div>
  `).join('');

  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.style.zIndex = '999999';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3><i class="fas fa-file"></i> اختر صفحة للتحرير</h3>
        <button class="modal-close" onclick="this.closest('.modal').remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="pages-select-list">
          ${pagesList}
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">إلغاء</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function loadPageToBuilder(pageId) {
  // Get pages from localStorage
  const pagesData = localStorage.getItem('techksa_pages');
  const pages = pagesData ? JSON.parse(pagesData) : [];
  const page = pages.find(p => p.id === pageId);

  if (page) {
    pageBuilderManager.currentPage = page;
    const currentPageNameEl = document.getElementById('currentPageName');
    if (currentPageNameEl) {
      currentPageNameEl.textContent = page.title;
    }

    // Load layout
    if (page.layout && page.layout.length > 0) {
      pageBuilderManager.pageLayout = page.layout;
      renderExistingLayout();
    } else {
      // Clear canvas
      const canvas = document.getElementById('pageCanvas');
      if (canvas) {
        Array.from(canvas.children).forEach(child => {
          if (!child.classList.contains('canvas-empty')) {
            child.remove();
          }
        });
        const emptyState = canvas.querySelector('.canvas-empty');
        if (emptyState) emptyState.style.display = 'flex';
      }
      pageBuilderManager.pageLayout = [];
    }

    // Close modal
    document.querySelector('.modal')?.remove();
    pageBuilderManager.showNotification('تم تحميل الصفحة: ' + page.title, 'success');
  }
}

function addQuickElement(type) {
  const firstComponent = pageBuilderManager.componentsLibrary[type]?.[0];
  if (firstComponent) {
    pageBuilderManager.addComponentToCanvas(type, firstComponent.id);
  }
}

function moveComponentUp(btn) {
  const component = btn.closest('.canvas-component');
  const prev = component.previousElementSibling;

  if (prev && !prev.classList.contains('canvas-empty')) {
    component.parentNode.insertBefore(component, prev);
    updateLayoutOrder();
  }
}

function moveComponentDown(btn) {
  const component = btn.closest('.canvas-component');
  const next = component.nextElementSibling;

  if (next) {
    component.parentNode.insertBefore(next, component);
    updateLayoutOrder();
  }
}

function removeComponent(btn) {
  if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
    const component = btn.closest('.canvas-component');
    const componentId = component.dataset.componentId;

    // Remove from layout
    pageBuilderManager.pageLayout = pageBuilderManager.pageLayout.filter(
      item => item.id !== componentId
    );

    // Remove from canvas
    component.remove();

    // Check if canvas is empty
    const canvas = document.getElementById('pageCanvas');
    if (canvas.querySelectorAll('.canvas-component').length === 0) {
      const emptyState = canvas.querySelector('.canvas-empty');
      if (emptyState) emptyState.style.display = 'flex';
    }

    pageBuilderManager.showNotification('تم حذف العنصر', 'success');
  }
}

function editComponent(btn) {
  const component = btn.closest('.canvas-component');
  const content = component.querySelector('.component-content');

  const currentHTML = content.innerHTML;

  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
    <div class="modal-content" style="max-width: 1000px;">
      <div class="modal-header">
        <h3>تعديل العنصر</h3>
        <button class="modal-close" onclick="this.closest('.modal').remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>محتوى HTML</label>
          <textarea id="componentHTML" style="min-height: 400px; font-family: monospace;">${currentHTML}</textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">إلغاء</button>
        <button class="btn btn-primary" onclick="saveComponentEdit(this)">حفظ التعديلات</button>
      </div>
    </div>
  `;

  // Store reference to component
  modal.dataset.componentElement = component.dataset.componentId;

  document.body.appendChild(modal);
}

function saveComponentEdit(btn) {
  const modal = btn.closest('.modal');
  const componentId = modal.dataset.componentElement;
  const newHTML = document.getElementById('componentHTML').value;

  // Find component in canvas
  const component = document.querySelector(`[data-component-id="${componentId}"]`);
  if (component) {
    const content = component.querySelector('.component-content');
    content.innerHTML = newHTML;

    // Update in layout
    const layoutItem = pageBuilderManager.pageLayout.find(item => item.id === componentId);
    if (layoutItem) {
      layoutItem.html = newHTML;
    }

    pageBuilderManager.showNotification('تم حفظ التعديلات', 'success');
  }

  modal.remove();
}

function updateLayoutOrder() {
  const canvas = document.getElementById('pageCanvas');
  const components = canvas.querySelectorAll('.canvas-component');

  pageBuilderManager.pageLayout = [];
  components.forEach((comp, index) => {
    const id = comp.dataset.componentId;
    const type = comp.dataset.componentType;
    const html = comp.querySelector('.component-content').innerHTML;

    pageBuilderManager.pageLayout.push({
      id: id,
      type: type,
      html: html,
      order: index
    });
  });
}

function savePageLayout() {
  if (!pageBuilderManager.currentPage) {
    pageBuilderManager.showNotification('لم يتم اختيار صفحة', 'error');
    return;
  }

  updateLayoutOrder();

  // Save layout to page in localStorage
  const pagesData = localStorage.getItem('techksa_pages');
  const pages = pagesData ? JSON.parse(pagesData) : [];
  const pageIndex = pages.findIndex(p => p.id === pageBuilderManager.currentPage.id);

  if (pageIndex !== -1) {
    pages[pageIndex].layout = pageBuilderManager.pageLayout;
    pages[pageIndex].updatedAt = new Date().toISOString();

    localStorage.setItem('techksa_pages', JSON.stringify(pages));
    pageBuilderManager.showNotification('✓ تم حفظ التخطيط بنجاح', 'success');
  }
}

function previewPage() {
  if (!pageBuilderManager.currentPage) {
    pageBuilderManager.showNotification('لم يتم اختيار صفحة', 'error');
    return;
  }

  updateLayoutOrder();

  // Generate HTML preview
  const layoutHTML = pageBuilderManager.pageLayout
    .map(item => item.html)
    .join('\n\n');

  const previewWindow = window.open('', '_blank');
  previewWindow.document.write(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageBuilderManager.currentPage.title} - معاينة</title>
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cairo', sans-serif; margin: 0; padding: 0; }
    .preview-banner {
      background: #ff9800;
      color: white;
      padding: 1rem;
      text-align: center;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="preview-banner">
    <i class="fas fa-eye"></i> معاينة الصفحة - ${pageBuilderManager.currentPage.title}
  </div>
  <main>
    ${layoutHTML}
  </main>
</body>
</html>
  `);
  previewWindow.document.close();
}

function publishPage() {
  if (!pageBuilderManager.currentPage) {
    pageBuilderManager.showNotification('لم يتم اختيار صفحة', 'error');
    return;
  }

  // Save layout first
  savePageLayout();

  // Update page status in localStorage
  const pagesData = localStorage.getItem('techksa_pages');
  const pages = pagesData ? JSON.parse(pagesData) : [];
  const pageIndex = pages.findIndex(p => p.id === pageBuilderManager.currentPage.id);

  if (pageIndex !== -1) {
    pages[pageIndex].status = 'published';
    pages[pageIndex].publishedAt = new Date().toISOString();
    localStorage.setItem('techksa_pages', JSON.stringify(pages));

    // Show success message with link
    const pageSlug = pages[pageIndex].slug === 'index' ? '' : pages[pageIndex].slug;
    const pageUrl = `/${pageSlug}`;
    const message = `
      <div style="text-align: center;">
        <p style="font-size: 1.2rem; margin-bottom: 1rem;">✓ تم نشر الصفحة بنجاح!</p>
        <p style="font-weight: bold; margin-bottom: 1rem;">${pages[pageIndex].title}</p>
        <p style="margin-bottom: 1rem;">لمعاينة الصفحة المنشورة:</p>
        <a href="${pageUrl}" target="_blank" style="display: inline-flex; align-items: center; gap: 0.5rem; background: white; color: #0C4A2F; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600;">
          <i class="fas fa-external-link-alt"></i>
          افتح الصفحة
        </a>
        <div style="background: #fef3c7; border: 2px solid #fbbf24; border-radius: 8px; padding: 1rem; margin-top: 1.5rem;">
          <p style="color: #92400e; margin: 0; font-size: 0.95rem;">
            <i class="fas fa-exclamation-triangle"></i> <strong>مهم جداً:</strong>
          </p>
          <p style="color: #92400e; margin: 0.5rem 0 0 0; font-size: 0.9rem;">
            يجب تصدير البيانات وتشغيل أمر البناء لرؤية التغييرات على الموقع
          </p>
        </div>
      </div>
    `;

    showPublishSuccessModal(message, pageUrl);

    // Show export reminder
    setTimeout(() => {
      dataSyncManager.showExportReminder();
    }, 2000);
  }
}

function showPublishSuccessModal(message, url) {
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.style.zIndex = '999999';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
    <div class="modal-content">
      <div class="modal-header" style="background: #10B981; color: white;">
        <h3><i class="fas fa-check-circle"></i> تم النشر بنجاح</h3>
        <button class="modal-close" onclick="this.closest('.modal').remove()" style="color: white;">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body" style="padding: 2rem;">
        ${message}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">إغلاق</button>
        <a href="${url}" target="_blank" class="btn btn-primary">
          <i class="fas fa-eye"></i> معاينة الصفحة
        </a>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// ==========================================
// COMPONENTS LIBRARY FUNCTIONS
// ==========================================

function initComponentsLibrary() {
  // This will load the components library view
  console.log('Initializing components library...');
}

// ==========================================
// SETTINGS FUNCTIONS
// ==========================================

function loadSettings() {
  const data = blogCMS.loadData();
  const settings = data.headerFooterSettings || {};

  // Load Site Information
  const siteSettings = data.siteSettings || {};
  if (document.getElementById('siteName')) {
    document.getElementById('siteName').value = siteSettings.siteName || '';
  }
  if (document.getElementById('siteDescription')) {
    document.getElementById('siteDescription').value = siteSettings.siteDescription || '';
  }

  // Load Header Settings
  if (settings.header) {
    const headerTheme = document.getElementById('headerTheme');
    const headerPosition = document.getElementById('headerPosition');
    const headerColor = document.getElementById('headerColor');
    const headerCtaText = document.getElementById('headerCtaText');
    const headerCtaLink = document.getElementById('headerCtaLink');

    if (headerPosition) headerPosition.value = settings.header.sticky ? 'sticky' : 'static';
    if (headerColor) headerColor.value = settings.header.backgroundColor || '#ffffff';
    if (headerCtaText) headerCtaText.value = settings.header.ctaText || '';
    if (headerCtaLink) headerCtaLink.value = settings.header.ctaLink || '';
  }

  // Load Footer Settings
  if (settings.footer) {
    const footerColor = document.getElementById('footerColor');
    const footerCopyright = document.getElementById('footerCopyright');

    if (footerColor) footerColor.value = settings.footer.backgroundColor || '#1a1a1a';
    if (footerCopyright) footerCopyright.value = settings.footer.copyrightText || '';

    // Company Info
    if (settings.footer.company) {
      const companyAbout = document.getElementById('companyAbout');
      if (companyAbout) companyAbout.value = settings.footer.company.description || '';
    }
  }

  // Load Contact Information
  if (settings.footer && settings.footer.company) {
    const contactPhone = document.getElementById('contactPhone');
    const contactEmail = document.getElementById('contactEmail');
    const contactAddress = document.getElementById('contactAddress');

    if (contactPhone) contactPhone.value = settings.footer.company.phone || '';
    if (contactEmail) contactEmail.value = settings.footer.company.email || '';
    if (contactAddress) contactAddress.value = settings.footer.company.address || '';
  }

  // Load Social Media
  if (settings.footer && settings.footer.social) {
    const socialFacebook = document.getElementById('socialFacebook');
    const socialTwitter = document.getElementById('socialTwitter');
    const socialLinkedin = document.getElementById('socialLinkedin');
    const socialInstagram = document.getElementById('socialInstagram');
    const socialYoutube = document.getElementById('socialYoutube');

    if (socialFacebook) socialFacebook.value = settings.footer.social.facebook || '';
    if (socialTwitter) socialTwitter.value = settings.footer.social.twitter || '';
    if (socialLinkedin) socialLinkedin.value = settings.footer.social.linkedin || '';
    if (socialInstagram) socialInstagram.value = settings.footer.social.instagram || '';
    if (socialYoutube) socialYoutube.value = settings.footer.social.youtube || '';
  }

  // Load Logo Settings
  if (settings.logo) {
    const logoUrl = document.getElementById('logoUrl');
    if (logoUrl) logoUrl.value = settings.logo.imageUrl || '';
  }
}

function saveSettings() {
  const data = blogCMS.loadData();

  // Get all form values
  const siteName = document.getElementById('siteName')?.value || '';
  const siteDescription = document.getElementById('siteDescription')?.value || '';
  const headerPosition = document.getElementById('headerPosition')?.value || 'sticky';
  const headerColor = document.getElementById('headerColor')?.value || '#ffffff';
  const headerCtaText = document.getElementById('headerCtaText')?.value || '';
  const headerCtaLink = document.getElementById('headerCtaLink')?.value || '';
  const footerColor = document.getElementById('footerColor')?.value || '#1a1a1a';
  const footerCopyright = document.getElementById('footerCopyright')?.value || '';
  const companyAbout = document.getElementById('companyAbout')?.value || '';
  const contactPhone = document.getElementById('contactPhone')?.value || '';
  const contactEmail = document.getElementById('contactEmail')?.value || '';
  const contactAddress = document.getElementById('contactAddress')?.value || '';
  const socialFacebook = document.getElementById('socialFacebook')?.value || '';
  const socialTwitter = document.getElementById('socialTwitter')?.value || '';
  const socialLinkedin = document.getElementById('socialLinkedin')?.value || '';
  const socialInstagram = document.getElementById('socialInstagram')?.value || '';
  const socialYoutube = document.getElementById('socialYoutube')?.value || '';
  const logoUrl = document.getElementById('logoUrl')?.value || '';

  // Build settings object
  const settings = {
    header: {
      enabled: true,
      sticky: headerPosition === 'sticky' || headerPosition === 'fixed',
      backgroundColor: headerColor,
      textColor: '#333333',
      height: 80,
      showCTA: headerCtaText !== '',
      ctaText: headerCtaText,
      ctaLink: headerCtaLink,
      ctaStyle: 'primary'
    },
    footer: {
      enabled: true,
      backgroundColor: footerColor,
      textColor: '#ffffff',
      showSocial: true,
      copyrightText: footerCopyright || '© {year} Technology KSA. جميع الحقوق محفوظة.',
      company: {
        name: siteName || 'Technology KSA',
        description: companyAbout,
        email: contactEmail,
        phone: contactPhone,
        address: contactAddress
      },
      social: {
        facebook: socialFacebook,
        twitter: socialTwitter,
        linkedin: socialLinkedin,
        instagram: socialInstagram,
        youtube: socialYoutube
      }
    },
    logo: {
      type: logoUrl ? 'image' : 'text',
      text: siteName || 'Technology KSA',
      imageUrl: logoUrl,
      width: 150,
      height: 50
    }
  };

  // Update site settings
  data.siteSettings = {
    siteName: siteName,
    siteDescription: siteDescription,
    siteUrl: data.siteSettings?.siteUrl || 'https://technologyksa.com',
    language: 'ar',
    timezone: 'Asia/Riyadh'
  };

  data.headerFooterSettings = settings;
  blogCMS.saveData(data);

  if (pageBuilderManager) {
    pageBuilderManager.showNotification('تم حفظ الإعدادات بنجاح ✓', 'success');
  } else {
    alert('تم حفظ الإعدادات بنجاح ✓');
  }
}

function resetSettings() {
  if (confirm('هل أنت متأكد من استعادة الإعدادات الافتراضية؟')) {
    // This will reload settings from default
    loadSettings();
    alert('تم استعادة الإعدادات الافتراضية');
  }
}

// ==========================================
// PUBLISH & PREVIEW FUNCTIONS FOR POSTS, SERVICES, PROJECTS
// ==========================================

// Add View/Preview button to action buttons
function addPreviewButton(itemId, itemType, slug) {
  const actionButtons = document.querySelectorAll('.action-buttons');
  actionButtons.forEach(btnGroup => {
    const editBtn = btnGroup.querySelector(`[onclick*="${itemId}"]`);
    if (editBtn && !btnGroup.querySelector('.btn-preview')) {
      const previewBtn = document.createElement('button');
      previewBtn.className = 'btn-icon btn-preview';
      previewBtn.title = 'معاينة';
      previewBtn.onclick = function(e) {
        e.stopPropagation();
        previewItem(itemType, slug);
      };
      previewBtn.innerHTML = '<i class="fas fa-eye"></i>';
      btnGroup.insertBefore(previewBtn, editBtn);
    }
  });
}

function previewItem(type, slug) {
  let url = '';
  switch(type) {
    case 'post':
      url = `/blog/${slug}`;
      break;
    case 'service':
      url = `/services/${slug}`;
      break;
    case 'project':
      url = `/portfolio/${slug}`;
      break;
    case 'page':
      url = `/${slug}`;
      break;
  }

  if (url) {
    window.open(url, '_blank');
  }
}

// Enhanced save functions with publish notification
function enhancedSavePost(postData, status = 'draft') {
  // This will be called after saving
  if (status === 'published') {
    const slug = postData.slug;
    const url = `/blog/${slug}`;
    showPublishNotification('مقال', postData.title, url);
  }
}

function enhancedSaveService(serviceData, isNew = false) {
  const slug = serviceData.slug;
  const url = `/services/${slug}`;
  showPublishNotification('خدمة', serviceData.title || serviceData.name, url, isNew ? 'تم إضافة' : 'تم تحديث');
}

function enhancedSaveProject(projectData, isNew = false) {
  const slug = projectData.slug;
  const url = `/portfolio/${slug}`;
  showPublishNotification('مشروع', projectData.title, url, isNew ? 'تم إضافة' : 'تم تحديث');
}

function showPublishNotification(type, title, url, action = 'تم نشر') {
  const message = `
    <div style="text-align: center;">
      <p style="font-size: 1.2rem; margin-bottom: 1rem;">✓ ${action} ${type} بنجاح!</p>
      <p style="font-weight: bold; margin-bottom: 1rem;">${title}</p>
      <p style="margin-bottom: 1rem;">لمعاينة ${type}:</p>
      <a href="${url}" target="_blank" style="display: inline-flex; align-items: center; gap: 0.5rem; background: white; color: #0C4A2F; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600;">
        <i class="fas fa-external-link-alt"></i>
        افتح الرابط
      </a>
      <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.9;">
        <i class="fas fa-info-circle"></i>
        لرؤية التغييرات على الموقع، قم بتشغيل أمر البناء
      </p>
    </div>
  `;

  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.style.zIndex = '999999';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
    <div class="modal-content">
      <div class="modal-header" style="background: #10B981; color: white;">
        <h3><i class="fas fa-check-circle"></i> تم بنجاح</h3>
        <button class="modal-close" onclick="this.closest('.modal').remove()" style="color: white;">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body" style="padding: 2rem;">
        ${message}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">إغلاق</button>
        <a href="${url}" target="_blank" class="btn btn-primary">
          <i class="fas fa-eye"></i> معاينة
        </a>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// Override existing save functions to add notifications
if (typeof window !== 'undefined') {
  // Wait for page to load
  window.addEventListener('DOMContentLoaded', function() {
    // Intercept form submissions
    const postForm = document.getElementById('postForm');
    if (postForm) {
      postForm.addEventListener('submit', function(e) {
        setTimeout(function() {
          const status = document.getElementById('postStatus')?.value;
          if (status === 'published') {
            const title = document.getElementById('postTitle')?.value;
            const slug = document.getElementById('postSlug')?.value;
            if (title && slug) {
              showPublishNotification('مقال', title, `/blog/${slug}`, 'تم نشر');
            }
          }
        }, 500);
      });
    }
  });
}

// Add build notification button
function showBuildInstructions() {
  const message = `
    <div style="text-align: center;">
      <h3 style="margin-bottom: 1rem;"><i class="fas fa-hammer"></i> تعليمات بناء الموقع</h3>
      <p style="margin-bottom: 1rem;">لنشر التغييرات على الموقع، قم بتنفيذ الأمر التالي:</p>
      <div style="background: #f3f4f6; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; font-family: monospace;">
        node build-improved.js
      </div>
      <p style="font-size: 0.9rem; color: #6b7280;">
        هذا الأمر سيقوم بتوليد جميع الصفحات الثابتة من البيانات المخزنة
      </p>
    </div>
  `;

  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3><i class="fas fa-info-circle"></i> تعليمات البناء</h3>
        <button class="modal-close" onclick="this.closest('.modal').remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body" style="padding: 2rem;">
        ${message}
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="this.closest('.modal').remove()">فهمت</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// ==========================================
// ADD ANIMATIONS
// ==========================================

const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      transform: translate(-50%, -100%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translate(-50%, 0);
      opacity: 1;
    }
    to {
      transform: translate(-50%, -100%);
      opacity: 0;
    }
  }

  .page-canvas.drag-over {
    background-color: rgba(16, 185, 129, 0.1);
    border: 2px dashed #10B981;
  }

  .canvas-component {
    position: relative;
    margin-bottom: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    background: white;
  }

  .canvas-component:hover {
    border-color: #10B981;
  }

  .component-toolbar {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e5e7eb;
  }

  .component-content {
    min-height: 100px;
  }

  .page-select-item {
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: all 0.3s;
  }

  .page-select-item:hover {
    border-color: #10B981;
    background: rgba(16, 185, 129, 0.1);
  }

  .pages-select-list {
    max-height: 500px;
    overflow-y: auto;
  }

  .component-item {
    margin-bottom: 1rem;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    cursor: move;
    transition: all 0.3s;
  }

  .component-item:hover {
    border-color: #10B981;
    transform: translateX(-4px);
  }

  .component-preview {
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .component-name {
    font-weight: 600;
    font-size: 0.875rem;
  }

  .btn-preview {
    background-color: #0066FF !important;
  }

  .btn-preview:hover {
    background-color: #0052CC !important;
    color: white !important;
  }
`;
document.head.appendChild(style);

console.log('✓ CMS Extended Functions Loaded');
