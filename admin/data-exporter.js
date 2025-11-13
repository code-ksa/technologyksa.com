/**
 * Technology KSA - Data Exporter
 * تصدير البيانات من localStorage إلى ملفات JSON لنظام البناء
 */

class DataExporter {
  constructor() {
    this.exportData = {
      pages: [],
      posts: [],
      menus: [],
      settings: {}
    };
  }

  /**
   * Export all data
   */
  async exportAll() {
    try {
      // Load data from localStorage
      this.loadFromStorage();

      // Create downloadable files
      this.downloadJSON('pages-data.json', this.exportData.pages);
      this.downloadJSON('posts-data.json', this.exportData.posts);
      this.downloadJSON('menus-data.json', this.exportData.menus);
      this.downloadJSON('settings-data.json', this.exportData.settings);

      // Show info message
      this.showExportInfo();

      return true;
    } catch (error) {
      console.error('Export error:', error);
      showToast(`فشل التصدير: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * Load data from localStorage
   */
  loadFromStorage() {
    // Use storage manager if available
    if (window.storage) {
      this.exportData.pages = storage.get('pages', []);
      this.exportData.posts = storage.get('blog_posts', []);
      this.exportData.menus = storage.get('menus', []);
      this.exportData.settings = storage.get('site_settings', {});
    } else {
      // Fallback to direct localStorage
      this.exportData.pages = JSON.parse(localStorage.getItem('techksa_pages') || '[]');
      this.exportData.posts = JSON.parse(localStorage.getItem('techksa_blog_posts') || '[]');
      this.exportData.menus = JSON.parse(localStorage.getItem('techksa_menus') || '[]');
      this.exportData.settings = JSON.parse(localStorage.getItem('techksa_site_settings') || '{}');
    }

    // Filter published only
    this.exportData.pages = this.exportData.pages.filter(p => p.status === 'published');
    this.exportData.posts = this.exportData.posts.filter(p => p.status === 'published');
  }

  /**
   * Download JSON file
   */
  downloadJSON(filename, data) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  }

  /**
   * Show export info
   */
  showExportInfo() {
    const message = `
تم التصدير بنجاح! 📦

الملفات المُصدّرة:
- pages-data.json (${this.exportData.pages.length} صفحة)
- posts-data.json (${this.exportData.posts.length} مقال)
- menus-data.json (${this.exportData.menus.length} قائمة)
- settings-data.json

الخطوات التالية:
1. ضع الملفات في مجلد المشروع الرئيسي
2. قم بتشغيل: node build-enhanced.js
3. سيتم بناء الموقع في مجلد dist/

ملاحظة: الصور المحفوظة في IndexedDB ستحتاج إلى تصدير منفصل.
    `;

    if (typeof showToast === 'function') {
      showToast('تم التصدير بنجاح! راجع Console للتفاصيل.', 'success');
    }

    console.log(message);
    alert(message);
  }

  /**
   * Export images from IndexedDB
   */
  async exportImages() {
    if (!window.contentManager || !contentManager.imageManager) {
      showToast('نظام إدارة الصور غير متاح', 'error');
      return;
    }

    try {
      const images = await contentManager.imageManager.getAllImages();

      if (images.length === 0) {
        showToast('لا توجد صور للتصدير', 'warning');
        return;
      }

      // Create images directory structure
      const imagesData = {
        count: images.length,
        images: images,
        exportDate: new Date().toISOString()
      };

      this.downloadJSON('images-data.json', imagesData);

      showToast(`تم تصدير معلومات ${images.length} صورة`, 'success');

      // Show instructions
      alert(
        `تم تصدير معلومات الصور.\n\n` +
        `ملاحظة: الصور نفسها محفوظة في IndexedDB.\n` +
        `لتصدير الصور الفعلية، استخدم أداة تصدير IndexedDB من متصفحك.`
      );

    } catch (error) {
      console.error('Error exporting images:', error);
      showToast(`فشل تصدير الصور: ${error.message}`, 'error');
    }
  }

  /**
   * Quick export (one-click)
   */
  async quickExport() {
    showToast('جاري التصدير...', 'info');

    const success = await this.exportAll();

    if (success) {
      // Also export images info
      await this.exportImages();
    }
  }
}

// Create global instance
if (typeof window !== 'undefined') {
  window.dataExporter = new DataExporter();
  window.DataExporter = DataExporter;
}

// Add export button to admin interface
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addExportButton);
} else {
  addExportButton();
}

function addExportButton() {
  // Add export button to settings page
  setTimeout(() => {
    const settingsView = document.getElementById('settingsView');

    if (settingsView) {
      const exportSection = document.createElement('div');
      exportSection.className = 'card';
      exportSection.style.marginTop = '2rem';
      exportSection.innerHTML = `
        <h3>تصدير البيانات</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1rem;">
          صدّر جميع البيانات (الصفحات، المقالات، القوائم، الإعدادات) لاستخدامها مع نظام البناء.
        </p>
        <button onclick="dataExporter.quickExport()" class="btn btn-primary" style="width: 100%;">
          <i class="fas fa-download"></i> تصدير جميع البيانات
        </button>
        <p style="color: var(--text-secondary); font-size: 0.875rem; margin-top: 1rem;">
          بعد التصدير، ضع الملفات في المجلد الرئيسي وقم بتشغيل: <code>node build-enhanced.js</code>
        </p>
      `;

      settingsView.appendChild(exportSection);
    }
  }, 1000);
}
