/**
 * eCommerce Plugin - Technology KSA
 * نظام متجر إلكتروني كامل مثل WooCommerce
 */

// ==========================================
// PRODUCTS MANAGER
// ==========================================

class ProductsManager {
  constructor() {
    this.products = this.loadProducts();
    this.categories = this.loadCategories();
    this.attributes = this.loadAttributes();
  }

  loadProducts() {
    const saved = localStorage.getItem('techksa_ecommerce_products');
    return saved ? JSON.parse(saved) : this.getDefaultProducts();
  }

  loadCategories() {
    const saved = localStorage.getItem('techksa_ecommerce_categories');
    return saved ? JSON.parse(saved) : this.getDefaultCategories();
  }

  loadAttributes() {
    const saved = localStorage.getItem('techksa_ecommerce_attributes');
    return saved ? JSON.parse(saved) : [];
  }

  saveProducts() {
    localStorage.setItem('techksa_ecommerce_products', JSON.stringify(this.products));
  }

  saveCategories() {
    localStorage.setItem('techksa_ecommerce_categories', JSON.stringify(this.categories));
  }

  saveAttributes() {
    localStorage.setItem('techksa_ecommerce_attributes', JSON.stringify(this.attributes));
  }

  getDefaultProducts() {
    return [
      {
        id: 'product-' + Date.now(),
        name: 'منتج تجريبي',
        slug: 'demo-product',
        sku: 'DEMO-001',
        price: 299.99,
        salePrice: null,
        regularPrice: 299.99,
        stock: 50,
        stockStatus: 'instock', // instock, outofstock, onbackorder
        manageStock: true,
        description: 'وصف المنتج التجريبي',
        shortDescription: 'وصف مختصر',
        images: [],
        categories: [],
        tags: [],
        attributes: [],
        variations: [],
        type: 'simple', // simple, variable
        featured: false,
        status: 'publish', // publish, draft
        rating: 0,
        reviewsCount: 0,
        dateCreated: new Date().toISOString(),
        weight: null,
        dimensions: { length: '', width: '', height: '' },
        shippingClass: '',
        metaTitle: '',
        metaDescription: ''
      }
    ];
  }

  getDefaultCategories() {
    return [
      {
        id: 'cat-1',
        name: 'إلكترونيات',
        slug: 'electronics',
        description: 'الأجهزة الإلكترونية',
        parent: null,
        image: '',
        count: 0
      },
      {
        id: 'cat-2',
        name: 'أزياء',
        slug: 'fashion',
        description: 'الملابس والإكسسوارات',
        parent: null,
        image: '',
        count: 0
      }
    ];
  }

  // ==========================================
  // PRODUCTS CRUD
  // ==========================================

  addProduct(productData) {
    const product = {
      id: 'product-' + Date.now(),
      ...productData,
      dateCreated: new Date().toISOString()
    };

    this.products.push(product);
    this.saveProducts();
    return product;
  }

  updateProduct(id, productData) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        ...productData,
        dateModified: new Date().toISOString()
      };
      this.saveProducts();
      return this.products[index];
    }
    return null;
  }

  deleteProduct(id) {
    this.products = this.products.filter(p => p.id !== id);
    this.saveProducts();
  }

  getProduct(id) {
    return this.products.find(p => p.id === id);
  }

  duplicateProduct(id) {
    const product = this.getProduct(id);
    if (!product) return null;

    const duplicated = JSON.parse(JSON.stringify(product));
    duplicated.id = 'product-' + Date.now();
    duplicated.name = product.name + ' (نسخة)';
    duplicated.slug = product.slug + '-copy';
    duplicated.sku = product.sku + '-COPY';
    duplicated.dateCreated = new Date().toISOString();

    this.products.push(duplicated);
    this.saveProducts();
    return duplicated;
  }

  // ==========================================
  // CATEGORIES CRUD
  // ==========================================

  addCategory(categoryData) {
    const category = {
      id: 'cat-' + Date.now(),
      ...categoryData,
      count: 0
    };

    this.categories.push(category);
    this.saveCategories();
    return category;
  }

  updateCategory(id, categoryData) {
    const index = this.categories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.categories[index] = {
        ...this.categories[index],
        ...categoryData
      };
      this.saveCategories();
      return this.categories[index];
    }
    return null;
  }

  deleteCategory(id) {
    this.categories = this.categories.filter(c => c.id !== id);
    this.saveCategories();
  }

  // ==========================================
  // ATTRIBUTES CRUD
  // ==========================================

  addAttribute(name, values) {
    const attribute = {
      id: 'attr-' + Date.now(),
      name: name,
      slug: this.generateSlug(name),
      values: values,
      visible: true,
      variation: true
    };

    this.attributes.push(attribute);
    this.saveAttributes();
    return attribute;
  }

  updateAttribute(id, data) {
    const index = this.attributes.findIndex(a => a.id === id);
    if (index !== -1) {
      this.attributes[index] = {
        ...this.attributes[index],
        ...data
      };
      this.saveAttributes();
      return this.attributes[index];
    }
    return null;
  }

  deleteAttribute(id) {
    this.attributes = this.attributes.filter(a => a.id !== id);
    this.saveAttributes();
  }

  // ==========================================
  // UTILITIES
  // ==========================================

  generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  updateProductStock(productId, quantity, operation = 'set') {
    const product = this.getProduct(productId);
    if (!product || !product.manageStock) return;

    if (operation === 'set') {
      product.stock = quantity;
    } else if (operation === 'increase') {
      product.stock += quantity;
    } else if (operation === 'decrease') {
      product.stock = Math.max(0, product.stock - quantity);
    }

    // Update stock status
    if (product.stock <= 0) {
      product.stockStatus = 'outofstock';
    } else {
      product.stockStatus = 'instock';
    }

    this.saveProducts();
  }

  getProductsByCategory(categoryId) {
    return this.products.filter(p => p.categories.includes(categoryId));
  }

  searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.sku.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
    );
  }

  // ==========================================
  // ADMIN UI RENDERING
  // ==========================================

  renderProductsList() {
    const container = document.getElementById('productsList');
    if (!container) return;

    if (this.products.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-box-open" style="font-size: 4rem; color: var(--text-secondary);"></i>
          <h3>لا توجد منتجات</h3>
          <p>ابدأ بإضافة أول منتج لمتجرك</p>
          <button class="btn btn-primary" onclick="openProductModal()">
            <i class="fas fa-plus"></i> إضافة منتج جديد
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>صورة</th>
            <th>الاسم</th>
            <th>SKU</th>
            <th>السعر</th>
            <th>المخزون</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          ${this.products.map(product => `
            <tr>
              <td>
                <div class="product-image-thumb">
                  ${product.images && product.images.length > 0 ?
                    `<img src="${product.images[0]}" alt="${product.name}">` :
                    `<i class="fas fa-image"></i>`
                  }
                </div>
              </td>
              <td>
                <strong>${product.name}</strong>
                ${product.featured ? '<span class="badge badge-warning">مميز</span>' : ''}
              </td>
              <td><code>${product.sku}</code></td>
              <td>
                ${product.salePrice ?
                  `<span style="text-decoration: line-through; color: var(--text-secondary); font-size: 0.85rem;">${product.regularPrice}</span>
                   <br><strong style="color: var(--success);">${product.salePrice} ريال</strong>` :
                  `<strong>${product.price} ريال</strong>`
                }
              </td>
              <td>
                ${product.manageStock ?
                  `<span class="stock-badge ${product.stockStatus}">
                    ${product.stock} قطعة
                  </span>` :
                  `<span class="badge badge-secondary">غير مُدار</span>`
                }
              </td>
              <td>
                <span class="badge badge-${product.status === 'publish' ? 'success' : 'warning'}">
                  ${product.status === 'publish' ? 'منشور' : 'مسودة'}
                </span>
              </td>
              <td>
                <div class="btn-group">
                  <button class="btn-icon" onclick="productsManager.editProduct('${product.id}')" title="تعديل">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon" onclick="productsManager.duplicateProduct('${product.id}'); productsManager.renderProductsList();" title="تكرار">
                    <i class="fas fa-copy"></i>
                  </button>
                  <button class="btn-icon" onclick="if(confirm('حذف المنتج؟')) { productsManager.deleteProduct('${product.id}'); productsManager.renderProductsList(); }" title="حذف">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  editProduct(id) {
    const product = this.getProduct(id);
    if (!product) return;

    // Open modal with product data
    if (typeof openProductModal === 'function') {
      openProductModal(product);
    }
  }

  renderCategoriesList() {
    const container = document.getElementById('categoriesList');
    if (!container) return;

    container.innerHTML = this.categories.map(cat => `
      <div class="category-item">
        <div class="category-info">
          <h4>${cat.name}</h4>
          <p>${cat.description || 'لا يوجد وصف'}</p>
          <small>المنتجات: ${this.getProductsByCategory(cat.id).length}</small>
        </div>
        <div class="category-actions">
          <button class="btn-icon" onclick="editCategory('${cat.id}')" title="تعديل">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon" onclick="if(confirm('حذف الفئة؟')) { productsManager.deleteCategory('${cat.id}'); productsManager.renderCategoriesList(); }" title="حذف">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
  }
}

// ==========================================
// SHOPPING CART
// ==========================================

class ShoppingCart {
  constructor() {
    this.items = this.loadCart();
  }

  loadCart() {
    const saved = localStorage.getItem('techksa_cart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('techksa_cart', JSON.stringify(this.items));
  }

  addItem(productId, quantity = 1, variationId = null) {
    const existingItem = this.items.find(item =>
      item.productId === productId && item.variationId === variationId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        productId,
        variationId,
        quantity,
        addedAt: new Date().toISOString()
      });
    }

    this.saveCart();
    return true;
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this.saveCart();
  }

  updateQuantity(index, quantity) {
    if (this.items[index]) {
      this.items[index].quantity = Math.max(1, quantity);
      this.saveCart();
    }
  }

  clearCart() {
    this.items = [];
    this.saveCart();
  }

  getTotal() {
    // Will calculate based on products data
    return 0;
  }

  getItemsCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}

// ==========================================
// PLUGIN INITIALIZATION
// ==========================================

let productsManager;
let shoppingCart;

function init_ecommerce_plugin() {
  console.log('✅ eCommerce Plugin Activated');

  // Initialize managers
  productsManager = new ProductsManager();
  shoppingCart = new ShoppingCart();

  // Add to global scope
  window.productsManager = productsManager;
  window.shoppingCart = shoppingCart;
}

function cleanup_ecommerce_plugin() {
  console.log('❌ eCommerce Plugin Deactivated');

  // Cleanup if needed
  window.productsManager = null;
  window.shoppingCart = null;
}
