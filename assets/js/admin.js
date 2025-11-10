/**
 * Technology KSA - Blog CMS System
 * نظام إدارة المدونة والخدمات الكامل
 */

// ==========================================
// PAGES MANAGEMENT CLASS
// ==========================================

class PagesManager {
  constructor() {
    this.pages = [];
    this.currentPageId = null;
  }

  init() {
    this.loadPages();
    this.renderPagesList();
  }

  loadPages() {
    const storedPages = localStorage.getItem('techksa_pages');
    this.pages = storedPages ? JSON.parse(storedPages) : this.getDefaultPages();
  }

  getDefaultPages() {
    return [
      {
        id: 'home',
        title: 'الصفحة الرئيسية',
        slug: 'index',
        metaTitle: 'شركة تكنولوجيا السعودية - حلول تقنية متكاملة',
        metaDescription: 'نقدم حلول تقنية متكاملة للشركات في المملكة العربية السعودية',
        status: 'published',
        date: new Date().toISOString().split('T')[0],
        layout: []
      }
    ];
  }

  savePages() {
    localStorage.setItem('techksa_pages', JSON.stringify(this.pages));
    this.renderPagesList();
  }

  renderPagesList() {
    const tbody = document.getElementById('pagesTableBody');
    if (!tbody) return;

    if (this.pages.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">لا توجد صفحات. أضف صفحة جديدة!</td></tr>';
      return;
    }

    tbody.innerHTML = this.pages.map(page => `
      <tr>
        <td>${page.title}</td>
        <td><code>${page.slug}</code></td>
        <td>${page.layout?.length || 0} عناصر</td>
        <td>${page.date}</td>
        <td><span class="badge badge-${page.status === 'published' ? 'success' : 'warning'}">${page.status === 'published' ? 'منشورة' : 'مسودة'}</span></td>
        <td>
          <button class="btn-icon" onclick="pagesManager.editPage('${page.id}')" title="تعديل">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon" onclick="pagesManager.openPageBuilder('${page.id}')" title="Page Builder">
            <i class="fas fa-hammer"></i>
          </button>
          ${page.id !== 'home' ? `<button class="btn-icon" onclick="pagesManager.deletePage('${page.id}')" title="حذف">
            <i class="fas fa-trash"></i>
          </button>` : ''}
        </td>
      </tr>
    `).join('');
  }

  editPage(id) {
    const page = this.pages.find(p => p.id === id);
    if (!page) return;

    document.getElementById('pageId').value = page.id;
    document.getElementById('pageTitle').value = page.title;
    document.getElementById('pageSlug').value = page.slug;
    document.getElementById('pageMetaTitle').value = page.metaTitle;
    document.getElementById('pageMetaDescription').value = page.metaDescription;
    document.getElementById('pageStatus').value = page.status;

    document.getElementById('pageModalTitle').textContent = 'تعديل الصفحة';
    document.getElementById('pageModal').classList.add('active');
  }

  deletePage(id) {
    if (!confirm('هل أنت متأكد من حذف هذه الصفحة؟')) return;

    this.pages = this.pages.filter(p => p.id !== id);
    this.savePages();
    showToast('تم حذف الصفحة بنجاح!', 'success');
  }

  openPageBuilder(id) {
    this.currentPageId = id;
    const page = this.pages.find(p => p.id === id);

    if (page) {
      // Update page builder title
      document.getElementById('currentPageName').textContent = page.title;

      // Load page layout
      pageLayout = page.layout || [];
      renderPageCanvas();

      // Switch to page builder view
      document.querySelectorAll('.admin-nav li').forEach(li => li.classList.remove('active'));
      document.querySelector('[data-view="pagebuilder"]').parentElement.classList.add('active');

      document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
      document.getElementById('pagebuilderView').classList.add('active');

      document.getElementById('pageTitle').textContent = 'Page Builder';
      document.getElementById('btnNewPost').style.display = 'none';

      initPageBuilder();
    }
  }
}

// Global instance
let pagesManager;

class BlogCMS {
  constructor() {
    this.posts = [];
    this.services = [];
    this.projects = [];
    this.media = [];
  }

  init() {
    this.loadData();
    this.renderPostsList();
    this.renderServicesList();
    this.renderProjectsList();
    this.renderMediaGrid();
  }

  // ==========================================
  // DATA MANAGEMENT
  // ==========================================

  loadData() {
    // Load posts from localStorage
    const storedPosts = localStorage.getItem('techksa_blog_posts');
    this.posts = storedPosts ? JSON.parse(storedPosts) : this.getDefaultPosts();

    // Load services from localStorage
    const storedServices = localStorage.getItem('techksa_services');
    this.services = storedServices ? JSON.parse(storedServices) : [];

    // Load projects from localStorage
    const storedProjects = localStorage.getItem('techksa_projects');
    this.projects = storedProjects ? JSON.parse(storedProjects) : [];

    // Load media from localStorage
    const storedMedia = localStorage.getItem('techksa_blog_media');
    this.media = storedMedia ? JSON.parse(storedMedia) : [];
  }

  getDefaultPosts() {
    return [{
      id: 'digital-marketing-strategies-2025',
      title: 'استراتيجيات التسويق الرقمي 2025: دليل شامل للشركات السعودية',
      slug: 'digital-marketing-strategies-2025',
      category: 'تسويق رقمي',
      excerpt: 'اكتشف أحدث استراتيجيات التسويق الرقمي التي تساعد شركتك على التميز في السوق السعودي وتحقيق أهدافك التسويقية بفعالية في عام 2025.',
      content: 'محتوى المقال الكامل هنا...',
      featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      imageAlt: 'استراتيجيات التسويق الرقمي',
      metaTitle: 'استراتيجيات التسويق الرقمي 2025 للشركات السعودية',
      metaDescription: 'دليل شامل لأحدث استراتيجيات التسويق الرقمي في السعودية',
      author: 'فريق تكنولوجي السعودية',
      status: 'published',
      date: '2025-01-15',
      readTime: '8'
    }];
  }

  savePosts() {
    localStorage.setItem('techksa_blog_posts', JSON.stringify(this.posts));
    this.renderPostsList();
  }

  saveServices() {
    localStorage.setItem('techksa_services', JSON.stringify(this.services));
    this.renderServicesList();
  }

  saveProjects() {
    localStorage.setItem('techksa_projects', JSON.stringify(this.projects));
    this.renderProjectsList();
  }

  saveMedia() {
    localStorage.setItem('techksa_blog_media', JSON.stringify(this.media));
    this.renderMediaGrid();
  }

  // ==========================================
  // POST MANAGEMENT
  // ==========================================

  createPost(postData) {
    this.posts.unshift(postData);
    this.savePosts();
    this.showToast('تم إضافة المقال بنجاح');
  }

  updatePost(postData) {
    const index = this.posts.findIndex(p => p.id === postData.id);
    if (index !== -1) {
      this.posts[index] = postData;
      this.savePosts();
      this.showToast('تم تحديث المقال بنجاح');
    }
  }

  deletePost(postId) {
    this.posts = this.posts.filter(p => p.id !== postId);
    this.savePosts();
    this.showToast('تم حذف المقال بنجاح');
  }

  renderPostsList() {
    const tbody = document.getElementById('postsTableBody');
    if (!tbody) return;

    if (this.posts.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
            <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
            لا توجد مقالات حالياً. اضغط "إضافة مقال جديد" للبدء
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.posts.map(post => `
      <tr>
        <td>
          <strong>${post.title}</strong>
          ${post.excerpt ? `<br><small style="color: var(--text-secondary);">${post.excerpt.substring(0, 80)}...</small>` : ''}
        </td>
        <td>
          <span class="badge badge-${post.status === 'published' ? 'success' : 'warning'}">
            ${post.category}
          </span>
        </td>
        <td>${this.formatDate(post.date)}</td>
        <td>
          <span class="badge badge-${post.status === 'published' ? 'success' : 'warning'}">
            ${post.status === 'published' ? 'منشور' : 'مسودة'}
          </span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon" onclick="editPost('${post.id}')" title="تعديل">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon btn-danger" onclick="deletePost('${post.id}')" title="حذف">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // ==========================================
  // SERVICE MANAGEMENT
  // ==========================================

  createService(serviceData) {
    this.services.unshift(serviceData);
    this.saveServices();
    this.showToast('تم إضافة الخدمة بنجاح');
  }

  updateService(serviceData) {
    const index = this.services.findIndex(s => s.id === serviceData.id);
    if (index !== -1) {
      this.services[index] = serviceData;
      this.saveServices();
      this.showToast('تم تحديث الخدمة بنجاح');
    }
  }

  deleteService(serviceId) {
    this.services = this.services.filter(s => s.id !== serviceId);
    this.saveServices();
    this.showToast('تم حذف الخدمة بنجاح');
  }

  renderServicesList() {
    const tbody = document.getElementById('servicesTableBody');
    if (!tbody) return;

    if (this.services.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
            <i class="fas fa-briefcase" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
            لا توجد خدمات حالياً. اضغط "إضافة خدمة جديدة" للبدء
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.services.map(service => `
      <tr>
        <td>
          <strong>${service.name}</strong>
          ${service.description ? `<br><small style="color: var(--text-secondary);">${service.description.substring(0, 80)}...</small>` : ''}
        </td>
        <td><code>${service.slug}</code></td>
        <td>
          <span class="badge badge-success">نشط</span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon" onclick="editService('${service.id}')" title="تعديل">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon btn-danger" onclick="deleteService('${service.id}')" title="حذف">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // ==========================================
  // PROJECT MANAGEMENT
  // ==========================================

  createProject(projectData) {
    this.projects.unshift(projectData);
    this.saveProjects();
    this.showToast('تم إضافة المشروع بنجاح');
  }

  updateProject(projectData) {
    const index = this.projects.findIndex(p => p.id === projectData.id);
    if (index !== -1) {
      this.projects[index] = projectData;
      this.saveProjects();
      this.showToast('تم تحديث المشروع بنجاح');
    }
  }

  deleteProject(projectId) {
    this.projects = this.projects.filter(p => p.id !== projectId);
    this.saveProjects();
    this.showToast('تم حذف المشروع بنجاح');
  }

  renderProjectsList() {
    const tbody = document.getElementById('projectsTableBody');
    if (!tbody) return;

    if (this.projects.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
            <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
            لا توجد مشاريع حالياً. اضغط "إضافة مشروع جديد" للبدء
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.projects.map(project => `
      <tr>
        <td>
          <strong>${project.title}</strong>
          ${project.description ? `<br><small style="color: var(--text-secondary);">${project.description.substring(0, 80)}...</small>` : ''}
        </td>
        <td>
          <span class="badge badge-${project.category === 'مواقع' ? 'primary' : project.category === 'تطبيقات' ? 'info' : 'success'}">
            ${project.category}
          </span>
        </td>
        <td>${project.client || '-'}</td>
        <td>${this.formatDate(project.date)}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon" onclick="editProject('${project.id}')" title="تعديل">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon btn-danger" onclick="deleteProject('${project.id}')" title="حذف">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // ==========================================
  // MEDIA MANAGEMENT
  // ==========================================

  uploadImage(fileName, dataUrl) {
    const image = {
      id: Date.now().toString(),
      name: fileName,
      url: dataUrl,
      alt: fileName.replace(/\.[^/.]+$/, ''), // Remove extension
      uploadDate: new Date().toISOString()
    };

    this.media.unshift(image);
    this.saveMedia();
    this.showToast('تم رفع الصورة بنجاح');
  }

  deleteMedia(mediaId) {
    this.media = this.media.filter(m => m.id !== mediaId);
    this.saveMedia();
    this.showToast('تم حذف الصورة بنجاح');
  }

  updateImageAlt(imageId, alt) {
    const image = this.media.find(m => m.id === imageId);
    if (image) {
      image.alt = alt;
      this.saveMedia();
    }
  }

  renderMediaGrid() {
    const grid = document.getElementById('mediaGrid');
    if (!grid) return;

    if (this.media.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
          <i class="fas fa-images" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
          <p>لا توجد صور في المكتبة. ارفع صوراً للبدء</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.media.map(image => `
      <div class="media-item" data-id="${image.id}">
        <img src="${image.url}" alt="${image.alt}">
        <div class="media-item-info">
          <small style="font-weight: 600; display: block; margin-bottom: 0.5rem;">رابط الصورة:</small>
          <small style="display: block; margin-bottom: 0.75rem; word-break: break-all;">${image.url.substring(0, 50)}...</small>

          <label style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.25rem; display: block;">Alt Text:</label>
          <input
            type="text"
            value="${image.alt}"
            onchange="updateImageAlt('${image.id}', this.value)"
            placeholder="وصف الصورة"
          >

          <div class="media-actions">
            <button class="btn-delete" onclick="deleteMedia('${image.id}')">
              <i class="fas fa-trash"></i> حذف
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  generateSlug(text) {
    const arabicToEnglish = {
      'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'a',
      'ب': 'b', 'ت': 't', 'ث': 'th',
      'ج': 'j', 'ح': 'h', 'خ': 'kh',
      'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
      'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd',
      'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh',
      'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l',
      'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w',
      'ي': 'y', 'ى': 'a', 'ة': 'h', 'ئ': 'e',
      'ء': 'a', 'ؤ': 'o', 'ة': 't'
    };

    return text
      .toLowerCase()
      .trim()
      .split('')
      .map(char => arabicToEnglish[char] || char)
      .join('')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
                   'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toast.className = 'toast show';
    if (type === 'error') {
      toast.classList.add('error');
    }

    toastMessage.textContent = message;

    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.remove('error');
    }, 3000);
  }
}

// Make BlogCMS available globally
if (typeof window !== 'undefined') {
  window.BlogCMS = BlogCMS;
}

// ==========================================
// SETTINGS MANAGEMENT
// ==========================================

function loadSettings() {
  const settings = JSON.parse(localStorage.getItem('techksa_site_settings') || '{}');

  const defaults = {
    siteName: 'تكنولوجيا السعودية',
    siteNameEn: 'Technology KSA',
    siteDescription: 'شركة تكنولوجيا السعودية - وكالة رقمية رائدة متخصصة في تقديم حلول تقنية شاملة ومتكاملة',
    logo: 'assets/images/logo.png',
    favicon: 'assets/images/favicon.ico',
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
    companyYear: '2010',
    companyCountry: 'المملكة العربية السعودية',
    companyAbout: 'نحن شركة رائدة في تقديم الحلول التقنية المتكاملة في المملكة العربية السعودية، نساعد الشركات على التحول الرقمي وتحقيق أهدافها التجارية.',
    footerCopyright: `© ${new Date().getFullYear()} تكنولوجي السعودية. جميع الحقوق محفوظة.`,
    headerStyle: 'default',
    headerColor: '#0C4A2F',
    footerStyle: 'default',
    footerColor: '#0C4A2F',
    showBlogSidebar: 'yes',
    sidebarPosition: 'right'
  };

  // Merge defaults with existing settings
  const mergedSettings = { ...defaults, ...settings };
  if (settings.socialMedia) {
    mergedSettings.socialMedia = { ...defaults.socialMedia, ...settings.socialMedia };
  }

  // Populate form fields
  document.getElementById('siteName').value = mergedSettings.siteName;
  document.getElementById('siteNameEn').value = mergedSettings.siteNameEn;
  document.getElementById('siteDescription').value = mergedSettings.siteDescription;
  document.getElementById('logoUrl').value = mergedSettings.logo;
  document.getElementById('faviconUrl').value = mergedSettings.favicon;
  document.getElementById('contactPhone').value = mergedSettings.phone;
  document.getElementById('contactEmail').value = mergedSettings.email;
  document.getElementById('contactWhatsapp').value = mergedSettings.whatsapp;
  document.getElementById('contactAddress').value = mergedSettings.address;
  document.getElementById('socialFacebook').value = mergedSettings.socialMedia.facebook;
  document.getElementById('socialTwitter').value = mergedSettings.socialMedia.twitter;
  document.getElementById('socialLinkedin').value = mergedSettings.socialMedia.linkedin;
  document.getElementById('socialInstagram').value = mergedSettings.socialMedia.instagram;
  document.getElementById('socialYoutube').value = mergedSettings.socialMedia.youtube;
  document.getElementById('companyYear').value = mergedSettings.companyYear;
  document.getElementById('companyCountry').value = mergedSettings.companyCountry;
  document.getElementById('companyAbout').value = mergedSettings.companyAbout;
  document.getElementById('footerCopyright').value = mergedSettings.footerCopyright;

  // Layout Settings
  document.getElementById('headerStyle').value = mergedSettings.headerStyle;
  document.getElementById('headerColor').value = mergedSettings.headerColor;
  document.getElementById('footerStyle').value = mergedSettings.footerStyle;
  document.getElementById('footerColor').value = mergedSettings.footerColor;
  document.getElementById('showBlogSidebar').value = mergedSettings.showBlogSidebar;
  document.getElementById('sidebarPosition').value = mergedSettings.sidebarPosition;
}

function saveSettings() {
  const settings = {
    siteName: document.getElementById('siteName').value,
    siteNameEn: document.getElementById('siteNameEn').value,
    siteDescription: document.getElementById('siteDescription').value,
    logo: document.getElementById('logoUrl').value,
    favicon: document.getElementById('faviconUrl').value,
    phone: document.getElementById('contactPhone').value,
    email: document.getElementById('contactEmail').value,
    whatsapp: document.getElementById('contactWhatsapp').value,
    address: document.getElementById('contactAddress').value,
    socialMedia: {
      facebook: document.getElementById('socialFacebook').value,
      twitter: document.getElementById('socialTwitter').value,
      linkedin: document.getElementById('socialLinkedin').value,
      instagram: document.getElementById('socialInstagram').value,
      youtube: document.getElementById('socialYoutube').value
    },
    companyYear: document.getElementById('companyYear').value,
    companyCountry: document.getElementById('companyCountry').value,
    companyAbout: document.getElementById('companyAbout').value,
    footerCopyright: document.getElementById('footerCopyright').value,
    headerStyle: document.getElementById('headerStyle').value,
    headerColor: document.getElementById('headerColor').value,
    footerStyle: document.getElementById('footerStyle').value,
    footerColor: document.getElementById('footerColor').value,
    showBlogSidebar: document.getElementById('showBlogSidebar').value,
    sidebarPosition: document.getElementById('sidebarPosition').value
  };

  localStorage.setItem('techksa_site_settings', JSON.stringify(settings));

  // Show success message
  showToast('تم حفظ الإعدادات بنجاح! ستظهر التغييرات في الموقع عند إعادة تحميل الصفحات.', 'success');
}

function resetSettings() {
  if (confirm('هل أنت متأكد من استعادة الإعدادات الافتراضية؟ سيتم فقدان جميع التغييرات الحالية.')) {
    localStorage.removeItem('techksa_site_settings');
    loadSettings();
    showToast('تم استعادة الإعدادات الافتراضية بنجاح!', 'success');
  }
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#10B981' : '#ef4444'};
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-weight: 600;
    animation: slideUp 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==========================================
// COMPONENTS LIBRARY MANAGEMENT
// ==========================================

function initComponentsLibrary() {
  // Initialize component tabs
  const componentTabs = document.querySelectorAll('.component-tab');
  const componentTabContents = document.querySelectorAll('.component-tab-content');

  componentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;

      // Update active tab
      componentTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show corresponding content
      componentTabContents.forEach(content => {
        if (content.dataset.content === tabName) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });

      // Load components for this tab
      loadComponents(tabName);
    });
  });

  // Create sample components for demonstration
  createSampleComponents();

  // Load hero components by default
  loadComponents('hero');
}

function loadComponents(type) {
  const gridId = `${type}ComponentsGrid`;
  const grid = document.getElementById(gridId);

  if (!grid) return;

  // Load components from localStorage
  const components = JSON.parse(localStorage.getItem(`techksa_components_${type}`) || '[]');

  if (components.length === 0) {
    grid.innerHTML = `
      <div class="component-empty">
        <i class="fas fa-cube"></i>
        <h3>لا توجد عناصر حتى الآن</h3>
        <p>ابدأ بإضافة عنصر جديد باستخدام الزر أعلاه</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = components.map(component => `
    <div class="component-card">
      <div class="component-card-header">
        <div>
          <h3 class="component-card-title">${component.title}</h3>
          <span class="component-card-type">${getComponentTypeName(type)}</span>
        </div>
      </div>
      <div class="component-card-preview">
        ${component.preview ? `<img src="${component.preview}" alt="${component.title}">` : `<i class="fas fa-${getComponentIcon(type)}"></i>`}
      </div>
      <p class="component-card-description">${component.description || 'لا يوجد وصف'}</p>
      <div class="component-card-actions">
        <button class="btn btn-primary" onclick="editComponent('${type}', '${component.id}')">
          <i class="fas fa-edit"></i> تعديل
        </button>
        <button class="btn btn-danger" onclick="deleteComponent('${type}', '${component.id}')">
          <i class="fas fa-trash"></i> حذف
        </button>
      </div>
    </div>
  `).join('');
}

function getComponentTypeName(type) {
  const names = {
    hero: 'Hero Section',
    cta: 'Call to Action',
    features: 'Features Grid',
    testimonials: 'Testimonials',
    stats: 'Statistics',
    contact: 'Contact Form',
    team: 'Team Members',
    pricing: 'Pricing Table'
  };
  return names[type] || type;
}

function getComponentIcon(type) {
  const icons = {
    hero: 'image',
    cta: 'bullhorn',
    features: 'th',
    testimonials: 'comments',
    stats: 'chart-bar',
    contact: 'envelope',
    team: 'users',
    pricing: 'tags'
  };
  return icons[type] || 'cube';
}

function openComponentModal(type) {
  showToast('جاري تطوير محرر المكونات... ستكون متاحة قريباً!', 'success');
  // TODO: Implement component editor modal
}

function editComponent(type, id) {
  showToast('جاري تطوير محرر المكونات... ستكون متاحة قريباً!', 'success');
  // TODO: Implement component editor
}

function deleteComponent(type, id) {
  if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;

  const components = JSON.parse(localStorage.getItem(`techksa_components_${type}`) || '[]');
  const updated = components.filter(c => c.id !== id);

  localStorage.setItem(`techksa_components_${type}`, JSON.stringify(updated));
  loadComponents(type);
  showToast('تم حذف العنصر بنجاح!', 'success');
}

// Create sample components for demonstration
function createSampleComponents() {
  const sampleHero = [
    {
      id: 'hero-1',
      title: 'Hero Section - Modern',
      description: 'قسم بطل حديث مع خلفية متدرجة وعناصر تفاعلية',
      preview: null,
      content: {
        title: 'عنوان رئيسي جذاب',
        subtitle: 'نص فرعي يوضح الخدمة أو المنتج',
        buttonText: 'ابدأ الآن',
        buttonLink: '#',
        backgroundImage: '',
        backgroundColor: 'linear-gradient(135deg, #0C4A2F 0%, #10B981 100%)'
      }
    }
  ];

  const sampleCTA = [
    {
      id: 'cta-1',
      title: 'CTA - اتصل بنا الآن',
      description: 'قسم دعوة لاتخاذ إجراء مع زر بارز',
      preview: null,
      content: {
        title: 'هل لديك مشروع؟',
        description: 'تواصل معنا الآن واحصل على استشارة مجانية',
        buttonText: 'تواصل معنا',
        buttonLink: '#contact'
      }
    }
  ];

  const sampleContact = [
    {
      id: 'contact-1',
      title: 'Contact Form - Standard',
      description: 'نموذج تواصل قياسي مع الحقول الأساسية',
      preview: null,
      content: {
        title: 'تواصل معنا',
        subtitle: 'نسعد بالرد على استفساراتكم',
        fields: ['name', 'email', 'phone', 'message'],
        submitText: 'إرسال'
      }
    }
  ];

  const sampleTeam = [
    {
      id: 'team-1',
      title: 'Team Section - Grid',
      description: 'عرض أعضاء الفريق في شبكة منظمة',
      preview: null,
      content: {
        title: 'فريق العمل',
        subtitle: 'تعرف على خبرائنا',
        members: []
      }
    }
  ];

  const samplePricing = [
    {
      id: 'pricing-1',
      title: 'Pricing Table - 3 Columns',
      description: 'جدول أسعار بثلاثة خطط',
      preview: null,
      content: {
        title: 'خطط الأسعار',
        subtitle: 'اختر الباقة المناسبة لك',
        plans: []
      }
    }
  ];

  // Save samples if nothing exists
  if (!localStorage.getItem('techksa_components_hero')) {
    localStorage.setItem('techksa_components_hero', JSON.stringify(sampleHero));
  }
  if (!localStorage.getItem('techksa_components_cta')) {
    localStorage.setItem('techksa_components_cta', JSON.stringify(sampleCTA));
  }
  if (!localStorage.getItem('techksa_components_contact')) {
    localStorage.setItem('techksa_components_contact', JSON.stringify(sampleContact));
  }
  if (!localStorage.getItem('techksa_components_team')) {
    localStorage.setItem('techksa_components_team', JSON.stringify(sampleTeam));
  }
  if (!localStorage.getItem('techksa_components_pricing')) {
    localStorage.setItem('techksa_components_pricing', JSON.stringify(samplePricing));
  }
}

// ==========================================
// PAGE BUILDER FUNCTIONS
// ==========================================

let pageLayout = [];

function initPageBuilder() {
  // Load components from library into sidebar
  loadPageComponents('hero', 'heroComponents');
  loadPageComponents('cta', 'ctaComponents');
  loadPageComponents('features', 'featuresComponents');
  loadPageComponents('testimonials', 'testimonialsComponents');
  loadPageComponents('stats', 'statsComponents');
  loadPageComponents('contact', 'contactComponents');
  loadPageComponents('team', 'teamComponents');
  loadPageComponents('pricing', 'pricingComponents');

  // Load saved page layout
  loadPageLayout();

  // Setup drag and drop
  setupDragAndDrop();
}

function loadPageComponents(type, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const components = JSON.parse(localStorage.getItem(`techksa_components_${type}`) || '[]');

  if (components.length === 0) {
    container.innerHTML = '<p style="font-size: 0.8rem; color: var(--text-muted); padding: 0.5rem;">لا توجد عناصر</p>';
    return;
  }

  container.innerHTML = components.map(component => `
    <div class="draggable-component" draggable="true" data-component='${JSON.stringify(component)}' data-type="${type}">
      <h5>${component.title}</h5>
      <p>${component.description || ''}</p>
    </div>
  `).join('');
}

function loadPageLayout() {
  const saved = localStorage.getItem('techksa_page_layout');
  pageLayout = saved ? JSON.parse(saved) : [];
  renderPageCanvas();
}

function renderPageCanvas() {
  const canvas = document.getElementById('pageCanvas');
  if (!canvas) return;

  if (pageLayout.length === 0) {
    canvas.innerHTML = `
      <div class="canvas-empty">
        <i class="fas fa-plus-circle"></i>
        <h3>ابدأ بإضافة عناصر إلى الصفحة</h3>
        <p>اسحب العناصر من الشريط الجانبي وأفلتها هنا</p>
      </div>
    `;
    return;
  }

  canvas.innerHTML = pageLayout.map((section, index) => `
    <div class="page-section" draggable="true" data-index="${index}">
      <div class="section-header">
        <div class="section-info">
          <span class="drag-handle">
            <i class="fas fa-grip-vertical"></i>
          </span>
          <div class="section-icon">
            <i class="fas fa-${getComponentIcon(section.type)}"></i>
          </div>
          <div class="section-title-group">
            <h4>${section.title}</h4>
            <p>${getComponentTypeName(section.type)}</p>
          </div>
        </div>
        <div class="section-actions">
          <button class="btn btn-secondary" onclick="moveSection(${index}, 'up')" ${index === 0 ? 'disabled' : ''}>
            <i class="fas fa-arrow-up"></i>
          </button>
          <button class="btn btn-secondary" onclick="moveSection(${index}, 'down')" ${index === pageLayout.length - 1 ? 'disabled' : ''}>
            <i class="fas fa-arrow-down"></i>
          </button>
          <button class="btn btn-primary" onclick="editSection(${index})">
            <i class="fas fa-edit"></i> تعديل
          </button>
          <button class="btn btn-danger" onclick="deleteSection(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="section-content">
        <div class="section-content-preview">
          ${renderSectionPreview(section)}
        </div>
      </div>
    </div>
  `).join('');
}

function renderSectionPreview(section) {
  const content = section.content;
  let preview = '';

  switch(section.type) {
    case 'hero':
      preview = `
        <strong>العنوان:</strong> ${content.title || 'غير محدد'}<br>
        <strong>النص الفرعي:</strong> ${content.subtitle || 'غير محدد'}<br>
        <strong>زر الحث:</strong> ${content.buttonText || 'غير محدد'}
      `;
      break;
    case 'cta':
      preview = `
        <strong>العنوان:</strong> ${content.title || 'غير محدد'}<br>
        <strong>الوصف:</strong> ${content.description || 'غير محدد'}<br>
        <strong>زر الحث:</strong> ${content.buttonText || 'غير محدد'}
      `;
      break;
    case 'features':
      const featuresCount = content.items?.length || 0;
      preview = `
        <strong>عنوان القسم:</strong> ${content.title || 'غير محدد'}<br>
        <strong>عدد الميزات:</strong> ${featuresCount} ${featuresCount > 0 ? '✅' : '⚠️'}
      `;
      break;
    case 'testimonials':
      const testimonialsCount = content.items?.length || 0;
      preview = `
        <strong>عنوان القسم:</strong> ${content.title || 'غير محدد'}<br>
        <strong>عدد الشهادات:</strong> ${testimonialsCount} ${testimonialsCount > 0 ? '✅' : '⚠️'}
      `;
      break;
    case 'stats':
      const statsCount = content.items?.length || 0;
      preview = `
        <strong>عنوان القسم:</strong> ${content.title || 'غير محدد'}<br>
        <strong>عدد الإحصائيات:</strong> ${statsCount} ${statsCount > 0 ? '✅' : '⚠️'}
      `;
      break;
    default:
      preview = `<strong>محتوى العنصر</strong>`;
  }

  return preview;
}

function setupDragAndDrop() {
  const canvas = document.getElementById('pageCanvas');
  if (!canvas) return;

  // Allow drop on canvas
  canvas.addEventListener('dragover', function(e) {
    e.preventDefault();
    canvas.style.borderColor = 'var(--saudi-green)';
    canvas.style.backgroundColor = 'rgba(12, 74, 47, 0.05)';
  });

  canvas.addEventListener('dragleave', function(e) {
    if (e.target === canvas) {
      canvas.style.borderColor = '';
      canvas.style.backgroundColor = '';
    }
  });

  canvas.addEventListener('drop', function(e) {
    e.preventDefault();
    canvas.style.borderColor = '';
    canvas.style.backgroundColor = '';

    const componentData = e.dataTransfer.getData('component');
    if (componentData) {
      const component = JSON.parse(componentData);
      addSectionToPage(component);
    }
  });

  // Make components draggable
  document.addEventListener('dragstart', function(e) {
    if (e.target.classList.contains('draggable-component')) {
      const componentData = e.target.getAttribute('data-component');
      const type = e.target.getAttribute('data-type');
      e.dataTransfer.setData('component', componentData);
      e.dataTransfer.setData('type', type);
    }
  });
}

function addSectionToPage(component) {
  const newSection = {
    id: Date.now().toString(),
    type: component.type || 'hero',
    title: component.title,
    description: component.description,
    content: component.content || {}
  };

  pageLayout.push(newSection);
  renderPageCanvas();
  showToast('تم إضافة العنصر إلى الصفحة!', 'success');
}

function moveSection(index, direction) {
  if (direction === 'up' && index > 0) {
    [pageLayout[index], pageLayout[index - 1]] = [pageLayout[index - 1], pageLayout[index]];
  } else if (direction === 'down' && index < pageLayout.length - 1) {
    [pageLayout[index], pageLayout[index + 1]] = [pageLayout[index + 1], pageLayout[index]];
  }
  renderPageCanvas();
}

function editSection(index) {
  const section = pageLayout[index];
  if (!section) return;

  // Set current section index and type
  document.getElementById('sectionIndex').value = index;
  document.getElementById('sectionType').value = section.type;

  // Set basic info
  document.getElementById('sectionTitle').value = section.title;
  document.getElementById('sectionDescription').value = section.description || '';

  // Hide all field groups
  document.querySelectorAll('.section-fields').forEach(field => {
    field.style.display = 'none';
  });

  // Show and populate fields based on type
  const content = section.content || {};

  switch(section.type) {
    case 'hero':
      document.getElementById('heroFields').style.display = 'block';
      document.getElementById('heroTitle').value = content.title || '';
      document.getElementById('heroSubtitle').value = content.subtitle || '';
      document.getElementById('heroButtonText').value = content.buttonText || '';
      document.getElementById('heroButtonLink').value = content.buttonLink || '';
      document.getElementById('heroBackgroundImage').value = content.backgroundImage || '';
      document.getElementById('heroBackgroundColor').value = content.backgroundColor || '';
      break;

    case 'cta':
      document.getElementById('ctaFields').style.display = 'block';
      document.getElementById('ctaTitle').value = content.title || '';
      document.getElementById('ctaDescription').value = content.description || '';
      document.getElementById('ctaButtonText').value = content.buttonText || '';
      document.getElementById('ctaButtonLink').value = content.buttonLink || '';
      break;

    case 'features':
      document.getElementById('featuresFields').style.display = 'block';
      document.getElementById('featuresTitle').value = content.title || '';
      document.getElementById('featuresSubtitle').value = content.subtitle || '';
      currentFeatureItems = content.items || [];
      renderFeaturesList();
      break;

    case 'testimonials':
      document.getElementById('testimonialsFields').style.display = 'block';
      document.getElementById('testimonialsTitle').value = content.title || '';
      document.getElementById('testimonialsSubtitle').value = content.subtitle || '';
      currentTestimonialItems = content.items || [];
      renderTestimonialsList();
      break;

    case 'stats':
      document.getElementById('statsFields').style.display = 'block';
      document.getElementById('statsTitle').value = content.title || '';
      document.getElementById('statsSubtitle').value = content.subtitle || '';
      currentStatItems = content.items || [];
      renderStatsList();
      break;
  }

  // Update modal title
  document.getElementById('sectionModalTitle').textContent = `تحرير ${section.title}`;

  // Open modal
  document.getElementById('sectionEditorModal').classList.add('active');
}

function closeSectionEditor() {
  document.getElementById('sectionEditorModal').classList.remove('active');
  document.getElementById('sectionForm').reset();
}

function saveSectionEdit(event) {
  event.preventDefault();

  const index = parseInt(document.getElementById('sectionIndex').value);
  const type = document.getElementById('sectionType').value;

  // Update basic info
  pageLayout[index].title = document.getElementById('sectionTitle').value;
  pageLayout[index].description = document.getElementById('sectionDescription').value;

  // Update content based on type
  let content = {};

  switch(type) {
    case 'hero':
      content = {
        title: document.getElementById('heroTitle').value,
        subtitle: document.getElementById('heroSubtitle').value,
        buttonText: document.getElementById('heroButtonText').value,
        buttonLink: document.getElementById('heroButtonLink').value,
        backgroundImage: document.getElementById('heroBackgroundImage').value,
        backgroundColor: document.getElementById('heroBackgroundColor').value
      };
      break;

    case 'cta':
      content = {
        title: document.getElementById('ctaTitle').value,
        description: document.getElementById('ctaDescription').value,
        buttonText: document.getElementById('ctaButtonText').value,
        buttonLink: document.getElementById('ctaButtonLink').value
      };
      break;

    case 'features':
      content = {
        title: document.getElementById('featuresTitle').value,
        subtitle: document.getElementById('featuresSubtitle').value,
        items: collectFeatureItems()
      };
      break;

    case 'testimonials':
      content = {
        title: document.getElementById('testimonialsTitle').value,
        subtitle: document.getElementById('testimonialsSubtitle').value,
        items: collectTestimonialItems()
      };
      break;

    case 'stats':
      content = {
        title: document.getElementById('statsTitle').value,
        subtitle: document.getElementById('statsSubtitle').value,
        items: collectStatItems()
      };
      break;
  }

  pageLayout[index].content = content;

  // Re-render canvas
  renderPageCanvas();

  // Close modal
  closeSectionEditor();

  // Show success message
  showToast('تم تحديث العنصر بنجاح!', 'success');
}

function deleteSection(index) {
  if (!confirm('هل أنت متأكد من حذف هذا العنصر من الصفحة؟')) return;

  pageLayout.splice(index, 1);
  renderPageCanvas();
  showToast('تم حذف العنصر من الصفحة!', 'success');
}

function savePageLayout() {
  localStorage.setItem('techksa_page_layout', JSON.stringify(pageLayout));
  showToast('تم حفظ تخطيط الصفحة بنجاح!', 'success');
}

function previewPage() {
  if (pageLayout.length === 0) {
    showToast('لا توجد عناصر في الصفحة للمعاينة!', 'warning');
    return;
  }

  // Generate HTML preview
  let html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>معاينة الصفحة</title>
  <style>
    body { font-family: 'Tajawal', sans-serif; margin: 0; padding: 20px; }
    .section { margin-bottom: 40px; padding: 40px; background: #f5f5f5; border-radius: 8px; }
    .section h2 { color: #0C4A2F; margin-bottom: 16px; }
    .section p { color: #666; line-height: 1.6; }
    .btn { display: inline-block; padding: 12px 24px; background: #0C4A2F; color: white; text-decoration: none; border-radius: 4px; }
  </style>
</head>
<body>
`;

  pageLayout.forEach(section => {
    html += `
  <div class="section">
    <h2>${section.title}</h2>
    <p>${section.description || ''}</p>
    ${section.content.title ? `<h3>${section.content.title}</h3>` : ''}
    ${section.content.subtitle ? `<p>${section.content.subtitle}</p>` : ''}
    ${section.content.buttonText ? `<a href="${section.content.buttonLink || '#'}" class="btn">${section.content.buttonText}</a>` : ''}
  </div>
`;
  });

  html += `
</body>
</html>
`;

  // Open in new window
  const previewWindow = window.open('', 'preview', 'width=800,height=600');
  previewWindow.document.write(html);
  previewWindow.document.close();
}

function publishPage() {
  if (pageLayout.length === 0) {
    showToast('لا توجد عناصر في الصفحة للنشر!', 'warning');
    return;
  }

  // Save before publishing
  savePageLayout();

  showToast('تم نشر الصفحة! يمكن الآن عرضها على الموقع الرئيسي.', 'success');

  // TODO: Generate actual homepage HTML file or integrate with frontend
  console.log('Page published:', pageLayout);
}

// ==========================================
// FEATURES EDITOR FUNCTIONS
// ==========================================

let currentFeatureItems = [];

function addFeatureItem() {
  const item = {
    id: Date.now().toString(),
    icon: 'fa-star',
    title: '',
    description: ''
  };
  currentFeatureItems.push(item);
  renderFeaturesList();
}

function removeFeatureItem(id) {
  currentFeatureItems = currentFeatureItems.filter(item => item.id !== id);
  renderFeaturesList();
}

function renderFeaturesList() {
  const container = document.getElementById('featuresList');
  if (!container) return;

  if (currentFeatureItems.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1rem;">لا توجد ميزات. اضغط "إضافة ميزة" للبدء</p>';
    return;
  }

  container.innerHTML = currentFeatureItems.map((item, index) => `
    <div class="dynamic-item" data-id="${item.id}">
      <div class="dynamic-item-header">
        <h6><i class="fas fa-cube"></i> ميزة ${index + 1}</h6>
        <div class="dynamic-item-actions">
          <button type="button" class="btn btn-danger btn-sm" onclick="removeFeatureItem('${item.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="item-fields">
        <div class="form-group">
          <label>أيقونة FontAwesome</label>
          <input type="text" class="feature-icon" data-id="${item.id}" value="${item.icon}" placeholder="fa-star">
          <small>مثال: fa-star, fa-rocket, fa-check</small>
        </div>
        <div class="form-group">
          <label>عنوان الميزة</label>
          <input type="text" class="feature-title" data-id="${item.id}" value="${item.title}" placeholder="خدمة مميزة">
        </div>
        <div class="form-group">
          <label>وصف الميزة</label>
          <textarea class="feature-description" data-id="${item.id}" rows="2" placeholder="وصف مختصر للميزة">${item.description}</textarea>
        </div>
      </div>
    </div>
  `).join('');
}

function collectFeatureItems() {
  currentFeatureItems.forEach(item => {
    item.icon = document.querySelector(`.feature-icon[data-id="${item.id}"]`)?.value || '';
    item.title = document.querySelector(`.feature-title[data-id="${item.id}"]`)?.value || '';
    item.description = document.querySelector(`.feature-description[data-id="${item.id}"]`)?.value || '';
  });
  return currentFeatureItems;
}

// ==========================================
// TESTIMONIALS EDITOR FUNCTIONS
// ==========================================

let currentTestimonialItems = [];

function addTestimonialItem() {
  const item = {
    id: Date.now().toString(),
    name: '',
    position: '',
    company: '',
    image: '',
    rating: 5,
    text: ''
  };
  currentTestimonialItems.push(item);
  renderTestimonialsList();
}

function removeTestimonialItem(id) {
  currentTestimonialItems = currentTestimonialItems.filter(item => item.id !== id);
  renderTestimonialsList();
}

function renderTestimonialsList() {
  const container = document.getElementById('testimonialsList');
  if (!container) return;

  if (currentTestimonialItems.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1rem;">لا توجد شهادات. اضغط "إضافة شهادة" للبدء</p>';
    return;
  }

  container.innerHTML = currentTestimonialItems.map((item, index) => `
    <div class="dynamic-item" data-id="${item.id}">
      <div class="dynamic-item-header">
        <h6><i class="fas fa-quote-right"></i> شهادة ${index + 1}</h6>
        <div class="dynamic-item-actions">
          <button type="button" class="btn btn-danger btn-sm" onclick="removeTestimonialItem('${item.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="item-fields">
        <div class="form-group">
          <label>اسم العميل</label>
          <input type="text" class="testimonial-name" data-id="${item.id}" value="${item.name}" placeholder="محمد أحمد">
        </div>
        <div class="form-group">
          <label>المنصب</label>
          <input type="text" class="testimonial-position" data-id="${item.id}" value="${item.position}" placeholder="مدير تقني">
        </div>
        <div class="form-group">
          <label>الشركة</label>
          <input type="text" class="testimonial-company" data-id="${item.id}" value="${item.company}" placeholder="شركة ABC">
        </div>
        <div class="form-group">
          <label>رابط الصورة</label>
          <input type="text" class="testimonial-image" data-id="${item.id}" value="${item.image}" placeholder="https://...">
        </div>
        <div class="form-group">
          <label>التقييم (من 5)</label>
          <select class="testimonial-rating" data-id="${item.id}">
            <option value="5" ${item.rating === 5 ? 'selected' : ''}>⭐⭐⭐⭐⭐</option>
            <option value="4" ${item.rating === 4 ? 'selected' : ''}>⭐⭐⭐⭐</option>
            <option value="3" ${item.rating === 3 ? 'selected' : ''}>⭐⭐⭐</option>
            <option value="2" ${item.rating === 2 ? 'selected' : ''}>⭐⭐</option>
            <option value="1" ${item.rating === 1 ? 'selected' : ''}>⭐</option>
          </select>
        </div>
        <div class="form-group">
          <label>نص الشهادة</label>
          <textarea class="testimonial-text" data-id="${item.id}" rows="3" placeholder="رأي العميل عن الخدمة...">${item.text}</textarea>
        </div>
      </div>
    </div>
  `).join('');
}

function collectTestimonialItems() {
  currentTestimonialItems.forEach(item => {
    item.name = document.querySelector(`.testimonial-name[data-id="${item.id}"]`)?.value || '';
    item.position = document.querySelector(`.testimonial-position[data-id="${item.id}"]`)?.value || '';
    item.company = document.querySelector(`.testimonial-company[data-id="${item.id}"]`)?.value || '';
    item.image = document.querySelector(`.testimonial-image[data-id="${item.id}"]`)?.value || '';
    item.rating = parseInt(document.querySelector(`.testimonial-rating[data-id="${item.id}"]`)?.value) || 5;
    item.text = document.querySelector(`.testimonial-text[data-id="${item.id}"]`)?.value || '';
  });
  return currentTestimonialItems;
}

// ==========================================
// STATISTICS EDITOR FUNCTIONS
// ==========================================

let currentStatItems = [];

function addStatItem() {
  const item = {
    id: Date.now().toString(),
    icon: 'fa-users',
    number: '',
    suffix: '+',
    label: ''
  };
  currentStatItems.push(item);
  renderStatsList();
}

function removeStatItem(id) {
  currentStatItems = currentStatItems.filter(item => item.id !== id);
  renderStatsList();
}

function renderStatsList() {
  const container = document.getElementById('statsList');
  if (!container) return;

  if (currentStatItems.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1rem;">لا توجد إحصائيات. اضغط "إضافة إحصائية" للبدء</p>';
    return;
  }

  container.innerHTML = currentStatItems.map((item, index) => `
    <div class="dynamic-item" data-id="${item.id}">
      <div class="dynamic-item-header">
        <h6><i class="fas fa-chart-line"></i> إحصائية ${index + 1}</h6>
        <div class="dynamic-item-actions">
          <button type="button" class="btn btn-danger btn-sm" onclick="removeStatItem('${item.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="item-fields">
        <div class="form-group">
          <label>أيقونة FontAwesome</label>
          <input type="text" class="stat-icon" data-id="${item.id}" value="${item.icon}" placeholder="fa-users">
          <small>مثال: fa-users, fa-project-diagram, fa-trophy</small>
        </div>
        <div class="form-group">
          <label>الرقم</label>
          <input type="text" class="stat-number" data-id="${item.id}" value="${item.number}" placeholder="500">
        </div>
        <div class="form-group">
          <label>لاحقة الرقم</label>
          <input type="text" class="stat-suffix" data-id="${item.id}" value="${item.suffix}" placeholder="+">
          <small>مثال: +, %, K</small>
        </div>
        <div class="form-group">
          <label>التسمية</label>
          <input type="text" class="stat-label" data-id="${item.id}" value="${item.label}" placeholder="عميل سعيد">
        </div>
      </div>
    </div>
  `).join('');
}

function collectStatItems() {
  currentStatItems.forEach(item => {
    item.icon = document.querySelector(`.stat-icon[data-id="${item.id}"]`)?.value || '';
    item.number = document.querySelector(`.stat-number[data-id="${item.id}"]`)?.value || '';
    item.suffix = document.querySelector(`.stat-suffix[data-id="${item.id}"]`)?.value || '';
    item.label = document.querySelector(`.stat-label[data-id="${item.id}"]`)?.value || '';
  });
  return currentStatItems;
}

// ==========================================
// PAGE MANAGEMENT FUNCTIONS
// ==========================================

function openPageModal() {
  document.getElementById('pageId').value = '';
  document.getElementById('pageForm').reset();
  document.getElementById('pageModalTitle').textContent = 'إضافة صفحة جديدة';
  document.getElementById('pageModal').classList.add('active');
}

function closePageModal() {
  document.getElementById('pageModal').classList.remove('active');
  document.getElementById('pageForm').reset();
}

function savePage(event) {
  event.preventDefault();

  const pageId = document.getElementById('pageId').value;
  const pageData = {
    id: pageId || 'page-' + Date.now(),
    title: document.getElementById('pageTitle').value,
    slug: document.getElementById('pageSlug').value || generateSlug(document.getElementById('pageTitle').value),
    metaTitle: document.getElementById('pageMetaTitle').value,
    metaDescription: document.getElementById('pageMetaDescription').value,
    status: document.getElementById('pageStatus').value,
    date: new Date().toISOString().split('T')[0],
    layout: []
  };

  if (pageId) {
    // Update existing page
    const index = pagesManager.pages.findIndex(p => p.id === pageId);
    if (index !== -1) {
      pagesManager.pages[index] = { ...pagesManager.pages[index], ...pageData };
    }
  } else {
    // Add new page
    pagesManager.pages.push(pageData);
  }

  pagesManager.savePages();
  closePageModal();
  showToast('تم حفظ الصفحة بنجاح!', 'success');
}

function openPageBuilder() {
  const pageId = document.getElementById('pageId').value;
  if (pageId) {
    // Save first then open builder
    savePage(event);
    setTimeout(() => {
      pagesManager.openPageBuilder(pageId);
    }, 100);
  } else {
    showToast('يجب حفظ الصفحة أولاً!', 'warning');
  }
}

function selectPage() {
  if (!pagesManager || pagesManager.pages.length === 0) {
    showToast('لا توجد صفحات! أضف صفحة جديدة أولاً من قسم الصفحات.', 'warning');
    return;
  }

  const pages = pagesManager.pages;
  const options = pages.map((p, i) => `${i + 1}. ${p.title}`).join('\n');
  const selection = prompt(`اختر رقم الصفحة:\n\n${options}`);

  if (selection) {
    const index = parseInt(selection) - 1;
    if (index >= 0 && index < pages.length) {
      pagesManager.openPageBuilder(pages[index].id);
    }
  }
}

// Quick add element function
function addQuickElement(type) {
  if (!pagesManager || !pagesManager.currentPageId) {
    showToast('يجب اختيار صفحة أولاً!', 'warning');
    return;
  }

  const defaultElements = {
    hero: {
      id: Date.now().toString(),
      type: 'hero',
      title: 'Hero Section',
      description: 'قسم رئيسي في الصفحة',
      content: {
        title: 'عنوان رئيسي',
        subtitle: 'نص فرعي يوضح المحتوى',
        buttonText: 'ابدأ الآن',
        buttonLink: '#',
        backgroundImage: '',
        backgroundColor: 'linear-gradient(135deg, #0C4A2F 0%, #10B981 100%)'
      }
    },
    cta: {
      id: Date.now().toString(),
      type: 'cta',
      title: 'Call to Action',
      description: 'دعوة لاتخاذ إجراء',
      content: {
        title: 'هل لديك مشروع؟',
        description: 'تواصل معنا الآن',
        buttonText: 'اتصل بنا',
        buttonLink: '#contact'
      }
    },
    features: {
      id: Date.now().toString(),
      type: 'features',
      title: 'Features Grid',
      description: 'عرض الميزات',
      content: {
        title: 'خدماتنا',
        subtitle: 'نقدم خدمات متنوعة',
        items: []
      }
    },
    testimonials: {
      id: Date.now().toString(),
      type: 'testimonials',
      title: 'Testimonials',
      description: 'آراء العملاء',
      content: {
        title: 'آراء عملائنا',
        subtitle: 'ماذا يقول عملاؤنا',
        items: []
      }
    },
    stats: {
      id: Date.now().toString(),
      type: 'stats',
      title: 'Statistics',
      description: 'الإحصائيات',
      content: {
        title: 'إنجازاتنا',
        subtitle: 'بالأرقام',
        items: []
      }
    }
  };

  const element = defaultElements[type];
  if (element) {
    pageLayout.push(element);
    renderPageCanvas();
    showToast(`تم إضافة ${getComponentTypeName(type)} بنجاح!`, 'success');
  }
}

// Update savePageLayout to save to current page
function savePageLayout() {
  if (!pagesManager || !pagesManager.currentPageId) {
    showToast('يجب اختيار صفحة أولاً!', 'warning');
    return;
  }

  const pageIndex = pagesManager.pages.findIndex(p => p.id === pagesManager.currentPageId);
  if (pageIndex !== -1) {
    pagesManager.pages[pageIndex].layout = pageLayout;
    pagesManager.savePages();
    showToast('تم حفظ تخطيط الصفحة بنجاح!', 'success');
  }
}

// Auto-generate slug from Arabic text
function generateSlug(text) {
  // Simple transliteration map
  const arabicToEnglish = {
    'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th',
    'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'th', 'ر': 'r', 'ز': 'z',
    'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
    'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
    'ه': 'h', 'و': 'w', 'ي': 'y', 'ة': 'h', 'ى': 'a', 'ء': 'a'
  };

  let slug = text.toLowerCase();

  // Replace Arabic characters
  for (const [ar, en] of Object.entries(arabicToEnglish)) {
    slug = slug.replace(new RegExp(ar, 'g'), en);
  }

  // Clean up
  slug = slug.replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with dash
    .replace(/^-+|-+$/g, '')  // Remove leading/trailing dashes
    .replace(/-+/g, '-');  // Replace multiple dashes with single dash

  return slug || 'page';
}
