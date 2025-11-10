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
