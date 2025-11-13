/**
 * Technology KSA - Enhanced Admin System
 * نظام إدارة محسّن يحل جميع المشاكل:
 * 1. استخدام IndexedDB للصور بدلاً من Data URLs
 * 2. إضافة تلقائية للصفحات في القوائم
 * 3. تحديث تلقائي للهيدر والفوتر
 * 4. عرض المقالات في صفحة المدونة
 */

// ==========================================
// ENHANCED PAGES MANAGER
// ==========================================

class EnhancedPagesManager extends PagesManager {
  constructor() {
    super();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for page created event
    if (window.eventBus) {
      eventBus.on('page:created', (data) => {
        this.onPageCreated(data.page);
      });

      eventBus.on('page:updated', (data) => {
        this.onPageUpdated(data.pageId, data.updates);
      });
    }
  }

  /**
   * Handle page creation - auto-add to menu
   */
  onPageCreated(page) {
    // Auto-add to main menu if published
    if (page.status === 'published') {
      this.autoAddToMenu(page);
    }

    // Trigger rebuild if needed
    this.triggerRebuild();
  }

  /**
   * Handle page update
   */
  onPageUpdated(pageId, updates) {
    // If status changed to published, add to menu
    if (updates.status === 'published') {
      const page = this.pages.find(p => p.id === pageId);
      if (page) {
        this.autoAddToMenu(page);
      }
    }

    // Trigger rebuild
    this.triggerRebuild();
  }

  /**
   * Auto-add page to main menu
   */
  autoAddToMenu(page) {
    if (!menusManager) return;

    const menus = menusManager.menus;
    const mainMenu = menus.find(m => m.location === 'header' || m.id === 'main-menu');

    if (mainMenu) {
      // Check if already exists
      const exists = mainMenu.items.some(item => item.pageId === page.id);

      if (!exists) {
        // Ask user if they want to add to menu
        if (confirm(`هل تريد إضافة الصفحة "${page.title}" إلى القائمة الرئيسية؟`)) {
          mainMenu.items.push({
            id: `item_${Date.now()}`,
            title: page.title,
            url: `/${page.slug}`,
            type: 'page',
            pageId: page.id
          });

          menusManager.saveMenus();
          showToast('تم إضافة الصفحة إلى القائمة الرئيسية', 'success');
        }
      }
    }
  }

  /**
   * Trigger rebuild notification
   */
  triggerRebuild() {
    showToast('تم حفظ التغييرات. قم بتشغيل build.js لتطبيق التحديثات على الموقع.', 'info');
  }

  /**
   * Override savePages to use new system
   */
  savePages() {
    if (window.contentManager) {
      contentManager.savePages(this.pages);
    } else {
      // Fallback to localStorage
      super.savePages();
    }
    this.renderPagesList();
  }

  /**
   * Override loadPages to use new system
   */
  loadPages() {
    if (window.contentManager) {
      this.pages = contentManager.getPages();
    } else {
      // Fallback to localStorage
      super.loadPages();
    }

    // Ensure default pages exist
    if (this.pages.length === 0) {
      this.pages = this.getDefaultPages();
      this.savePages();
    }
  }
}

// ==========================================
// ENHANCED BLOG CMS
// ==========================================

class EnhancedBlogCMS extends BlogCMS {
  constructor() {
    super();
    this.imageStorageManager = null;
    this.setupImageStorage();
    this.setupEventListeners();
  }

  /**
   * Setup Image Storage Manager
   */
  async setupImageStorage() {
    try {
      if (window.ImageStorageManager) {
        this.imageStorageManager = new ImageStorageManager();
        await this.imageStorageManager.init();
        console.log('✓ Image Storage Manager ready');

        // Check if migration needed
        await this.checkMigration();
      }
    } catch (error) {
      console.error('Error setting up image storage:', error);
    }
  }

  /**
   * Check if old Data URL images need migration
   */
  async checkMigration() {
    const oldMedia = this.media.filter(m => m.url && m.url.startsWith('data:image/'));

    if (oldMedia.length > 0) {
      const migrate = confirm(
        `تم العثور على ${oldMedia.length} صورة بنظام قديم (Data URLs).\n` +
        `هل تريد ترقيتها إلى النظام الجديد المحسّن؟\n\n` +
        `الفوائد:\n` +
        `- تقليل حجم التخزين بنسبة 70-90%\n` +
        `- أداء أفضل\n` +
        `- روابط قصيرة ومفهومة`
      );

      if (migrate) {
        await this.migrateImages(oldMedia);
      }
    }
  }

  /**
   * Migrate old Data URL images to IndexedDB
   */
  async migrateImages(oldMedia) {
    if (!this.imageStorageManager) {
      showToast('نظام تخزين الصور غير متاح', 'error');
      return;
    }

    showToast(`جاري ترقية ${oldMedia.length} صورة...`, 'info');

    const result = await this.imageStorageManager.migrateFromDataURLs(oldMedia);

    // Update media references
    result.migrated.forEach(migration => {
      const index = this.media.findIndex(m => m.id === migration.oldId);
      if (index >= 0) {
        this.media[index].id = migration.newId;
        this.media[index].url = migration.url;
      }
    });

    this.saveMedia();

    showToast(
      `تمت الترقية بنجاح!\n` +
      `تم ترقية: ${result.migrated.length} صورة\n` +
      `${result.failed.length > 0 ? `فشل: ${result.failed.length}` : ''}`,
      result.failed.length === 0 ? 'success' : 'warning'
    );

    // Show storage savings
    const info = await this.imageStorageManager.getStorageInfo();
    showToast(
      `تم توفير ${info.savedPercentage}% من المساحة!\n` +
      `الحجم الأصلي: ${this.imageStorageManager.formatBytes(info.totalOriginalSize)}\n` +
      `بعد الضغط: ${this.imageStorageManager.formatBytes(info.totalCompressedSize)}`,
      'success'
    );

    this.renderMediaGrid();
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    if (window.eventBus) {
      eventBus.on('posts:updated', () => {
        this.onPostsUpdated();
      });
    }
  }

  /**
   * Handle posts update
   */
  onPostsUpdated() {
    // Trigger rebuild for blog page
    this.triggerBlogRebuild();
  }

  /**
   * Trigger blog rebuild
   */
  triggerBlogRebuild() {
    showToast('تم حفظ المقال. قم بتشغيل build.js لنشر التحديثات.', 'info');
  }

  /**
   * Enhanced uploadImage using IndexedDB
   */
  async uploadImage(fileName, fileOrDataUrl) {
    if (!this.imageStorageManager) {
      // Fallback to old method
      super.uploadImage(fileName, fileOrDataUrl);
      return;
    }

    try {
      let file;

      // Check if it's a File object or Data URL
      if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:image/')) {
        // Convert Data URL to File
        const response = await fetch(fileOrDataUrl);
        const blob = await response.blob();
        file = new File([blob], fileName, { type: blob.type });
      } else if (fileOrDataUrl instanceof File) {
        file = fileOrDataUrl;
      } else {
        throw new Error('Invalid file format');
      }

      // Store in IndexedDB
      const stored = await this.imageStorageManager.storeImage(file, {
        alt: fileName.replace(/\.[^/.]+$/, '')
      });

      // Add to media list
      const mediaItem = {
        id: stored.id,
        name: stored.name,
        url: stored.url, // idb://... URL
        alt: stored.alt,
        width: stored.width,
        height: stored.height,
        compressedSize: stored.compressedSize,
        compressionRatio: stored.compressionRatio,
        uploadDate: stored.uploadDate
      };

      this.media.unshift(mediaItem);
      this.saveMedia();

      // Show success with compression info
      showToast(
        `تم رفع الصورة بنجاح!\n` +
        `تم ضغط الصورة بنسبة ${stored.compressionRatio}%`,
        'success'
      );

      return mediaItem;
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast(`فشل رفع الصورة: ${error.message}`, 'error');
      return null;
    }
  }

  /**
   * Enhanced deleteMedia
   */
  async deleteMedia(mediaId) {
    // Delete from IndexedDB if it's an idb:// URL
    const media = this.media.find(m => m.id === mediaId);

    if (media && media.url && media.url.startsWith('idb://')) {
      if (this.imageStorageManager) {
        const imageId = media.url.replace('idb://', '');
        try {
          await this.imageStorageManager.deleteImage(imageId);
        } catch (error) {
          console.error('Error deleting from IndexedDB:', error);
        }
      }
    }

    // Delete from media list
    this.media = this.media.filter(m => m.id !== mediaId);
    this.saveMedia();
    this.showToast('تم حذف الصورة بنجاح');
  }

  /**
   * Enhanced renderMediaGrid with better URL display
   */
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

    grid.innerHTML = this.media.map(image => {
      // Display URL nicely
      let displayUrl;
      if (image.url && image.url.startsWith('idb://')) {
        displayUrl = `<span class="badge badge-success">IndexedDB: ${image.name}</span>`;
      } else if (image.url && image.url.startsWith('data:image/')) {
        const size = Math.round(image.url.length / 1024);
        displayUrl = `<span class="badge badge-warning">Data URL (${size} KB)</span>`;
      } else {
        displayUrl = `<code>${image.url.substring(0, 50)}...</code>`;
      }

      // Get image URL for display
      const imgSrc = this.getImageDisplayUrl(image);

      return `
        <div class="media-item" data-id="${image.id}">
          <img src="${imgSrc}" alt="${image.alt}" loading="lazy">
          <div class="media-item-info">
            <small style="font-weight: 600; display: block; margin-bottom: 0.5rem;">رابط الصورة:</small>
            <small style="display: block; margin-bottom: 0.75rem; word-break: break-all;">${displayUrl}</small>

            ${image.compressionRatio ? `
              <small style="display: block; margin-bottom: 0.5rem; color: var(--success-color);">
                <i class="fas fa-compress"></i> تم ضغط الصورة بنسبة ${image.compressionRatio}%
              </small>
            ` : ''}

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
      `;
    }).join('');

    // Load images from IndexedDB
    this.loadIndexedDBImages();
  }

  /**
   * Get display URL for image
   */
  getImageDisplayUrl(image) {
    if (image.url && image.url.startsWith('idb://')) {
      return '/assets/images/placeholder.jpg'; // Will be replaced by loadIndexedDBImages
    }
    return image.url;
  }

  /**
   * Load images from IndexedDB for display
   */
  async loadIndexedDBImages() {
    if (!this.imageStorageManager) return;

    const idbImages = this.media.filter(m => m.url && m.url.startsWith('idb://'));

    for (const image of idbImages) {
      try {
        const imageId = image.url.replace('idb://', '');
        const blobUrl = await this.imageStorageManager.getImage(imageId, true); // true = thumbnail

        // Update image src
        const imgElement = document.querySelector(`[data-id="${image.id}"] img`);
        if (imgElement) {
          imgElement.src = blobUrl;
        }
      } catch (error) {
        console.error(`Error loading image ${image.id}:`, error);
      }
    }
  }

  /**
   * Override savePosts to use event system
   */
  savePosts() {
    if (window.contentManager) {
      contentManager.savePosts(this.posts);
    } else {
      // Fallback
      super.savePosts();
    }
    this.renderPostsList();
  }

  /**
   * Override createPost to trigger events
   */
  createPost(postData) {
    const result = super.createPost(postData);

    // Emit event
    if (window.eventBus && result) {
      eventBus.emit('post:created', { post: this.posts[0] });
    }

    return result;
  }
}

// ==========================================
// REPLACE OLD INSTANCES
// ==========================================

// Override old BlogCMS with enhanced version
if (typeof window !== 'undefined') {
  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnhancedSystem);
  } else {
    initEnhancedSystem();
  }
}

function initEnhancedSystem() {
  // Replace PagesManager
  if (typeof pagesManager !== 'undefined') {
    const oldPages = pagesManager.pages;
    pagesManager = new EnhancedPagesManager();
    pagesManager.pages = oldPages;
    pagesManager.renderPagesList();
  }

  // Replace BlogCMS
  if (typeof blogCMS !== 'undefined') {
    const oldPosts = blogCMS.posts;
    const oldMedia = blogCMS.media;
    const oldServices = blogCMS.services;
    const oldProjects = blogCMS.projects;

    blogCMS = new EnhancedBlogCMS();
    blogCMS.posts = oldPosts;
    blogCMS.media = oldMedia;
    blogCMS.services = oldServices;
    blogCMS.projects = oldProjects;

    blogCMS.renderPostsList();
    blogCMS.renderMediaGrid();
    blogCMS.renderServicesList();
    blogCMS.renderProjectsList();
  }

  console.log('✓ Enhanced Admin System initialized');
}

// Export
if (typeof window !== 'undefined') {
  window.EnhancedPagesManager = EnhancedPagesManager;
  window.EnhancedBlogCMS = EnhancedBlogCMS;
}
