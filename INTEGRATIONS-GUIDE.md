# 🔌 دليل نظام التكاملات والتتبع

## نظرة عامة

نظام شامل للتكامل مع جميع منصات التحليل والتتبع والإعلان وإدارة علاقات العملاء (CRM).

---

## 📦 التكاملات المدعومة

### 1. **Google Analytics 4 (GA4)** 📊
- تتبع شامل لحركة المرور
- تحليل سلوك المستخدمين
- تقارير مخصصة
- تتبع التحويلات

### 2. **Meta Pixel (Facebook & Instagram)** 📘
- تتبع التحويلات
- إعادة الاستهداف
- Custom Audiences
- تحسين الحملات الإعلانية

### 3. **TikTok Pixel** 🎵
- تتبع أحداث الموقع
- تحسين الإعلانات
- جماهير مخصصة
- قياس ROI

### 4. **Snapchat Pixel** 👻
- تتبع Snap Ads
- قياس التحويلات
- Snap Audience Network

### 5. **Microsoft Clarity** 🔍
- تسجيل جلسات المستخدمين
- خرائط حرارية (Heatmaps)
- تحليل النقرات
- **مجاني بالكامل!**

### 6. **Bing Ads (UET)** 🔎
- تتبع حملات Bing
- Conversion Tracking
- Remarketing Lists

### 7. **Yandex Metrica** 🇷🇺
- تحليل شامل للزوار
- Webvisor لتسجيل الجلسات
- مثالي للسوق الروسي

### 8. **Perfex CRM** 💼
- مزامنة جهات الاتصال
- إنشاء Leads تلقائياً
- ربط API كامل

### 9. **Custom Scripts** 📝
- Google Tag Manager
- أي سكريبتات مخصصة

---

## 🚀 البداية السريعة

### تفعيل النظام:

```
1. Admin Panel → الإضافات
2. ابحث عن "التكاملات والتتبع - Integrations"
3. اضغط "تفعيل"
4. ستظهر قائمة "التكاملات" في القائمة الجانبية
```

---

## 📋 إعداد التكاملات

### 1. Google Analytics 4

#### الحصول على Measurement ID:

```
1. اذهب إلى: analytics.google.com
2. Admin → Data Streams
3. اختر Web Stream أو أنشئ واحد جديد
4. انسخ Measurement ID (يبدأ بـ G-)
```

#### التكوين:

```
التكاملات → الإعدادات → Google Analytics
☑ تفعيل Google Analytics
Measurement ID: G-XXXXXXXXXX
☑ إرسال Page View تلقائياً
→ حفظ
```

#### الأحداث المتاحة:

```javascript
// Page View
integrationsManager.trackPageView('/about', 'عن الشركة');

// Custom Event
integrationsManager.trackGAEvent('button_click', {
  button_name: 'download',
  category: 'engagement'
});

// Conversion
integrationsManager.trackConversion('purchase', 500, 'SAR');
```

---

### 2. Meta Pixel (Facebook)

#### الحصول على Pixel ID:

```
1. اذهب إلى: facebook.com/events_manager
2. Data Sources → Pixels
3. أنشئ Pixel جديد أو اختر موجود
4. انسخ Pixel ID (15 رقم)
```

#### التكوين:

```
التكاملات → الإعدادات → Meta Pixel
☑ تفعيل Meta Pixel
Pixel ID: 123456789012345
☑ تتبع Page View تلقائياً
→ حفظ
```

#### الأحداث القياسية:

```javascript
// Page View (تلقائي)
// Manual Page View
fbq('track', 'PageView');

// View Content
integrationsManager.trackMetaEvent('ViewContent', {
  content_name: 'Product Page',
  content_ids: ['1234'],
  content_type: 'product'
});

// Add to Cart
integrationsManager.trackMetaEvent('AddToCart', {
  content_ids: ['1234'],
  content_type: 'product',
  value: 299.99,
  currency: 'SAR'
});

// Purchase
integrationsManager.trackMetaEvent('Purchase', {
  value: 500,
  currency: 'SAR',
  content_ids: ['1234', '5678']
});

// Lead
integrationsManager.trackMetaEvent('Lead', {
  content_name: 'Contact Form'
});

// Custom Event
integrationsManager.trackMetaCustomEvent('ButtonClick', {
  button_name: 'cta_header'
});
```

---

### 3. TikTok Pixel

#### الحصول على Pixel ID:

```
1. اذهب إلى: ads.tiktok.com
2. Assets → Events → Web Events
3. Manage → Get Pixel Code
4. انسخ Pixel ID
```

#### التكوين:

```
التكاملات → الإعدادات → TikTok Pixel
☑ تفعيل TikTok Pixel
Pixel ID: C1234567890ABCDEFG
→ حفظ
```

#### الأحداث المتاحة:

```javascript
// Page View (تلقائي)
ttq.page();

// View Content
integrationsManager.trackTikTokEvent('ViewContent', {
  content_id: '1234',
  content_type: 'product',
  content_name: 'Product Name'
});

// Add to Cart
integrationsManager.trackTikTokEvent('AddToCart', {
  content_id: '1234',
  value: 299.99,
  currency: 'SAR'
});

// Complete Payment
integrationsManager.trackTikTokEvent('CompletePayment', {
  value: 500,
  currency: 'SAR'
});
```

---

### 4. Snapchat Pixel

#### الحصول على Pixel ID:

```
1. اذهب إلى: ads.snapchat.com
2. Events Manager → Create Pixel
3. انسخ Pixel ID (UUID format)
```

#### التكوين:

```
التكاملات → الإعدادات → Snapchat Pixel
☑ تفعيل Snapchat Pixel
Pixel ID: 12345678-1234-1234-1234-123456789012
→ حفظ
```

#### الأحداث:

```javascript
// Page View (تلقائي)
snaptr('track', 'PAGE_VIEW');

// View Content
integrationsManager.trackSnapchatEvent('VIEW_CONTENT', {
  item_ids: ['1234'],
  item_category: 'electronics'
});

// Add to Cart
integrationsManager.trackSnapchatEvent('ADD_CART', {
  item_ids: ['1234'],
  price: 299.99,
  currency: 'SAR'
});

// Purchase
integrationsManager.trackSnapchatEvent('PURCHASE', {
  price: 500,
  currency: 'SAR',
  transaction_id: 'ORDER123'
});
```

---

### 5. Microsoft Clarity

#### الحصول على Project ID:

```
1. اذهب إلى: clarity.microsoft.com
2. New Project
3. أدخل URL الموقع
4. انسخ Project ID (10 أحرف)
```

#### التكوين:

```
التكاملات → الإعدادات → Microsoft Clarity
☑ تفعيل Microsoft Clarity
Project ID: abcdefghij
→ حفظ
```

#### الميزات:
- ✅ تسجيل تلقائي للجلسات
- ✅ Heatmaps
- ✅ Rage Clicks Detection
- ✅ Dead Clicks Detection
- ✅ مجاني بالكامل

---

### 6. Bing Ads (UET)

#### الحصول على UET Tag ID:

```
1. اذهب إلى: ads.microsoft.com
2. Tools → UET Tag
3. Create UET Tag
4. انسخ Tag ID
```

#### التكوين:

```
التكاملات → الإعدادات → Bing Ads
☑ تفعيل Bing UET
UET Tag ID: 12345678
→ حفظ
```

#### تتبع التحويلات:

```javascript
integrationsManager.trackBingEvent('purchase', {
  revenue_value: 500,
  currency: 'SAR'
});
```

---

### 7. Yandex Metrica

#### الحصول على Counter ID:

```
1. اذهب إلى: metrica.yandex.com
2. Add a tag
3. أدخل URL الموقع
4. انسخ Counter ID (8 أرقام)
```

#### التكوين:

```
التكاملات → الإعدادات → Yandex Metrica
☑ تفعيل Yandex Metrica
Counter ID: 12345678
→ حفظ
```

#### الأحداث:

```javascript
// Reach Goal
integrationsManager.trackYandexEvent('purchase_complete', {
  order_price: 500,
  currency: 'SAR'
});
```

---

### 8. Perfex CRM

#### إعداد API:

```
1. Perfex CRM → Setup → Settings → API
2. ☑ Enable API
3. Generate API Key
4. انسخ API Key
```

#### التكوين:

```
التكاملات → الإعدادات → Perfex CRM
☑ تفعيل Perfex CRM
رابط Perfex: https://crm.example.com
API Key: your-api-key-here
☑ مزامنة جهات الاتصال تلقائياً
→ اختبار الاتصال
→ حفظ
```

#### المزامنة التلقائية:

```javascript
// يتم تلقائياً عند إرسال Contact Form
// جهة الاتصال تُنشأ في Perfex CRM

// إنشاء Lead يدوياً
await integrationsManager.createPerfexLead({
  name: 'أحمد محمد',
  email: 'ahmed@example.com',
  phonenumber: '+966500000000',
  description: 'Lead من الموقع',
  source: 'Website'
});
```

---

### 9. Custom Scripts

#### إضافة Google Tag Manager:

```
التكاملات → الإعدادات → سكريبتات مخصصة

سكريبتات Head:
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXX');</script>
<!-- End Google Tag Manager -->

سكريبتات Body:
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

→ حفظ
```

---

## 🎯 تتبع الأحداث الموحد

### استخدام trackEvent():

```javascript
// تتبع حدث واحد على جميع المنصات
integrationsManager.trackEvent('button_click', {
  button_name: 'cta_header',
  page: 'home'
});

// سيتم إرساله تلقائياً إلى:
// ✅ Google Analytics
// ✅ Meta Pixel
// ✅ TikTok Pixel
// ✅ Snapchat Pixel
// ✅ Bing Ads
// ✅ Yandex Metrica
```

---

## 💰 تتبع التحويلات

### استخدام trackConversion():

```javascript
// Purchase Conversion
integrationsManager.trackConversion('purchase', 500, 'SAR');

// Lead Conversion
integrationsManager.trackConversion('lead', 0, 'SAR');

// Sign Up Conversion
integrationsManager.trackConversion('sign_up', 0, 'SAR');
```

---

## 📱 أحداث شائعة جاهزة

### 1. Page View

```javascript
// تلقائي عند تحميل الصفحة
// أو يدوياً:
integrationsManager.trackPageView('/about', 'عن الشركة');
```

### 2. Add to Cart

```javascript
integrationsManager.trackAddToCart({
  id: 'product-123',
  name: 'Product Name',
  price: 299.99
});
```

### 3. Purchase

```javascript
integrationsManager.trackPurchase({
  total: 500,
  currency: 'SAR',
  order_id: 'ORDER123',
  items: ['product-123', 'product-456']
});
```

### 4. Sign Up

```javascript
integrationsManager.trackSignUp('email');
// or
integrationsManager.trackSignUp('google');
```

### 5. Login

```javascript
integrationsManager.trackLogin('email');
```

### 6. Search

```javascript
integrationsManager.trackSearch('laptop hp');
```

### 7. Contact Form

```javascript
integrationsManager.trackContactForm('contact_page');
```

---

## 🛠️ دوال API الرئيسية

### Integrations Manager:

```javascript
// Initialize
integrationsManager.init();

// Update Settings
integrationsManager.updateSettings({
  ga_enabled: true,
  ga_measurement_id: 'G-XXXXXXXXXX'
});

// Track Event (جميع المنصات)
integrationsManager.trackEvent(eventName, eventData);

// Track Conversion
integrationsManager.trackConversion(type, value, currency);

// Get Enabled Integrations
const enabled = integrationsManager.getEnabledIntegrations();
// Returns: ['Google Analytics', 'Meta Pixel', ...]

// Get Integration Status
const status = integrationsManager.getIntegrationStatus();
// Returns: { google_analytics: true, meta_pixel: false, ... }

// Get Total Events
const count = integrationsManager.getTotalEvents();

// Get Recent Events
const events = integrationsManager.getRecentEvents(10);

// Clear Events
integrationsManager.clearEvents();
```

### Google Analytics:

```javascript
// Track Event
integrationsManager.trackGAEvent('button_click', {
  category: 'engagement',
  label: 'header_cta'
});

// Track Page View
integrationsManager.trackGAPageView('/about', 'عن الشركة');
```

### Meta Pixel:

```javascript
// Standard Event
integrationsManager.trackMetaEvent('Purchase', {
  value: 500,
  currency: 'SAR'
});

// Custom Event
integrationsManager.trackMetaCustomEvent('VideoView', {
  video_title: 'Introduction'
});
```

### TikTok Pixel:

```javascript
integrationsManager.trackTikTokEvent('CompletePayment', {
  value: 500,
  currency: 'SAR'
});
```

### Snapchat Pixel:

```javascript
integrationsManager.trackSnapchatEvent('PURCHASE', {
  price: 500,
  currency: 'SAR'
});
```

### Bing Ads:

```javascript
integrationsManager.trackBingEvent('purchase', {
  revenue_value: 500,
  currency: 'SAR'
});
```

### Yandex Metrica:

```javascript
integrationsManager.trackYandexEvent('goal_name', {
  order_price: 500
});
```

### Perfex CRM:

```javascript
// Sync Contact
await integrationsManager.syncContactToPerfex({
  name: 'أحمد محمد',
  email: 'ahmed@example.com',
  phone: '+966500000000',
  message: 'رسالة من الموقع'
});

// Create Lead
await integrationsManager.createPerfexLead({
  name: 'محمد علي',
  email: 'mohammed@example.com',
  source: 'Website',
  description: 'مهتم بالمنتج X'
});
```

---

## 🎨 أمثلة عملية

### Example 1: إعداد Google Analytics

```javascript
// 1. تفعيل من الإعدادات
// 2. استخدام:

// Track Page View
integrationsManager.trackGAPageView('/services', 'خدماتنا');

// Track Button Click
document.querySelector('.cta-button').addEventListener('click', () => {
  integrationsManager.trackGAEvent('cta_click', {
    button_location: 'header',
    button_text: 'احجز الآن'
  });
});

// Track Form Submit
document.querySelector('#contactForm').addEventListener('submit', () => {
  integrationsManager.trackGAEvent('form_submit', {
    form_name: 'contact',
    form_location: 'contact_page'
  });
});
```

### Example 2: تتبع eCommerce كامل

```javascript
// View Product
integrationsManager.trackEvent('view_item', {
  item_id: 'product-123',
  item_name: 'Laptop HP',
  price: 2999
});

// Add to Cart
integrationsManager.trackAddToCart({
  id: 'product-123',
  name: 'Laptop HP',
  price: 2999
});

// Begin Checkout
integrationsManager.trackEvent('begin_checkout', {
  value: 2999,
  currency: 'SAR',
  items: [{id: 'product-123', name: 'Laptop HP'}]
});

// Purchase
integrationsManager.trackPurchase({
  total: 2999,
  currency: 'SAR',
  order_id: 'ORDER-' + Date.now(),
  items: ['product-123']
});
```

### Example 3: تتبع موحد لجميع المنصات

```javascript
// حدث واحد → جميع المنصات
function trackCTAClick() {
  integrationsManager.trackEvent('cta_click', {
    button_text: 'احجز الآن',
    page: window.location.pathname
  });
}

// سيتم إرساله تلقائياً إلى:
// - Google Analytics (as event)
// - Meta Pixel (as custom event)
// - TikTok Pixel (as custom event)
// - Snapchat Pixel (as custom event)
// - Bing Ads (as event)
// - Yandex Metrica (as reach goal)
```

### Example 4: ربط Perfex CRM مع Contact Forms

```javascript
// تلقائياً عند تفعيل "مزامنة تلقائية"
// أو يدوياً:

document.querySelector('#contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const contactData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    message: formData.get('message')
  };

  // مزامنة مع Perfex
  const result = await integrationsManager.syncContactToPerfex(contactData);

  if (result.success) {
    console.log('تم إنشاء جهة الاتصال في Perfex CRM');
  }

  // تتبع الحدث
  integrationsManager.trackContactForm('contact_page');
});
```

### Example 5: اختبار الأحداث

```javascript
// من Admin Panel:
// التكاملات → الأحداث

// أو من Console:
integrationsManager.trackEvent('test_event', {
  test: true,
  value: 100
});

// مشاهدة الأحداث الأخيرة:
console.log(integrationsManager.getRecentEvents(10));
```

---

## 📊 لوحة التحكم

### معلومات متاحة:

- **عدد التكاملات النشطة**
- **إجمالي الأحداث المرسلة**
- **حالة كل تكامل** (نشط/غير نشط)
- **الأحداث الأخيرة** (مع التفاصيل)

### التحديث التلقائي:

```javascript
// يتم تحديث اللوحة تلقائياً كل 30 ثانية
// أو يدوياً:
updateIntegrationsDashboard();
```

---

## 🔒 الأمان والخصوصية

### حماية البيانات:

- ✅ جميع API Keys محفوظة في localStorage
- ✅ التحقق من المدخلات
- ✅ استخدام HTTPS للاتصالات
- ✅ عدم إرسال بيانات حساسة

### ملاحظة مهمة:

⚠️ **للإنتاج:**
- احمِ API Keys الخاصة بـ Perfex CRM
- استخدم Environment Variables
- لا تشارك API Keys علناً
- راجع سياسة الخصوصية لكل منصة

---

## 🎓 نصائح وأفضل الممارسات

### 1. تسمية الأحداث:

```javascript
// ✅ جيد
'button_click'
'form_submit'
'video_play'

// ❌ سيء
'btnClick'
'fs'
'vp'
```

### 2. بيانات الأحداث:

```javascript
// ✅ جيد
{
  button_name: 'cta_header',
  button_text: 'احجز الآن',
  page: '/services'
}

// ❌ سيء
{
  b: 'cta',
  t: 'احجز',
  p: '/srv'
}
```

### 3. تتبع التحويلات:

```javascript
// ✅ استخدم trackConversion() للتحويلات
integrationsManager.trackConversion('purchase', 500, 'SAR');

// ✅ استخدم trackEvent() للأحداث العامة
integrationsManager.trackEvent('button_click', {});
```

### 4. اختبار التكاملات:

```
1. فعّل التكامل
2. اذهب إلى: التكاملات → الأحداث
3. اضغط "اختبار"
4. تحقق من وصول البيانات في المنصة الأصلية
```

---

## 🚧 استكشاف الأخطاء

### المشكلة: Google Analytics لا يعمل

```
✓ تحقق من Measurement ID (يبدأ بـ G-)
✓ تحقق من تفعيل "إرسال Page View"
✓ انتظر 24-48 ساعة لظهور البيانات
✓ استخدم Google Analytics DebugView للاختبار
```

### المشكلة: Meta Pixel لا يتتبع

```
✓ تحقق من Pixel ID (15 رقم)
✓ استخدم Meta Pixel Helper (Chrome Extension)
✓ تحقق من Console للأخطاء
✓ تأكد من تحميل fbq بنجاح
```

### المشكلة: Perfex CRM لا يتصل

```
✓ تحقق من رابط Perfex (https://...)
✓ تحقق من API Key
✓ تأكد من تفعيل API في Perfex
✓ استخدم "اختبار الاتصال"
✓ تحقق من CORS Settings في Perfex
```

---

## 📞 الدعم

للاستفسارات:
- 📖 راجع: `EMAIL-MARKETING-GUIDE.md`
- 📖 راجع: `PLUGINS-ECOMMERCE-GUIDE.md`
- 📖 راجع: `CMS-DOCUMENTATION.md`

---

## ✅ Checklist التكاملات

### إعداد أساسي:
- [ ] تفعيل Integrations Plugin
- [ ] إعداد Google Analytics
- [ ] إعداد Meta Pixel
- [ ] اختبار تتبع الأحداث

### إعداد متقدم:
- [ ] إضافة TikTok Pixel
- [ ] إضافة Snapchat Pixel
- [ ] إضافة Microsoft Clarity
- [ ] إضافة Bing Ads
- [ ] إضافة Yandex Metrica

### CRM:
- [ ] إعداد Perfex CRM
- [ ] اختبار الاتصال
- [ ] تفعيل المزامنة التلقائية
- [ ] اختبار إنشاء جهة اتصال

### سكريبتات مخصصة:
- [ ] إضافة Google Tag Manager
- [ ] إضافة سكريبتات أخرى

---

## 📊 الإحصائيات

- **8 منصات** مدعومة
- **40+ دالة** API
- **Unlimited** أحداث
- **تتبع موحد** لجميع المنصات
- **ربط API** مع Perfex CRM

---

**آخر تحديث:** 2025-01-10
**الحالة:** ✅ جاهز للاستخدام

---

**🎉 النظام جاهز للاستخدام!**
