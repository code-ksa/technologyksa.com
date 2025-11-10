/**
 * Technology KSA - Blog CMS System
 * نظام إدارة المدونة والخدمات الكامل
 */

class BlogCMS {
  constructor() {
    this.posts = [];
    this.services = [];
    this.media = [];
  }

  init() {
    this.loadData();
    this.renderPostsList();
    this.renderServicesList();
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
