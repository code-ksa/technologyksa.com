/**
 * Technology KSA - Core Integration
 * دمج CorePublisher مع النظام الحالي
 */

// Override publishPage to use CorePublisher
(function() {
  // Wait for everything to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', integrateCore);
  } else {
    integrateCore();
  }

  function integrateCore() {
    // Override publishPage function
    if (typeof window.publishPage === 'function') {
      const originalPublishPage = window.publishPage;

      window.publishPage = async function() {
        if (!pageBuilderManager || !pageBuilderManager.currentPage) {
          showToast('لم يتم اختيار صفحة', 'error');
          return;
        }

        // Save layout first
        if (typeof savePageLayout === 'function') {
          savePageLayout();
        }

        const page = pageBuilderManager.currentPage;

        // Update page status in localStorage
        const pagesData = localStorage.getItem('techksa_pages');
        const pages = pagesData ? JSON.parse(pagesData) : [];
        const pageIndex = pages.findIndex(p => p.id === page.id);

        if (pageIndex === -1) {
          showToast('الصفحة غير موجودة', 'error');
          return;
        }

        pages[pageIndex].status = 'published';
        pages[pageIndex].publishedAt = new Date().toISOString();
        localStorage.setItem('techksa_pages', JSON.stringify(pages));

        // Use CorePublisher for real publishing
        if (window.corePublisher) {
          try {
            showToast('جاري النشر على الخادم...', 'info');

            const result = await corePublisher.publishPage(pages[pageIndex]);

            if (result.published) {
              // Published to server successfully!
              showPublishSuccessModalReal(pages[pageIndex], result.url);
              showToast('✓ تم النشر على الخادم بنجاح!', 'success');
            } else {
              // API not available, fallback to download
              showPublishSuccessModalDownload(pages[pageIndex], result.html, result.filename);
              showToast('API غير متاح. قم بتحميل الملف يدوياً.', 'warning');
            }

            // Ask about adding to menu
            setTimeout(() => {
              if (window.menusManager && window.pagesManager) {
                const addToMenu = confirm(`هل تريد إضافة الصفحة "${page.title}" إلى القائمة الرئيسية؟`);
                if (addToMenu) {
                  pagesManager.addToMenu(page.id);
                }
              }
            }, 1000);

          } catch (error) {
            console.error('Publish error:', error);
            showToast(`فشل النشر: ${error.message}`, 'error');

            // Show error modal with solution
            showPublishErrorModal(error.message);
          }
        } else {
          showToast('CorePublisher غير متاح', 'error');
        }
      };

      console.log('✓ CorePublisher integrated with publishPage');
    }
  }
})();

// ==========================================
// SUCCESS MODAL - PUBLISHED TO SERVER
// ==========================================

function showPublishSuccessModalReal(page, url) {
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.style.zIndex = '999999';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
    <div class="modal-content" style="max-width: 600px;">
      <div class="modal-header" style="background: #10B981; color: white;">
        <h3><i class="fas fa-check-circle"></i> تم النشر على الخادم بنجاح!</h3>
        <button class="modal-close" onclick="this.closest('.modal').remove()" style="color: white;">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body" style="padding: 2rem; text-align: center;">
        <i class="fas fa-check-circle" style="font-size: 4rem; color: #10B981; margin-bottom: 1rem; display: block;"></i>
        <h2 style="margin-bottom: 1rem;">${page.title}</h2>
        <p style="margin-bottom: 1.5rem; color: #6B7280;">الصفحة منشورة ومتاحة الآن على الموقع!</p>

        <div style="background: #F3F4F6; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
          <small style="display: block; margin-bottom: 0.5rem; color: #6B7280;">رابط الصفحة:</small>
          <code style="font-size: 1.1rem; color: #059669; font-weight: 600;">${url}</code>
        </div>

        <a href="${url}" target="_blank" class="btn btn-success" style="width: 100%; margin-bottom: 1rem;">
          <i class="fas fa-external-link-alt"></i> فتح الصفحة على الموقع
        </a>

        <p style="font-size: 0.9rem; color: #10B981;">
          <i class="fas fa-check"></i> الصفحة متاحة الآن على: ${url}
        </p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// ==========================================
// SUCCESS MODAL - DOWNLOAD HTML
// ==========================================

function showPublishSuccessModalDownload(page, html, filename) {
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.style.zIndex = '999999';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
    <div class="modal-content" style="max-width: 600px;">
      <div class="modal-header" style="background: #F59E0B; color: white;">
        <h3><i class="fas fa-exclamation-triangle"></i> API غير متاح</h3>
        <button class="modal-close" onclick="this.closest('.modal').remove()" style="color: white;">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body" style="padding: 2rem; text-align: center;">
        <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #F59E0B; margin-bottom: 1rem; display: block;"></i>
        <h2 style="margin-bottom: 1rem;">${page.title}</h2>
        <p style="margin-bottom: 1.5rem; color: #6B7280;">
          Publisher API غير متاح.<br>
          قم بتحميل ملف HTML ورفعه للخادم يدوياً.
        </p>

        <div style="background: #FEF3C7; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border: 2px solid #F59E0B;">
          <p style="color: #92400E; margin: 0; font-weight: 600;">
            <i class="fas fa-lightbulb"></i> لتفعيل النشر التلقائي:
          </p>
          <p style="color: #92400E; margin: 0.5rem 0 0; font-size: 0.9rem;">
            شغّل الأمر في Terminal: <code>npm run publish-api</code>
          </p>
        </div>

        <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
          <button onclick="downloadHTML_${Date.now()}()" class="btn btn-primary" style="flex: 1;">
            <i class="fas fa-download"></i> تحميل HTML
          </button>
          <button onclick="previewHTML_${Date.now()}()" class="btn btn-secondary" style="flex: 1;">
            <i class="fas fa-eye"></i> معاينة
          </button>
        </div>

        <p style="font-size: 0.9rem; color: #6B7280;">
          <i class="fas fa-info-circle"></i> بعد التحميل، ارفع الملف إلى مجلد dist/ على الخادم
        </p>
      </div>
    </div>
  `;

  // Add download function
  window[`downloadHTML_${Date.now()}`] = function() {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`تم تحميل ${filename}`, 'success');
  };

  // Add preview function
  window[`previewHTML_${Date.now()}`] = function() {
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(html);
    previewWindow.document.close();
  };

  document.body.appendChild(modal);
}

// ==========================================
// ERROR MODAL
// ==========================================

function showPublishErrorModal(errorMessage) {
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.style.zIndex = '999999';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
    <div class="modal-content" style="max-width: 600px;">
      <div class="modal-header" style="background: #EF4444; color: white;">
        <h3><i class="fas fa-times-circle"></i> فشل النشر</h3>
        <button class="modal-close" onclick="this.closest('.modal').remove()" style="color: white;">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body" style="padding: 2rem;">
        <p style="margin-bottom: 1rem; color: #DC2626;">
          <strong>خطأ:</strong> ${errorMessage}
        </p>

        <div style="background: #FEF2F2; border: 2px solid #EF4444; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
          <p style="color: #991B1B; margin: 0; font-weight: 600;">
            <i class="fas fa-tools"></i> الحلول المقترحة:
          </p>
          <ol style="color: #991B1B; margin: 0.5rem 0 0 1.5rem; font-size: 0.9rem;">
            <li>تأكد من تشغيل Publisher API: <code>npm run publish-api</code></li>
            <li>تأكد من أن المنفذ 3001 غير مستخدم</li>
            <li>تحقق من اتصالك بالإنترنت</li>
            <li>أعد تحميل الصفحة وحاول مرة أخرى</li>
          </ol>
        </div>

        <button onclick="this.closest('.modal').remove()" class="btn btn-secondary" style="width: 100%;">
          إغلاق
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

console.log('✓ Core Integration loaded');
