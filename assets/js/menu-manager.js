/**
 * Technology KSA - Menu Manager
 * نظام إدارة القوائم (رئيسية وفرعية)
 */

class MenuManager {
  constructor() {
    this.menus = this.loadMenus();
    this.init();
  }

  init() {
    console.log('Menu Manager initialized');
    console.log('Menus loaded:', Object.keys(this.menus).length);
  }

  // ==========================================
  // LOAD/SAVE MENUS
  // ==========================================

  loadMenus() {
    const defaultMenus = {
      primary: {
        id: 'primary',
        name: 'القائمة الرئيسية',
        location: 'header',
        items: [
          { id: 1, label: 'الرئيسية', url: '/', icon: 'home', order: 1, children: [] },
          { id: 2, label: 'خدماتنا', url: '/services', icon: 'briefcase', order: 2, children: [] },
          { id: 3, label: 'أعمالنا', url: '/portfolio', icon: 'folder', order: 3, children: [] },
          { id: 4, label: 'المدونة', url: '/blog', icon: 'newspaper', order: 4, children: [] },
          { id: 5, label: 'اتصل بنا', url: '/contact', icon: 'envelope', order: 5, children: [] }
        ]
      },
      footer: {
        id: 'footer',
        name: 'قائمة الفوتر',
        location: 'footer',
        items: [
          { id: 11, label: 'من نحن', url: '/about', order: 1, children: [] },
          { id: 12, label: 'سياسة الخصوصية', url: '/privacy', order: 2, children: [] },
          { id: 13, label: 'الشروط والأحكام', url: '/terms', order: 3, children: [] }
        ]
      }
    };

    const saved = localStorage.getItem('techksa_menus');
    if (!saved) return defaultMenus;

    try {
      const parsed = JSON.parse(saved);

      // التحقق من صحة البيانات: يجب أن تكون object وليست array
      if (Array.isArray(parsed)) {
        console.warn('تحويل القوائم من array إلى object');
        // تحويل array إلى object بناءً على id
        const menusObject = {};
        parsed.forEach(menu => {
          if (menu && menu.id) {
            menusObject[menu.id] = menu;
          }
        });
        // حفظ التنسيق الصحيح
        localStorage.setItem('techksa_menus', JSON.stringify(menusObject));
        return menusObject;
      }

      // التحقق من أن البيانات object صحيح
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return parsed;
      }

      console.warn('صيغة قوائم غير صحيحة، استخدام القيم الافتراضية');
      return defaultMenus;
    } catch (error) {
      console.error('خطأ في تحليل القوائم:', error);
      return defaultMenus;
    }
  }

  saveMenus() {
    localStorage.setItem('techksa_menus', JSON.stringify(this.menus));
    this.triggerUpdate();
  }

  // ==========================================
  // MENU CRUD
  // ==========================================

  createMenu(menuData) {
    const id = menuData.id || this.generateMenuId();
    this.menus[id] = {
      id,
      name: menuData.name,
      location: menuData.location || 'header',
      items: []
    };
    this.saveMenus();
    return this.menus[id];
  }

  getMenu(menuId) {
    return this.menus[menuId] || null;
  }

  getAllMenus() {
    return this.menus;
  }

  updateMenu(menuId, menuData) {
    if (!this.menus[menuId]) return false;

    this.menus[menuId] = {
      ...this.menus[menuId],
      ...menuData,
      id: menuId // Preserve ID
    };
    this.saveMenus();
    return true;
  }

  deleteMenu(menuId) {
    if (menuId === 'primary' || menuId === 'footer') {
      console.warn('Cannot delete default menus');
      return false;
    }

    delete this.menus[menuId];
    this.saveMenus();
    return true;
  }

  // ==========================================
  // MENU ITEMS CRUD
  // ==========================================

  addMenuItem(menuId, itemData) {
    if (!this.menus[menuId]) return null;

    const item = {
      id: itemData.id || this.generateItemId(),
      label: itemData.label,
      url: itemData.url,
      icon: itemData.icon || '',
      target: itemData.target || '_self',
      classes: itemData.classes || '',
      order: itemData.order || this.menus[menuId].items.length + 1,
      parentId: itemData.parentId || null,
      children: []
    };

    if (item.parentId) {
      // Add as child
      const parent = this.findMenuItem(menuId, item.parentId);
      if (parent) {
        parent.children.push(item);
      }
    } else {
      // Add as top-level item
      this.menus[menuId].items.push(item);
    }

    this.saveMenus();
    return item;
  }

  updateMenuItem(menuId, itemId, itemData) {
    if (!this.menus[menuId]) return false;

    const item = this.findMenuItem(menuId, itemId);
    if (!item) return false;

    Object.assign(item, {
      ...itemData,
      id: itemId, // Preserve ID
      children: item.children // Preserve children
    });

    this.saveMenus();
    return true;
  }

  deleteMenuItem(menuId, itemId) {
    if (!this.menus[menuId]) return false;

    // Remove from items or from parent's children
    this.menus[menuId].items = this.removeItemRecursive(this.menus[menuId].items, itemId);
    this.saveMenus();
    return true;
  }

  findMenuItem(menuId, itemId) {
    if (!this.menus[menuId]) return null;
    return this.findItemRecursive(this.menus[menuId].items, itemId);
  }

  findItemRecursive(items, itemId) {
    for (const item of items) {
      if (item.id === itemId) return item;
      if (item.children && item.children.length > 0) {
        const found = this.findItemRecursive(item.children, itemId);
        if (found) return found;
      }
    }
    return null;
  }

  removeItemRecursive(items, itemId) {
    return items.filter(item => {
      if (item.id === itemId) return false;
      if (item.children && item.children.length > 0) {
        item.children = this.removeItemRecursive(item.children, itemId);
      }
      return true;
    });
  }

  // ==========================================
  // REORDERING
  // ==========================================

  reorderItems(menuId, itemsOrder) {
    if (!this.menus[menuId]) return false;

    // itemsOrder is an array of IDs in the desired order
    const newItems = [];
    itemsOrder.forEach((itemId, index) => {
      const item = this.findMenuItem(menuId, itemId);
      if (item) {
        item.order = index + 1;
        newItems.push(item);
      }
    });

    this.menus[menuId].items = newItems;
    this.saveMenus();
    return true;
  }

  moveItemUp(menuId, itemId) {
    if (!this.menus[menuId]) return false;

    const items = this.menus[menuId].items;
    const index = items.findIndex(item => item.id === itemId);

    if (index > 0) {
      [items[index], items[index - 1]] = [items[index - 1], items[index]];
      this.updateItemOrders(menuId);
      this.saveMenus();
      return true;
    }

    return false;
  }

  moveItemDown(menuId, itemId) {
    if (!this.menus[menuId]) return false;

    const items = this.menus[menuId].items;
    const index = items.findIndex(item => item.id === itemId);

    if (index >= 0 && index < items.length - 1) {
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
      this.updateItemOrders(menuId);
      this.saveMenus();
      return true;
    }

    return false;
  }

  updateItemOrders(menuId) {
    if (!this.menus[menuId]) return;

    this.menus[menuId].items.forEach((item, index) => {
      item.order = index + 1;
    });
  }

  // ==========================================
  // RENDER
  // ==========================================

  renderMenu(menuId, options = {}) {
    const menu = this.menus[menuId];
    if (!menu) return '';

    const {
      className = 'menu',
      showIcons = true,
      maxDepth = 3
    } = options;

    return this.renderMenuItems(menu.items, className, showIcons, maxDepth, 0);
  }

  renderMenuItems(items, className, showIcons, maxDepth, currentDepth) {
    if (currentDepth >= maxDepth) return '';

    let html = `<ul class="${className}${currentDepth > 0 ? ' submenu' : ''}">`;

    items.sort((a, b) => a.order - b.order).forEach(item => {
      const hasChildren = item.children && item.children.length > 0;
      const icon = showIcons && item.icon ? `<i class="fas fa-${item.icon}"></i> ` : '';

      html += `<li class="menu-item${hasChildren ? ' has-submenu' : ''}">`;
      html += `<a href="${item.url}" target="${item.target}" class="${item.classes}">${icon}${item.label}</a>`;

      if (hasChildren && currentDepth + 1 < maxDepth) {
        html += this.renderMenuItems(item.children, className, showIcons, maxDepth, currentDepth + 1);
      }

      html += `</li>`;
    });

    html += `</ul>`;
    return html;
  }

  // ==========================================
  // UTILITIES
  // ==========================================

  generateMenuId() {
    return `menu_${Date.now()}`;
  }

  generateItemId() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  triggerUpdate() {
    window.dispatchEvent(new CustomEvent('menusUpdated', {
      detail: this.menus
    }));
  }

  // ==========================================
  // EXPORT/IMPORT
  // ==========================================

  exportMenus() {
    const dataStr = JSON.stringify(this.menus, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `menus-${Date.now()}.json`;
    link.href = url;
    link.click();
  }

  importMenus(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const menus = JSON.parse(e.target.result);
          this.menus = menus;
          this.saveMenus();
          resolve(menus);
        } catch (error) {
          reject('ملف غير صحيح');
        }
      };
      reader.onerror = () => reject('فشل قراءة الملف');
      reader.readAsText(file);
    });
  }

  // ==========================================
  // RESET
  // ==========================================

  reset() {
    localStorage.removeItem('techksa_menus');
    this.menus = this.loadMenus();
    this.triggerUpdate();
  }

  // ==========================================
  // BULK OPERATIONS
  // ==========================================

  duplicateMenuItem(menuId, itemId) {
    const item = this.findMenuItem(menuId, itemId);
    if (!item) return null;

    const duplicate = {
      ...item,
      id: this.generateItemId(),
      label: `${item.label} (نسخة)`,
      children: [] // Don't duplicate children for now
    };

    return this.addMenuItem(menuId, duplicate);
  }

  // Get menu by location
  getMenuByLocation(location) {
    return Object.values(this.menus).find(menu => menu.location === location);
  }

  // Get all items (flat array)
  getAllItems(menuId) {
    if (!this.menus[menuId]) return [];

    const items = [];
    const collectItems = (itemsArray) => {
      itemsArray.forEach(item => {
        items.push(item);
        if (item.children && item.children.length > 0) {
          collectItems(item.children);
        }
      });
    };

    collectItems(this.menus[menuId].items);
    return items;
  }
}

// Initialize
if (typeof window !== 'undefined') {
  window.MenuManager = MenuManager;
}
