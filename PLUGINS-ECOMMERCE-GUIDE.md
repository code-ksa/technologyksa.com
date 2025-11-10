# 🛍️ دليل نظام الإضافات و المتجر الإلكتروني

## نظرة عامة

تم تطوير نظام إضافات متكامل مع plugin كامل للتجارة الإلكترونية مشابه لـ WooCommerce.

---

## 📦 المكونات الرئيسية

### 1. **نظام الإضافات (Plugins System)**

```
📁 /assets/js/plugins-system.js
```

**الميزات:**
- ✅ تفعيل/تعطيل الإضافات
- ✅ إدارة إعدادات كل إضافة
- ✅ نظام Hooks & Filters
- ✅ localStorage للبيانات
- ✅ واجهة سهلة الاستخدام

**الإضافات المتاحة:**
1. **eCommerce** - متجر إلكتروني كامل ⭐
2. **Booking** - نظام الحجوزات
3. **Forms Builder** - منشئ النماذج
4. **SEO Pro** - أدوات SEO متقدمة

### 2. **إضافة التجارة الإلكترونية (eCommerce Plugin)**

```
📁 /assets/js/ecommerce-plugin.js
📁 /assets/js/products-admin-ui.js
📁 /admin/plugins-views.html
```

---

## 🚀 البداية السريعة

### تفعيل نظام المتجر:

1. **افتح Admin Panel** → الإضافات
2. **ابحث عن "متجر إلكتروني - eCommerce"**
3. **اضغط "تفعيل"**
4. **ستظهر قائمة "المنتجات" في القائمة الجانبية**

### إضافة أول منتج:

```
1. اذهب إلى: المنتجات → إضافة منتج جديد
2. املأ البيانات الأساسية:
   - اسم المنتج
   - السعر
   - الوصف
3. (اختياري) أضف صور
4. (اختياري) حدد الفئة
5. اضغط "حفظ المنتج"
```

---

## 📋 ميزات المتجر الإلكتروني

### 1. **إدارة المنتجات الكاملة**

#### نوعين من المنتجات:

**منتج بسيط (Simple Product):**
- سعر واحد
- مخزون واحد
- لا يوجد متغيرات

**منتج متغير (Variable Product):**
- متغيرات متعددة (مثل: الحجم، اللون)
- سعر ومخزون لكل متغير
- خصائص قابلة للتخصيص

#### حقول المنتج:

**عام:**
```javascript
{
  name: 'اسم المنتج',
  sku: 'رمز المنتج الفريد',
  type: 'simple أو variable',
  shortDescription: 'وصف مختصر',
  description: 'وصف كامل',
  regularPrice: 299.99,
  salePrice: 249.99,  // اختياري
  featured: true/false,
  status: 'publish أو draft'
}
```

**المخزون:**
```javascript
{
  manageStock: true/false,
  stock: 50,
  stockStatus: 'instock | outofstock | onbackorder'
}
```

**الشحن:**
```javascript
{
  weight: 1.5,  // كجم
  dimensions: {
    length: 30,  // سم
    width: 20,
    height: 10
  }
}
```

**الصور:**
```javascript
{
  images: [
    'url-1.jpg',  // الصورة الرئيسية
    'url-2.jpg',
    'url-3.jpg'
  ]
}
```

**SEO:**
```javascript
{
  slug: 'product-name',
  metaTitle: 'عنوان Meta',
  metaDescription: 'وصف Meta'
}
```

### 2. **نظام الفئات**

```javascript
{
  id: 'cat-1',
  name: 'إلكترونيات',
  slug: 'electronics',
  description: 'وصف الفئة',
  parent: null,  // أو ID فئة أخرى
  image: 'url',
  count: 10  // عدد المنتجات
}
```

**الفئات الرئيسية والفرعية:**
```
Electronics (فئة رئيسية)
├── Phones (فئة فرعية)
├── Laptops
└── Accessories

Fashion
├── Men
├── Women
└── Kids
```

### 3. **نظام الخصائص (Attributes)**

```javascript
{
  id: 'attr-1',
  name: 'اللون',
  slug: 'color',
  values: ['أحمر', 'أزرق', 'أخضر'],
  visible: true,
  variation: true  // قابل للاستخدام في المتغيرات
}
```

**أمثلة:**
- اللون: أحمر، أزرق، أخضر
- الحجم: صغير، متوسط، كبير
- المادة: قطن، بوليستر، حرير

### 4. **عربة التسوق (Shopping Cart)**

```javascript
class ShoppingCart {
  addItem(productId, quantity, variationId)
  removeItem(index)
  updateQuantity(index, quantity)
  clearCart()
  getTotal()
  getItemsCount()
}
```

---

## 💾 تخزين البيانات

### localStorage Keys:

```javascript
{
  // Products
  'techksa_ecommerce_products': [...],

  // Categories
  'techksa_ecommerce_categories': [...],

  // Attributes
  'techksa_ecommerce_attributes': [...],

  // Cart
  'techksa_cart': [...],

  // Active Plugins
  'techksa_active_plugins': ['ecommerce'],

  // Plugin Settings
  'techksa_plugin_ecommerce_settings': {...}
}
```

---

## 🎨 واجهة Admin Panel

### 1. **صفحة الإضافات**

```
الإضافات
├── عرض جميع الإضافات المتاحة
├── تفعيل/تعطيل
├── إعدادات كل إضافة
└── معلومات (اسم، وصف، ميزات)
```

### 2. **صفحة المنتجات**

```
المنتجات
├── جميع المنتجات (جدول)
│   ├── صورة
│   ├── اسم
│   ├── SKU
│   ├── السعر
│   ├── المخزون
│   └── الإجراءات
│
├── الفئات
│   ├── إضافة فئة
│   ├── تعديل
│   └── حذف
│
└── الخصائص
    ├── إضافة خاصية
    ├── تعديل القيم
    └── حذف
```

### 3. **نافذة إضافة منتج (Modal)**

**التبويبات:**
1. **عام** - معلومات أساسية
2. **المخزون** - إدارة الكميات
3. **الصور** - معرض الصور
4. **الخصائص** - الخصائص والمتغيرات
5. **SEO** - تحسين محركات البحث

---

## 🛠️ دوال API الرئيسية

### Products Manager:

```javascript
// إضافة منتج
productsManager.addProduct(productData);

// تحديث منتج
productsManager.updateProduct(id, productData);

// حذف منتج
productsManager.deleteProduct(id);

// الحصول على منتج
productsManager.getProduct(id);

// تكرار منتج
productsManager.duplicateProduct(id);

// البحث
productsManager.searchProducts(query);

// حسب الفئة
productsManager.getProductsByCategory(categoryId);

// تحديث المخزون
productsManager.updateProductStock(productId, quantity, 'set|increase|decrease');
```

### Categories Manager:

```javascript
// إضافة فئة
productsManager.addCategory(categoryData);

// تحديث فئة
productsManager.updateCategory(id, categoryData);

// حذف فئة
productsManager.deleteCategory(id);
```

### Shopping Cart:

```javascript
// إضافة للعربة
shoppingCart.addItem(productId, quantity, variationId);

// حذف من العربة
shoppingCart.removeItem(index);

// تحديث الكمية
shoppingCart.updateQuantity(index, quantity);

// إفراغ العربة
shoppingCart.clearCart();

// الإجمالي
const total = shoppingCart.getTotal();

// عدد العناصر
const count = shoppingCart.getItemsCount();
```

---

## 🎯 أمثلة عملية

### Example 1: إضافة منتج بسيط

```javascript
const product = {
  name: 'iPhone 15 Pro',
  sku: 'IPH-15-PRO',
  type: 'simple',
  shortDescription: 'أحدث هاتف من Apple',
  description: 'وصف تفصيلي...',
  regularPrice: 4999,
  salePrice: 4499,
  images: [
    'https://example.com/iphone-1.jpg',
    'https://example.com/iphone-2.jpg'
  ],
  categories: ['cat-1'],  // Electronics
  manageStock: true,
  stock: 25,
  stockStatus: 'instock',
  featured: true,
  status: 'publish'
};

productsManager.addProduct(product);
```

### Example 2: إضافة فئة فرعية

```javascript
const category = {
  name: 'الهواتف الذكية',
  slug: 'smartphones',
  description: 'أحدث الهواتف',
  parent: 'cat-1',  // Electronics
  image: 'https://example.com/phones-cat.jpg'
};

productsManager.addCategory(category);
```

### Example 3: البحث عن منتجات

```javascript
// البحث بالنص
const results = productsManager.searchProducts('iphone');

// حسب الفئة
const electronics = productsManager.getProductsByCategory('cat-1');
```

### Example 4: إضافة للعربة

```javascript
// منتج بسيط
shoppingCart.addItem('product-123', 2);

// منتج متغير
shoppingCart.addItem('product-456', 1, 'variation-789');

// عرض عدد العناصر
console.log(`العربة: ${shoppingCart.getItemsCount()} عنصر`);
```

---

## 🔌 إنشاء إضافة جديدة

### 1. تعريف الإضافة في `plugins-system.js`:

```javascript
my_plugin: {
  id: 'my_plugin',
  name: 'إضافتي الجديدة',
  description: 'وصف الإضافة',
  version: '1.0.0',
  author: 'اسمك',
  icon: 'icon-name',
  features: [
    'ميزة 1',
    'ميزة 2'
  ],
  settings: {
    option1: 'value1'
  }
}
```

### 2. إنشاء ملف الإضافة:

```javascript
// my-plugin.js

function init_my_plugin_plugin() {
  console.log('✅ تم تفعيل إضافتي');

  // كود التفعيل
}

function cleanup_my_plugin_plugin() {
  console.log('❌ تم تعطيل إضافتي');

  // كود التنظيف
}
```

### 3. إضافة الملف في HTML:

```html
<script src="../assets/js/my-plugin.js"></script>
```

---

## 📱 Frontend (قادم قريباً)

### صفحات المتجر:

```
/shop              → قائمة جميع المنتجات
/shop/category     → منتجات حسب الفئة
/product/slug      → صفحة المنتج الواحد
/cart              → عربة التسوق
/checkout          → إتمام الطلب
/my-account        → حساب المستخدم
```

### مكونات Frontend:

- عرض المنتجات (Grid/List)
- فلاتر (السعر، الفئة، الخصائص)
- صفحة المنتج الواحد
- عربة التسوق
- نموذج الطلب
- نظام الدفع

---

## 🔒 الأمان

### حماية البيانات:

- ✅ التحقق من المدخلات
- ✅ تخزين آمن في localStorage
- ✅ منع XSS
- ✅ التحقق من الصلاحيات

### ملاحظة:

⚠️ **للإنتاج:** يُنصح بإضافة:
- Backend API
- قاعدة بيانات (MySQL/MongoDB)
- نظام مصادقة
- بوابة دفع آمنة

---

## 🎨 التخصيص

### تخصيص إعدادات المتجر:

```javascript
const settings = pluginsManager.getPluginSettings('ecommerce');

settings.currency = 'SAR';
settings.currencyPosition = 'right';
settings.productsPerPage = 12;

pluginsManager.savePluginSettings('ecommerce', settings);
```

---

## 📊 الإحصائيات

- **4 إضافات** متاحة
- **1 إضافة** كاملة (eCommerce)
- **10+ حقول** لكل منتج
- **3 أنواع** مخزون
- **2 أنواع** منتجات
- **Unlimited** فئات ومنتجات

---

## 🚧 قيد التطوير

- [ ] Variations System (المتغيرات)
- [ ] Reviews & Ratings (التقييمات)
- [ ] Coupons (كوبونات الخصم)
- [ ] Orders Management (إدارة الطلبات)
- [ ] Payment Gateways (بوابات الدفع)
- [ ] Shipping Methods (طرق الشحن)
- [ ] Frontend Templates (قوالب العرض)
- [ ] Analytics Dashboard (لوحة التحليلات)

---

## 📞 الدعم

للاستفسارات:
- 📖 راجع: `CMS-DOCUMENTATION.md`
- 📖 راجع: `QUICK-GUIDE.md`
- 📖 راجع: `README.md`

---

**آخر تحديث:** 2025-01-10
**الحالة:** ✅ نظام الإضافات والمنتجات جاهز للاستخدام

---

## ✅ Checklist التطبيق

- [x] نظام Plugins Manager
- [x] eCommerce Plugin Core
- [x] Products CRUD
- [x] Categories System
- [x] Shopping Cart
- [x] Admin UI - Products
- [x] Admin UI - Categories
- [x] Stock Management
- [x] Images Management
- [x] SEO Fields
- [ ] Attributes & Variations
- [ ] Frontend Templates
- [ ] Payment Integration
- [ ] Orders System

---

**🎉 النظام جاهز للاستخدام!**
