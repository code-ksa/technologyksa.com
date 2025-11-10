/**
 * Products Admin UI - Technology KSA
 * واجهة إدارة المنتجات في Admin Panel
 */

// ==========================================
// PRODUCTS MODAL MANAGEMENT
// ==========================================

let currentProductModalTab = 'general';
let currentProductImages = [];

function openProductModal(product = null) {
  const modal = document.getElementById('productModal');
  const title = document.getElementById('productModalTitle');

  if (product) {
    // Edit mode
    title.textContent = 'تعديل المنتج';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productSKU').value = product.sku;
    document.getElementById('productType').value = product.type;
    document.getElementById('productShortDescription').value = product.shortDescription || '';
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productRegularPrice').value = product.regularPrice || '';
    document.getElementById('productSalePrice').value = product.salePrice || '';
    document.getElementById('productFeatured').checked = product.featured || false;
    document.getElementById('productStatus').value = product.status;

    // Inventory
    document.getElementById('productManageStock').checked = product.manageStock || false;
    document.getElementById('productStock').value = product.stock || 0;
    document.getElementById('productStockStatus').value = product.stockStatus;

    // Shipping
    document.getElementById('productWeight').value = product.weight || '';
    document.getElementById('productLength').value = product.dimensions?.length || '';
    document.getElementById('productWidth').value = product.dimensions?.width || '';
    document.getElementById('productHeight').value = product.dimensions?.height || '';

    // SEO
    document.getElementById('productSlug').value = product.slug;
    document.getElementById('productMetaTitle').value = product.metaTitle || '';
    document.getElementById('productMetaDescription').value = product.metaDescription || '';

    // Images
    currentProductImages = product.images || [];
    renderProductImages();

    toggleStockFields();
  } else {
    // Add mode
    title.textContent = 'إضافة منتج جديد';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    currentProductImages = [];
    renderProductImages();
  }

  // Load categories
  loadProductCategories();

  modal.classList.add('active');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('active');
  document.getElementById('productForm').reset();
  currentProductImages = [];
}

function switchProductModalTab(tab) {
  // Update buttons
  document.querySelectorAll('.product-modal-tabs .tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // Update content
  document.querySelectorAll('.product-tab-content').forEach(content => {
    content.classList.remove('active');
  });

  const tabMap = {
    'general': 'generalTab',
    'inventory': 'inventoryTab',
    'images': 'imagesTab',
    'attributes': 'attributesTabProduct',
    'seo': 'seoTab'
  };

  document.getElementById(tabMap[tab]).classList.add('active');
  currentProductModalTab = tab;
}

function toggleStockFields() {
  const manageStock = document.getElementById('productManageStock').checked;
  document.getElementById('stockFields').style.display = manageStock ? 'block' : 'none';
}

function handleProductTypeChange() {
  const type = document.getElementById('productType').value;
  // Handle simple vs variable product
  if (type === 'variable') {
    // Show attributes tab
    showToast('المنتجات المتغيرة تتطلب إضافة خصائص من تبويب الخصائص', 'info');
  }
}

// ==========================================
// PRODUCT IMAGES
// ==========================================

function renderProductImages() {
  const container = document.getElementById('productImages');
  if (!container) return;

  let html = '';

  // Render existing images
  currentProductImages.forEach((img, index) => {
    html += `
      <div class="product-image-item" style="position: relative;">
        <img src="${img}" style="width: 100%; height: 120px; object-fit: cover; border-radius: var(--radius-md);">
        <button type="button" class="btn-remove-image" onclick="removeProductImage(${index})" style="position: absolute; top: 5px; left: 5px; background: var(--error); color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">
          <i class="fas fa-times"></i>
        </button>
        ${index === 0 ? '<span class="badge badge-primary" style="position: absolute; bottom: 5px; right: 5px;">رئيسية</span>' : ''}
      </div>
    `;
  });

  // Add button
  html += `
    <button type="button" class="add-image-btn" onclick="openMediaForProduct()">
      <i class="fas fa-plus"></i>
      <span>إضافة صورة</span>
    </button>
  `;

  container.innerHTML = html;
}

function openMediaForProduct() {
  // Simplified: prompt for image URL
  const url = prompt('أدخل رابط الصورة:');
  if (url) {
    currentProductImages.push(url);
    renderProductImages();
  }

  // TODO: Integrate with Media Library
}

function removeProductImage(index) {
  if (confirm('حذف هذه الصورة؟')) {
    currentProductImages.splice(index, 1);
    renderProductImages();
  }
}

// ==========================================
// SAVE PRODUCT
// ==========================================

function saveProduct() {
  const productId = document.getElementById('productId').value;
  const name = document.getElementById('productName').value;

  if (!name) {
    showToast('يجب إدخال اسم المنتج', 'error');
    return;
  }

  // Collect all data
  const productData = {
    name: name,
    slug: document.getElementById('productSlug').value || generateSlug(name),
    sku: document.getElementById('productSKU').value || 'SKU-' + Date.now(),
    type: document.getElementById('productType').value,
    shortDescription: document.getElementById('productShortDescription').value,
    description: document.getElementById('productDescription').value,
    regularPrice: parseFloat(document.getElementById('productRegularPrice').value) || 0,
    salePrice: document.getElementById('productSalePrice').value ? parseFloat(document.getElementById('productSalePrice').value) : null,
    price: document.getElementById('productSalePrice').value ?
      parseFloat(document.getElementById('productSalePrice').value) :
      parseFloat(document.getElementById('productRegularPrice').value) || 0,
    featured: document.getElementById('productFeatured').checked,
    status: document.getElementById('productStatus').value,

    // Inventory
    manageStock: document.getElementById('productManageStock').checked,
    stock: parseInt(document.getElementById('productStock').value) || 0,
    stockStatus: document.getElementById('productStockStatus').value,

    // Shipping
    weight: document.getElementById('productWeight').value || null,
    dimensions: {
      length: document.getElementById('productLength').value || '',
      width: document.getElementById('productWidth').value || '',
      height: document.getElementById('productHeight').value || ''
    },

    // Images
    images: currentProductImages,

    // Categories
    categories: Array.from(document.getElementById('productCategories').selectedOptions).map(o => o.value),

    // SEO
    metaTitle: document.getElementById('productMetaTitle').value,
    metaDescription: document.getElementById('productMetaDescription').value,

    // Other
    attributes: [],
    variations: [],
    tags: []
  };

  if (productId) {
    // Update
    productsManager.updateProduct(productId, productData);
    showToast('تم تحديث المنتج بنجاح!', 'success');
  } else {
    // Add
    productsManager.addProduct(productData);
    showToast('تم إضافة المنتج بنجاح!', 'success');
  }

  closeProductModal();
  productsManager.renderProductsList();
}

function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// ==========================================
// CATEGORIES
// ==========================================

function loadProductCategories() {
  const select = document.getElementById('productCategories');
  if (!select || !productsManager) return;

  select.innerHTML = productsManager.categories.map(cat => `
    <option value="${cat.id}">${cat.name}</option>
  `).join('');
}

function openCategoryModal(category = null) {
  const modal = document.getElementById('categoryModal');

  if (category) {
    document.getElementById('categoryId').value = category.id;
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categorySlug').value = category.slug;
    document.getElementById('categoryDescription').value = category.description || '';
    document.getElementById('categoryParent').value = category.parent || '';
  } else {
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
  }

  // Load parent categories
  const parentSelect = document.getElementById('categoryParent');
  parentSelect.innerHTML = '<option value="">لا يوجد (فئة رئيسية)</option>';
  productsManager.categories.forEach(cat => {
    if (!category || cat.id !== category.id) {
      parentSelect.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
    }
  });

  modal.classList.add('active');
}

function closeCategoryModal() {
  document.getElementById('categoryModal').classList.remove('active');
}

function saveCategory() {
  const categoryId = document.getElementById('categoryId').value;
  const name = document.getElementById('categoryName').value;

  if (!name) {
    showToast('يجب إدخال اسم الفئة', 'error');
    return;
  }

  const categoryData = {
    name: name,
    slug: document.getElementById('categorySlug').value || generateSlug(name),
    description: document.getElementById('categoryDescription').value,
    parent: document.getElementById('categoryParent').value || null,
    image: ''
  };

  if (categoryId) {
    productsManager.updateCategory(categoryId, categoryData);
    showToast('تم تحديث الفئة بنجاح!', 'success');
  } else {
    productsManager.addCategory(categoryData);
    showToast('تم إضافة الفئة بنجاح!', 'success');
  }

  closeCategoryModal();
  productsManager.renderCategoriesList();
}

function editCategory(id) {
  const category = productsManager.categories.find(c => c.id === id);
  if (category) {
    openCategoryModal(category);
  }
}

// ==========================================
// TABS SWITCHING
// ==========================================

function switchProductTab(tab) {
  // Update buttons
  document.querySelectorAll('.products-tabs .tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // Update content
  document.querySelectorAll('#productsTabContent .tab-content').forEach(content => {
    content.classList.remove('active');
  });

  const tabMap = {
    'all': 'allProductsTab',
    'categories': 'categoriesTab',
    'attributes': 'attributesTab'
  };

  document.getElementById(tabMap[tab]).classList.add('active');

  // Load data if needed
  if (tab === 'categories') {
    productsManager.renderCategoriesList();
  }
}

// ==========================================
// ATTRIBUTES (TODO)
// ==========================================

function openAttributeModal() {
  showToast('قريباً: إضافة الخصائص', 'info');
}

function addProductAttribute() {
  showToast('قريباً: إضافة خصائص للمنتج', 'info');
}
