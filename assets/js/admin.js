/**
 * Technology KSA - Blog CMS System
 * نظام إدارة المدونة والخدمات الكامل
 */

// ==========================================
// PAGES MANAGEMENT CLASS
// ==========================================

class PagesManager {
  constructor() {
    this.pages = [];
    this.currentPageId = null;
  }

  init() {
    this.loadPages();
    this.renderPagesList();
  }

  loadPages() {
    const storedPages = localStorage.getItem('techksa_pages');
    this.pages = storedPages ? JSON.parse(storedPages) : this.getDefaultPages();
  }

  getDefaultPages() {
    return [
      {
        id: 'home',
        title: 'الصفحة الرئيسية',
        slug: 'index',
        metaTitle: 'شركة تكنولوجيا السعودية - حلول تقنية متكاملة',
        metaDescription: 'نقدم حلول تقنية متكاملة للشركات في المملكة العربية السعودية',
        status: 'published',
        date: new Date().toISOString().split('T')[0],
        layout: []
      }
    ];
  }

  savePages() {
    localStorage.setItem('techksa_pages', JSON.stringify(this.pages));
    this.renderPagesList();
  }

  renderPagesList() {
    const tbody = document.getElementById('pagesTableBody');
    if (!tbody) return;

    if (this.pages.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">لا توجد صفحات. أضف صفحة جديدة!</td></tr>';
      return;
    }

    tbody.innerHTML = this.pages.map(page => `
      <tr>
        <td>${page.title}</td>
        <td><code>${page.slug}</code></td>
        <td>${page.layout?.length || 0} عناصر</td>
        <td>${page.date}</td>
        <td><span class="badge badge-${page.status === 'published' ? 'success' : 'warning'}">${page.status === 'published' ? 'منشورة' : 'مسودة'}</span></td>
        <td>
          <button class="btn-icon" onclick="pagesManager.editPage('${page.id}')" title="تعديل">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon" onclick="pagesManager.openPageBuilder('${page.id}')" title="Page Builder">
            <i class="fas fa-hammer"></i>
          </button>
          <button class="btn-icon" onclick="pagesManager.duplicatePage('${page.id}')" title="تكرار">
            <i class="fas fa-copy"></i>
          </button>
          <button class="btn-icon" onclick="pagesManager.addToMenu('${page.id}')" title="إضافة للقائمة">
            <i class="fas fa-plus-circle"></i>
          </button>
          ${page.id !== 'home' ? `<button class="btn-icon" onclick="pagesManager.deletePage('${page.id}')" title="حذف">
            <i class="fas fa-trash"></i>
          </button>` : ''}
        </td>
      </tr>
    `).join('');
  }

  editPage(id) {
    const page = this.pages.find(p => p.id === id);
    if (!page) return;

    document.getElementById('pageId').value = page.id;
    document.getElementById('pageTitle').value = page.title;
    document.getElementById('pageSlug').value = page.slug;
    document.getElementById('pageMetaTitle').value = page.metaTitle;
    document.getElementById('pageMetaDescription').value = page.metaDescription;
    document.getElementById('pageStatus').value = page.status;

    document.getElementById('pageModalTitle').textContent = 'تعديل الصفحة';
    document.getElementById('pageModal').classList.add('active');
  }

  deletePage(id) {
    if (!confirm('هل أنت متأكد من حذف هذه الصفحة؟')) return;

    this.pages = this.pages.filter(p => p.id !== id);
    this.savePages();
    showToast('تم حذف الصفحة بنجاح!', 'success');
  }

  duplicatePage(id) {
    const page = this.pages.find(p => p.id === id);
    if (!page) return;

    const duplicatedPage = JSON.parse(JSON.stringify(page));
    duplicatedPage.id = 'page-' + Date.now();
    duplicatedPage.title = page.title + ' (نسخة)';
    duplicatedPage.slug = page.slug + '-copy';
    duplicatedPage.date = new Date().toISOString().split('T')[0];

    this.pages.push(duplicatedPage);
    this.savePages();
    showToast('تم تكرار الصفحة بنجاح!', 'success');
  }

  addToMenu(id) {
    const page = this.pages.find(p => p.id === id);
    if (!page) return;

    if (!menusManager) {
      menusManager = new MenusManager();
      menusManager.init();
    }

    // Ask which menu to add to
    const menus = menusManager.menus;
    if (menus.length === 0) {
      if (confirm('لا توجد قوائم! هل تريد إنشاء قائمة جديدة؟')) {
        openMenuModal();
      }
      return;
    }

    const menuOptions = menus.map((m, i) => `${i + 1}. ${m.name}`).join('\n');
    const selection = prompt(`اختر رقم القائمة:\n\n${menuOptions}`);

    if (selection) {
      const index = parseInt(selection) - 1;
      if (index >= 0 && index < menus.length) {
        const menu = menus[index];

        // Check if page already in menu
        if (menu.items.some(item => item.pageId === page.id)) {
          showToast('الصفحة موجودة بالفعل في هذه القائمة!', 'warning');
          return;
        }

        // Add to menu
        menu.items.push({
          id: 'item-' + Date.now(),
          title: page.title,
          url: '/' + page.slug,
          type: 'page',
          pageId: page.id
        });

        menusManager.saveMenus();
        showToast('تم إضافة الصفحة إلى القائمة بنجاح!', 'success');
      }
    }
  }

  openPageBuilder(id) {
    this.currentPageId = id;
    const page = this.pages.find(p => p.id === id);

    if (page) {
      // Update page builder title
      document.getElementById('currentPageName').textContent = page.title;

      // Load page layout
      pageLayout = page.layout || [];
      renderPageCanvas();

      // Switch to page builder view
      document.querySelectorAll('.admin-nav li').forEach(li => li.classList.remove('active'));
      document.querySelector('[data-view="pagebuilder"]').parentElement.classList.add('active');

      document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
      document.getElementById('pagebuilderView').classList.add('active');

      document.getElementById('pageTitle').textContent = 'Page Builder';
      document.getElementById('btnNewPost').style.display = 'none';

      initPageBuilder();
    }
  }
}

// Global instance
let pagesManager;

// ==========================================
// MENUS MANAGER
// ==========================================

class MenusManager {
  constructor() {
    this.menus = [];
    this.currentMenuItems = [];
  }

  init() {
    this.loadMenus();
    this.renderMenusList();
  }

  loadMenus() {
    const storedMenus = localStorage.getItem('techksa_menus');
    this.menus = storedMenus ? JSON.parse(storedMenus) : this.getDefaultMenus();
  }

  getDefaultMenus() {
    return [
      {
        id: 'main-menu',
        name: 'القائمة الرئيسية',
        location: 'header',
        date: new Date().toISOString().split('T')[0],
        items: [
          { id: 'item-1', title: 'الرئيسية', url: '/', type: 'page', pageId: 'home' },
          { id: 'item-2', title: 'خدماتنا', url: '/services', type: 'custom' },
          { id: 'item-3', title: 'المدونة', url: '/blog', type: 'custom' },
          { id: 'item-4', title: 'اتصل بنا', url: '#contact', type: 'custom' }
        ]
      }
    ];
  }

  saveMenus() {
    localStorage.setItem('techksa_menus', JSON.stringify(this.menus));
    this.renderMenusList();
  }

  renderMenusList() {
    const tbody = document.getElementById('menusTableBody');
    if (!tbody) return;

    if (this.menus.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">لا توجد قوائم. أضف قائمة جديدة!</td></tr>';
      return;
    }

    const locationNames = {
      'header': 'الهيدر',
      'footer-1': 'الفوتر - عمود 1',
      'footer-2': 'الفوتر - عمود 2',
      'footer-3': 'الفوتر - عمود 3',
      'sidebar': 'الشريط الجانبي',
      'custom': 'مخصص'
    };

    tbody.innerHTML = this.menus.map(menu => `
      <tr>
        <td>${menu.name}</td>
        <td><code>${menu.id}</code></td>
        <td>${menu.items?.length || 0} عناصر</td>
        <td><span class="badge badge-info">${locationNames[menu.location] || menu.location}</span></td>
        <td>${menu.date}</td>
        <td>
          <button class="btn-icon" onclick="menusManager.editMenu('${menu.id}')" title="تعديل">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon" onclick="menusManager.deleteMenu('${menu.id}')" title="حذف">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  editMenu(id) {
    const menu = this.menus.find(m => m.id === id);
    if (!menu) return;

    document.getElementById('menuId').value = menu.id;
    document.getElementById('menuName').value = menu.name;
    document.getElementById('menuLocation').value = menu.location;

    this.currentMenuItems = menu.items || [];
    this.loadAvailablePages();
    this.renderMenuItems();

    document.getElementById('menuModalTitle').textContent = 'تعديل القائمة';
    document.getElementById('menuModal').classList.add('active');
  }

  deleteMenu(id) {
    if (!confirm('هل أنت متأكد من حذف هذه القائمة؟')) return;

    this.menus = this.menus.filter(m => m.id !== id);
    this.saveMenus();
    showToast('تم حذف القائمة بنجاح!', 'success');
  }

  loadAvailablePages() {
    const container = document.getElementById('availablePages');
    if (!container) return;

    const pages = pagesManager ? pagesManager.pages : [];

    if (pages.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary);">لا توجد صفحات متاحة. أضف صفحات أولاً!</p>';
      return;
    }

    container.innerHTML = pages.map(page => {
      const isChecked = this.currentMenuItems.some(item => item.pageId === page.id);
      return `
        <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: var(--bg-primary); border-radius: 4px; cursor: pointer;">
          <input type="checkbox"
            ${isChecked ? 'checked' : ''}
            onchange="menusManager.togglePageInMenu('${page.id}', '${page.title}', '/${page.slug}', this.checked)"
            style="width: 18px; height: 18px;">
          <span>${page.title}</span>
          <code style="margin-right: auto; font-size: 0.85rem; color: var(--text-secondary);">/${page.slug}</code>
        </label>
      `;
    }).join('');
  }

  togglePageInMenu(pageId, title, url, checked) {
    if (checked) {
      // Add to menu
      if (!this.currentMenuItems.some(item => item.pageId === pageId)) {
        this.currentMenuItems.push({
          id: 'item-' + Date.now(),
          title: title,
          url: url,
          type: 'page',
          pageId: pageId
        });
      }
    } else {
      // Remove from menu
      this.currentMenuItems = this.currentMenuItems.filter(item => item.pageId !== pageId);
    }
    this.renderMenuItems();
  }

  renderMenuItems() {
    const container = document.getElementById('menuItemsList');
    if (!container) return;

    if (this.currentMenuItems.length === 0) {
      container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 1rem;">لا توجد عناصر. اختر صفحات من الأعلى أو أضف روابط مخصصة.</p>';
      return;
    }

    container.innerHTML = this.currentMenuItems.map((item, index) => `
      <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; background: var(--bg-secondary); border-radius: 4px; border: 1px solid var(--border-color);">
        <i class="fas fa-grip-vertical" style="color: var(--text-secondary); cursor: move;"></i>
        <div style="flex: 1;">
          <strong>${item.title}</strong>
          <small style="display: block; color: var(--text-secondary); margin-top: 0.25rem;">
            ${item.url} ${item.type === 'page' ? '(صفحة)' : '(رابط مخصص)'}
          </small>
        </div>
        ${item.type === 'page' && item.pageId ? `
          <button type="button" class="btn-icon" onclick="menusManager.editPageFromMenu('${item.pageId}')" title="تعديل الصفحة">
            <i class="fas fa-edit"></i>
          </button>
          <button type="button" class="btn-icon" onclick="menusManager.openPageBuilderFromMenu('${item.pageId}')" title="Page Builder">
            <i class="fas fa-hammer"></i>
          </button>
        ` : ''}
        <button type="button" class="btn-icon" onclick="menusManager.editMenuItem(${index})" title="تعديل العنصر">
          <i class="fas fa-pencil-alt"></i>
        </button>
        <button type="button" class="btn-icon" onclick="menusManager.removeMenuItem(${index})" title="حذف">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `).join('');
  }

  editPageFromMenu(pageId) {
    if (pagesManager) {
      pagesManager.editPage(pageId);
    }
  }

  openPageBuilderFromMenu(pageId) {
    if (pagesManager) {
      // Close menu modal first
      closeMenuModal();
      // Open page builder
      pagesManager.openPageBuilder(pageId);
    }
  }

  editMenuItem(index) {
    const item = this.currentMenuItems[index];
    if (!item) return;

    const newTitle = prompt('عنوان العنصر:', item.title);
    const newUrl = prompt('رابط العنصر:', item.url);

    if (newTitle && newUrl) {
      this.currentMenuItems[index].title = newTitle;
      this.currentMenuItems[index].url = newUrl;
      this.renderMenuItems();
    }
  }

  removeMenuItem(index) {
    this.currentMenuItems.splice(index, 1);
    this.loadAvailablePages(); // Refresh checkboxes
    this.renderMenuItems();
  }
}

// Global instance
let menusManager;

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
    logoLight: 'assets/images/logo-light.png',
    logoDark: 'assets/images/logo-dark.png',
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
    footerCopyright: `© ${new Date().getFullYear()} تكنولوجي السعودية. جميع الحقوق محفوظة.`,
    headerStyle: 'default',
    headerColor: '#0C4A2F',
    headerTheme: 'auto',
    headerPosition: 'static',
    showSearch: 'yes',
    showLanguageSwitcher: 'yes',
    headerCtaText: 'احجز استشارة',
    headerCtaLink: '#contact',
    footerStyle: 'default',
    footerColor: '#0C4A2F',
    footerLayout: '3-columns',
    showFooterCta: 'yes',
    footerMenu1: '',
    footerMenu2: '',
    footerMenu3: '',
    footerMenu4: '',
    showBlogSidebar: 'yes',
    sidebarPosition: 'right'
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
  document.getElementById('logoLight').value = mergedSettings.logoLight;
  document.getElementById('logoDark').value = mergedSettings.logoDark;
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

  // Layout Settings
  document.getElementById('headerStyle').value = mergedSettings.headerStyle;
  document.getElementById('headerColor').value = mergedSettings.headerColor;
  document.getElementById('footerStyle').value = mergedSettings.footerStyle;
  document.getElementById('footerColor').value = mergedSettings.footerColor;
  document.getElementById('showBlogSidebar').value = mergedSettings.showBlogSidebar;
  document.getElementById('sidebarPosition').value = mergedSettings.sidebarPosition;

  // Header Settings
  document.getElementById('headerTheme').value = mergedSettings.headerTheme;
  document.getElementById('headerPosition').value = mergedSettings.headerPosition;
  document.getElementById('showSearch').value = mergedSettings.showSearch;
  document.getElementById('showLanguageSwitcher').value = mergedSettings.showLanguageSwitcher;
  document.getElementById('headerCtaText').value = mergedSettings.headerCtaText;
  document.getElementById('headerCtaLink').value = mergedSettings.headerCtaLink;

  // Footer Settings
  const footerLayoutEl = document.getElementById('footerLayout');
  const showFooterCtaEl = document.getElementById('showFooterCta');
  if (footerLayoutEl) footerLayoutEl.value = mergedSettings.footerLayout;
  if (showFooterCtaEl) showFooterCtaEl.value = mergedSettings.showFooterCta;

  // Load menus into footer selects
  loadMenusIntoFooterSelects();

  // Set selected menus
  const footerMenu1El = document.getElementById('footerMenu1');
  const footerMenu2El = document.getElementById('footerMenu2');
  const footerMenu3El = document.getElementById('footerMenu3');
  const footerMenu4El = document.getElementById('footerMenu4');
  if (footerMenu1El) footerMenu1El.value = mergedSettings.footerMenu1;
  if (footerMenu2El) footerMenu2El.value = mergedSettings.footerMenu2;
  if (footerMenu3El) footerMenu3El.value = mergedSettings.footerMenu3;
  if (footerMenu4El) footerMenu4El.value = mergedSettings.footerMenu4;
}

function saveSettings() {
  const settings = {
    siteName: document.getElementById('siteName').value,
    siteNameEn: document.getElementById('siteNameEn').value,
    siteDescription: document.getElementById('siteDescription').value,
    logo: document.getElementById('logoUrl').value,
    logoLight: document.getElementById('logoLight').value,
    logoDark: document.getElementById('logoDark').value,
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
    footerCopyright: document.getElementById('footerCopyright').value,
    headerStyle: document.getElementById('headerStyle').value,
    headerColor: document.getElementById('headerColor').value,
    headerTheme: document.getElementById('headerTheme').value,
    headerPosition: document.getElementById('headerPosition').value,
    showSearch: document.getElementById('showSearch').value,
    showLanguageSwitcher: document.getElementById('showLanguageSwitcher').value,
    headerCtaText: document.getElementById('headerCtaText').value,
    headerCtaLink: document.getElementById('headerCtaLink').value,
    footerStyle: document.getElementById('footerStyle').value,
    footerColor: document.getElementById('footerColor').value,
    footerLayout: document.getElementById('footerLayout')?.value || '3-columns',
    showFooterCta: document.getElementById('showFooterCta')?.value || 'yes',
    footerMenu1: document.getElementById('footerMenu1')?.value || '',
    footerMenu2: document.getElementById('footerMenu2')?.value || '',
    footerMenu3: document.getElementById('footerMenu3')?.value || '',
    footerMenu4: document.getElementById('footerMenu4')?.value || '',
    showBlogSidebar: document.getElementById('showBlogSidebar').value,
    sidebarPosition: document.getElementById('sidebarPosition').value
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

// ==========================================
// COMPONENTS LIBRARY MANAGEMENT
// ==========================================

function initComponentsLibrary() {
  // Initialize component tabs
  const componentTabs = document.querySelectorAll('.component-tab');
  const componentTabContents = document.querySelectorAll('.component-tab-content');

  componentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;

      // Update active tab
      componentTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show corresponding content
      componentTabContents.forEach(content => {
        if (content.dataset.content === tabName) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });

      // Load components for this tab
      loadComponents(tabName);
    });
  });

  // Create sample components for demonstration
  createSampleComponents();

  // Load hero components by default
  loadComponents('hero');
}

function loadComponents(type) {
  const gridId = `${type}ComponentsGrid`;
  const grid = document.getElementById(gridId);

  if (!grid) return;

  // Load components from localStorage
  const components = JSON.parse(localStorage.getItem(`techksa_components_${type}`) || '[]');

  if (components.length === 0) {
    grid.innerHTML = `
      <div class="component-empty">
        <i class="fas fa-cube"></i>
        <h3>لا توجد عناصر حتى الآن</h3>
        <p>ابدأ بإضافة عنصر جديد باستخدام الزر أعلاه</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = components.map(component => `
    <div class="component-card">
      <div class="component-card-header">
        <div>
          <h3 class="component-card-title">${component.title}</h3>
          <span class="component-card-type">${getComponentTypeName(type)}</span>
        </div>
      </div>
      <div class="component-card-preview">
        ${component.preview ? `<img src="${component.preview}" alt="${component.title}">` : `<i class="fas fa-${getComponentIcon(type)}"></i>`}
      </div>
      <p class="component-card-description">${component.description || 'لا يوجد وصف'}</p>
      <div class="component-card-actions">
        <button class="btn btn-primary" onclick="editComponent('${type}', '${component.id}')">
          <i class="fas fa-edit"></i> تعديل
        </button>
        <button class="btn btn-danger" onclick="deleteComponent('${type}', '${component.id}')">
          <i class="fas fa-trash"></i> حذف
        </button>
      </div>
    </div>
  `).join('');
}

function getComponentTypeName(type) {
  const names = {
    // Original (8)
    hero: 'Hero Section',
    cta: 'Call to Action',
    features: 'Features Grid',
    testimonials: 'Testimonials',
    stats: 'Statistics',
    contact: 'Contact Form',
    team: 'Team Members',
    pricing: 'Pricing Table',

    // Section Types (15)
    about: 'About Section',
    services: 'Services Grid',
    portfolio: 'Portfolio Grid',
    blog: 'Blog Grid',
    faq: 'FAQ - Accordion',
    timeline: 'Timeline',
    counter: 'Animated Counter',
    video: 'Video Section',
    gallery: 'Image Gallery',
    map: 'Map Section',
    newsletter: 'Newsletter Signup',
    brands: 'Brands/Partners',
    process: 'Process Steps',
    comparison: 'Comparison Table',
    accordion: 'Content Accordion',

    // Content Types (15)
    textblock: 'Text Block',
    image: 'Image',
    iconbox: 'Icon Box',
    alert: 'Alert Box',
    quote: 'Quote Block',
    divider: 'Divider',
    spacer: 'Spacer',
    buttons: 'Button Group',
    social: 'Social Share',
    progress: 'Progress Bar',
    tabs: 'Tabs',
    cards: 'Cards Grid',
    list: 'Styled List',
    table: 'Data Table',
    code: 'Code Block'
  };
  return names[type] || type;
}

function getComponentIcon(type) {
  const icons = {
    // Original (8)
    hero: 'image',
    cta: 'bullhorn',
    features: 'th',
    testimonials: 'comments',
    stats: 'chart-bar',
    contact: 'envelope',
    team: 'users',
    pricing: 'tags',

    // Section Types (15)
    about: 'info-circle',
    services: 'briefcase',
    portfolio: 'folder-open',
    blog: 'blog',
    faq: 'question-circle',
    timeline: 'stream',
    counter: 'tachometer-alt',
    video: 'play-circle',
    gallery: 'images',
    map: 'map-marker-alt',
    newsletter: 'paper-plane',
    brands: 'handshake',
    process: 'tasks',
    comparison: 'balance-scale',
    accordion: 'list-alt',

    // Content Types (15)
    textblock: 'align-left',
    image: 'file-image',
    iconbox: 'cube',
    alert: 'exclamation-triangle',
    quote: 'quote-right',
    divider: 'minus',
    spacer: 'arrows-alt-v',
    buttons: 'th-large',
    social: 'share-alt',
    progress: 'tasks',
    tabs: 'folder',
    cards: 'id-card',
    list: 'list-ul',
    table: 'table',
    code: 'code'
  };
  return icons[type] || 'cube';
}

function openComponentModal(type) {
  showToast('جاري تطوير محرر المكونات... ستكون متاحة قريباً!', 'success');
  // TODO: Implement component editor modal
}

function editComponent(type, id) {
  showToast('جاري تطوير محرر المكونات... ستكون متاحة قريباً!', 'success');
  // TODO: Implement component editor
}

function deleteComponent(type, id) {
  if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;

  const components = JSON.parse(localStorage.getItem(`techksa_components_${type}`) || '[]');
  const updated = components.filter(c => c.id !== id);

  localStorage.setItem(`techksa_components_${type}`, JSON.stringify(updated));
  loadComponents(type);
  showToast('تم حذف العنصر بنجاح!', 'success');
}

// Create sample components for demonstration
function createSampleComponents() {
  const sampleHero = [
    {
      id: 'hero-1',
      title: 'Hero Section - Modern',
      description: 'قسم بطل حديث مع خلفية متدرجة وعناصر تفاعلية',
      preview: null,
      content: {
        title: 'عنوان رئيسي جذاب',
        subtitle: 'نص فرعي يوضح الخدمة أو المنتج',
        buttonText: 'ابدأ الآن',
        buttonLink: '#',
        backgroundImage: '',
        backgroundColor: 'linear-gradient(135deg, #0C4A2F 0%, #10B981 100%)'
      }
    }
  ];

  const sampleCTA = [
    {
      id: 'cta-1',
      title: 'CTA - اتصل بنا الآن',
      description: 'قسم دعوة لاتخاذ إجراء مع زر بارز',
      preview: null,
      content: {
        title: 'هل لديك مشروع؟',
        description: 'تواصل معنا الآن واحصل على استشارة مجانية',
        buttonText: 'تواصل معنا',
        buttonLink: '#contact'
      }
    }
  ];

  const sampleContact = [
    {
      id: 'contact-1',
      title: 'Contact Form - Standard',
      description: 'نموذج تواصل قياسي مع الحقول الأساسية',
      preview: null,
      content: {
        title: 'تواصل معنا',
        subtitle: 'نسعد بالرد على استفساراتكم',
        fields: ['name', 'email', 'phone', 'message'],
        submitText: 'إرسال'
      }
    }
  ];

  const sampleTeam = [
    {
      id: 'team-1',
      title: 'Team Section - Grid',
      description: 'عرض أعضاء الفريق في شبكة منظمة',
      preview: null,
      content: {
        title: 'فريق العمل',
        subtitle: 'تعرف على خبرائنا',
        members: []
      }
    }
  ];

  const samplePricing = [
    {
      id: 'pricing-1',
      title: 'Pricing Table - 3 Columns',
      description: 'جدول أسعار بثلاثة خطط',
      preview: null,
      content: {
        title: 'خطط الأسعار',
        subtitle: 'اختر الباقة المناسبة لك',
        plans: []
      }
    }
  ];

  // Save samples if nothing exists
  if (!localStorage.getItem('techksa_components_hero')) {
    localStorage.setItem('techksa_components_hero', JSON.stringify(sampleHero));
  }
  if (!localStorage.getItem('techksa_components_cta')) {
    localStorage.setItem('techksa_components_cta', JSON.stringify(sampleCTA));
  }
  if (!localStorage.getItem('techksa_components_contact')) {
    localStorage.setItem('techksa_components_contact', JSON.stringify(sampleContact));
  }
  if (!localStorage.getItem('techksa_components_team')) {
    localStorage.setItem('techksa_components_team', JSON.stringify(sampleTeam));
  }
  if (!localStorage.getItem('techksa_components_pricing')) {
    localStorage.setItem('techksa_components_pricing', JSON.stringify(samplePricing));
  }
}

// ==========================================
// PAGE BUILDER FUNCTIONS
// ==========================================

let pageLayout = [];

function initPageBuilder() {
  // Build dynamic sidebar with all component types
  buildDynamicSidebar();

  // Load saved page layout
  loadPageLayout();

  // Setup drag and drop
  setupDragAndDrop();
}

function buildDynamicSidebar() {
  const sidebar = document.querySelector('.component-categories');
  if (!sidebar || typeof COMPONENT_TYPES === 'undefined') {
    console.warn('COMPONENT_TYPES not loaded or sidebar not found');
    return;
  }

  // Clear existing content
  sidebar.innerHTML = '';

  // Group components by category
  const sections = {};
  const contents = {};

  Object.entries(COMPONENT_TYPES).forEach(([type, data]) => {
    if (data.category === 'sections') {
      sections[type] = data;
    } else if (data.category === 'content') {
      contents[type] = data;
    }
  });

  // Add Sections category
  sidebar.innerHTML += `
    <div class="category-group">
      <h3 style="color: var(--primary); padding: 1rem; margin: 0; border-bottom: 2px solid var(--primary); font-size: 1rem;">
        <i class="fas fa-layer-group"></i> قوالب الأقسام (Sections)
      </h3>
  `;

  Object.entries(sections).forEach(([type, data]) => {
    sidebar.innerHTML += `
      <div class="component-category">
        <h4 class="category-title">
          <i class="fas fa-${data.icon}"></i>
          ${data.name}
        </h4>
        <div id="${type}Components" class="draggable-components">
          <div class="draggable-component" draggable="true" data-type="${type}">
            <div style="padding: 0.75rem;">
              <h5 style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">${data.name}</h5>
              <p style="margin: 0; font-size: 0.75rem; color: var(--text-secondary);">${data.description}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  sidebar.innerHTML += `</div>`;

  // Add Content category
  sidebar.innerHTML += `
    <div class="category-group" style="margin-top: 1rem;">
      <h3 style="color: var(--secondary); padding: 1rem; margin: 0; border-bottom: 2px solid var(--secondary); font-size: 1rem;">
        <i class="fas fa-puzzle-piece"></i> عناصر المحتوى (Content)
      </h3>
  `;

  Object.entries(contents).forEach(([type, data]) => {
    sidebar.innerHTML += `
      <div class="component-category">
        <h4 class="category-title">
          <i class="fas fa-${data.icon}"></i>
          ${data.name}
        </h4>
        <div id="${type}Components" class="draggable-components">
          <div class="draggable-component" draggable="true" data-type="${type}">
            <div style="padding: 0.75rem;">
              <h5 style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">${data.name}</h5>
              <p style="margin: 0; font-size: 0.75rem; color: var(--text-secondary);">${data.description}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  sidebar.innerHTML += `</div>`;
}

function loadPageComponents(type, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const components = JSON.parse(localStorage.getItem(`techksa_components_${type}`) || '[]');

  if (components.length === 0) {
    container.innerHTML = '<p style="font-size: 0.8rem; color: var(--text-muted); padding: 0.5rem;">لا توجد عناصر</p>';
    return;
  }

  container.innerHTML = components.map(component => `
    <div class="draggable-component" draggable="true" data-component='${JSON.stringify(component)}' data-type="${type}">
      <h5>${component.title}</h5>
      <p>${component.description || ''}</p>
    </div>
  `).join('');
}

function loadPageLayout() {
  const saved = localStorage.getItem('techksa_page_layout');
  pageLayout = saved ? JSON.parse(saved) : [];
  renderPageCanvas();
}

function renderPageCanvas() {
  const canvas = document.getElementById('pageCanvas');
  if (!canvas) return;

  if (pageLayout.length === 0) {
    canvas.innerHTML = `
      <div class="canvas-empty">
        <i class="fas fa-plus-circle"></i>
        <h3>ابدأ بإضافة عناصر إلى الصفحة</h3>
        <p>اسحب العناصر من الشريط الجانبي وأفلتها هنا</p>
      </div>
    `;
    return;
  }

  canvas.innerHTML = pageLayout.map((section, index) => `
    <div class="page-section" draggable="true" data-index="${index}">
      <div class="section-header">
        <div class="section-info">
          <span class="drag-handle">
            <i class="fas fa-grip-vertical"></i>
          </span>
          <div class="section-icon">
            <i class="fas fa-${getComponentIcon(section.type)}"></i>
          </div>
          <div class="section-title-group">
            <h4>${section.title}</h4>
            <p>${getComponentTypeName(section.type)}</p>
          </div>
        </div>
        <div class="section-actions">
          <button class="btn btn-secondary" onclick="moveSection(${index}, 'up')" ${index === 0 ? 'disabled' : ''} title="نقل لأعلى">
            <i class="fas fa-arrow-up"></i>
          </button>
          <button class="btn btn-secondary" onclick="moveSection(${index}, 'down')" ${index === pageLayout.length - 1 ? 'disabled' : ''} title="نقل لأسفل">
            <i class="fas fa-arrow-down"></i>
          </button>
          <button class="btn btn-secondary" onclick="duplicateSection(${index})" title="تكرار العنصر">
            <i class="fas fa-copy"></i>
          </button>
          <button class="btn btn-primary" onclick="editSection(${index})" title="تعديل">
            <i class="fas fa-edit"></i> تعديل
          </button>
          <button class="btn btn-danger" onclick="deleteSection(${index})" title="حذف">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="section-content">
        <div class="section-content-preview">
          ${renderSectionPreview(section)}
        </div>
      </div>
    </div>
  `).join('');
}

// ====================================
// DYNAMIC SECTION PREVIEW
// ====================================

function renderSectionPreview(section) {
  const content = section.content || {};
  const componentType = section.type;

  // Check if component type exists in COMPONENT_TYPES
  if (typeof COMPONENT_TYPES === 'undefined' || !COMPONENT_TYPES[componentType]) {
    return `<strong>نوع العنصر:</strong> ${componentType}<br><em style="color: var(--text-muted);">لا توجد بيانات معاينة</em>`;
  }

  const componentData = COMPONENT_TYPES[componentType];
  let preview = '';

  // Show title if exists
  if (content.title) {
    preview += `<strong>العنوان:</strong> ${content.title}<br>`;
  }

  // Show subtitle/description if exists
  if (content.subtitle) {
    preview += `<strong>النص الفرعي:</strong> ${content.subtitle.substring(0, 60)}${content.subtitle.length > 60 ? '...' : ''}<br>`;
  } else if (content.description) {
    preview += `<strong>الوصف:</strong> ${content.description.substring(0, 60)}${content.description.length > 60 ? '...' : ''}<br>`;
  }

  // Show button if exists
  if (content.buttonText) {
    preview += `<strong>زر:</strong> ${content.buttonText}<br>`;
  }

  // Show items count if component has items
  if (componentData.hasItems) {
    const itemsCount = content.items?.length || 0;
    preview += `<strong>العناصر:</strong> ${itemsCount} ${itemsCount > 0 ? '✅' : '⚠️'}<br>`;
  }

  // Show specific fields based on component type
  if (content.columns) {
    preview += `<strong>الأعمدة:</strong> ${content.columns}<br>`;
  }

  if (content.image) {
    preview += `<strong>الصورة:</strong> ✅<br>`;
  }

  if (content.video) {
    preview += `<strong>الفيديو:</strong> ✅<br>`;
  }

  if (content.code) {
    preview += `<strong>كود:</strong> ${content.language || 'text'}<br>`;
  }

  // If no preview content, show default
  if (preview === '') {
    preview = `<em style="color: var(--text-muted);">لم يتم إضافة محتوى بعد</em>`;
  }

  return preview;
}

function setupDragAndDrop() {
  const canvas = document.getElementById('pageCanvas');
  if (!canvas) return;

  // Allow drop on canvas
  canvas.addEventListener('dragover', function(e) {
    e.preventDefault();
    canvas.style.borderColor = 'var(--saudi-green)';
    canvas.style.backgroundColor = 'rgba(12, 74, 47, 0.05)';
  });

  canvas.addEventListener('dragleave', function(e) {
    if (e.target === canvas) {
      canvas.style.borderColor = '';
      canvas.style.backgroundColor = '';
    }
  });

  canvas.addEventListener('drop', function(e) {
    e.preventDefault();
    canvas.style.borderColor = '';
    canvas.style.backgroundColor = '';

    const componentData = e.dataTransfer.getData('component');
    if (componentData) {
      const component = JSON.parse(componentData);
      addSectionToPage(component);
    }
  });

  // Make components draggable
  document.addEventListener('dragstart', function(e) {
    if (e.target.classList.contains('draggable-component')) {
      const componentData = e.target.getAttribute('data-component');
      const type = e.target.getAttribute('data-type');
      e.dataTransfer.setData('component', componentData);
      e.dataTransfer.setData('type', type);
    }
  });
}

function addSectionToPage(component) {
  const newSection = {
    id: Date.now().toString(),
    type: component.type || 'hero',
    title: component.title,
    description: component.description,
    content: component.content || {}
  };

  pageLayout.push(newSection);
  renderPageCanvas();
  showToast('تم إضافة العنصر إلى الصفحة!', 'success');
}

function moveSection(index, direction) {
  if (direction === 'up' && index > 0) {
    [pageLayout[index], pageLayout[index - 1]] = [pageLayout[index - 1], pageLayout[index]];
  } else if (direction === 'down' && index < pageLayout.length - 1) {
    [pageLayout[index], pageLayout[index + 1]] = [pageLayout[index + 1], pageLayout[index]];
  }
  renderPageCanvas();
}

function duplicateSection(index) {
  const section = pageLayout[index];
  if (!section) return;

  // Deep clone the section
  const duplicatedSection = JSON.parse(JSON.stringify(section));

  // Update title
  duplicatedSection.title = section.title + ' (نسخة)';
  duplicatedSection.id = Date.now().toString();

  // Insert after the original
  pageLayout.splice(index + 1, 0, duplicatedSection);

  renderPageCanvas();
  showToast('تم تكرار العنصر بنجاح!', 'success');
}

// ====================================
// DYNAMIC FORM BUILDER
// ====================================

/**
 * Build dynamic form fields based on component type
 */
function buildDynamicFormFields(componentType, content = {}) {
  if (typeof COMPONENT_TYPES === 'undefined' || !COMPONENT_TYPES[componentType]) {
    console.warn('Component type not found:', componentType);
    return '<p>نوع العنصر غير معروف</p>';
  }

  const componentData = COMPONENT_TYPES[componentType];
  const fields = componentData.fields || [];

  let html = `<div class="dynamic-fields" id="dynamicFields_${componentType}">`;

  fields.forEach(field => {
    // Skip items field (handled separately)
    if (field === 'items') return;

    const fieldId = `field_${componentType}_${field}`;
    const fieldValue = content[field] || '';
    const fieldLabel = getFieldLabel(field);

    html += `
      <div class="form-group">
        <label for="${fieldId}">${fieldLabel}</label>
        ${getFieldInput(fieldId, field, fieldValue, componentType)}
      </div>
    `;
  });

  // Handle items if component has them
  if (componentData.hasItems) {
    html += `
      <div class="form-group">
        <label>العناصر</label>
        <div id="itemsContainer_${componentType}" class="items-container"></div>
        <button type="button" class="btn btn-secondary" onclick="addComponentItem('${componentType}')">
          <i class="fas fa-plus"></i> إضافة عنصر
        </button>
      </div>
    `;
  }

  // Advanced Settings
  const advanced = content.advanced || {};
  html += `
    <div class="form-group" style="margin-top: 2rem;">
      <details>
        <summary style="cursor: pointer; padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md); font-weight: 600; color: var(--saudi-green); user-select: none;">
          <i class="fas fa-cog"></i> إعدادات متقدمة
        </summary>
        <div style="padding: 1rem; border: 1px solid var(--border-color); border-top: none; border-radius: 0 0 var(--radius-md) var(--radius-md); margin-top: 0;">

          <div class="form-group">
            <label>CSS Class مخصص</label>
            <input type="text" id="adv_${componentType}_customClass" class="form-control" value="${advanced.customClass || ''}" placeholder="my-custom-class">
            <small>أضف CSS classes مخصصة لهذا العنصر</small>
          </div>

          <div class="form-group">
            <label>الحركة (Animation)</label>
            <select id="adv_${componentType}_animation" class="form-control">
              <option value="">بدون حركة</option>
              <option value="fade-up" ${advanced.animation === 'fade-up' ? 'selected' : ''}>ظهور من الأسفل</option>
              <option value="fade-down" ${advanced.animation === 'fade-down' ? 'selected' : ''}>ظهور من الأعلى</option>
              <option value="fade-left" ${advanced.animation === 'fade-left' ? 'selected' : ''}>ظهور من اليسار</option>
              <option value="fade-right" ${advanced.animation === 'fade-right' ? 'selected' : ''}>ظهور من اليمين</option>
              <option value="zoom-in" ${advanced.animation === 'zoom-in' ? 'selected' : ''}>تكبير</option>
            </select>
          </div>

          <div class="form-group">
            <label>الخلفية</label>
            <input type="text" id="adv_${componentType}_bgColor" class="form-control" value="${advanced.bgColor || ''}" placeholder="#ffffff أو transparent">
          </div>

          <div class="form-group">
            <label>المسافة العلوية (px)</label>
            <input type="number" id="adv_${componentType}_marginTop" class="form-control" value="${advanced.marginTop || ''}" min="0" max="200">
          </div>

          <div class="form-group">
            <label>المسافة السفلية (px)</label>
            <input type="number" id="adv_${componentType}_marginBottom" class="form-control" value="${advanced.marginBottom || ''}" min="0" max="200">
          </div>

        </div>
      </details>
    </div>
  `;

  html += '</div>';
  return html;
}

/**
 * Get field label in Arabic
 */
function getFieldLabel(field) {
  const labels = {
    title: 'العنوان',
    subtitle: 'العنوان الفرعي',
    description: 'الوصف',
    text: 'النص',
    content: 'المحتوى',
    buttonText: 'نص الزر',
    buttonLink: 'رابط الزر',
    buttonStyle: 'نمط الزر',
    backgroundImage: 'صورة الخلفية',
    backgroundColor: 'لون الخلفية',
    overlay: 'شفافية الخلفية',
    image: 'الصورة',
    imageAlt: 'وصف الصورة',
    icon: 'الأيقونة',
    columns: 'عدد الأعمدة',
    alignment: 'المحاذاة',
    video: 'رابط الفيديو',
    videoThumbnail: 'صورة معاينة الفيديو',
    height: 'الارتفاع',
    width: 'العرض',
    code: 'الكود',
    language: 'اللغة',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    message: 'الرسالة',
    latitude: 'خط العرض',
    longitude: 'خط الطول',
    zoom: 'التكبير',
    items: 'العناصر',
    layout: 'التخطيط',
    animation: 'الحركة',
    spacing: 'المسافات',
    borderColor: 'لون الحدود',
    borderWidth: 'عرض الحدود',
    borderRadius: 'انحناء الحدود',
    shadow: 'الظل'
  };
  return labels[field] || field;
}

/**
 * Get appropriate input field based on field type
 */
function getFieldInput(fieldId, fieldName, fieldValue, componentType) {
  // Text areas for long content
  if (['description', 'text', 'content', 'message', 'code'].includes(fieldName)) {
    return `<textarea id="${fieldId}" class="form-control" rows="4">${fieldValue}</textarea>`;
  }

  // Color pickers
  if (fieldName.includes('Color') || fieldName === 'backgroundColor' || fieldName === 'borderColor') {
    return `
      <div style="display: flex; gap: 0.5rem;">
        <input type="color" id="${fieldId}_picker" value="${fieldValue.startsWith('#') ? fieldValue : '#10B981'}" style="width: 60px; height: 40px;">
        <input type="text" id="${fieldId}" class="form-control" value="${fieldValue}" placeholder="#10B981 أو gradient">
      </div>
    `;
  }

  // Number inputs
  if (['columns', 'rating', 'zoom', 'overlay', 'borderWidth', 'borderRadius', 'height', 'width', 'spacing'].includes(fieldName)) {
    const max = fieldName === 'columns' ? 12 : (fieldName === 'rating' ? 5 : (fieldName === 'overlay' ? 1 : 1000));
    const step = ['overlay', 'zoom'].includes(fieldName) ? '0.1' : '1';
    return `<input type="number" id="${fieldId}" class="form-control" value="${fieldValue}" min="0" max="${max}" step="${step}">`;
  }

  // Select for button style
  if (fieldName === 'buttonStyle') {
    return `
      <select id="${fieldId}" class="form-control">
        <option value="primary" ${fieldValue === 'primary' ? 'selected' : ''}>أساسي</option>
        <option value="secondary" ${fieldValue === 'secondary' ? 'selected' : ''}>ثانوي</option>
        <option value="outline" ${fieldValue === 'outline' ? 'selected' : ''}>حدود</option>
      </select>
    `;
  }

  // Select for alignment
  if (fieldName === 'alignment') {
    return `
      <select id="${fieldId}" class="form-control">
        <option value="right" ${fieldValue === 'right' ? 'selected' : ''}>يمين</option>
        <option value="center" ${fieldValue === 'center' ? 'selected' : ''}>وسط</option>
        <option value="left" ${fieldValue === 'left' ? 'selected' : ''}>يسار</option>
      </select>
    `;
  }

  // Select for layout
  if (fieldName === 'layout') {
    return `
      <select id="${fieldId}" class="form-control">
        <option value="grid" ${fieldValue === 'grid' ? 'selected' : ''}>شبكة</option>
        <option value="list" ${fieldValue === 'list' ? 'selected' : ''}>قائمة</option>
        <option value="carousel" ${fieldValue === 'carousel' ? 'selected' : ''}>شريط متحرك</option>
      </select>
    `;
  }

  // Select for language (code blocks)
  if (fieldName === 'language') {
    return `
      <select id="${fieldId}" class="form-control">
        <option value="javascript" ${fieldValue === 'javascript' ? 'selected' : ''}>JavaScript</option>
        <option value="html" ${fieldValue === 'html' ? 'selected' : ''}>HTML</option>
        <option value="css" ${fieldValue === 'css' ? 'selected' : ''}>CSS</option>
        <option value="php" ${fieldValue === 'php' ? 'selected' : ''}>PHP</option>
        <option value="python" ${fieldValue === 'python' ? 'selected' : ''}>Python</option>
      </select>
    `;
  }

  // Default text input
  return `<input type="text" id="${fieldId}" class="form-control" value="${fieldValue}">`;
}

/**
 * Collect form data dynamically
 */
function collectDynamicFormData(componentType) {
  if (typeof COMPONENT_TYPES === 'undefined' || !COMPONENT_TYPES[componentType]) {
    return {};
  }

  const componentData = COMPONENT_TYPES[componentType];
  const fields = componentData.fields || [];
  const content = {};

  fields.forEach(field => {
    if (field === 'items') {
      // Items handled separately
      return;
    }

    const fieldId = `field_${componentType}_${field}`;
    const element = document.getElementById(fieldId);

    if (element) {
      content[field] = element.value;
    }
  });

  // Handle items if component has them
  if (componentData.hasItems) {
    content.items = window[`current_${componentType}_items`] || [];
  }

  // Collect advanced settings
  const advanced = {};
  const advFields = ['customClass', 'animation', 'bgColor', 'marginTop', 'marginBottom'];

  advFields.forEach(field => {
    const fieldId = `adv_${componentType}_${field}`;
    const element = document.getElementById(fieldId);
    if (element && element.value) {
      advanced[field] = element.value;
    }
  });

  // Only add advanced if it has values
  if (Object.keys(advanced).length > 0) {
    content.advanced = advanced;
  }

  return content;
}

// ====================================
// UPDATED EDIT SECTION (DYNAMIC)
// ====================================

function editSection(index) {
  const section = pageLayout[index];
  if (!section) return;

  // Set current section index and type
  document.getElementById('sectionIndex').value = index;
  document.getElementById('sectionType').value = section.type;

  // Set basic info
  document.getElementById('sectionTitle').value = section.title;
  document.getElementById('sectionDescription').value = section.description || '';

  // Get dynamic fields container
  const fieldsContainer = document.getElementById('dynamicFieldsContainer');
  if (!fieldsContainer) {
    console.error('Dynamic fields container not found');
    return;
  }

  // Build and insert dynamic form fields
  const content = section.content || {};
  fieldsContainer.innerHTML = buildDynamicFormFields(section.type, content);

  // If component has items, load them
  if (typeof COMPONENT_TYPES !== 'undefined' && COMPONENT_TYPES[section.type]?.hasItems) {
    window[`current_${section.type}_items`] = content.items || [];
    renderComponentItems(section.type);
  }

  // Update modal title
  document.getElementById('sectionModalTitle').textContent = `تحرير ${section.title}`;

  // Open modal
  document.getElementById('sectionEditorModal').classList.add('active');
}

function closeSectionEditor() {
  document.getElementById('sectionEditorModal').classList.remove('active');
  document.getElementById('sectionForm').reset();
}

// ====================================
// DYNAMIC ITEMS MANAGEMENT
// ====================================

/**
 * Render component items dynamically
 */
function renderComponentItems(componentType) {
  if (typeof COMPONENT_TYPES === 'undefined' || !COMPONENT_TYPES[componentType]) {
    return;
  }

  const componentData = COMPONENT_TYPES[componentType];
  if (!componentData.hasItems) return;

  const container = document.getElementById(`itemsContainer_${componentType}`);
  if (!container) return;

  const items = window[`current_${componentType}_items`] || [];

  if (items.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">لا توجد عناصر</p>';
    return;
  }

  container.innerHTML = items.map((item, index) => {
    const previewText = item.title || item.name || item.text || 'عنصر';
    return `
      <div class="item-card">
        <div class="item-info">
          <strong>${previewText}</strong>
          ${item.description ? `<p>${item.description.substring(0, 50)}...</p>` : ''}
        </div>
        <div class="item-actions">
          <button type="button" class="btn-icon" onclick="editComponentItem('${componentType}', ${index})" title="تعديل">
            <i class="fas fa-edit"></i>
          </button>
          <button type="button" class="btn-icon" onclick="deleteComponentItem('${componentType}', ${index})" title="حذف">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Add new component item
 */
function addComponentItem(componentType) {
  if (typeof COMPONENT_TYPES === 'undefined' || !COMPONENT_TYPES[componentType]) {
    return;
  }

  const componentData = COMPONENT_TYPES[componentType];
  if (!componentData.hasItems || !componentData.itemFields) return;

  // Create new item with empty values
  const newItem = {};
  componentData.itemFields.forEach(field => {
    newItem[field] = '';
  });

  // Initialize array if doesn't exist
  if (!window[`current_${componentType}_items`]) {
    window[`current_${componentType}_items`] = [];
  }

  // Add item and open editor
  const items = window[`current_${componentType}_items`];
  items.push(newItem);
  editComponentItem(componentType, items.length - 1);
}

/**
 * Edit component item
 */
function editComponentItem(componentType, itemIndex) {
  if (typeof COMPONENT_TYPES === 'undefined' || !COMPONENT_TYPES[componentType]) {
    return;
  }

  const componentData = COMPONENT_TYPES[componentType];
  if (!componentData.hasItems) return;

  const items = window[`current_${componentType}_items`] || [];
  const item = items[itemIndex];
  if (!item) return;

  // Build item editor form
  let formHTML = `<div class="item-editor-form">`;

  componentData.itemFields.forEach(field => {
    const fieldLabel = getFieldLabel(field);
    const fieldValue = item[field] || '';
    const fieldId = `itemField_${field}_${itemIndex}`;

    if (['description', 'text', 'message'].includes(field)) {
      formHTML += `
        <div class="form-group">
          <label for="${fieldId}">${fieldLabel}</label>
          <textarea id="${fieldId}" class="form-control" rows="3">${fieldValue}</textarea>
        </div>
      `;
    } else if (field === 'rating') {
      formHTML += `
        <div class="form-group">
          <label for="${fieldId}">${fieldLabel}</label>
          <input type="number" id="${fieldId}" class="form-control" value="${fieldValue}" min="0" max="5" step="0.5">
        </div>
      `;
    } else {
      formHTML += `
        <div class="form-group">
          <label for="${fieldId}">${fieldLabel}</label>
          <input type="text" id="${fieldId}" class="form-control" value="${fieldValue}">
        </div>
      `;
    }
  });

  formHTML += `
    <div class="form-actions" style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1rem;">
      <button type="button" class="btn btn-secondary" onclick="cancelItemEdit('${componentType}')">إلغاء</button>
      <button type="button" class="btn btn-primary" onclick="saveComponentItem('${componentType}', ${itemIndex})">حفظ</button>
    </div>
  </div>`;

  // Show in modal or inline
  const container = document.getElementById(`itemsContainer_${componentType}`);
  if (container) {
    container.innerHTML = formHTML;
  }
}

/**
 * Save component item
 */
function saveComponentItem(componentType, itemIndex) {
  if (typeof COMPONENT_TYPES === 'undefined' || !COMPONENT_TYPES[componentType]) {
    return;
  }

  const componentData = COMPONENT_TYPES[componentType];
  const items = window[`current_${componentType}_items`] || [];
  const item = items[itemIndex];
  if (!item) return;

  // Collect field values
  componentData.itemFields.forEach(field => {
    const fieldId = `itemField_${field}_${itemIndex}`;
    const element = document.getElementById(fieldId);
    if (element) {
      item[field] = element.value;
    }
  });

  // Re-render items list
  renderComponentItems(componentType);
  showToast('تم حفظ العنصر بنجاح!', 'success');
}

/**
 * Cancel item edit
 */
function cancelItemEdit(componentType) {
  renderComponentItems(componentType);
}

/**
 * Delete component item
 */
function deleteComponentItem(componentType, itemIndex) {
  if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;

  const items = window[`current_${componentType}_items`] || [];
  items.splice(itemIndex, 1);
  renderComponentItems(componentType);
  showToast('تم حذف العنصر!', 'success');
}

// ====================================
// UPDATED SAVE SECTION (DYNAMIC)
// ====================================

function saveSectionEdit(event) {
  event.preventDefault();

  const index = parseInt(document.getElementById('sectionIndex').value);
  const type = document.getElementById('sectionType').value;

  // Update basic info
  pageLayout[index].title = document.getElementById('sectionTitle').value;
  pageLayout[index].description = document.getElementById('sectionDescription').value;

  // Collect content dynamically
  const content = collectDynamicFormData(type);

  pageLayout[index].content = content;

  // Re-render canvas
  renderPageCanvas();

  // Close modal
  closeSectionEditor();

  // Show success message
  showToast('تم تحديث العنصر بنجاح!', 'success');
}

function deleteSection(index) {
  if (!confirm('هل أنت متأكد من حذف هذا العنصر من الصفحة؟')) return;

  pageLayout.splice(index, 1);
  renderPageCanvas();
  showToast('تم حذف العنصر من الصفحة!', 'success');
}

function savePageLayout() {
  localStorage.setItem('techksa_page_layout', JSON.stringify(pageLayout));
  showToast('تم حفظ تخطيط الصفحة بنجاح!', 'success');
}

function previewPage() {
  if (pageLayout.length === 0) {
    showToast('لا توجد عناصر في الصفحة للمعاينة!', 'warning');
    return;
  }

  // Generate HTML preview
  let html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>معاينة الصفحة</title>
  <style>
    body { font-family: 'Tajawal', sans-serif; margin: 0; padding: 20px; }
    .section { margin-bottom: 40px; padding: 40px; background: #f5f5f5; border-radius: 8px; }
    .section h2 { color: #0C4A2F; margin-bottom: 16px; }
    .section p { color: #666; line-height: 1.6; }
    .btn { display: inline-block; padding: 12px 24px; background: #0C4A2F; color: white; text-decoration: none; border-radius: 4px; }
  </style>
</head>
<body>
`;

  pageLayout.forEach(section => {
    html += `
  <div class="section">
    <h2>${section.title}</h2>
    <p>${section.description || ''}</p>
    ${section.content.title ? `<h3>${section.content.title}</h3>` : ''}
    ${section.content.subtitle ? `<p>${section.content.subtitle}</p>` : ''}
    ${section.content.buttonText ? `<a href="${section.content.buttonLink || '#'}" class="btn">${section.content.buttonText}</a>` : ''}
  </div>
`;
  });

  html += `
</body>
</html>
`;

  // Open in new window
  const previewWindow = window.open('', 'preview', 'width=800,height=600');
  previewWindow.document.write(html);
  previewWindow.document.close();
}

function publishPage() {
  if (pageLayout.length === 0) {
    showToast('لا توجد عناصر في الصفحة للنشر!', 'warning');
    return;
  }

  // Save before publishing
  savePageLayout();

  showToast('تم نشر الصفحة! يمكن الآن عرضها على الموقع الرئيسي.', 'success');

  // TODO: Generate actual homepage HTML file or integrate with frontend
  console.log('Page published:', pageLayout);
}

// ==========================================
// FEATURES EDITOR FUNCTIONS
// ==========================================

let currentFeatureItems = [];

function addFeatureItem() {
  const item = {
    id: Date.now().toString(),
    icon: 'fa-star',
    title: '',
    description: ''
  };
  currentFeatureItems.push(item);
  renderFeaturesList();
}

function removeFeatureItem(id) {
  currentFeatureItems = currentFeatureItems.filter(item => item.id !== id);
  renderFeaturesList();
}

function renderFeaturesList() {
  const container = document.getElementById('featuresList');
  if (!container) return;

  if (currentFeatureItems.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1rem;">لا توجد ميزات. اضغط "إضافة ميزة" للبدء</p>';
    return;
  }

  container.innerHTML = currentFeatureItems.map((item, index) => `
    <div class="dynamic-item" data-id="${item.id}">
      <div class="dynamic-item-header">
        <h6><i class="fas fa-cube"></i> ميزة ${index + 1}</h6>
        <div class="dynamic-item-actions">
          <button type="button" class="btn btn-danger btn-sm" onclick="removeFeatureItem('${item.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="item-fields">
        <div class="form-group">
          <label>أيقونة FontAwesome</label>
          <input type="text" class="feature-icon" data-id="${item.id}" value="${item.icon}" placeholder="fa-star">
          <small>مثال: fa-star, fa-rocket, fa-check</small>
        </div>
        <div class="form-group">
          <label>عنوان الميزة</label>
          <input type="text" class="feature-title" data-id="${item.id}" value="${item.title}" placeholder="خدمة مميزة">
        </div>
        <div class="form-group">
          <label>وصف الميزة</label>
          <textarea class="feature-description" data-id="${item.id}" rows="2" placeholder="وصف مختصر للميزة">${item.description}</textarea>
        </div>
      </div>
    </div>
  `).join('');
}

function collectFeatureItems() {
  currentFeatureItems.forEach(item => {
    item.icon = document.querySelector(`.feature-icon[data-id="${item.id}"]`)?.value || '';
    item.title = document.querySelector(`.feature-title[data-id="${item.id}"]`)?.value || '';
    item.description = document.querySelector(`.feature-description[data-id="${item.id}"]`)?.value || '';
  });
  return currentFeatureItems;
}

// ==========================================
// TESTIMONIALS EDITOR FUNCTIONS
// ==========================================

let currentTestimonialItems = [];

function addTestimonialItem() {
  const item = {
    id: Date.now().toString(),
    name: '',
    position: '',
    company: '',
    image: '',
    rating: 5,
    text: ''
  };
  currentTestimonialItems.push(item);
  renderTestimonialsList();
}

function removeTestimonialItem(id) {
  currentTestimonialItems = currentTestimonialItems.filter(item => item.id !== id);
  renderTestimonialsList();
}

function renderTestimonialsList() {
  const container = document.getElementById('testimonialsList');
  if (!container) return;

  if (currentTestimonialItems.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1rem;">لا توجد شهادات. اضغط "إضافة شهادة" للبدء</p>';
    return;
  }

  container.innerHTML = currentTestimonialItems.map((item, index) => `
    <div class="dynamic-item" data-id="${item.id}">
      <div class="dynamic-item-header">
        <h6><i class="fas fa-quote-right"></i> شهادة ${index + 1}</h6>
        <div class="dynamic-item-actions">
          <button type="button" class="btn btn-danger btn-sm" onclick="removeTestimonialItem('${item.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="item-fields">
        <div class="form-group">
          <label>اسم العميل</label>
          <input type="text" class="testimonial-name" data-id="${item.id}" value="${item.name}" placeholder="محمد أحمد">
        </div>
        <div class="form-group">
          <label>المنصب</label>
          <input type="text" class="testimonial-position" data-id="${item.id}" value="${item.position}" placeholder="مدير تقني">
        </div>
        <div class="form-group">
          <label>الشركة</label>
          <input type="text" class="testimonial-company" data-id="${item.id}" value="${item.company}" placeholder="شركة ABC">
        </div>
        <div class="form-group">
          <label>رابط الصورة</label>
          <input type="text" class="testimonial-image" data-id="${item.id}" value="${item.image}" placeholder="https://...">
        </div>
        <div class="form-group">
          <label>التقييم (من 5)</label>
          <select class="testimonial-rating" data-id="${item.id}">
            <option value="5" ${item.rating === 5 ? 'selected' : ''}>⭐⭐⭐⭐⭐</option>
            <option value="4" ${item.rating === 4 ? 'selected' : ''}>⭐⭐⭐⭐</option>
            <option value="3" ${item.rating === 3 ? 'selected' : ''}>⭐⭐⭐</option>
            <option value="2" ${item.rating === 2 ? 'selected' : ''}>⭐⭐</option>
            <option value="1" ${item.rating === 1 ? 'selected' : ''}>⭐</option>
          </select>
        </div>
        <div class="form-group">
          <label>نص الشهادة</label>
          <textarea class="testimonial-text" data-id="${item.id}" rows="3" placeholder="رأي العميل عن الخدمة...">${item.text}</textarea>
        </div>
      </div>
    </div>
  `).join('');
}

function collectTestimonialItems() {
  currentTestimonialItems.forEach(item => {
    item.name = document.querySelector(`.testimonial-name[data-id="${item.id}"]`)?.value || '';
    item.position = document.querySelector(`.testimonial-position[data-id="${item.id}"]`)?.value || '';
    item.company = document.querySelector(`.testimonial-company[data-id="${item.id}"]`)?.value || '';
    item.image = document.querySelector(`.testimonial-image[data-id="${item.id}"]`)?.value || '';
    item.rating = parseInt(document.querySelector(`.testimonial-rating[data-id="${item.id}"]`)?.value) || 5;
    item.text = document.querySelector(`.testimonial-text[data-id="${item.id}"]`)?.value || '';
  });
  return currentTestimonialItems;
}

// ==========================================
// STATISTICS EDITOR FUNCTIONS
// ==========================================

let currentStatItems = [];

function addStatItem() {
  const item = {
    id: Date.now().toString(),
    icon: 'fa-users',
    number: '',
    suffix: '+',
    label: ''
  };
  currentStatItems.push(item);
  renderStatsList();
}

function removeStatItem(id) {
  currentStatItems = currentStatItems.filter(item => item.id !== id);
  renderStatsList();
}

function renderStatsList() {
  const container = document.getElementById('statsList');
  if (!container) return;

  if (currentStatItems.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1rem;">لا توجد إحصائيات. اضغط "إضافة إحصائية" للبدء</p>';
    return;
  }

  container.innerHTML = currentStatItems.map((item, index) => `
    <div class="dynamic-item" data-id="${item.id}">
      <div class="dynamic-item-header">
        <h6><i class="fas fa-chart-line"></i> إحصائية ${index + 1}</h6>
        <div class="dynamic-item-actions">
          <button type="button" class="btn btn-danger btn-sm" onclick="removeStatItem('${item.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="item-fields">
        <div class="form-group">
          <label>أيقونة FontAwesome</label>
          <input type="text" class="stat-icon" data-id="${item.id}" value="${item.icon}" placeholder="fa-users">
          <small>مثال: fa-users, fa-project-diagram, fa-trophy</small>
        </div>
        <div class="form-group">
          <label>الرقم</label>
          <input type="text" class="stat-number" data-id="${item.id}" value="${item.number}" placeholder="500">
        </div>
        <div class="form-group">
          <label>لاحقة الرقم</label>
          <input type="text" class="stat-suffix" data-id="${item.id}" value="${item.suffix}" placeholder="+">
          <small>مثال: +, %, K</small>
        </div>
        <div class="form-group">
          <label>التسمية</label>
          <input type="text" class="stat-label" data-id="${item.id}" value="${item.label}" placeholder="عميل سعيد">
        </div>
      </div>
    </div>
  `).join('');
}

function collectStatItems() {
  currentStatItems.forEach(item => {
    item.icon = document.querySelector(`.stat-icon[data-id="${item.id}"]`)?.value || '';
    item.number = document.querySelector(`.stat-number[data-id="${item.id}"]`)?.value || '';
    item.suffix = document.querySelector(`.stat-suffix[data-id="${item.id}"]`)?.value || '';
    item.label = document.querySelector(`.stat-label[data-id="${item.id}"]`)?.value || '';
  });
  return currentStatItems;
}

// ==========================================
// PAGE MANAGEMENT FUNCTIONS
// ==========================================

function openPageModal() {
  document.getElementById('pageId').value = '';
  document.getElementById('pageForm').reset();
  document.getElementById('pageModalTitle').textContent = 'إضافة صفحة جديدة';
  document.getElementById('pageModal').classList.add('active');
}

function closePageModal() {
  document.getElementById('pageModal').classList.remove('active');
  document.getElementById('pageForm').reset();
}

function savePage(event) {
  event.preventDefault();

  const pageId = document.getElementById('pageId').value;
  const pageData = {
    id: pageId || 'page-' + Date.now(),
    title: document.getElementById('pageTitle').value,
    slug: document.getElementById('pageSlug').value || generateSlug(document.getElementById('pageTitle').value),
    metaTitle: document.getElementById('pageMetaTitle').value,
    metaDescription: document.getElementById('pageMetaDescription').value,
    status: document.getElementById('pageStatus').value,
    date: new Date().toISOString().split('T')[0],
    layout: []
  };

  if (pageId) {
    // Update existing page
    const index = pagesManager.pages.findIndex(p => p.id === pageId);
    if (index !== -1) {
      pagesManager.pages[index] = { ...pagesManager.pages[index], ...pageData };
    }
  } else {
    // Add new page
    pagesManager.pages.push(pageData);
  }

  pagesManager.savePages();
  closePageModal();
  showToast('تم حفظ الصفحة بنجاح!', 'success');
}

function openPageBuilder() {
  const pageId = document.getElementById('pageId').value;
  if (pageId) {
    // Save first then open builder
    savePage(event);
    setTimeout(() => {
      pagesManager.openPageBuilder(pageId);
    }, 100);
  } else {
    showToast('يجب حفظ الصفحة أولاً!', 'warning');
  }
}

function selectPage() {
  if (!pagesManager || pagesManager.pages.length === 0) {
    showToast('لا توجد صفحات! أضف صفحة جديدة أولاً من قسم الصفحات.', 'warning');
    return;
  }

  const pages = pagesManager.pages;
  const options = pages.map((p, i) => `${i + 1}. ${p.title}`).join('\n');
  const selection = prompt(`اختر رقم الصفحة:\n\n${options}`);

  if (selection) {
    const index = parseInt(selection) - 1;
    if (index >= 0 && index < pages.length) {
      pagesManager.openPageBuilder(pages[index].id);
    }
  }
}

// ==========================================
// MENU MANAGEMENT FUNCTIONS
// ==========================================

function openMenuModal() {
  if (!menusManager) return;

  document.getElementById('menuId').value = '';
  document.getElementById('menuForm').reset();
  document.getElementById('menuModalTitle').textContent = 'إضافة قائمة جديدة';

  menusManager.currentMenuItems = [];
  menusManager.loadAvailablePages();
  menusManager.renderMenuItems();

  document.getElementById('menuModal').classList.add('active');
}

function closeMenuModal() {
  document.getElementById('menuModal').classList.remove('active');
  document.getElementById('menuForm').reset();
}

function saveMenu(event) {
  event.preventDefault();

  if (!menusManager) return;

  const menuId = document.getElementById('menuId').value;
  const menuData = {
    id: menuId || 'menu-' + Date.now(),
    name: document.getElementById('menuName').value,
    location: document.getElementById('menuLocation').value,
    date: new Date().toISOString().split('T')[0],
    items: menusManager.currentMenuItems
  };

  if (menuId) {
    // Update existing menu
    const index = menusManager.menus.findIndex(m => m.id === menuId);
    if (index !== -1) {
      menusManager.menus[index] = { ...menusManager.menus[index], ...menuData };
    }
  } else {
    // Add new menu
    menusManager.menus.push(menuData);
  }

  menusManager.saveMenus();
  closeMenuModal();
  showToast('تم حفظ القائمة بنجاح!', 'success');

  // Refresh footer menu dropdowns if on settings page
  loadMenusIntoFooterSelects();
}

function addCustomMenuItem() {
  if (!menusManager) return;

  const title = document.getElementById('customItemTitle').value.trim();
  const url = document.getElementById('customItemUrl').value.trim();

  if (!title || !url) {
    showToast('يجب إدخال العنوان والرابط!', 'warning');
    return;
  }

  menusManager.currentMenuItems.push({
    id: 'item-' + Date.now(),
    title: title,
    url: url,
    type: 'custom'
  });

  document.getElementById('customItemTitle').value = '';
  document.getElementById('customItemUrl').value = '';

  menusManager.renderMenuItems();
  showToast('تم إضافة العنصر!', 'success');
}

function openQuickPageModal() {
  const title = prompt('أدخل عنوان الصفحة الجديدة:');
  if (!title) return;

  const slug = generateSlug(title);

  if (!pagesManager) {
    pagesManager = new PagesManager();
    pagesManager.init();
  }

  // Create quick page
  const pageData = {
    id: 'page-' + Date.now(),
    title: title,
    slug: slug,
    metaTitle: title,
    metaDescription: '',
    status: 'published',
    date: new Date().toISOString().split('T')[0],
    layout: []
  };

  pagesManager.pages.push(pageData);
  pagesManager.savePages();

  // Add to menu automatically
  if (menusManager) {
    menusManager.currentMenuItems.push({
      id: 'item-' + Date.now(),
      title: title,
      url: '/' + slug,
      type: 'page',
      pageId: pageData.id
    });
    menusManager.loadAvailablePages();
    menusManager.renderMenuItems();
  }

  showToast('تم إضافة الصفحة بنجاح!', 'success');
}

function loadMenusIntoFooterSelects() {
  if (!menusManager) return;

  const selects = ['footerMenu1', 'footerMenu2', 'footerMenu3', 'footerMenu4'];

  selects.forEach(selectId => {
    const select = document.getElementById(selectId);
    if (!select) return;

    const currentValue = select.value;
    const options = menusManager.menus.map(menu =>
      `<option value="${menu.id}">${menu.name}</option>`
    ).join('');

    select.innerHTML = '<option value="">-- بدون قائمة --</option>' + options;
    select.value = currentValue; // Restore selection
  });
}

// Quick add element function
function addQuickElement(type) {
  if (!pagesManager || !pagesManager.currentPageId) {
    showToast('يجب اختيار صفحة أولاً!', 'warning');
    return;
  }

  // Get component data from COMPONENT_TYPES
  if (typeof COMPONENT_TYPES === 'undefined' || !COMPONENT_TYPES[type]) {
    showToast('نوع العنصر غير موجود!', 'error');
    return;
  }

  const componentData = COMPONENT_TYPES[type];

  // Create element with default content
  const element = {
    id: Date.now().toString(),
    type: type,
    title: componentData.name,
    description: componentData.description,
    content: { ...componentData.defaultContent }
  };

  pageLayout.push(element);
  renderPageCanvas();
  showToast(`تم إضافة ${componentData.name} بنجاح!`, 'success');
}

// Update savePageLayout to save to current page
function savePageLayout() {
  if (!pagesManager || !pagesManager.currentPageId) {
    showToast('يجب اختيار صفحة أولاً!', 'warning');
    return;
  }

  const pageIndex = pagesManager.pages.findIndex(p => p.id === pagesManager.currentPageId);
  if (pageIndex !== -1) {
    pagesManager.pages[pageIndex].layout = pageLayout;
    pagesManager.savePages();
    showToast('تم حفظ تخطيط الصفحة بنجاح!', 'success');
  }
}

// Auto-generate slug from Arabic text
function generateSlug(text) {
  // Simple transliteration map
  const arabicToEnglish = {
    'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th',
    'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'th', 'ر': 'r', 'ز': 'z',
    'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
    'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
    'ه': 'h', 'و': 'w', 'ي': 'y', 'ة': 'h', 'ى': 'a', 'ء': 'a'
  };

  let slug = text.toLowerCase();

  // Replace Arabic characters
  for (const [ar, en] of Object.entries(arabicToEnglish)) {
    slug = slug.replace(new RegExp(ar, 'g'), en);
  }

  // Clean up
  slug = slug.replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with dash
    .replace(/^-+|-+$/g, '')  // Remove leading/trailing dashes
    .replace(/-+/g, '-');  // Replace multiple dashes with single dash

  return slug || 'page';
}
