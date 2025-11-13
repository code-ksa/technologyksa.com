/**
 * Technology KSA - Page Management Functions
 * دوال إدارة الصفحات مع التدفق المحسّن
 */

// ==========================================
// PAGE MODAL FUNCTIONS
// ==========================================

/**
 * Open page modal for creating/editing
 */
function openPageModal(pageId = null) {
  const modal = document.getElementById('pageModal');
  const form = document.getElementById('pageForm');

  if (!modal || !form) return;

  form.reset();

  if (pageId && pagesManager) {
    // Edit mode
    const page = pagesManager.pages.find(p => p.id === pageId);
    if (page) {
      document.getElementById('pageModalTitle').textContent = 'تعديل الصفحة';
      document.getElementById('pageId').value = page.id;
      document.getElementById('pageTitle').value = page.title;
      document.getElementById('pageSlug').value = page.slug;
      document.getElementById('pageMetaTitle').value = page.metaTitle || '';
      document.getElementById('pageMetaDescription').value = page.metaDescription || '';
      document.getElementById('pageStatus').value = page.status || 'published';
    }
  } else {
    // Create mode
    document.getElementById('pageModalTitle').textContent = 'إضافة صفحة جديدة';
    document.getElementById('pageId').value = '';
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * Close page modal
 */
function closePageModal() {
  const modal = document.getElementById('pageModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Save page from modal
 */
function savePage(event) {
  event.preventDefault();

  if (!pagesManager) {
    showToast('نظام إدارة الصفحات غير متاح', 'error');
    return;
  }

  const pageId = document.getElementById('pageId').value;
  const title = document.getElementById('pageTitle').value.trim();
  const slug = document.getElementById('pageSlug').value.trim() ||
    (blogCMS ? blogCMS.generateSlug(title) : title.toLowerCase().replace(/\s+/g, '-'));
  const metaTitle = document.getElementById('pageMetaTitle').value.trim() || title;
  const metaDescription = document.getElementById('pageMetaDescription').value.trim();
  const status = document.getElementById('pageStatus').value;

  // Validation
  if (!title) {
    showToast('يرجى إدخال عنوان الصفحة', 'error');
    return;
  }

  if (pageId) {
    // Update existing page
    const index = pagesManager.pages.findIndex(p => p.id === pageId);
    if (index >= 0) {
      pagesManager.pages[index] = {
        ...pagesManager.pages[index],
        title,
        slug,
        metaTitle,
        metaDescription,
        status,
        updatedAt: new Date().toISOString()
      };

      pagesManager.savePages();
      showToast('تم تحديث الصفحة بنجاح!', 'success');

      // Update page builder if it's the current page
      if (pageBuilderManager && pageBuilderManager.currentPage && pageBuilderManager.currentPage.id === pageId) {
        pageBuilderManager.currentPage = pagesManager.pages[index];
        document.getElementById('currentPageName').textContent = title;
      }
    }
  } else {
    // Create new page
    const newPage = {
      id: `page_${Date.now()}`,
      title,
      slug,
      metaTitle,
      metaDescription,
      status,
      layout: [],
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    pagesManager.pages.push(newPage);
    pagesManager.savePages();

    showToast('تم إضافة الصفحة بنجاح!', 'success');

    // Close modal
    closePageModal();

    // IMPORTANT: Auto-open Page Builder after creating page
    setTimeout(() => {
      openPageBuilderForPage(newPage.id);
    }, 300);

    return; // Exit to prevent closing modal again
  }

  closePageModal();
}

/**
 * Open Page Builder directly
 */
function openPageBuilder() {
  const pageId = document.getElementById('pageId').value;

  if (pageId) {
    closePageModal();
    setTimeout(() => {
      openPageBuilderForPage(pageId);
    }, 300);
  } else {
    showToast('يرجى حفظ الصفحة أولاً', 'warning');
  }
}

/**
 * Open Page Builder for specific page
 */
function openPageBuilderForPage(pageId) {
  if (!pagesManager) return;

  const page = pagesManager.pages.find(p => p.id === pageId);
  if (!page) {
    showToast('الصفحة غير موجودة', 'error');
    return;
  }

  // Update page builder
  if (pageBuilderManager) {
    pageBuilderManager.currentPage = page;
    pageBuilderManager.pageLayout = page.layout || [];

    document.getElementById('currentPageName').textContent = page.title;
    renderPageCanvas();
  }

  // Switch to page builder view
  switchView('pagebuilder');
}

/**
 * Switch to a specific view
 */
function switchView(viewName) {
  // Hide all views
  document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));

  // Show selected view
  const view = document.getElementById(viewName + 'View');
  if (view) {
    view.classList.add('active');
  }

  // Update nav
  document.querySelectorAll('.admin-nav li').forEach(li => li.classList.remove('active'));
  const navItem = document.querySelector(`[data-view="${viewName}"]`);
  if (navItem) {
    navItem.parentElement.classList.add('active');
  }

  // Update page title
  const pageTitle = document.getElementById('pageTitle');
  if (pageTitle) {
    const titles = {
      'dashboard': 'لوحة التحكم',
      'posts': 'إدارة المقالات',
      'services': 'إدارة الخدمات',
      'projects': 'إدارة المشاريع',
      'pages': 'إدارة الصفحات',
      'menus': 'إدارة القوائم',
      'media': 'مكتبة الصور',
      'pagebuilder': 'Page Builder',
      'settings': 'الإعدادات'
    };

    pageTitle.textContent = titles[viewName] || 'لوحة التحكم';
  }

  // Hide/show new button
  const btnNewPost = document.getElementById('btnNewPost');
  if (btnNewPost) {
    if (['pagebuilder', 'media', 'settings', 'dashboard'].includes(viewName)) {
      btnNewPost.style.display = 'none';
    } else {
      btnNewPost.style.display = 'inline-flex';
    }
  }
}

// ==========================================
// PAGE BUILDER ENHANCED FUNCTIONS
// ==========================================

/**
 * Save page layout (enhanced)
 */
function savePageLayoutEnhanced() {
  if (!pageBuilderManager || !pageBuilderManager.currentPage) {
    showToast('لم يتم اختيار صفحة', 'error');
    return;
  }

  // Get layout from page builder
  const canvas = document.getElementById('pageCanvas');
  if (!canvas) return;

  const elements = canvas.querySelectorAll('[data-component-id]');
  const layout = [];

  elements.forEach((el, index) => {
    layout.push({
      id: el.dataset.componentId,
      type: el.dataset.componentType || 'custom',
      html: el.innerHTML,
      order: index
    });
  });

  // Update page
  const pageIndex = pagesManager.pages.findIndex(p => p.id === pageBuilderManager.currentPage.id);
  if (pageIndex >= 0) {
    pagesManager.pages[pageIndex].layout = layout;
    pagesManager.pages[pageIndex].updatedAt = new Date().toISOString();
    pagesManager.savePages();

    pageBuilderManager.currentPage = pagesManager.pages[pageIndex];
    pageBuilderManager.pageLayout = layout;

    showToast('تم حفظ التخطيط بنجاح!', 'success');
  }
}

/**
 * Publish page (enhanced with auto-build)
 */
function publishPageEnhanced() {
  if (!pageBuilderManager || !pageBuilderManager.currentPage) {
    showToast('لم يتم اختيار صفحة', 'error');
    return;
  }

  // Save layout first
  savePageLayoutEnhanced();

  const page = pageBuilderManager.currentPage;

  // Update status to published
  const pageIndex = pagesManager.pages.findIndex(p => p.id === page.id);
  if (pageIndex >= 0) {
    pagesManager.pages[pageIndex].status = 'published';
    pagesManager.pages[pageIndex].publishedAt = new Date().toISOString();
    pagesManager.savePages();

    // Auto-build page
    if (frontendBuilder) {
      frontendBuilder.loadData();
      const result = frontendBuilder.buildAndSavePage(pagesManager.pages[pageIndex]);

      if (result && result.success) {
        // Show success modal with link
        frontendBuilder.showSuccessModal(
          pagesManager.pages[pageIndex],
          'تم نشر الصفحة بنجاح!'
        );

        // Ask about adding to menu
        setTimeout(() => {
          if (menusManager) {
            const addToMenu = confirm(`هل تريد إضافة الصفحة "${page.title}" إلى القائمة الرئيسية؟`);
            if (addToMenu) {
              pagesManager.addToMenu(page.id);
            }
          }
        }, 1000);
      }
    } else {
      showToast('تم نشر الصفحة! قم بتحميل الملف وريعه للخادم.', 'success');
    }
  }
}

// ==========================================
// AUTO-SETUP ON LOAD
// ==========================================

// Override old functions if they exist
if (typeof window !== 'undefined') {
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPageFunctions);
  } else {
    setupPageFunctions();
  }
}

function setupPageFunctions() {
  // Override savePageLayout
  if (typeof savePageLayout !== 'undefined') {
    const originalSavePageLayout = savePageLayout;
    savePageLayout = function() {
      savePageLayoutEnhanced();
    };
  } else {
    window.savePageLayout = savePageLayoutEnhanced;
  }

  // Override publishPage
  if (typeof publishPage !== 'undefined') {
    const originalPublishPage = publishPage;
    publishPage = function() {
      publishPageEnhanced();
    };
  } else {
    window.publishPage = publishPageEnhanced;
  }

  console.log('✓ Enhanced page functions loaded');
}

// Export functions
if (typeof window !== 'undefined') {
  window.openPageModal = openPageModal;
  window.closePageModal = closePageModal;
  window.savePage = savePage;
  window.openPageBuilder = openPageBuilder;
  window.openPageBuilderForPage = openPageBuilderForPage;
  window.switchView = switchView;
  window.savePageLayoutEnhanced = savePageLayoutEnhanced;
  window.publishPageEnhanced = publishPageEnhanced;
}
