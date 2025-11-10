/**
 * Technology KSA - Blog CMS System
 * نظام إدارة المدونة والخدمات الكامل
 */

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
    footerCopyright: `© ${new Date().getFullYear()} تكنولوجي السعودية. جميع الحقوق محفوظة.`
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
    footerCopyright: document.getElementById('footerCopyright').value
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
    stats: 'Statistics'
  };
  return names[type] || type;
}

function getComponentIcon(type) {
  const icons = {
    hero: 'image',
    cta: 'bullhorn',
    features: 'th',
    testimonials: 'comments',
    stats: 'chart-bar'
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

  // Save samples if nothing exists
  if (!localStorage.getItem('techksa_components_hero')) {
    localStorage.setItem('techksa_components_hero', JSON.stringify(sampleHero));
  }
  if (!localStorage.getItem('techksa_components_cta')) {
    localStorage.setItem('techksa_components_cta', JSON.stringify(sampleCTA));
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
  // TODO: Implement section editor modal
  showToast('سيتم إضافة محرر العناصر قريباً!', 'info');
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
