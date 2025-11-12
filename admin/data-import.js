/**
 * Data Import Manager
 * يستورد البيانات من data.json إلى localStorage
 * يستخدم عند فتح لوحة التحكم لأول مرة أو عند الحاجة لإعادة المزامنة
 */

class DataImportManager {
  constructor() {
    this.dataJsonUrl = '../data.json';
  }

  /**
   * استيراد جميع البيانات من data.json إلى localStorage
   */
  async importAllData() {
    try {
      const response = await fetch(this.dataJsonUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch data.json: ${response.status}`);
      }

      const data = await response.json();

      // استيراد جميع الأنواع
      this.importPosts(data.posts || []);
      this.importServices(data.services || []);
      this.importProjects(data.projects || []);
      this.importPages(data.pages || []);
      this.importMedia(data.media || []);
      this.importMenus(data.menus || {});
      this.importSiteSettings(data.siteSettings || {});
      this.importHeaderFooterSettings(data.headerFooterSettings || {});

      // حفظ وقت آخر استيراد
      localStorage.setItem('techksa_last_import', new Date().toISOString());

      return {
        success: true,
        message: 'تم استيراد جميع البيانات بنجاح',
        counts: {
          posts: data.posts?.length || 0,
          services: data.services?.length || 0,
          projects: data.projects?.length || 0,
          pages: data.pages?.length || 0,
          media: data.media?.length || 0
        }
      };
    } catch (error) {
      console.error('Error importing data:', error);
      return {
        success: false,
        message: `خطأ في استيراد البيانات: ${error.message}`
      };
    }
  }

  importPosts(posts) {
    if (posts && posts.length > 0) {
      localStorage.setItem('techksa_posts', JSON.stringify(posts));
    }
  }

  importServices(services) {
    if (services && services.length > 0) {
      localStorage.setItem('techksa_services', JSON.stringify(services));
    }
  }

  importProjects(projects) {
    if (projects && projects.length > 0) {
      localStorage.setItem('techksa_projects', JSON.stringify(projects));
    }
  }

  importPages(pages) {
    if (pages && pages.length > 0) {
      localStorage.setItem('techksa_pages', JSON.stringify(pages));
    }
  }

  importMedia(media) {
    if (media && media.length > 0) {
      localStorage.setItem('techksa_media', JSON.stringify(media));
    }
  }

  importMenus(menus) {
    if (menus && Object.keys(menus).length > 0) {
      // تحويل object إلى array للتخزين
      const menusArray = Object.values(menus);
      localStorage.setItem('techksa_menus', JSON.stringify(menusArray));
    }
  }

  importSiteSettings(settings) {
    if (settings && Object.keys(settings).length > 0) {
      localStorage.setItem('techksa_site_settings', JSON.stringify(settings));
    }
  }

  importHeaderFooterSettings(settings) {
    if (settings && Object.keys(settings).length > 0) {
      localStorage.setItem('techksa_header_footer_settings', JSON.stringify(settings));
    }
  }

  /**
   * التحقق من وجود بيانات في localStorage
   */
  hasLocalData() {
    const keys = [
      'techksa_posts',
      'techksa_services',
      'techksa_projects',
      'techksa_pages'
    ];

    return keys.some(key => {
      const data = localStorage.getItem(key);
      return data && JSON.parse(data).length > 0;
    });
  }

  /**
   * عرض نافذة الاستيراد
   */
  showImportModal() {
    const hasData = this.hasLocalData();
    const lastImport = localStorage.getItem('techksa_last_import');

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.zIndex = '999999';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 500px;">
        <div class="modal-header">
          <h3><i class="fas fa-upload"></i> استيراد البيانات من data.json</h3>
          <button class="modal-close" onclick="this.closest('.modal').remove()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div style="background: #f3f4f6; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
            <p style="margin: 0; line-height: 1.6;">
              سيتم استيراد جميع البيانات من ملف <code>data.json</code> إلى المتصفح.
            </p>
            ${lastImport ? `
              <p style="margin: 0.5rem 0 0; color: #6b7280; font-size: 0.875rem;">
                <i class="fas fa-clock"></i> آخر استيراد: ${new Date(lastImport).toLocaleString('ar')}
              </p>
            ` : ''}
          </div>

          ${hasData ? `
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
              <p style="margin: 0; color: #92400e;">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>تحذير:</strong> توجد بيانات محلية حالياً. سيتم استبدالها بالبيانات من data.json.
              </p>
            </div>
          ` : ''}

          <p style="margin-bottom: 1rem;">
            هذا الإجراء مفيد في الحالات التالية:
          </p>
          <ul style="margin: 0; padding-right: 1.5rem;">
            <li>عند فتح لوحة التحكم لأول مرة</li>
            <li>لاستعادة البيانات من النسخة الاحتياطية</li>
            <li>بعد إجراء تعديلات على data.json مباشرة</li>
          </ul>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
            إلغاء
          </button>
          <button class="btn btn-primary" onclick="dataImportManager.performImport(this)">
            <i class="fas fa-upload"></i> استيراد الآن
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  /**
   * تنفيذ الاستيراد
   */
  async performImport(button) {
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الاستيراد...';

    const result = await this.importAllData();

    if (result.success) {
      // إغلاق النافذة الحالية
      button.closest('.modal').remove();

      // عرض رسالة النجاح
      this.showSuccessModal(result);
    } else {
      button.disabled = false;
      button.innerHTML = originalText;
      alert(result.message);
    }
  }

  /**
   * عرض رسالة النجاح
   */
  showSuccessModal(result) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.zIndex = '999999';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 500px;">
        <div class="modal-header" style="background: #10b981; color: white;">
          <h3><i class="fas fa-check-circle"></i> نجح الاستيراد</h3>
          <button class="modal-close" onclick="this.closest('.modal').remove()" style="color: white;">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div style="text-align: center; padding: 1rem 0;">
            <i class="fas fa-check-circle" style="font-size: 3rem; color: #10b981;"></i>
            <p style="font-size: 1.125rem; margin: 1rem 0;">${result.message}</p>
          </div>

          <div style="background: #f3f4f6; padding: 1rem; border-radius: 8px;">
            <h4 style="margin: 0 0 0.5rem;">تم استيراد:</h4>
            <ul style="margin: 0; padding-right: 1.5rem;">
              ${result.counts.pages > 0 ? `<li>الصفحات: ${result.counts.pages}</li>` : ''}
              ${result.counts.posts > 0 ? `<li>المقالات: ${result.counts.posts}</li>` : ''}
              ${result.counts.services > 0 ? `<li>الخدمات: ${result.counts.services}</li>` : ''}
              ${result.counts.projects > 0 ? `<li>المشاريع: ${result.counts.projects}</li>` : ''}
              ${result.counts.media > 0 ? `<li>الوسائط: ${result.counts.media}</li>` : ''}
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="location.reload()">
            <i class="fas fa-sync"></i> إعادة تحميل الصفحة
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  /**
   * الاستيراد التلقائي عند أول تشغيل
   */
  async autoImportOnFirstRun() {
    const hasImported = localStorage.getItem('techksa_last_import');
    const hasData = this.hasLocalData();

    // إذا لم يتم الاستيراد من قبل ولا توجد بيانات محلية
    if (!hasImported && !hasData) {
      console.log('First run detected, importing data from data.json...');
      const result = await this.importAllData();

      if (result.success) {
        console.log('Auto-import successful:', result);
      } else {
        console.error('Auto-import failed:', result.message);
      }
    }
  }
}

// إنشاء instance عام
const dataImportManager = new DataImportManager();

// الاستيراد التلقائي عند تحميل الصفحة (أول مرة فقط)
document.addEventListener('DOMContentLoaded', () => {
  dataImportManager.autoImportOnFirstRun();
});
