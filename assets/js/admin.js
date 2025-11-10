/**
 * Technology KSA - Admin Panel Complete CMS System
 * نظام إدارة المحتوى الكامل للمقالات
 */

(function() {
  'use strict';

  class BlogCMS {
    constructor() {
      this.posts = this.loadPosts();
      this.media = this.loadMedia();
      this.currentEditingPost = null;
      this.selectedImage = null;
      this.init();
    }

    init() {
      this.setupNavigation();
      this.setupPostManagement();
      this.setupMediaLibrary();
      this.renderDashboard();
      this.renderPostsList();
      this.renderMediaGrid();
    }

    // ============================================
    // DATA MANAGEMENT
    // ============================================

    loadPosts() {
      const stored = localStorage.getItem('technologyksa_posts');
      return stored ? JSON.parse(stored) : this.getDefaultPosts();
    }

    savePosts() {
      localStorage.setItem('technologyksa_posts', JSON.stringify(this.posts));
      this.updateStats();
    }

    loadMedia() {
      const stored = localStorage.getItem('technologyksa_media');
      return stored ? JSON.parse(stored) : [];
    }

    saveMedia() {
      localStorage.setItem('technologyksa_media', JSON.stringify(this.media));
      this.updateStats();
    }

    getDefaultPosts() {
      return [
        {
          id: 1,
          title: 'أفضل 10 استراتيجيات التسويق الرقمي في السعودية 2025',
          slug: 'digital-marketing-strategies-2025',
          category: 'digital-marketing',
          categoryName: 'التسويق الرقمي',
          excerpt: 'اكتشف أحدث استراتيجيات التسويق الرقمي التي ستساعدك على تحقيق النجاح في السوق السعودي لعام 2025',
          content: 'محتوى المقال الكامل هنا...',
          featuredImage: '',
          imageAlt: 'أفضل 10 استراتيجيات التسويق الرقمي في السعودية 2025',
          metaTitle: 'أفضل 10 استراتيجيات التسويق الرقمي في السعودية 2025 | Technology KSA',
          metaDescription: 'دليل شامل لأفضل استراتيجيات التسويق الرقمي في السعودية 2025، يشمل SEO، التسويق عبر وسائل التواصل، والمحتوى الرقمي لتحقيق النجاح.',
          author: 'محمد أحمد',
          authorBio: 'خبير تسويق رقمي بخبرة تزيد عن 10 سنوات',
          date: '2025-01-15',
          readTime: 8,
          status: 'published',
          views: 1250
        }
      ];
    }

    // ============================================
    // NAVIGATION
    // ============================================

    setupNavigation() {
      const navItems = document.querySelectorAll('.admin-nav li');
      const views = document.querySelectorAll('.admin-view');
      const pageTitle = document.getElementById('pageTitle');

      const titles = {
        dashboard: 'لوحة المعلومات',
        posts: 'إدارة المقالات',
        media: 'مكتبة الوسائط',
        settings: 'الإعدادات'
      };

      navItems.forEach(item => {
        item.addEventListener('click', () => {
          const viewName = item.getAttribute('data-view');

          navItems.forEach(i => i.classList.remove('active'));
          item.classList.add('active');

          views.forEach(v => v.classList.remove('active'));
          document.getElementById(viewName + 'View').classList.add('active');

          pageTitle.textContent = titles[viewName];

          if (viewName === 'posts') {
            this.renderPostsList();
          } else if (viewName === 'media') {
            this.renderMediaGrid();
          } else if (viewName === 'dashboard') {
            this.renderDashboard();
          }
        });
      });
    }

    // ============================================
    // POST MANAGEMENT
    // ============================================

    setupPostManagement() {
      // New Post Button
      document.getElementById('newPostBtn').addEventListener('click', () => {
        this.openPostEditor();
      });

      // Post Editor Form
      const form = document.getElementById('postEditorForm');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.savePost();
        });
      }

      // Auto-generate slug from title
      const titleInput = document.getElementById('postTitle');
      if (titleInput) {
        titleInput.addEventListener('input', (e) => {
          const slug = this.generateSlug(e.target.value);
          document.getElementById('postSlug').value = slug;

          // Also update meta title if empty
          const metaTitleInput = document.getElementById('postMetaTitle');
          if (!metaTitleInput.value) {
            metaTitleInput.value = e.target.value + ' | Technology KSA';
          }

          // Update image alt text
          document.getElementById('imageAlt').value = e.target.value;
        });
      }

      // Featured Image Selection
      document.getElementById('selectFeaturedImage').addEventListener('click', () => {
        this.openImageSelector();
      });

      // Remove Featured Image
      document.getElementById('removeFeaturedImage').addEventListener('click', () => {
        this.removeFeaturedImage();
      });

      // Close Modal Buttons
      document.querySelectorAll('.modal-close, #cancelPostBtn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.closeModals();
        });
      });
    }

    openPostEditor(postId = null) {
      const modal = document.getElementById('postEditorModal');
      const form = document.getElementById('postEditorForm');

      if (postId) {
        // Edit mode
        const post = this.posts.find(p => p.id === postId);
        document.getElementById('modalTitle').textContent = 'تعديل المقال';
        this.populatePostForm(post);
        this.currentEditingPost = postId;
      } else {
        // Create mode
        document.getElementById('modalTitle').textContent = 'مقال جديد';
        form.reset();
        this.currentEditingPost = null;
        this.removeFeaturedImage();
      }

      modal.classList.add('active');
    }

    populatePostForm(post) {
      document.getElementById('postId').value = post.id;
      document.getElementById('postTitle').value = post.title;
      document.getElementById('postSlug').value = post.slug;
      document.getElementById('postCategory').value = post.category;
      document.getElementById('postExcerpt').value = post.excerpt;
      document.getElementById('postContent').value = post.content;
      document.getElementById('postMetaTitle').value = post.metaTitle;
      document.getElementById('postMetaDescription').value = post.metaDescription;
      document.getElementById('postAuthor').value = post.author;
      document.getElementById('postStatus').value = post.status;

      if (post.featuredImage) {
        document.getElementById('featuredImageImg').src = post.featuredImage;
        document.getElementById('featuredImagePreview').classList.add('active');
        document.getElementById('imageUrl').textContent = post.featuredImage;
        document.getElementById('imageAlt').value = post.imageAlt || post.title;
      }
    }

    savePost() {
      const title = document.getElementById('postTitle').value.trim();
      const slug = document.getElementById('postSlug').value.trim();
      const category = document.getElementById('postCategory').value;
      const excerpt = document.getElementById('postExcerpt').value.trim();
      const content = document.getElementById('postContent').value.trim();
      const metaTitle = document.getElementById('postMetaTitle').value.trim();
      const metaDescription = document.getElementById('postMetaDescription').value.trim();
      const author = document.getElementById('postAuthor').value.trim();
      const status = document.getElementById('postStatus').value;
      const featuredImage = document.getElementById('featuredImageImg').src || '';
      const imageAlt = document.getElementById('imageAlt').value.trim() || title;

      // Validation
      if (!title || !slug || !category || !excerpt || !content) {
        this.showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
      }

      if (!featuredImage) {
        this.showToast('يرجى اختيار صورة للمقال', 'error');
        return;
      }

      const categoryNames = {
        'digital-marketing': 'التسويق الرقمي',
        'app-development': 'تطوير التطبيقات',
        'web-development': 'تطوير المواقع',
        'cybersecurity': 'الأمن السيبراني',
        'erp': 'أنظمة ERP',
        'seo': 'تحسين محركات البحث'
      };

      const postData = {
        id: this.currentEditingPost || Date.now(),
        title,
        slug,
        category,
        categoryName: categoryNames[category] || category,
        excerpt,
        content,
        featuredImage,
        imageAlt,
        metaTitle: metaTitle || title + ' | Technology KSA',
        metaDescription: metaDescription || excerpt,
        author,
        authorBio: 'خبير في مجال التقنية والتسويق الرقمي',
        date: new Date().toISOString().split('T')[0],
        readTime: this.calculateReadTime(content),
        status,
        views: 0
      };

      if (this.currentEditingPost) {
        // Update existing post
        const index = this.posts.findIndex(p => p.id === this.currentEditingPost);
        this.posts[index] = postData;
        this.showToast('تم تحديث المقال بنجاح', 'success');
      } else {
        // Add new post
        this.posts.unshift(postData);
        this.showToast('تم إضافة المقال بنجاح', 'success');
      }

      this.savePosts();
      this.generatePostHTML(postData);
      this.closeModals();
      this.renderPostsList();
      this.renderDashboard();
    }

    deletePost(postId) {
      if (confirm('هل أنت متأكد من حذف هذا المقال؟')) {
        this.posts = this.posts.filter(p => p.id !== postId);
        this.savePosts();
        this.renderPostsList();
        this.renderDashboard();
        this.showToast('تم حذف المقال بنجاح', 'success');
      }
    }

    generatePostHTML(post) {
      // Generate the complete HTML file for the post
      const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.metaTitle}</title>
  <meta name="description" content="${post.metaDescription}">
  <meta name="keywords" content="${post.category}, ${post.title}">
  <meta name="author" content="${post.author}">
  <link rel="canonical" href="https://www.technologyksa.com/ar/blog/posts/${post.slug}.html">

  <link rel="stylesheet" href="../../../assets/css/main.css">
  <link rel="stylesheet" href="../../../assets/css/rtl.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap" rel="stylesheet">
</head>
<body>
  <header class="header" id="header">
    <nav class="navbar container">
      <a href="../../../index.html" class="logo">
        <span class="logo-text">تكنولوجيا السعودية</span>
      </a>
      <ul class="nav-menu" id="navMenu">
        <li><a href="../../../index.html" class="nav-link">الرئيسية</a></li>
        <li><a href="../../about.html" class="nav-link">من نحن</a></li>
        <li><a href="../../services/index.html" class="nav-link">خدماتنا</a></li>
        <li><a href="../index.html" class="nav-link active">المدونة</a></li>
        <li><a href="../../contact.html" class="nav-link">اتصل بنا</a></li>
      </ul>
      <div class="nav-actions">
        <div class="language-switcher">
          <button class="lang-btn active" data-lang="ar">عربي</button>
          <button class="lang-btn" data-lang="en">EN</button>
        </div>
        <button class="theme-toggle" id="themeToggle">
          <i class="fas fa-sun sun-icon"></i>
          <i class="fas fa-moon moon-icon"></i>
        </button>
        <button class="mobile-menu-toggle" id="mobileMenuToggle">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  </header>

  <article class="blog-post-page section" style="padding-top: 120px;">
    <div class="container">
      <nav class="breadcrumbs" style="margin-bottom: 2rem;">
        <a href="../../../index.html">الرئيسية</a>
        <span> / </span>
        <a href="../index.html">المدونة</a>
        <span> / </span>
        <span>${post.title}</span>
      </nav>

      <div class="post-header" style="margin-bottom: 3rem;">
        <span class="blog-category" style="display: inline-block; margin-bottom: 1rem;">${post.categoryName}</span>
        <h1 style="font-size: 2.5rem; font-weight: 900; margin-bottom: 1.5rem; line-height: 1.2;">
          ${post.title}
        </h1>
        <div class="blog-meta" style="display: flex; gap: 1.5rem; color: #6B7280; margin-bottom: 2rem;">
          <span><i class="fas fa-calendar"></i> ${this.formatDate(post.date)}</span>
          <span><i class="fas fa-clock"></i> ${post.readTime} دقائق</span>
          <span><i class="fas fa-user"></i> ${post.author}</span>
        </div>
        ${post.featuredImage ? `<img src="${post.featuredImage}" alt="${post.imageAlt}" style="width: 100%; height: auto; border-radius: 1rem; margin-bottom: 2rem;">` : ''}
      </div>

      <div class="post-content" style="max-width: 800px; margin: 0 auto; font-size: 1.125rem; line-height: 1.8;">
        <div style="white-space: pre-wrap;">${post.content}</div>
      </div>
    </div>
  </article>

  <footer class="footer">
    <div class="footer-main">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-column">
            <a href="../../../index.html" class="footer-logo">
              <span>تكنولوجيا السعودية</span>
            </a>
            <p class="footer-description">
              وكالة رقمية سعودية رائدة متخصصة في تقديم حلول تقنية شاملة ومتكاملة منذ 2010
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <div class="footer-bottom-content">
          <p class="copyright">© 2025 شركة تكنولوجيا السعودية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </div>
  </footer>

  <script src="../../../assets/js/main.js"></script>
  <script src="../../../assets/js/language.js"></script>
  <script src="../../../assets/js/theme.js"></script>
</body>
</html>`;

      // Store HTML in localStorage for download
      localStorage.setItem(`post_html_${post.slug}`, html);

      console.log(`HTML generated for post: ${post.slug}`);
      console.log('To save: Copy from localStorage or use download feature');
    }

    // ============================================
    // MEDIA LIBRARY
    // ============================================

    setupMediaLibrary() {
      const uploadArea = document.getElementById('uploadArea');
      const imageUpload = document.getElementById('imageUpload');
      const selectFilesBtn = document.getElementById('selectFilesBtn');

      selectFilesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        imageUpload.click();
      });

      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
      });

      uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
      });

      uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        this.handleFiles(e.dataTransfer.files);
      });

      uploadArea.addEventListener('click', (e) => {
        if (e.target.id !== 'selectFilesBtn') {
          imageUpload.click();
        }
      });

      imageUpload.addEventListener('change', (e) => {
        this.handleFiles(e.target.files);
      });
    }

    handleFiles(files) {
      Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
          this.showToast('يرجى اختيار ملفات صور فقط', 'error');
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          this.showToast('حجم الصورة يجب أن يكون أقل من 5MB', 'error');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = {
            id: Date.now() + Math.random(),
            name: file.name,
            url: e.target.result,
            alt: file.name.replace(/\.[^/.]+$/, ""),
            size: file.size,
            date: new Date().toISOString()
          };

          this.media.unshift(imageData);
          this.saveMedia();
          this.renderMediaGrid();
          this.showToast('تم رفع الصورة بنجاح', 'success');
        };
        reader.readAsDataURL(file);
      });
    }

    deleteImage(imageId) {
      if (confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
        this.media = this.media.filter(img => img.id !== imageId);
        this.saveMedia();
        this.renderMediaGrid();
        this.showToast('تم حذف الصورة بنجاح', 'success');
      }
    }

    openImageSelector() {
      if (this.media.length === 0) {
        this.showToast('لا توجد صور في المكتبة. يرجى رفع صور أولاً', 'error');
        return;
      }

      const modal = document.getElementById('imageSelectionModal');
      const grid = document.getElementById('imageSelectionGrid');

      const html = this.media.map(image => `
        <div class="selectable-image" data-id="${image.id}" data-url="${image.url}" data-alt="${image.alt}">
          <img src="${image.url}" alt="${image.alt}">
          <div class="image-info">
            <p class="image-name">${image.name}</p>
          </div>
        </div>
      `).join('');

      grid.innerHTML = html;
      modal.classList.add('active');

      // Add click handlers
      document.querySelectorAll('.selectable-image').forEach(item => {
        item.addEventListener('click', () => {
          document.querySelectorAll('.selectable-image').forEach(i => i.classList.remove('selected'));
          item.classList.add('selected');
          this.selectedImage = {
            id: item.dataset.id,
            url: item.dataset.url,
            alt: item.dataset.alt
          };
          document.getElementById('confirmImageSelection').disabled = false;
        });
      });
    }

    confirmImageSelection() {
      if (this.selectedImage) {
        document.getElementById('featuredImageImg').src = this.selectedImage.url;
        document.getElementById('featuredImagePreview').classList.add('active');
        document.getElementById('imageUrl').textContent = this.selectedImage.url;

        const altInput = document.getElementById('imageAlt');
        if (!altInput.value) {
          altInput.value = this.selectedImage.alt;
        }

        this.closeModals();
        this.showToast('تم اختيار الصورة بنجاح', 'success');
      }
    }

    removeFeaturedImage() {
      document.getElementById('featuredImageImg').src = '';
      document.getElementById('featuredImagePreview').classList.remove('active');
      document.getElementById('imageUrl').textContent = '';
      this.selectedImage = null;
    }

    // ============================================
    // RENDERING
    // ============================================

    renderDashboard() {
      const totalPosts = this.posts.length;
      const publishedPosts = this.posts.filter(p => p.status === 'published').length;
      const draftPosts = this.posts.filter(p => p.status === 'draft').length;
      const totalImages = this.media.length;

      document.getElementById('totalPosts').textContent = totalPosts;
      document.getElementById('publishedPosts').textContent = publishedPosts;
      document.getElementById('draftPosts').textContent = draftPosts;
      document.getElementById('totalImages').textContent = totalImages;

      // Render recent posts in dashboard
      const recentPosts = this.posts.slice(0, 5);
      const tbody = document.querySelector('#dashboardView .posts-table tbody');

      if (tbody) {
        tbody.innerHTML = recentPosts.map(post => `
          <tr>
            <td>${post.title}</td>
            <td>${post.categoryName}</td>
            <td>${this.formatDate(post.date)}</td>
            <td>
              <span class="badge ${post.status === 'published' ? 'badge-success' : 'badge-warning'}">
                ${post.status === 'published' ? 'منشور' : 'مسودة'}
              </span>
            </td>
          </tr>
        `).join('');
      }
    }

    renderPostsList() {
      const tbody = document.getElementById('postsTableBody');
      if (!tbody) return;

      if (this.posts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">لا توجد مقالات</td></tr>';
        return;
      }

      tbody.innerHTML = this.posts.map(post => `
        <tr>
          <td>
            <div class="post-title-cell">
              <strong>${post.title}</strong>
              <small style="color: var(--text-secondary);">${post.slug}</small>
            </div>
          </td>
          <td>${post.categoryName}</td>
          <td>${this.formatDate(post.date)}</td>
          <td>
            <span class="badge ${post.status === 'published' ? 'badge-success' : 'badge-warning'}">
              ${post.status === 'published' ? 'منشور' : 'مسودة'}
            </span>
          </td>
          <td>
            <div class="action-buttons">
              <button class="btn-icon" onclick="blogCMS.openPostEditor(${post.id})" title="تعديل">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn-icon" onclick="blogCMS.downloadPostHTML(${post.id})" title="تحميل HTML">
                <i class="fas fa-download"></i>
              </button>
              <button class="btn-icon btn-danger" onclick="blogCMS.deletePost(${post.id})" title="حذف">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    renderMediaGrid() {
      const grid = document.getElementById('mediaGrid');
      if (!grid) return;

      if (this.media.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem; grid-column: 1/-1;">لا توجد صور في المكتبة حالياً</p>';
        return;
      }

      grid.innerHTML = this.media.map(image => `
        <div class="media-item" data-id="${image.id}">
          <img src="${image.url}" alt="${image.alt}">
          <div class="media-overlay">
            <button class="btn-icon btn-danger" onclick="blogCMS.deleteImage(${image.id})" title="حذف">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <div class="media-info">
            <p style="font-size: 0.75rem; padding: 0.5rem; background: rgba(0,0,0,0.7); color: white; margin: 0;">
              ${image.name}
            </p>
          </div>
        </div>
      `).join('');
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    generateSlug(text) {
      // Arabic to English transliteration mapping
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
        'ء': 'a', 'ؤ': 'o'
      };

      return text
        .toLowerCase()
        .split('')
        .map(char => arabicToEnglish[char] || char)
        .join('')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    calculateReadTime(content) {
      const wordsPerMinute = 200;
      const words = content.trim().split(/\s+/).length;
      return Math.max(1, Math.ceil(words / wordsPerMinute));
    }

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    updateStats() {
      this.renderDashboard();
    }

    downloadPostHTML(postId) {
      const post = this.posts.find(p => p.id === postId);
      if (!post) return;

      this.generatePostHTML(post);
      const html = localStorage.getItem(`post_html_${post.slug}`);

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${post.slug}.html`;
      a.click();
      URL.revokeObjectURL(url);

      this.showToast('تم تحميل ملف HTML بنجاح', 'success');
    }

    closeModals() {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
      });
      this.selectedImage = null;
    }

    showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      `;

      const container = document.getElementById('toastContainer');
      container.appendChild(toast);

      setTimeout(() => toast.classList.add('show'), 100);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  }

  // Initialize CMS when DOM is ready
  let blogCMS;
  document.addEventListener('DOMContentLoaded', function() {
    blogCMS = new BlogCMS();
    window.blogCMS = blogCMS; // Make it globally accessible

    // Setup image selection confirmation
    const confirmBtn = document.getElementById('confirmImageSelection');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        blogCMS.confirmImageSelection();
      });
    }

    // Setup cancel button
    const cancelBtn = document.getElementById('cancelImageSelection');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        blogCMS.closeModals();
      });
    }

    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', () => {
        blogCMS.closeModals();
      });
    });

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', () => {
      if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        window.location.href = '../index.html';
      }
    });

    // Settings form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        blogCMS.showToast('تم حفظ الإعدادات بنجاح', 'success');
      });
    }
  });

})();
