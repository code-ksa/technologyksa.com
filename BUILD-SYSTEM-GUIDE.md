# 🏗️ دليل نظام البناء (Build System)

## نظرة عامة

نظام Static Site Generator (SSG) كامل لتجميع العناصر (Header, Footer, Components) وتوليد صفحات HTML ثابتة كاملة.

---

## ✨ المشاكل التي يحلها

### ✅ قبل نظام البناء:
```
❌ index.html غير موجود في المجلدات الفرعية
❌ روابط مكسورة (/about → 404)
❌ ظهور محتوى الملفات الخام في المتصفح
❌ صعوبة صيانة Header/Footer في كل صفحة
❌ عدم وجود SEO لكل صفحة
```

### ✅ بعد نظام البناء:
```
✓ كل مجلد يحتوي على index.html كامل
✓ روابط نظيفة تعمل (example.com/about/)
✓ صفحات HTML كاملة جاهزة للاستضافة
✓ Header/Footer موحد في قالب واحد
✓ SEO كامل لكل صفحة (title, meta, og tags)
✓ sitemap.xml و robots.txt تلقائياً
```

---

## 📦 المكونات الرئيسية

### 1. **build.js** - السكريبت الرئيسي
```javascript
// محرك البناء الكامل
- TemplateEngine: محرك القوالب
- SiteBuilder: بناء الموقع
- Utilities: أدوات مساعدة
```

### 2. **pages.config.json** - تكوين الصفحات
```json
{
  "site": {...},      // معلومات الموقع
  "build": {...},     // إعدادات البناء
  "pages": [...],     // تعريف جميع الصفحات
  "navigation": {...} // قوائم التنقل
}
```

### 3. **templates/** - القوالب
```
templates/
├── partials/        # أجزاء القوالب
│   ├── header.html
│   ├── footer.html
│   ├── nav.html
│   └── sections/    # أقسام الصفحات
│       ├── hero.html
│       ├── features.html
│       └── ...
```

### 4. **dist/** - مخرجات البناء
```
dist/                # الصفحات الجاهزة للنشر
├── index.html       # الصفحة الرئيسية
├── about/
│   └── index.html
├── services/
│   └── index.html
├── assets/          # الملفات الثابتة
├── admin/           # لوحة التحكم
├── sitemap.xml
└── robots.txt
```

---

## 🚀 البداية السريعة

### التثبيت:

```bash
# 1. تثبيت Node.js (إذا لم يكن مثبت)
# من: https://nodejs.org/

# 2. تثبيت الحزم
cd /path/to/technologyksa.com
npm install

# إذا لم يتوفر npm install، يمكن تشغيل البناء مباشرة
# build.js لا يحتاج dependencies خارجية (يستخدم core modules فقط)
```

### البناء الأول:

```bash
# بناء الموقع
npm run build

# أو مباشرة
node build.js
```

### النتيجة:

```bash
✓ Starting build process...
✓ Configuration loaded
ℹ Loaded partial: header
ℹ Loaded partial: footer
ℹ Loaded partial: nav
ℹ Building pages...
✓ Generated: /dist/index.html
✓ Generated: /dist/about/index.html
✓ Generated: /dist/services/index.html
✓ Generated: /dist/blog/index.html
✓ Generated: /dist/portfolio/index.html
✓ Generated: /dist/contact/index.html
✓ Copying assets...
✓ Assets copied successfully
✓ Copying admin panel...
✓ Admin panel copied successfully
✓ Generating sitemap.xml...
✓ Generating robots.txt...

✓ Build completed!
ℹ Pages generated: 6
```

---

## 📝 تكوين الصفحات (pages.config.json)

### إضافة صفحة جديدة:

```json
{
  "pages": [
    {
      "id": "pricing",
      "slug": "pricing",
      "slugAr": "الأسعار",
      "title": "Pricing - Technology KSA",
      "titleAr": "الأسعار - التقنية السعودية",
      "description": "أسعار خدماتنا",
      "template": "page",
      "layout": "default",
      "sections": [
        "pricing-hero",
        "pricing-plans",
        "pricing-faq"
      ],
      "priority": 0.7
    }
  ]
}
```

### شرح الحقول:

```javascript
{
  id: "pricing",          // معرف فريد
  slug: "pricing",        // الرابط بالإنجليزية
  slugAr: "الأسعار",      // الرابط بالعربية
  title: "...",           // عنوان الصفحة
  description: "...",     // وصف SEO
  template: "page",       // نوع القالب
  sections: [...],        // الأقسام المطلوبة
  priority: 0.7          // أولوية في sitemap (0.0 - 1.0)
}
```

---

## 🎨 إنشاء القوالب

### 1. قالب Header (templates/partials/header.html):

```html
<!DOCTYPE html>
<html lang="{{lang}}" dir="{{dir}}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{{description}}">

  <title>{{title}}</title>

  <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
```

### 2. قالب Navigation (templates/partials/nav.html):

```html
<header class="site-header">
  <nav class="nav-container">
    <div class="nav-logo">
      <a href="/">
        <img src="{{logo}}" alt="{{siteName}}">
      </a>
    </div>
    <ul class="nav-menu">
      {{navItems}}
    </ul>
  </nav>
</header>
```

### 3. قالب Footer (templates/partials/footer.html):

```html
<footer class="site-footer">
  <div class="footer-container">
    <p>&copy; {{year}} {{siteName}}. جميع الحقوق محفوظة.</p>
  </div>
</footer>

<script src="/assets/js/main.js"></script>
</body>
</html>
```

### 4. قالب Section (templates/partials/sections/hero.html):

```html
<section id="hero" class="hero-section">
  <div class="container">
    <h1>{{heroTitle}}</h1>
    <p>{{heroSubtitle}}</p>
    <a href="/services" class="btn">خدماتنا</a>
  </div>
</section>
```

---

## 🔧 المتغيرات المتاحة

### في جميع القوالب:

```javascript
{{lang}}          // اللغة (ar/en)
{{dir}}           // الاتجاه (rtl/ltr)
{{title}}         // عنوان الصفحة
{{description}}   // وصف الصفحة
{{url}}           // رابط الصفحة الكامل
{{siteName}}      // اسم الموقع
{{logo}}          // رابط اللوجو
{{year}}          // السنة الحالية
{{navItems}}      // قائمة التنقل (مولدة تلقائياً)
{{footerLinks}}   // روابط Footer (مولدة تلقائياً)
{{socialLinks}}   // روابط السوشيال ميديا (مولدة تلقائياً)
{{contactEmail}}  // البريد الإلكتروني
{{contactPhone}}  // رقم الهاتف
{{keywords}}      // الكلمات المفتاحية
```

### متغيرات مخصصة:

```javascript
// في pages.config.json
{
  "customData": {
    "heroTitle": "عنوان مخصص",
    "heroSubtitle": "نص فرعي"
  }
}

// في القالب
<h1>{{heroTitle}}</h1>
```

---

## 🏗️ هيكل المشروع بعد البناء

### قبل البناء (Source):
```
technologyksa.com/
├── build.js
├── pages.config.json
├── templates/
├── assets/
├── admin/
└── ...
```

### بعد البناء (dist/):
```
dist/
├── index.html                    ← الرئيسية
├── about/
│   └── index.html                ← example.com/about/
├── services/
│   └── index.html                ← example.com/services/
├── blog/
│   └── index.html
├── portfolio/
│   └── index.html
├── contact/
│   └── index.html
├── assets/                       ← نسخة كاملة
│   ├── css/
│   ├── js/
│   └── images/
├── admin/                        ← نسخة كاملة
│   ├── index.html
│   └── ...
├── sitemap.xml                   ← SEO
└── robots.txt                    ← SEO
```

---

## 🔗 حل مشكلة الروابط

### قبل:
```
❌ /about.html → 404
❌ /services → 404 (لا يوجد index)
❌ /blog/ → يعرض قائمة الملفات
```

### بعد:
```
✓ /about → dist/about/index.html
✓ /services → dist/services/index.html
✓ /blog/ → dist/blog/index.html (صفحة كاملة)
```

### تكوين Apache (.htaccess):

```apache
# Clean URLs already configured
RewriteEngine On

# Remove .html
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}\.html -f
RewriteRule ^(.+)$ $1.html [L,QSA]

# Trailing slash
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_URI} !(.*)/$
RewriteRule ^(.*)$ $1/ [L,R=301]
```

---

## 🚀 أوامر npm

### أوامر متاحة:

```bash
# بناء كامل
npm run build

# بناء صفحات فقط
npm run build:pages

# بناء النسخة العربية فقط
npm run build:ar

# بناء مع المراقبة (يعيد البناء عند التغيير)
npm run build:watch

# مسح مجلد dist
npm run clean

# تشغيل سيرفر محلي (preview)
npm run serve

# بناء + تشغيل سيرفر
npm run dev
```

### أمثلة:

```bash
# بناء الموقع
npm run build

# معاينة الموقع
npm run serve
# ثم افتح: http://localhost:8080

# تطوير مع إعادة بناء تلقائية
npm run build:watch
```

---

## 🎯 سير العمل (Workflow)

### 1. تطوير المحتوى:

```bash
# 1. عدّل pages.config.json
# أضف صفحات جديدة

# 2. أنشئ قوالب في templates/
# أضف sections جديدة

# 3. ابنِ الموقع
npm run build

# 4. عاين النتيجة
npm run serve
```

### 2. تحديث التصميم:

```bash
# 1. عدّل assets/css/
# غيّر الستايلات

# 2. ابنِ مرة أخرى
npm run build
# سيتم نسخ assets/ تلقائياً
```

### 3. النشر (Deployment):

```bash
# 1. ابنِ النسخة النهائية
npm run build

# 2. ارفع محتوى dist/ للسيرفر
# يمكنك استخدام:
# - FTP
# - rsync
# - Git deployment
# - Hosting platforms (Netlify, Vercel, etc.)

# مثال rsync:
rsync -avz dist/ user@server:/var/www/html/
```

---

## 📊 المميزات المتقدمة

### 1. Sitemap تلقائي:

```xml
<!-- Generated automatically -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://technologyksa.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://technologyksa.com/services</loc>
    <priority>0.9</priority>
  </url>
  <!-- ... -->
</urlset>
```

### 2. Robots.txt تلقائي:

```
User-agent: *
Allow: /
Sitemap: https://technologyksa.com/sitemap.xml
```

### 3. SEO Tags كاملة:

```html
<!-- في كل صفحة -->
<meta name="description" content="...">
<meta name="keywords" content="...">

<!-- Open Graph -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:url" content="...">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
```

---

## 🔧 التخصيص

### إضافة متغيرات جديدة:

```javascript
// في build.js - TemplateEngine.render()
const pageData = {
  ...data,
  // إضافة متغيرات مخصصة
  companyName: 'Technology KSA',
  foundedYear: 2020,
  teamSize: 50
};
```

### إضافة sections ديناميكية:

```javascript
// templates/partials/sections/team.html
<section id="team">
  <div class="container">
    <h2>فريقنا</h2>
    <!-- محتوى ديناميكي سيتم تحميله من site-loader.js -->
    <div id="team-members" data-load="team"></div>
  </div>
</section>
```

---

## 🐛 استكشاف الأخطاء

### المشكلة: صفحة لا تُبنى

```bash
# تحقق من:
1. pages.config.json صحيح؟
2. slug فريد؟
3. sections موجودة في templates/?

# تشغيل build بوضع debug:
node build.js --verbose
```

### المشكلة: Assets لا تُنسخ

```bash
# تحقق من:
1. مجلد assets/ موجود؟
2. الصلاحيات صحيحة؟

# حل:
npm run clean
npm run build
```

### المشكلة: روابط مكسورة

```bash
# تأكد من:
1. استخدام روابط نسبية: /about (وليس about.html)
2. .htaccess موجود
3. Clean URLs مفعلة
```

---

## 📚 أمثلة عملية

### Example 1: إضافة صفحة "الأسعار"

```bash
# 1. pages.config.json
{
  "id": "pricing",
  "slug": "pricing",
  "title": "الأسعار",
  "sections": ["pricing-hero", "pricing-table"]
}

# 2. templates/partials/sections/pricing-hero.html
<section id="pricing-hero">
  <h1>أسعار خدماتنا</h1>
</section>

# 3. templates/partials/sections/pricing-table.html
<section id="pricing-table">
  <div class="pricing-grid">
    <!-- جداول الأسعار -->
  </div>
</section>

# 4. Build
npm run build

# النتيجة: dist/pricing/index.html ✓
```

### Example 2: تعدد اللغات

```javascript
// pages.config.json
{
  "slug": "services",
  "slugAr": "خدماتنا",
  "title": "Services",
  "titleAr": "خدماتنا"
}

// سيتم توليد:
// dist/services/index.html (عربي - default)
// dist/en/services/index.html (إنجليزي)
```

---

## 🚀 الاستضافة

### الاستضافة الثابتة (Static Hosting):

```bash
# يمكن استضافة dist/ على:

1. Netlify
   - drag & drop dist/
   - أو ربط مع Git

2. Vercel
   - vercel deploy dist/

3. GitHub Pages
   - git subtree push --prefix dist origin gh-pages

4. استضافة تقليدية
   - رفع محتوى dist/ عبر FTP
```

### تكوين السيرفر:

```nginx
# Nginx
server {
    listen 80;
    server_name technologyksa.com;
    root /var/www/technologyksa.com/dist;

    location / {
        try_files $uri $uri/ $uri/index.html =404;
    }
}
```

---

## ✅ Checklist

- [ ] تثبيت Node.js
- [ ] npm install (اختياري)
- [ ] تكوين pages.config.json
- [ ] إنشاء templates
- [ ] npm run build
- [ ] npm run serve (للمعاينة)
- [ ] رفع dist/ للسيرفر

---

## 📊 الإحصائيات

- **700+ سطر** build.js
- **Unlimited** صفحات
- **SEO** كامل تلقائي
- **Multi-language** support
- **Zero** dependencies (core modules only)

---

**آخر تحديث:** 2025-01-10
**الحالة:** ✅ جاهز للاستخدام

---

**🎉 نظام البناء جاهز!**

استخدم `npm run build` لبناء موقعك الآن.
