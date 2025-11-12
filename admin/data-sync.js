/**
 * Export/Import System for CMS Data
 * Syncs localStorage with data.json
 */

class DataSyncManager {
  constructor() {
    this.dataFile = 'data.json';
  }

  // Export all data from localStorage to data.json format
  exportAllData() {
    const posts = JSON.parse(localStorage.getItem('techksa_posts') || '[]');
    const services = JSON.parse(localStorage.getItem('techksa_services') || '[]');
    const projects = JSON.parse(localStorage.getItem('techksa_projects') || '[]');
    const pages = JSON.parse(localStorage.getItem('techksa_pages') || '[]');
    const media = JSON.parse(localStorage.getItem('techksa_media') || '[]');
    const menusData = localStorage.getItem('techksa_menus');
    const settingsData = localStorage.getItem('techksa_header_footer_settings');
    const siteSettings = localStorage.getItem('techksa_site_settings');

    // Parse menus
    let menus = {
      primary: {
        id: 'primary',
        name: 'القائمة الرئيسية',
        location: 'header',
        items: []
      },
      footer: {
        id: 'footer',
        name: 'قائمة التذييل',
        location: 'footer',
        items: []
      }
    };

    if (menusData) {
      try {
        menus = JSON.parse(menusData);
      } catch (e) {
        console.error('Error parsing menus:', e);
      }
    }

    // Parse settings
    let headerFooterSettings = {
      header: {
        enabled: true,
        sticky: true,
        backgroundColor: '#ffffff',
        textColor: '#333333',
        height: 80,
        showCTA: true,
        ctaText: 'اتصل بنا',
        ctaLink: '/contact',
        ctaStyle: 'primary'
      },
      footer: {
        enabled: true,
        backgroundColor: '#1a1a1a',
        textColor: '#ffffff',
        showSocial: true,
        copyrightText: '© {year} Technology KSA. جميع الحقوق محفوظة.',
        company: {
          name: 'Technology KSA',
          description: 'شركة تقنية سعودية متخصصة في تطوير المواقع والتطبيقات',
          email: 'info@technologyksa.com',
          phone: '+966 50 123 4567',
          address: 'الرياض، المملكة العربية السعودية'
        },
        social: {
          twitter: 'https://twitter.com/technologyksa',
          facebook: 'https://facebook.com/technologyksa',
          linkedin: 'https://linkedin.com/company/technologyksa',
          instagram: 'https://instagram.com/technologyksa'
        }
      },
      logo: {
        type: 'text',
        text: 'Technology KSA',
        imageUrl: '',
        width: 150,
        height: 50
      }
    };

    if (settingsData) {
      try {
        headerFooterSettings = JSON.parse(settingsData);
      } catch (e) {
        console.error('Error parsing settings:', e);
      }
    }

    const exportData = {
      posts,
      services,
      projects,
      pages,
      media,
      menus,
      headerFooterSettings,
      siteSettings: siteSettings ? JSON.parse(siteSettings) : {
        siteName: 'Technology KSA',
        siteDescription: 'شركة تقنية سعودية متخصصة في تطوير المواقع والتطبيقات',
        siteUrl: 'https://technologyksa.com',
        language: 'ar',
        timezone: 'Asia/Riyadh'
      }
    };

    return exportData;
  }

  // Download data.json file
  downloadDataJSON() {
    const data = this.exportAllData();
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return data;
  }

  // Show export modal with instructions
  showExportModal() {
    const data = this.exportAllData();
    const dataStr = JSON.stringify(data, null, 2);

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.zIndex = '999999';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
      <div class="modal-content" style="max-width: 800px;">
        <div class="modal-header" style="background: #0C4A2F; color: white;">
          <h3><i class="fas fa-download"></i> تصدير البيانات</h3>
          <button class="modal-close" onclick="this.closest('.modal').remove()" style="color: white;">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body" style="padding: 2rem;">
          <div style="background: #f0fdf4; border: 2px solid #86efac; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
            <h4 style="color: #166534; margin-bottom: 0.5rem;">
              <i class="fas fa-check-circle"></i> تم تصدير البيانات بنجاح
            </h4>
            <p style="color: #15803d; margin: 0;">
              <strong>المحتوى:</strong> ${data.posts.length} مقال، ${data.services.length} خدمة، ${data.projects.length} مشروع، ${data.pages.length} صفحة
            </p>
          </div>

          <h4 style="margin-bottom: 1rem;">الخطوات التالية:</h4>
          <ol style="line-height: 2; padding-right: 1.5rem;">
            <li>اضغط على زر "تحميل data.json" أدناه</li>
            <li>انسخ الملف إلى مجلد المشروع الرئيسي (استبدل الملف القديم)</li>
            <li>شغّل أمر البناء: <code style="background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 4px;">node build-improved.js</code></li>
            <li>ستظهر جميع الصفحات والمقالات على الموقع!</li>
          </ol>

          <div style="background: #eff6ff; border: 2px solid #93c5fd; border-radius: 8px; padding: 1rem; margin-top: 1.5rem;">
            <p style="color: #1e40af; margin: 0; font-size: 0.9rem;">
              <i class="fas fa-info-circle"></i> <strong>ملاحظة:</strong> يجب تصدير البيانات في كل مرة تضيف أو تعدل محتوى لكي يظهر على الموقع النهائي.
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">إغلاق</button>
          <button class="btn btn-primary" onclick="dataSyncManager.downloadDataJSON(); this.closest('.modal').remove();">
            <i class="fas fa-download"></i> تحميل data.json
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Auto-export on save
  autoExportOnSave() {
    // Intercept localStorage setItem
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      originalSetItem.apply(this, arguments);

      // If it's CMS data, trigger auto-export notification
      if (key.startsWith('techksa_')) {
        console.log('CMS data updated:', key);
        // Show notification that data needs to be exported
        dataSyncManager.showExportReminder();
      }
    };
  }

  showExportReminder() {
    // Only show once per session
    if (sessionStorage.getItem('exportReminderShown')) return;
    sessionStorage.setItem('exportReminderShown', 'true');

    // Show small notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: #0C4A2F;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 999999;
      display: flex;
      align-items: center;
      gap: 1rem;
      max-width: 400px;
      animation: slideInLeft 0.3s ease-out;
    `;
    notification.innerHTML = `
      <i class="fas fa-info-circle" style="font-size: 1.5rem;"></i>
      <div style="flex: 1;">
        <strong>تذكير مهم</strong>
        <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem; opacity: 0.9;">
          لا تنسى تصدير البيانات بعد الحفظ
        </p>
      </div>
      <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 1.25rem;">
        ×
      </button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutLeft 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutLeft {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(-100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize
const dataSyncManager = new DataSyncManager();

console.log('✓ Data Sync Manager Loaded');
