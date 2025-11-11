# 📧 دليل نظام التسويق بالبريد الإلكتروني

## نظرة عامة

نظام شامل لإدارة البريد الإلكتروني والتسويق مع دعم SMTP و IMAP ومنشئ القوالب الاحترافي.

---

## 📦 المكونات الرئيسية

### 1. **نظام إدارة البريد الإلكتروني**

```
📁 /assets/js/email-marketing-plugin.js
📁 /assets/js/email-admin-ui.js
📁 /admin/email-views.html
```

**الميزات:**
- ✅ إرسال واستقبال البريد الإلكتروني
- ✅ اتصال SMTP لإرسال البريد
- ✅ اتصال IMAP لاستقبال البريد
- ✅ منشئ قوالب البريد الاحترافي
- ✅ ربط تلقائي مع نماذج الاتصال
- ✅ إدارة جهات الاتصال
- ✅ الرد التلقائي
- ✅ إحصائيات شاملة

---

## 🚀 البداية السريعة

### تفعيل النظام:

1. **افتح Admin Panel** → الإضافات
2. **ابحث عن "التسويق بالبريد الإلكتروني - Email Marketing"**
3. **اضغط "تفعيل"**
4. **ستظهر قائمة "البريد الإلكتروني" في القائمة الجانبية**

### إعداد SMTP (الإرسال):

```
1. اذهب إلى: البريد الإلكتروني → الإعدادات
2. ضمن قسم SMTP:
   - عنوان الخادم: smtp.gmail.com (مثال)
   - المنفذ: 587
   - فعّل: استخدام TLS/SSL
   - اسم المستخدم: your-email@gmail.com
   - كلمة المرور: [App Password]
   - اسم المرسل: اسم موقعك
   - البريد الإلكتروني للمرسل: noreply@yoursite.com
3. اضغط "اختبار الاتصال"
4. احفظ الإعدادات
```

### إعداد IMAP (الاستقبال):

```
1. في نفس صفحة الإعدادات
2. ضمن قسم IMAP:
   - عنوان الخادم: imap.gmail.com
   - المنفذ: 993
   - فعّل: استخدام SSL
   - اسم المستخدم: your-email@gmail.com
   - كلمة المرور: [App Password]
3. اضغط "اختبار الاتصال"
4. احفظ الإعدادات
```

---

## 📋 الميزات التفصيلية

### 1. **إدارة البريد الإلكتروني**

#### صناديق البريد:

**صندوق الوارد (Inbox):**
- استقبال الرسائل من Contact Form
- استقبال الرسائل من IMAP
- تعليم كمقروء/غير مقروء
- تمييز الرسائل بنجمة

**المرسل (Sent):**
- جميع الرسائل المرسلة
- تتبع حالة الإرسال

**المسودات (Draft):**
- الرسائل المحفوظة للإرسال لاحقاً

**المحذوفات (Trash):**
- الرسائل المحذوفة

#### إرسال بريد جديد:

```javascript
// من واجهة Admin
1. اضغط "إرسال بريد جديد"
2. املأ:
   - إلى: email@example.com
   - الموضوع: عنوان الرسالة
   - الرسالة: محتوى HTML
3. اضغط "إرسال"
```

#### الرد على رسالة:

```
1. افتح الرسالة من صندوق الوارد
2. اضغط "رد"
3. سيتم ملء البريد الإلكتروني للمستلم تلقائياً
4. اكتب ردك
5. اضغط "إرسال"
```

#### البحث في الرسائل:

```javascript
// البحث في جميع الحقول
emailManager.searchEmails('كلمة البحث');

// يبحث في:
- الموضوع
- المرسل
- المستقبل
- محتوى الرسالة
```

---

### 2. **قوالب البريد الإلكتروني**

#### القوالب الافتراضية:

**1. رسالة الترحيب:**
```html
الموضوع: مرحباً بك في {{site_name}}
المتغيرات: site_name, customer_name, site_url
الاستخدام: رسالة ترحيب للعملاء الجدد
```

**2. رد على استفسار:**
```html
الموضوع: رد على استفسارك - {{site_name}}
المتغيرات: site_name, customer_name, reply_message
الاستخدام: الرد على استفسارات العملاء
```

**3. نشرة بريدية:**
```html
الموضوع: {{newsletter_title}} - {{site_name}}
المتغيرات: site_name, newsletter_title, newsletter_content, logo_url, unsubscribe_url
الاستخدام: إرسال نشرات بريدية
```

**4. إشعار عام:**
```html
الموضوع: إشعار: {{notification_title}}
المتغيرات: site_name, notification_title, notification_message
الاستخدام: إشعارات عامة
```

#### إنشاء قالب جديد:

```
1. اذهب إلى: القوالب
2. اضغط "إضافة قالب جديد"
3. املأ:
   - اسم القالب
   - التصنيف: عام/دعم فني/تسويق/إشعارات/مخصص
   - الموضوع
   - محتوى القالب (HTML)
4. استخدم المتغيرات:
   - {{site_name}}
   - {{customer_name}}
   - {{site_url}}
   - {{date}}
5. اضغط "حفظ القالب"
```

#### استخدام قالب:

```
1. من صفحة القوالب
2. اضغط "استخدام" على القالب المطلوب
3. سيفتح نافذة الإرسال مع القالب معبأ
4. عدّل حسب الحاجة
5. أرسل
```

#### تعديل قالب:

```
1. اضغط "تعديل" على القالب
2. عدّل:
   - محرر الكود: لتعديل HTML
   - المعاينة: لرؤية النتيجة
3. احفظ التغييرات
```

#### المتغيرات المتاحة:

```javascript
{
  site_name: 'اسم الموقع',
  customer_name: 'اسم العميل',
  site_url: 'رابط الموقع',
  date: 'التاريخ الحالي',
  // يمكن إضافة متغيرات مخصصة
}
```

---

### 3. **جهات الاتصال**

#### إضافة جهة اتصال:

```javascript
{
  name: 'محمد أحمد',
  email: 'mohammed@example.com',
  phone: '+966 50 123 4567',
  company: 'شركة التقنية',
  tags: ['عميل', 'vip']
}
```

#### الحقول:

- **الاسم**: الاسم الكامل
- **البريد الإلكتروني**: البريد الإلكتروني (مطلوب)
- **رقم الهاتف**: رقم الهاتف (اختياري)
- **الشركة**: اسم الشركة (اختياري)
- **Tags**: وسوم التصنيف

#### الإضافة التلقائية:

```javascript
// عند استلام رسالة من Contact Form
// يتم إضافة المرسل تلقائياً إلى جهات الاتصال
emailManager.handleContactFormSubmission(formData);
```

#### إرسال بريد لجهة اتصال:

```
1. من قائمة جهات الاتصال
2. اضغط أيقونة "إرسال بريد"
3. سيفتح نافذة الإرسال مع البريد الإلكتروني معبأ
```

---

### 4. **ربط نماذج الاتصال**

#### الربط التلقائي:

```javascript
// تم ربط النظام تلقائياً مع جميع نماذج الاتصال
// عند إرسال نموذج اتصال:

// 1. يتم حفظ الرسالة في صندوق الوارد
emailManager.handleContactFormSubmission(formData);

// 2. يتم إضافة المرسل إلى جهات الاتصال

// 3. يتم إرسال رد تلقائي (إذا كان مفعلاً)
```

#### بنية نموذج الاتصال:

```html
<form class="contact-form">
  <input name="name" required>
  <input name="email" type="email" required>
  <input name="phone">
  <input name="subject">
  <textarea name="message" required></textarea>
  <button type="submit">إرسال</button>
</form>
```

#### الرد التلقائي:

```
1. الإعدادات → إعدادات عامة
2. فعّل: الرد التلقائي
3. اكتب رسالة الرد التلقائي
4. احفظ

الآن عند استلام رسالة من Contact Form:
→ يتم إرسال الرد التلقائي تلقائياً
```

---

## 💾 تخزين البيانات

### localStorage Keys:

```javascript
{
  // Emails
  'techksa_emails': [...],

  // Templates
  'techksa_email_templates': [...],

  // Contacts
  'techksa_email_contacts': [...],

  // Settings
  'techksa_plugin_emailmarketing_settings': {...}
}
```

### بنية Email:

```javascript
{
  id: 'email-1234567890',
  from: 'sender@example.com',
  to: 'recipient@example.com',
  subject: 'موضوع الرسالة',
  body: '<html>...</html>',
  templateId: 'template-welcome',
  status: 'sent', // draft, sent, failed, received
  type: 'outgoing', // outgoing, incoming
  folder: 'sent', // inbox, sent, draft, trash
  read: false,
  starred: false,
  tags: ['important'],
  attachments: [],
  dateCreated: '2025-01-10T12:00:00.000Z',
  dateSent: '2025-01-10T12:05:00.000Z'
}
```

### بنية Template:

```javascript
{
  id: 'template-1234567890',
  name: 'رسالة الترحيب',
  subject: 'مرحباً بك في {{site_name}}',
  body: '<html>...</html>',
  variables: ['site_name', 'customer_name'],
  category: 'general',
  dateCreated: '2025-01-10T12:00:00.000Z'
}
```

### بنية Contact:

```javascript
{
  id: 'contact-1234567890',
  name: 'محمد أحمد',
  email: 'mohammed@example.com',
  phone: '+966 50 123 4567',
  company: 'شركة التقنية',
  tags: ['عميل'],
  dateAdded: '2025-01-10T12:00:00.000Z',
  lastEmailDate: '2025-01-10T14:30:00.000Z',
  emailCount: 5
}
```

---

## 🛠️ دوال API الرئيسية

### Email Manager:

```javascript
// إضافة بريد
emailManager.addEmail(emailData);

// تحديث بريد
emailManager.updateEmail(id, emailData);

// حذف بريد
emailManager.deleteEmail(id);

// الحصول على بريد
emailManager.getEmail(id);

// تعليم كمقروء
emailManager.markAsRead(id);

// تمييز بنجمة
emailManager.toggleStar(id);

// نقل إلى مجلد
emailManager.moveToFolder(id, 'sent');

// إرسال بريد
await emailManager.sendEmail(emailData);

// استقبال بريد
await emailManager.fetchEmails();

// البحث
emailManager.searchEmails('كلمة البحث');

// الحصول على رسائل مجلد
emailManager.getEmailsByFolder('inbox');

// عدد غير المقروءة
emailManager.getUnreadCount();

// الإحصائيات
emailManager.getEmailStats();
```

### Template Manager:

```javascript
// إضافة قالب
emailManager.addTemplate(templateData);

// تحديث قالب
emailManager.updateTemplate(id, templateData);

// حذف قالب
emailManager.deleteTemplate(id);

// الحصول على قالب
emailManager.getTemplate(id);

// استبدال المتغيرات
emailManager.replaceVariables(template, {
  site_name: 'Technology KSA',
  customer_name: 'محمد'
});
```

### Contacts Manager:

```javascript
// إضافة جهة اتصال
emailManager.addContact(contactData);

// تحديث جهة اتصال
emailManager.updateContact(id, contactData);

// حذف جهة اتصال
emailManager.deleteContact(id);

// الحصول بالبريد الإلكتروني
emailManager.getContactByEmail('email@example.com');
```

---

## 🎯 أمثلة عملية

### Example 1: إرسال بريد بسيط

```javascript
const result = await emailManager.sendEmail({
  from: 'noreply@techksa.com',
  to: 'customer@example.com',
  subject: 'مرحباً بك',
  body: '<h1>أهلاً بك في موقعنا</h1><p>نشكرك على تسجيلك.</p>'
});

if (result.success) {
  console.log('تم الإرسال بنجاح');
}
```

### Example 2: استخدام قالب

```javascript
// 1. الحصول على القالب
const template = emailManager.getTemplate('template-welcome');

// 2. استبدال المتغيرات
const body = emailManager.replaceVariables(template.body, {
  site_name: 'Technology KSA',
  customer_name: 'محمد أحمد',
  site_url: 'https://techksa.com'
});

// 3. الإرسال
await emailManager.sendEmail({
  from: 'noreply@techksa.com',
  to: 'customer@example.com',
  subject: template.subject,
  body: body,
  templateId: template.id
});
```

### Example 3: معالجة Contact Form

```javascript
// عند إرسال نموذج الاتصال
const formData = {
  name: 'أحمد محمد',
  email: 'ahmed@example.com',
  phone: '+966 50 123 4567',
  subject: 'استفسار عن الخدمات',
  message: 'أريد الاستفسار عن...'
};

// معالجة تلقائية
const email = emailManager.handleContactFormSubmission(formData);

// سيتم:
// 1. حفظ الرسالة في صندوق الوارد
// 2. إضافة المرسل إلى جهات الاتصال
// 3. إرسال رد تلقائي (إذا كان مفعلاً)
```

### Example 4: إنشاء قالب مخصص

```javascript
emailManager.addTemplate({
  name: 'تأكيد الطلب',
  subject: 'تأكيد طلبك #{{order_number}}',
  category: 'custom',
  body: `
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
      <h2>شكراً لطلبك!</h2>
      <p>عزيزي {{customer_name}},</p>
      <p>تم استلام طلبك رقم <strong>{{order_number}}</strong></p>
      <p>المبلغ: {{total_amount}} ريال</p>
      <a href="{{order_url}}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        عرض الطلب
      </a>
    </div>
  `,
  variables: ['customer_name', 'order_number', 'total_amount', 'order_url']
});
```

### Example 5: البحث المتقدم

```javascript
// البحث في الرسائل
const results = emailManager.searchEmails('فاتورة');

// عرض النتائج
results.forEach(email => {
  console.log(`${email.from}: ${email.subject}`);
});

// الفلترة حسب مجلد
const inboxEmails = emailManager.getEmailsByFolder('inbox');
const sentEmails = emailManager.getEmailsByFolder('sent');
```

### Example 6: الإحصائيات

```javascript
const stats = emailManager.getEmailStats();

console.log(`
  إجمالي الرسائل: ${stats.total}
  رسائل مرسلة: ${stats.sent}
  رسائل واردة: ${stats.received}
  غير مقروءة: ${stats.unread}
  مميزة بنجمة: ${stats.starred}
`);
```

---

## 🎨 التخصيص

### تخصيص القوالب:

```javascript
// إضافة متغيرات مخصصة
const customVariables = {
  company_name: 'شركتي',
  phone: '+966 11 234 5678',
  address: 'الرياض، المملكة العربية السعودية'
};

const body = emailManager.replaceVariables(template.body, customVariables);
```

### تخصيص الإعدادات:

```javascript
// تحديث الإعدادات
emailManager.settings = {
  ...emailManager.settings,
  enableAutoReply: true,
  autoReplyMessage: 'شكراً لرسالتك. سنرد عليك خلال 24 ساعة.',
  smtpFromName: 'فريق التقنية السعودية'
};

emailManager.saveSettings();
```

---

## 📱 دمج مع Gmail

### إعداد Gmail SMTP:

```
1. تفعيل 2-Step Verification في حساب Gmail
2. إنشاء App Password:
   - اذهب إلى: https://myaccount.google.com/apppasswords
   - اختر "Mail" و "Other"
   - اكتب "TechKSA Website"
   - انسخ الـ 16-digit password

3. في إعدادات SMTP:
   - Host: smtp.gmail.com
   - Port: 587
   - User: your-email@gmail.com
   - Password: [App Password من الخطوة 2]
```

### إعداد Gmail IMAP:

```
1. في Gmail Settings → Forwarding and POP/IMAP
2. Enable IMAP

3. في إعدادات IMAP:
   - Host: imap.gmail.com
   - Port: 993
   - User: your-email@gmail.com
   - Password: [نفس App Password]
```

---

## 🔒 الأمان

### حماية البيانات:

- ✅ التحقق من المدخلات
- ✅ تخزين آمن في localStorage
- ✅ منع XSS في محتوى البريد
- ✅ التحقق من صحة البريد الإلكتروني

### ملاحظة مهمة:

⚠️ **للإنتاج الفعلي:**
- يجب إنشاء Backend API
- تخزين البيانات في قاعدة بيانات
- استخدام HTTPS
- تشفير كلمات المرور
- استخدام OAuth بدلاً من كلمات المرور المباشرة

---

## 🚧 النظام الحالي vs الإنتاج

### النظام الحالي (Frontend Simulation):

```javascript
// محاكاة SMTP
simulateSmtpSend(emailData) {
  // يحفظ في localStorage
  // لا يرسل بريد حقيقي
}

// محاكاة IMAP
simulateImapFetch() {
  // لا يستقبل بريد حقيقي
}
```

### للإنتاج (Backend Required):

```javascript
// Backend API endpoint
POST /api/email/send
{
  "to": "customer@example.com",
  "subject": "مرحباً",
  "body": "<html>...</html>"
}

// Backend يتصل بـ SMTP
// ويرسل البريد فعلياً

// Backend API endpoint
GET /api/email/fetch

// Backend يتصل بـ IMAP
// ويحضر البريد الجديد
```

---

## 📊 الإحصائيات

- **9 ميزات** رئيسية
- **4 قوالب** جاهزة
- **20+ دالة** API
- **Unlimited** رسائل وجهات اتصال
- **SMTP & IMAP** support ready

---

## 🎓 دروس تعليمية

### درس 1: إرسال أول بريد

```
1. فعّل الإضافة
2. اذهب إلى الإعدادات وأدخل بيانات SMTP
3. اضغط "إرسال بريد جديد"
4. املأ البيانات وأرسل
```

### درس 2: إنشاء قالب مخصص

```
1. القوالب → إضافة قالب جديد
2. اكتب HTML مع متغيرات
3. احفظ
4. استخدم القالب في الإرسال
```

### درس 3: ربط Contact Form

```
1. أضف class="contact-form" إلى النموذج
2. تأكد من وجود الحقول: name, email, message
3. النظام سيتعامل معه تلقائياً
```

---

## 📞 الدعم

للاستفسارات:
- 📖 راجع: `PLUGINS-ECOMMERCE-GUIDE.md`
- 📖 راجع: `CMS-DOCUMENTATION.md`
- 📖 راجع: `README.md`

---

## ✅ Checklist التطبيق

- [x] EmailManager Class
- [x] SMTP Configuration
- [x] IMAP Configuration
- [x] Send Email Function
- [x] Fetch Emails Function
- [x] Email Templates System
- [x] Template Builder
- [x] Default Templates (4)
- [x] Contacts Management
- [x] Contact Form Integration
- [x] Auto Reply
- [x] Email Search
- [x] Email Folders (inbox, sent, draft, trash)
- [x] Mark as Read/Unread
- [x] Star/Unstar
- [x] Reply to Email
- [x] Admin UI
- [x] Statistics Dashboard
- [ ] Backend API Integration (قادم)
- [ ] Real SMTP/IMAP Connection (يحتاج Backend)
- [ ] Attachments Support (قادم)
- [ ] Email Analytics (قادم)

---

**آخر تحديث:** 2025-01-10
**الحالة:** ✅ نظام البريد الإلكتروني جاهز للاستخدام (Frontend Ready)

---

**🎉 النظام جاهز للتجربة!**

**ملاحظة:** النظام الحالي يعمل بشكل محاكي (Simulation). للاستخدام الفعلي، يجب إنشاء Backend API يتصل فعلياً بـ SMTP و IMAP.
