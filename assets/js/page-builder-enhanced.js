/**
 * Technology KSA - Enhanced Page Builder with Drag & Drop
 * نظام بناء الصفحات المحسّن مع السحب والإفلات
 */

class PageBuilderEnhanced {
  constructor() {
    this.currentPage = null;
    this.sections = [];
    this.draggedElement = null;
    this.availableBlocks = this.getAvailableBlocks();
    this.init();
  }

  init() {
    console.log('Enhanced Page Builder initialized');
    this.setupDragAndDrop();
  }

  // ==========================================
  // AVAILABLE BLOCKS
  // ==========================================

  getAvailableBlocks() {
    return {
      hero: {
        id: 'hero',
        name: 'Hero Section',
        nameAr: 'قسم البطل',
        icon: 'star',
        category: 'headers',
        template: `
          <section class="hero-section" data-block-type="hero">
            <div class="container">
              <h1 contenteditable="true">عنوان رئيسي</h1>
              <p contenteditable="true">نص فرعي يشرح الخدمة أو المنتج</p>
              <div class="hero-buttons">
                <a href="#" class="btn btn-primary" contenteditable="true">ابدأ الآن</a>
                <a href="#" class="btn btn-secondary" contenteditable="true">اعرف المزيد</a>
              </div>
            </div>
          </section>
        `
      },

      text: {
        id: 'text',
        name: 'Text Block',
        nameAr: 'قالب نصي',
        icon: 'align-left',
        category: 'content',
        template: `
          <section class="text-block" data-block-type="text">
            <div class="container">
              <h2 contenteditable="true">عنوان القسم</h2>
              <p contenteditable="true">نص القسم يمكن تعديله بالنقر عليه مباشرة. اكتب ما تريد هنا.</p>
            </div>
          </section>
        `
      },

      features: {
        id: 'features',
        name: 'Features Grid',
        nameAr: 'شبكة المميزات',
        icon: 'th',
        category: 'content',
        template: `
          <section class="features-section" data-block-type="features">
            <div class="container">
              <h2 contenteditable="true">مميزاتنا</h2>
              <div class="features-grid">
                <div class="feature-card">
                  <i class="fas fa-rocket"></i>
                  <h3 contenteditable="true">سرعة عالية</h3>
                  <p contenteditable="true">نوفر أداء سريع وموثوق</p>
                </div>
                <div class="feature-card">
                  <i class="fas fa-shield-alt"></i>
                  <h3 contenteditable="true">أمان متقدم</h3>
                  <p contenteditable="true">حماية قوية لبياناتك</p>
                </div>
                <div class="feature-card">
                  <i class="fas fa-headset"></i>
                  <h3 contenteditable="true">دعم 24/7</h3>
                  <p contenteditable="true">فريق دعم متاح دائماً</p>
                </div>
              </div>
            </div>
          </section>
        `
      },

      cta: {
        id: 'cta',
        name: 'Call to Action',
        nameAr: 'دعوة للإجراء',
        icon: 'bullhorn',
        category: 'marketing',
        template: `
          <section class="cta-section" data-block-type="cta">
            <div class="container">
              <h2 contenteditable="true">جاهز للبدء؟</h2>
              <p contenteditable="true">ابدأ معنا اليوم واحصل على أفضل الحلول</p>
              <a href="#" class="btn btn-primary btn-lg" contenteditable="true">ابدأ الآن</a>
            </div>
          </section>
        `
      },

      stats: {
        id: 'stats',
        name: 'Statistics',
        nameAr: 'إحصائيات',
        icon: 'chart-bar',
        category: 'content',
        template: `
          <section class="stats-section" data-block-type="stats">
            <div class="container">
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-number" contenteditable="true">500+</span>
                  <span class="stat-label" contenteditable="true">مشروع مكتمل</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number" contenteditable="true">100+</span>
                  <span class="stat-label" contenteditable="true">عميل سعيد</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number" contenteditable="true">50+</span>
                  <span class="stat-label" contenteditable="true">خدمة متميزة</span>
                </div>
              </div>
            </div>
          </section>
        `
      },

      team: {
        id: 'team',
        name: 'Team Section',
        nameAr: 'قسم الفريق',
        icon: 'users',
        category: 'about',
        template: `
          <section class="team-section" data-block-type="team">
            <div class="container">
              <h2 contenteditable="true">فريقنا</h2>
              <div class="team-grid">
                <div class="team-member">
                  <img src="/assets/images/team/member1.jpg" alt="Team Member">
                  <h3 contenteditable="true">أحمد محمد</h3>
                  <p contenteditable="true">المدير التنفيذي</p>
                </div>
                <div class="team-member">
                  <img src="/assets/images/team/member2.jpg" alt="Team Member">
                  <h3 contenteditable="true">سارة أحمد</h3>
                  <p contenteditable="true">مديرة التسويق</p>
                </div>
              </div>
            </div>
          </section>
        `
      },

      testimonials: {
        id: 'testimonials',
        name: 'Testimonials',
        nameAr: 'شهادات العملاء',
        icon: 'quote-right',
        category: 'marketing',
        template: `
          <section class="testimonials-section" data-block-type="testimonials">
            <div class="container">
              <h2 contenteditable="true">ماذا يقول عملاؤنا</h2>
              <div class="testimonials-grid">
                <div class="testimonial-card">
                  <p contenteditable="true">"خدمة ممتازة وفريق محترف"</p>
                  <div class="client-info">
                    <strong contenteditable="true">محمد علي</strong>
                    <span contenteditable="true">مدير شركة ABC</span>
                  </div>
                </div>
                <div class="testimonial-card">
                  <p contenteditable="true">"تجربة رائعة ونتائج مبهرة"</p>
                  <div class="client-info">
                    <strong contenteditable="true">فاطمة أحمد</strong>
                    <span contenteditable="true">مديرة تسويق</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        `
      },

      pricing: {
        id: 'pricing',
        name: 'Pricing Table',
        nameAr: 'جدول الأسعار',
        icon: 'dollar-sign',
        category: 'marketing',
        template: `
          <section class="pricing-section" data-block-type="pricing">
            <div class="container">
              <h2 contenteditable="true">أسعارنا</h2>
              <div class="pricing-grid">
                <div class="pricing-card">
                  <h3 contenteditable="true">الباقة الأساسية</h3>
                  <div class="price">
                    <span class="amount" contenteditable="true">99</span>
                    <span class="currency" contenteditable="true">ريال/شهر</span>
                  </div>
                  <ul>
                    <li contenteditable="true">ميزة 1</li>
                    <li contenteditable="true">ميزة 2</li>
                    <li contenteditable="true">ميزة 3</li>
                  </ul>
                  <a href="#" class="btn btn-outline">اختر الباقة</a>
                </div>
                <div class="pricing-card featured">
                  <h3 contenteditable="true">الباقة الاحترافية</h3>
                  <div class="price">
                    <span class="amount" contenteditable="true">199</span>
                    <span class="currency" contenteditable="true">ريال/شهر</span>
                  </div>
                  <ul>
                    <li contenteditable="true">جميع ميزات الأساسية</li>
                    <li contenteditable="true">ميزة إضافية 1</li>
                    <li contenteditable="true">ميزة إضافية 2</li>
                  </ul>
                  <a href="#" class="btn btn-primary">اختر الباقة</a>
                </div>
              </div>
            </div>
          </section>
        `
      },

      gallery: {
        id: 'gallery',
        name: 'Image Gallery',
        nameAr: 'معرض الصور',
        icon: 'images',
        category: 'media',
        template: `
          <section class="gallery-section" data-block-type="gallery">
            <div class="container">
              <h2 contenteditable="true">معرض الصور</h2>
              <div class="gallery-grid">
                <div class="gallery-item">
                  <img src="/assets/images/gallery/1.jpg" alt="Gallery Image">
                </div>
                <div class="gallery-item">
                  <img src="/assets/images/gallery/2.jpg" alt="Gallery Image">
                </div>
                <div class="gallery-item">
                  <img src="/assets/images/gallery/3.jpg" alt="Gallery Image">
                </div>
              </div>
            </div>
          </section>
        `
      },

      contact: {
        id: 'contact',
        name: 'Contact Form',
        nameAr: 'نموذج التواصل',
        icon: 'envelope',
        category: 'forms',
        template: `
          <section class="contact-section" data-block-type="contact">
            <div class="container">
              <h2 contenteditable="true">تواصل معنا</h2>
              <form class="contact-form">
                <div class="form-group">
                  <label>الاسم</label>
                  <input type="text" name="name" required>
                </div>
                <div class="form-group">
                  <label>البريد الإلكتروني</label>
                  <input type="email" name="email" required>
                </div>
                <div class="form-group">
                  <label>الرسالة</label>
                  <textarea name="message" rows="5" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">إرسال</button>
              </form>
            </div>
          </section>
        `
      },

      spacer: {
        id: 'spacer',
        name: 'Spacer',
        nameAr: 'مسافة فارغة',
        icon: 'arrows-alt-v',
        category: 'layout',
        template: `
          <div class="spacer" data-block-type="spacer" style="height: 50px;"></div>
        `
      },

      divider: {
        id: 'divider',
        name: 'Divider',
        nameAr: 'فاصل',
        icon: 'minus',
        category: 'layout',
        template: `
          <div class="divider" data-block-type="divider">
            <hr>
          </div>
        `
      }
    };
  }

  // ==========================================
  // DRAG AND DROP
  // ==========================================

  setupDragAndDrop() {
    // Will be initialized when page builder UI loads
    console.log('Drag & Drop ready to setup');
  }

  initializeDragAndDrop(builderContainer, blocksPanel) {
    // Make blocks draggable
    const blockElements = blocksPanel.querySelectorAll('.block-item');
    blockElements.forEach(block => {
      block.setAttribute('draggable', 'true');
      block.addEventListener('dragstart', (e) => this.handleBlockDragStart(e));
      block.addEventListener('dragend', (e) => this.handleBlockDragEnd(e));
    });

    // Make builder container droppable
    builderContainer.addEventListener('dragover', (e) => this.handleDragOver(e));
    builderContainer.addEventListener('drop', (e) => this.handleDrop(e));

    // Enable reordering of sections
    this.enableSectionReordering(builderContainer);
  }

  handleBlockDragStart(e) {
    const blockId = e.target.dataset.blockId;
    e.dataTransfer.setData('blockId', blockId);
    e.target.classList.add('dragging');
    this.draggedElement = blockId;
  }

  handleBlockDragEnd(e) {
    e.target.classList.remove('dragging');
    this.draggedElement = null;
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }

  handleDrop(e) {
    e.preventDefault();
    const blockId = e.dataTransfer.getData('blockId');

    if (blockId && this.availableBlocks[blockId]) {
      this.addBlock(blockId, e.clientY);
    }
  }

  enableSectionReordering(container) {
    // Make sections draggable within the builder
    const sections = container.querySelectorAll('[data-block-type]');
    sections.forEach(section => {
      const handle = document.createElement('div');
      handle.className = 'section-drag-handle';
      handle.innerHTML = '<i class="fas fa-grip-vertical"></i>';
      handle.setAttribute('draggable', 'true');

      section.style.position = 'relative';
      section.insertBefore(handle, section.firstChild);

      handle.addEventListener('dragstart', (e) => {
        e.stopPropagation();
        section.classList.add('dragging-section');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('sectionIndex', Array.from(sections).indexOf(section));
      });

      handle.addEventListener('dragend', (e) => {
        section.classList.remove('dragging-section');
      });
    });

    // Handle reordering drops
    container.addEventListener('dragover', (e) => {
      const draggingSection = container.querySelector('.dragging-section');
      if (!draggingSection) return;

      const afterElement = this.getDragAfterElement(container, e.clientY);
      if (afterElement == null) {
        container.appendChild(draggingSection);
      } else {
        container.insertBefore(draggingSection, afterElement);
      }
    });
  }

  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('[data-block-type]:not(.dragging-section)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  // ==========================================
  // BLOCK MANAGEMENT
  // ==========================================

  addBlock(blockId, position = null) {
    const block = this.availableBlocks[blockId];
    if (!block) return null;

    const section = {
      id: `section_${Date.now()}`,
      blockType: blockId,
      content: block.template,
      order: this.sections.length + 1
    };

    this.sections.push(section);
    this.savePage();

    return section;
  }

  removeBlock(sectionId) {
    this.sections = this.sections.filter(s => s.id !== sectionId);
    this.savePage();
  }

  updateBlockContent(sectionId, content) {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) {
      section.content = content;
      this.savePage();
    }
  }

  duplicateBlock(sectionId) {
    const section = this.sections.find(s => s.id === sectionId);
    if (!section) return null;

    const duplicate = {
      ...section,
      id: `section_${Date.now()}`,
      order: section.order + 1
    };

    const index = this.sections.indexOf(section);
    this.sections.splice(index + 1, 0, duplicate);
    this.savePage();

    return duplicate;
  }

  reorderBlocks(newOrder) {
    // newOrder is an array of section IDs in the desired order
    const reordered = [];
    newOrder.forEach((id, index) => {
      const section = this.sections.find(s => s.id === id);
      if (section) {
        section.order = index + 1;
        reordered.push(section);
      }
    });

    this.sections = reordered;
    this.savePage();
  }

  // ==========================================
  // PAGE MANAGEMENT
  // ==========================================

  loadPage(pageId) {
    const pages = JSON.parse(localStorage.getItem('techksa_pages') || '[]');
    const page = pages.find(p => p.id === pageId);

    if (page) {
      this.currentPage = page;
      this.sections = page.sections || [];
      return page;
    }

    return null;
  }

  savePage() {
    if (!this.currentPage) return;

    const pages = JSON.parse(localStorage.getItem('techksa_pages') || '[]');
    const index = pages.findIndex(p => p.id === this.currentPage.id);

    if (index >= 0) {
      pages[index].sections = this.sections;
      pages[index].updatedAt = new Date().toISOString();
      localStorage.setItem('techksa_pages', JSON.stringify(pages));

      // Trigger update event
      window.dispatchEvent(new CustomEvent('pageUpdated', {
        detail: { pageId: this.currentPage.id, sections: this.sections }
      }));
    }
  }

  createPage(pageData) {
    const page = {
      id: `page_${Date.now()}`,
      title: pageData.title,
      slug: pageData.slug,
      status: 'draft',
      sections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const pages = JSON.parse(localStorage.getItem('techksa_pages') || '[]');
    pages.push(page);
    localStorage.setItem('techksa_pages', JSON.stringify(pages));

    this.currentPage = page;
    this.sections = [];

    return page;
  }

  publishPage() {
    if (!this.currentPage) return false;

    const pages = JSON.parse(localStorage.getItem('techksa_pages') || '[]');
    const index = pages.findIndex(p => p.id === this.currentPage.id);

    if (index >= 0) {
      pages[index].status = 'published';
      pages[index].publishedAt = new Date().toISOString();
      localStorage.setItem('techksa_pages', JSON.stringify(pages));

      // Trigger publish event
      window.dispatchEvent(new CustomEvent('pagePublished', {
        detail: { pageId: this.currentPage.id }
      }));

      return true;
    }

    return false;
  }

  // ==========================================
  // RENDER
  // ==========================================

  renderPage() {
    let html = '';
    this.sections.sort((a, b) => a.order - b.order).forEach(section => {
      html += section.content;
    });
    return html;
  }

  renderBlocksPalette() {
    const categories = {
      headers: 'رؤوس',
      content: 'محتوى',
      marketing: 'تسويق',
      about: 'عن الشركة',
      media: 'وسائط',
      forms: 'نماذج',
      layout: 'تخطيط'
    };

    let html = '<div class="blocks-palette">';

    Object.entries(categories).forEach(([key, label]) => {
      const blocks = Object.values(this.availableBlocks).filter(b => b.category === key);

      if (blocks.length > 0) {
        html += `<div class="block-category">`;
        html += `<h4>${label}</h4>`;
        html += `<div class="blocks-grid">`;

        blocks.forEach(block => {
          html += `
            <div class="block-item" data-block-id="${block.id}" draggable="true">
              <i class="fas fa-${block.icon}"></i>
              <span>${block.nameAr}</span>
            </div>
          `;
        });

        html += `</div></div>`;
      }
    });

    html += '</div>';
    return html;
  }
}

// Initialize
if (typeof window !== 'undefined') {
  window.PageBuilderEnhanced = PageBuilderEnhanced;
}
