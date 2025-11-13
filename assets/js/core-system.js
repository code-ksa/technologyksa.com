/**
 * Technology KSA - Core System
 * النظام الأساسي المحسّن مع Event System
 * حل احترافي لجميع مشاكل التزامن والتحديث
 */

// ==========================================
// EVENT SYSTEM - للتواصل بين المكونات
// ==========================================

class EventBus {
  constructor() {
    this.events = {};
  }

  /**
   * Subscribe to an event
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  }

  /**
   * Emit an event
   */
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Subscribe to event once
   */
  once(event, callback) {
    const unsubscribe = this.on(event, (data) => {
      callback(data);
      unsubscribe();
    });
    return unsubscribe;
  }
}

// Create global event bus
const eventBus = new EventBus();

// ==========================================
// STORAGE MANAGER - إدارة localStorage بشكل محسّن
// ==========================================

class StorageManager {
  constructor() {
    this.prefix = 'techksa_';
  }

  /**
   * Get item from storage
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from storage (${key}):`, error);
      return defaultValue;
    }
  }

  /**
   * Set item in storage
   */
  set(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      // Emit storage changed event
      eventBus.emit('storage:changed', { key, value });
      return true;
    } catch (error) {
      console.error(`Error writing to storage (${key}):`, error);
      // Check if it's a quota exceeded error
      if (error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded!');
        this.showStorageWarning();
      }
      return false;
    }
  }

  /**
   * Remove item from storage
   */
  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      eventBus.emit('storage:removed', { key });
      return true;
    } catch (error) {
      console.error(`Error removing from storage (${key}):`, error);
      return false;
    }
  }

  /**
   * Clear all items with prefix
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      eventBus.emit('storage:cleared');
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  /**
   * Get storage size
   */
  getSize() {
    let total = 0;
    for (let key in localStorage) {
      if (key.startsWith(this.prefix)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  /**
   * Format size to human readable
   */
  formatSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Show storage warning
   */
  showStorageWarning() {
    if (typeof showToast === 'function') {
      showToast('تحذير: مساحة التخزين ممتلئة! يرجى حذف بعض الصور أو البيانات.', 'error');
    } else {
      alert('تحذير: مساحة التخزين ممتلئة! يرجى حذف بعض الصور أو البيانات.');
    }
  }

  /**
   * Get storage info
   */
  getInfo() {
    const size = this.getSize();
    const limit = 5 * 1024 * 1024; // ~5MB typical limit
    const percentage = (size / limit * 100).toFixed(1);

    return {
      used: this.formatSize(size),
      usedBytes: size,
      limit: this.formatSize(limit),
      limitBytes: limit,
      percentage: percentage,
      available: this.formatSize(limit - size)
    };
  }
}

// Create global storage manager
const storage = new StorageManager();

// ==========================================
// CONTENT MANAGER - إدارة المحتوى المركزية
// ==========================================

class ContentManager {
  constructor() {
    this.imageManager = null;
    this.initialized = false;
  }

  /**
   * Initialize content manager
   */
  async init() {
    if (this.initialized) return;

    try {
      // Initialize Image Storage Manager if available
      if (typeof ImageStorageManager !== 'undefined') {
        this.imageManager = new ImageStorageManager();
        await this.imageManager.init();
        console.log('✓ Image Storage Manager initialized');
      }

      this.initialized = true;
      eventBus.emit('content:initialized');
    } catch (error) {
      console.error('Error initializing content manager:', error);
    }
  }

  /**
   * Get all pages
   */
  getPages() {
    return storage.get('pages', []);
  }

  /**
   * Save pages
   */
  savePages(pages) {
    const success = storage.set('pages', pages);
    if (success) {
      eventBus.emit('pages:updated', { pages });
    }
    return success;
  }

  /**
   * Get single page
   */
  getPage(pageId) {
    const pages = this.getPages();
    return pages.find(p => p.id === pageId);
  }

  /**
   * Update single page
   */
  updatePage(pageId, updates) {
    const pages = this.getPages();
    const index = pages.findIndex(p => p.id === pageId);

    if (index >= 0) {
      pages[index] = { ...pages[index], ...updates, updatedAt: new Date().toISOString() };
      const success = this.savePages(pages);

      if (success) {
        eventBus.emit('page:updated', { pageId, updates });
      }

      return success;
    }

    return false;
  }

  /**
   * Create new page
   */
  createPage(pageData) {
    const pages = this.getPages();

    const newPage = {
      id: `page_${Date.now()}`,
      title: pageData.title,
      slug: pageData.slug,
      metaTitle: pageData.metaTitle || pageData.title,
      metaDescription: pageData.metaDescription || '',
      status: pageData.status || 'draft',
      layout: pageData.layout || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...pageData
    };

    pages.push(newPage);

    const success = this.savePages(pages);

    if (success) {
      eventBus.emit('page:created', { page: newPage });
    }

    return success ? newPage : null;
  }

  /**
   * Delete page
   */
  deletePage(pageId) {
    const pages = this.getPages();
    const filtered = pages.filter(p => p.id !== pageId);

    if (filtered.length < pages.length) {
      const success = this.savePages(filtered);

      if (success) {
        eventBus.emit('page:deleted', { pageId });
      }

      return success;
    }

    return false;
  }

  /**
   * Get all posts
   */
  getPosts() {
    return storage.get('blog_posts', []);
  }

  /**
   * Save posts
   */
  savePosts(posts) {
    const success = storage.set('blog_posts', posts);
    if (success) {
      eventBus.emit('posts:updated', { posts });
    }
    return success;
  }

  /**
   * Get published posts
   */
  getPublishedPosts() {
    return this.getPosts().filter(p => p.status === 'published');
  }

  /**
   * Get all menus
   */
  getMenus() {
    return storage.get('menus', []);
  }

  /**
   * Save menus
   */
  saveMenus(menus) {
    const success = storage.set('menus', menus);
    if (success) {
      eventBus.emit('menus:updated', { menus });
    }
    return success;
  }

  /**
   * Get menu by location
   */
  getMenuByLocation(location) {
    const menus = this.getMenus();
    return menus.find(m => m.location === location);
  }

  /**
   * Update menu
   */
  updateMenu(menuId, updates) {
    const menus = this.getMenus();
    const index = menus.findIndex(m => m.id === menuId);

    if (index >= 0) {
      menus[index] = { ...menus[index], ...updates };
      const success = this.saveMenus(menus);

      if (success) {
        eventBus.emit('menu:updated', { menuId, updates });
      }

      return success;
    }

    return false;
  }

  /**
   * Auto-add page to main menu
   */
  autoAddPageToMenu(page) {
    const menus = this.getMenus();
    const mainMenu = menus.find(m => m.location === 'header' || m.id === 'main-menu');

    if (mainMenu) {
      // Check if page already in menu
      const exists = mainMenu.items.some(item => item.pageId === page.id);

      if (!exists) {
        mainMenu.items.push({
          id: `item_${Date.now()}`,
          title: page.title,
          url: `/${page.slug}`,
          type: 'page',
          pageId: page.id
        });

        return this.saveMenus(menus);
      }
    }

    return false;
  }

  /**
   * Get site settings
   */
  getSettings() {
    return storage.get('site_settings', {});
  }

  /**
   * Save site settings
   */
  saveSettings(settings) {
    const success = storage.set('site_settings', settings);
    if (success) {
      eventBus.emit('settings:updated', { settings });
    }
    return success;
  }
}

// Create global content manager
const contentManager = new ContentManager();

// ==========================================
// AUTO-INITIALIZATION
// ==========================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    contentManager.init();
  });
} else {
  contentManager.init();
}

// ==========================================
// GLOBAL EXPORTS
// ==========================================

if (typeof window !== 'undefined') {
  window.eventBus = eventBus;
  window.storage = storage;
  window.contentManager = contentManager;

  // Backward compatibility
  window.EventBus = EventBus;
  window.StorageManager = StorageManager;
  window.ContentManager = ContentManager;
}
