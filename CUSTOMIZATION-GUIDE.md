# 🎨 دليل التخصيص الشامل

## نظرة عامة

دليل كامل لتخصيص موقعك باستخدام أنظمة Header/Footer Customizer و Menu Manager و Page Builder المحسّن.

---

## 📑 المحتويات

1. [تخصيص Header و Footer](#تخصيص-header-و-footer)
2. [إدارة القوائم (Menu Manager)](#إدارة-القوائم)
3. [Page Builder المحسّن مع Drag & Drop](#page-builder-المحسّن)
4. [ربط التخصيصات مع Build System](#ربط-التخصيصات-مع-build-system)
5. [أمثلة عملية](#أمثلة-عملية)

---

## 🎯 تخصيص Header و Footer

### 1. إدارة اللوجو

#### رفع لوجو جديد:
```javascript
const customizer = new HeaderFooterCustomizer();

// رفع صورة لوجو
const fileInput = document.querySelector('#logoFile');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  try {
    const imageUrl = await customizer.uploadLogo(file);
    console.log('تم رفع اللوجو:', imageUrl);
  } catch (error) {
    console.error('خطأ:', error);
  }
});
```

#### استخدام نص كلوجو:
```javascript
customizer.updateLogo({
  type: 'text',
  text: 'Technology KSA',
  width: 200,
  height: 60
});
```

#### حذف اللوجو:
```javascript
customizer.removeLogo();
```

---

### 2. تخصيص الـ Header

#### الإعدادات الأساسية:
```javascript
customizer.updateHeader({
  style: 'default',           // 'default', 'transparent', 'fixed'
  backgroundColor: '#ffffff', // لون الخلفية
  textColor: '#333333',       // لون النص
  height: 80,                 // ارتفاع الهيدر (px)
  sticky: true,               // تثبيت عند التمرير
  showSearch: true,           // إظهار البحث
  showLanguage: true,         // إظهار اختيار اللغة
  showCTA: true,              // إظهار زر CTA
  ctaText: 'اتصل بنا',
  ctaLink: '/contact',
  ctaStyle: 'primary'         // 'primary', 'secondary', 'outline'
});
```

#### تفعيل/إيقاف التثبيت:
```javascript
customizer.toggleHeaderSticky(true); // تفعيل
customizer.toggleHeaderSticky(false); // إيقاف
```

---

### 3. تخصيص الـ Footer

#### معلومات الشركة:
```javascript
customizer.updateCompanyInfo({
  name: 'Technology KSA',
  description: 'شركة تقنية سعودية رائدة في تطوير الحلول الرقمية',
  email: 'info@technologyksa.com',
  phone: '+966 XX XXX XXXX',
  address: 'الرياض، المملكة العربية السعودية'
});
```

#### روابط السوشيال ميديا:
```javascript
customizer.updateSocialLinks({
  facebook: 'https://facebook.com/yourpage',
  twitter: 'https://twitter.com/yourpage',
  linkedin: 'https://linkedin.com/company/yourcompany',
  instagram: 'https://instagram.com/yourpage',
  youtube: 'https://youtube.com/yourchannel',
  snapchat: 'https://snapchat.com/add/yourpage',
  tiktok: 'https://tiktok.com/@yourpage',
  github: 'https://github.com/yourorg'
});
```

#### إعدادات Footer العامة:
```javascript
customizer.updateFooter({
  style: 'default',           // 'default', 'minimal', 'full'
  backgroundColor: '#1a1a1a', // لون الخلفية
  textColor: '#ffffff',       // لون النص
  columns: 4,                 // عدد الأعمدة
  showSocial: true,           // إظهار روابط السوشيال
  showNewsletter: true,       // إظهار النشرة البريدية
  copyrightText: '© {year} Technology KSA. جميع الحقوق محفوظة.'
});
```

---

### 4. تصدير/استيراد الإعدادات

#### تصدير:
```javascript
customizer.exportSettings();
// سيتم تحميل ملف JSON
```

#### استيراد:
```javascript
const fileInput = document.querySelector('#importFile');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  try {
    const settings = await customizer.importSettings(file);
    console.log('تم استيراد الإعدادات:', settings);
  } catch (error) {
    console.error('خطأ:', error);
  }
});
```

#### إعادة التعيين:
```javascript
customizer.reset();
```

---

## 📝 إدارة القوائم

### 1. إنشاء قائمة جديدة

```javascript
const menuManager = new MenuManager();

const newMenu = menuManager.createMenu({
  id: 'services-menu',
  name: 'قائمة الخدمات',
  location: 'header' // 'header', 'footer', 'sidebar'
});
```

---

### 2. إضافة عناصر للقائمة

#### عنصر رئيسي:
```javascript
menuManager.addMenuItem('primary', {
  label: 'الصفحة الرئيسية',
  url: '/',
  icon: 'home',
  order: 1
});
```

#### عنصر فرعي:
```javascript
// إضافة عنصر رئيسي أولاً
const servicesItem = menuManager.addMenuItem('primary', {
  label: 'خدماتنا',
  url: '/services',
  icon: 'briefcase',
  order: 2
});

// إضافة عناصر فرعية
menuManager.addMenuItem('primary', {
  label: 'تطوير المواقع',
  url: '/services/web-development',
  parentId: servicesItem.id,
  order: 1
});

menuManager.addMenuItem('primary', {
  label: 'تطوير التطبيقات',
  url: '/services/app-development',
  parentId: servicesItem.id,
  order: 2
});
```

---

### 3. تعديل عناصر القائمة

```javascript
menuManager.updateMenuItem('primary', itemId, {
  label: 'عنوان جديد',
  url: '/new-url',
  icon: 'new-icon',
  target: '_blank', // فتح في نافذة جديدة
  classes: 'custom-class highlight'
});
```

---

### 4. حذف عنصر

```javascript
menuManager.deleteMenuItem('primary', itemId);
```

---

### 5. إعادة ترتيب العناصر

#### رفع عنصر للأعلى:
```javascript
menuManager.moveItemUp('primary', itemId);
```

#### خفض عنصر للأسفل:
```javascript
menuManager.moveItemDown('primary', itemId);
```

#### ترتيب مخصص:
```javascript
const newOrder = [5, 1, 3, 2, 4]; // IDs بالترتيب الجديد
menuManager.reorderItems('primary', newOrder);
```

---

### 6. عرض القائمة

```javascript
const menuHTML = menuManager.renderMenu('primary', {
  className: 'main-menu',
  showIcons: true,
  maxDepth: 3 // عمق القوائم الفرعية
});

document.querySelector('#menu-container').innerHTML = menuHTML;
```

---

### 7. عمليات متقدمة

#### نسخ عنصر:
```javascript
const duplicate = menuManager.duplicateMenuItem('primary', itemId);
```

#### الحصول على قائمة بموقع محدد:
```javascript
const headerMenu = menuManager.getMenuByLocation('header');
```

#### الحصول على جميع العناصر (مسطحة):
```javascript
const allItems = menuManager.getAllItems('primary');
console.log('عدد العناصر:', allItems.length);
```

---

## 🎨 Page Builder المحسّن

### 1. إنشاء صفحة جديدة

```javascript
const pageBuilder = new PageBuilderEnhanced();

const newPage = pageBuilder.createPage({
  title: 'صفحة جديدة',
  slug: 'new-page'
});
```

---

### 2. تحميل صفحة للتعديل

```javascript
const page = pageBuilder.loadPage(pageId);
```

---

### 3. إضافة عناصر (Blocks)

```javascript
// إضافة Hero Section
pageBuilder.addBlock('hero');

// إضافة Features Grid
pageBuilder.addBlock('features');

// إضافة Call to Action
pageBuilder.addBlock('cta');
```

---

### 4. العناصر المتاحة

| العنصر | الوصف | الفئة |
|--------|-------|-------|
| `hero` | قسم البطل الرئيسي | headers |
| `text` | قالب نصي | content |
| `features` | شبكة المميزات | content |
| `cta` | دعوة للإجراء | marketing |
| `stats` | إحصائيات | content |
| `team` | قسم الفريق | about |
| `testimonials` | شهادات العملاء | marketing |
| `pricing` | جدول الأسعار | marketing |
| `gallery` | معرض الصور | media |
| `contact` | نموذج التواصل | forms |
| `spacer` | مسافة فارغة | layout |
| `divider` | فاصل | layout |

---

### 5. Drag & Drop

#### تفعيل السحب والإفلات:
```javascript
const builderContainer = document.querySelector('#page-builder');
const blocksPanel = document.querySelector('#blocks-panel');

pageBuilder.initializeDragAndDrop(builderContainer, blocksPanel);
```

#### الاستخدام:
1. اسحب عنصر من لوحة العناصر
2. أفلته في منطقة البناء
3. اسحب العناصر داخل الصفحة لإعادة ترتيبها

---

### 6. عمليات على العناصر

#### تعديل محتوى عنصر:
```javascript
pageBuilder.updateBlockContent(sectionId, newContent);
```

#### حذف عنصر:
```javascript
pageBuilder.removeBlock(sectionId);
```

#### نسخ عنصر:
```javascript
const duplicate = pageBuilder.duplicateBlock(sectionId);
```

#### إعادة ترتيب العناصر:
```javascript
const newOrder = [sectionId1, sectionId3, sectionId2];
pageBuilder.reorderBlocks(newOrder);
```

---

### 7. نشر الصفحة

```javascript
const success = pageBuilder.publishPage();
if (success) {
  console.log('تم نشر الصفحة بنجاح!');
}
```

---

### 8. عرض الصفحة

```javascript
const pageHTML = pageBuilder.renderPage();
document.querySelector('#preview').innerHTML = pageHTML;
```

---

## 🔗 ربط التخصيصات مع Build System

### الخطوات الكاملة:

#### 1️⃣ تخصيص في Admin Panel
```bash
1. افتح /admin/
2. خصص Header و Footer
3. أنشئ/عدل القوائم
4. أنشئ/عدل الصفحات في Page Builder
5. احفظ جميع التغييرات
```

#### 2️⃣ تصدير البيانات
```bash
1. افتح /export.html
2. اضغط "تصدير جميع البيانات"
3. اضغط "تحميل ملف JSON"
4. احفظ الملف باسم data.json في جذر المشروع
```

#### 3️⃣ البناء
```bash
npm run build
# أو
node build-improved.js
```

#### 4️⃣ النتيجة
```
✓ Header مخصص مع اللوجو الخاص بك
✓ القوائم الرئيسية والفرعية كما أنشأتها
✓ Footer مخصص مع معلومات الشركة
✓ جميع الصفحات من Page Builder
✓ جاهز للنشر!
```

---

## 🎯 أمثلة عملية

### مثال 1: موقع شركة

```javascript
// 1. تخصيص اللوجو
customizer.updateLogo({
  type: 'image',
  imageUrl: '/assets/images/company-logo.png',
  width: 180,
  height: 60
});

// 2. إعدادات Header
customizer.updateHeader({
  backgroundColor: '#0066cc',
  textColor: '#ffffff',
  sticky: true,
  showCTA: true,
  ctaText: 'احصل على عرض',
  ctaLink: '/quote'
});

// 3. القائمة الرئيسية
menuManager.addMenuItem('primary', {
  label: 'الرئيسية',
  url: '/',
  icon: 'home',
  order: 1
});

menuManager.addMenuItem('primary', {
  label: 'من نحن',
  url: '/about',
  icon: 'info-circle',
  order: 2
});

const servicesItem = menuManager.addMenuItem('primary', {
  label: 'خدماتنا',
  url: '/services',
  icon: 'briefcase',
  order: 3
});

// قائمة فرعية للخدمات
menuManager.addMenuItem('primary', {
  label: 'تطوير المواقع',
  url: '/services/web',
  parentId: servicesItem.id
});

menuManager.addMenuItem('primary', {
  label: 'تطوير التطبيقات',
  url: '/services/apps',
  parentId: servicesItem.id
});

// 4. Footer
customizer.updateCompanyInfo({
  name: 'شركة التقنية السعودية',
  email: 'info@tech.sa',
  phone: '+966 11 XXX XXXX',
  address: 'الرياض، المملكة العربية السعودية'
});

customizer.updateSocialLinks({
  linkedin: 'https://linkedin.com/company/yourcompany',
  twitter: 'https://twitter.com/yourcompany'
});

// 5. بناء صفحة الرئيسية
pageBuilder.createPage({
  title: 'الصفحة الرئيسية',
  slug: ''
});

pageBuilder.addBlock('hero');
pageBuilder.addBlock('features');
pageBuilder.addBlock('stats');
pageBuilder.addBlock('cta');

pageBuilder.publishPage();
```

---

### مثال 2: مدونة شخصية

```javascript
// 1. لوجو نصي بسيط
customizer.updateLogo({
  type: 'text',
  text: 'مدونتي',
  width: 120,
  height: 40
});

// 2. Header شفاف
customizer.updateHeader({
  style: 'transparent',
  backgroundColor: 'transparent',
  textColor: '#333333',
  sticky: false,
  showCTA: false
});

// 3. قائمة بسيطة
menuManager.addMenuItem('primary', {
  label: 'الرئيسية',
  url: '/'
});

menuManager.addMenuItem('primary', {
  label: 'المقالات',
  url: '/blog'
});

menuManager.addMenuItem('primary', {
  label: 'عني',
  url: '/about'
});

// 4. Footer مبسط
customizer.updateFooter({
  style: 'minimal',
  backgroundColor: '#f5f5f5',
  showSocial: true,
  showNewsletter: false
});

// 5. صفحة المقالات
pageBuilder.createPage({
  title: 'مقالاتي',
  slug: 'blog'
});

pageBuilder.addBlock('text');
// سيتم تحميل المقالات تلقائياً من CMS

pageBuilder.publishPage();
```

---

### مثال 3: موقع تجاري (E-commerce)

```javascript
// 1. لوجو تجاري
customizer.updateLogo({
  type: 'image',
  imageUrl: '/assets/images/store-logo.png',
  width: 200,
  height: 70
});

// 2. Header مع بحث وسلة
customizer.updateHeader({
  backgroundColor: '#ffffff',
  textColor: '#000000',
  sticky: true,
  showSearch: true,
  showCTA: true,
  ctaText: '🛒 السلة (0)',
  ctaLink: '/cart',
  ctaStyle: 'outline'
});

// 3. قائمة المنتجات
const productsMenu = menuManager.addMenuItem('primary', {
  label: 'المنتجات',
  url: '/products',
  icon: 'shopping-bag'
});

// فئات المنتجات
menuManager.addMenuItem('primary', {
  label: 'إلكترونيات',
  url: '/products/electronics',
  parentId: productsMenu.id
});

menuManager.addMenuItem('primary', {
  label: 'ملابس',
  url: '/products/clothing',
  parentId: productsMenu.id
});

menuManager.addMenuItem('primary', {
  label: 'إكسسوارات',
  url: '/products/accessories',
  parentId: productsMenu.id
});

// 4. صفحة الرئيسية
pageBuilder.createPage({
  title: 'المتجر',
  slug: ''
});

pageBuilder.addBlock('hero');
pageBuilder.addBlock('features');
pageBuilder.addBlock('gallery'); // عرض المنتجات
pageBuilder.addBlock('testimonials');
pageBuilder.addBlock('cta');

pageBuilder.publishPage();
```

---

## 💡 نصائح وأفضل الممارسات

### 🎨 التصميم:
```
✓ استخدم ألوان متناسقة للهيدر والفوتر
✓ احرص على تباين جيد بين النص والخلفية
✓ استخدم لوجو واضح بحجم مناسب (150-200px عرض)
✓ لا تبالغ في ارتفاع الهيدر (60-100px)
```

### 📝 القوائم:
```
✓ لا تتجاوز 6-7 عناصر في القائمة الرئيسية
✓ استخدم أيقونات معبّرة
✓ رتب العناصر حسب الأهمية
✓ استخدم القوائم الفرعية لتجميع الصفحات المرتبطة
✓ لا تتجاوز 3 مستويات (رئيسي → فرعي → فرعي ثاني)
```

### 🏗️ Page Builder:
```
✓ ابدأ بـ Hero Section جذاب
✓ استخدم التباعد المناسب (Spacer)
✓ لا تكثر من العناصر في صفحة واحدة
✓ اختبر الصفحة على الموبايل
✓ استخدم Call to Action في الأماكن المناسبة
```

### 🔧 التصدير والبناء:
```
✓ صدّر البيانات بعد كل تغيير مهم
✓ احتفظ بنسخة احتياطية من data.json
✓ اختبر البناء المحلي قبل النشر
✓ راجع الصفحات المولدة في dist/
```

---

## 🐛 حل المشاكل الشائعة

### المشكلة: اللوجو لا يظهر
```javascript
// تأكد من مسار الصورة صحيح
customizer.settings.logo.imageUrl // يجب أن يكون مساراً صحيحاً

// أو استخدم base64
const reader = new FileReader();
reader.onload = (e) => {
  customizer.updateLogo({
    type: 'image',
    imageUrl: e.target.result // base64
  });
};
reader.readAsDataURL(file);
```

### المشكلة: القائمة الفرعية لا تظهر
```javascript
// تأكد من parentId صحيح
const parent = menuManager.findMenuItem('primary', parentId);
if (!parent) {
  console.error('العنصر الأب غير موجود');
}
```

### المشكلة: الصفحة لا تظهر بعد النشر
```javascript
// تأكد من:
1. تم حفظ الصفحة: pageBuilder.savePage()
2. تم نشر الصفحة: pageBuilder.publishPage()
3. تم تصدير البيانات من export.html
4. تم تشغيل npm run build
```

### المشكلة: التخصيصات لا تظهر في Build
```javascript
// تأكد من:
1. تم حفظ التخصيصات في localStorage
2. تم تصدير data.json وهو يحتوي على headerFooterSettings و menus
3. ملف data.json في جذر المشروع
4. تم تشغيل build-improved.js (وليس build.js القديم)
```

---

## 📊 API Reference السريع

### HeaderFooterCustomizer:
```javascript
new HeaderFooterCustomizer()
  .updateLogo(data)
  .uploadLogo(file)
  .removeLogo()
  .updateHeader(data)
  .updateFooter(data)
  .updateCompanyInfo(data)
  .updateSocialLinks(data)
  .exportSettings()
  .importSettings(file)
  .reset()
```

### MenuManager:
```javascript
new MenuManager()
  .createMenu(data)
  .addMenuItem(menuId, data)
  .updateMenuItem(menuId, itemId, data)
  .deleteMenuItem(menuId, itemId)
  .moveItemUp(menuId, itemId)
  .moveItemDown(menuId, itemId)
  .reorderItems(menuId, order)
  .duplicateMenuItem(menuId, itemId)
  .renderMenu(menuId, options)
  .exportMenus()
  .importMenus(file)
  .reset()
```

### PageBuilderEnhanced:
```javascript
new PageBuilderEnhanced()
  .createPage(data)
  .loadPage(pageId)
  .addBlock(blockId)
  .removeBlock(sectionId)
  .updateBlockContent(sectionId, content)
  .duplicateBlock(sectionId)
  .reorderBlocks(order)
  .savePage()
  .publishPage()
  .renderPage()
  .initializeDragAndDrop(container, panel)
```

---

## ✅ Checklist للإطلاق

- [ ] تخصيص اللوجو
- [ ] إعدادات Header كاملة
- [ ] إعدادات Footer كاملة
- [ ] معلومات الشركة محدثة
- [ ] روابط السوشيال ميديا صحيحة
- [ ] القائمة الرئيسية جاهزة
- [ ] القوائم الفرعية (إن وجدت)
- [ ] قائمة Footer جاهزة
- [ ] جميع الصفحات منشأة في Page Builder
- [ ] تم اختبار Drag & Drop
- [ ] تم تصدير data.json
- [ ] تم تشغيل build-improved.js بنجاح
- [ ] تم مراجعة الصفحات في dist/
- [ ] تم اختبار الموقع محلياً
- [ ] جاهز للنشر!

---

**آخر تحديث:** 2025-01-12
**الإصدار:** 2.0.0
**الحالة:** ✅ جاهز للاستخدام

---

**🎉 استمتع ببناء موقعك المخصص!**
