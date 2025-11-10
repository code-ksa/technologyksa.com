/**
 * Technology KSA - Frontend Dynamic Content
 * عرض المحتوى الديناميكي من localStorage
 */

(function() {
  'use strict';

  // تحميل وعرض المقالات في الصفحة الرئيسية
  function loadBlogPosts() {
    const blogPreview = document.getElementById('blogPreviewCards');
    if (!blogPreview) return;

    const storedPosts = localStorage.getItem('techksa_blog_posts');
    const posts = storedPosts ? JSON.parse(storedPosts) : [];

    // تصفية المقالات المنشورة فقط
    const publishedPosts = posts.filter(post => post.status === 'published').slice(0, 3);

    if (publishedPosts.length === 0) {
      blogPreview.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
          <p style="color: var(--text-secondary);">لا توجد مقالات منشورة حالياً. قم بإضافة مقالات من لوحة التحكم.</p>
          <a href="admin/" class="btn btn-primary" style="margin-top: 1rem;">
            <i class="fas fa-plus"></i> إضافة مقال
          </a>
        </div>
      `;
      return;
    }

    blogPreview.innerHTML = publishedPosts.map(post => `
      <article class="blog-card" data-aos="fade-up">
        <div class="blog-card-img">
          <img src="${post.featuredImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600'}"
               alt="${post.imageAlt || post.title}"
               loading="lazy">
          <span class="blog-category">${post.category}</span>
        </div>
        <div class="blog-card-content">
          <div class="blog-meta">
            <span><i class="far fa-calendar"></i> ${formatDate(post.date)}</span>
            <span><i class="far fa-clock"></i> ${post.readTime} دقائق</span>
          </div>
          <h3>
            <a href="ar/blog/post.html?id=${post.id}">${post.title}</a>
          </h3>
          <p>${post.excerpt || post.content.substring(0, 150) + '...'}</p>
          <a href="ar/blog/post.html?id=${post.id}" class="blog-link">
            قراءة المزيد <i class="fas fa-arrow-left"></i>
          </a>
        </div>
      </article>
    `).join('');
  }

  // تحميل وعرض الخدمات في الصفحة الرئيسية
  function loadServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    if (!servicesGrid) return;

    const storedServices = localStorage.getItem('techksa_services');
    const services = storedServices ? JSON.parse(storedServices) : [];

    if (services.length === 0) {
      // استخدام الخدمات الافتراضية
      return;
    }

    // عرض أول 8 خدمات
    servicesGrid.innerHTML = services.slice(0, 8).map(service => `
      <div class="service-card" data-aos="fade-up">
        <div class="service-icon">
          <i class="${service.icon || 'fas fa-briefcase'}"></i>
        </div>
        <h3>${service.name}</h3>
        <p>${service.description}</p>
        <a href="ar/services/service.html?id=${service.id}" class="service-link">
          اعرف المزيد <i class="fas fa-arrow-left"></i>
        </a>
      </div>
    `).join('');
  }

  // تحميل وعرض المشاريع في الصفحة الرئيسية
  function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    const storedProjects = localStorage.getItem('techksa_projects');
    const projects = storedProjects ? JSON.parse(storedProjects) : [];

    if (projects.length === 0) {
      // استخدام المشاريع الافتراضية
      return;
    }

    // عرض أول 6 مشاريع
    projectsGrid.innerHTML = projects.slice(0, 6).map(project => `
      <div class="portfolio-item" data-category="${project.category || 'all'}" data-aos="fade-up">
        <div class="portfolio-img">
          <img src="${project.image}" alt="${project.title}" loading="lazy">
          <div class="portfolio-overlay">
            <div class="portfolio-content">
              <h3>${project.title}</h3>
              <p>${project.description}</p>
              <a href="ar/portfolio/project.html?id=${project.id}" class="portfolio-link">
                <i class="fas fa-arrow-left"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // تنسيق التاريخ
  function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
                   'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  // تهيئة عند تحميل الصفحة
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    loadBlogPosts();
    loadServices();
    loadProjects();
  }

})();
