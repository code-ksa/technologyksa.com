# 🚀 دليل التشغيل السريع - Technology KSA

## ⚡ التشغيل السريع (Quick Start)

### على Windows مع WSL:

```bash
# في WSL Terminal
./start-wsl.sh
```

### على Windows مباشرة:

اضغط مزدوجاً على:
```
START.bat
```

---

## 📋 خطوات مفصلة

### الخيار 1: استخدام WSL (موصى به للمطورين)

1. **افتح WSL Terminal:**
   ```bash
   wsl
   ```

2. **اذهب لمجلد المشروع:**
   ```bash
   cd /mnt/c/Users/ramde/Documents/GitHub/technologyksa.com
   ```

3. **شغّل السكريبت:**
   ```bash
   ./start-wsl.sh
   ```

**ما سيحدث:**
- ✅ تثبيت المكتبات إذا لزم الأمر
- ✅ إيقاف أي عمليات قديمة على المنافذ 3001 و 8080
- ✅ تشغيل Publisher API
- ✅ تشغيل HTTP Server
- ✅ فتح لوحة التحكم في المتصفح

**اترك Terminal مفتوحاً!**

### الخيار 2: تشغيل يدوي (WSL)

إذا فضّلت التحكم اليدوي:

#### Terminal 1 - Publisher API:
```bash
node publisher-api.js
```

يجب أن ترى:
```
✓ Publisher API running on http://localhost:3001
✓ Ready to publish pages and posts
```

#### Terminal 2 - HTTP Server:
```bash
npx http-server ./dist -p 8080
```

يجب أن ترى:
```
Available on:
  http://127.0.0.1:8080
```

---

## 🔍 اختبار الاتصال

### اختبر Publisher API:

```bash
curl http://localhost:3001/api/health
```

**النتيجة المتوقعة:**
```json
{"success":true,"status":"running","timestamp":"2025-11-13T..."}
```

### اختبر HTTP Server:

```bash
curl http://127.0.0.1:8080
```

يجب أن يعرض HTML بدون أخطاء.

---

## 🌐 فتح لوحة التحكم

### من WSL:

```bash
cmd.exe /c start http://127.0.0.1:8080/admin/index.html
```

### من Windows:

افتح في أي متصفح:
```
http://127.0.0.1:8080/admin/index.html
```

---

## ❌ حل المشاكل الشائعة

### المشكلة 1: `concurrently: not found`

**الحل:**
```bash
npm install
```

### المشكلة 2: `EADDRINUSE: address already in use`

**السبب:** المنفذ مشغول بالفعل

**الحل:**
```bash
# إيقاف جميع العمليات على المنافذ
pkill -f publisher-api.js
pkill -f http-server
fuser -k 3001/tcp
fuser -k 8080/tcp

# ثم شغّل من جديد
./start-wsl.sh
```

### المشكلة 3: `curl: command not found`

**الحل:**
```bash
sudo apt-get update
sudo apt-get install curl
```

### المشكلة 4: البيانات لا تُحفظ

**السبب:** localStorage في المتصفح

**الحل:**
- افتح Console (F12)
- اذهب لـ Application → Local Storage
- احذف البيانات القديمة
- أعد تحميل الصفحة

---

## 🛑 إيقاف النظام

### إذا استخدمت start-wsl.sh:

اضغط:
```
Ctrl + C
```

### يدوياً:

```bash
pkill -f publisher-api.js
pkill -f http-server
```

أو:

```bash
fuser -k 3001/tcp
fuser -k 8080/tcp
```

---

## 📊 التحقق من العمليات المشغّلة

```bash
# عرض جميع عمليات Node
ps aux | grep node

# عرض العمليات على المنافذ
netstat -tlnp | grep -E "3001|8080"
```

---

## 🔄 إعادة التشغيل السريع

```bash
# إيقاف
pkill -f publisher-api.js
pkill -f http-server

# انتظر
sleep 2

# تشغيل
./start-wsl.sh
```

---

## 📝 ملخص الأوامر المهمة

| الأمر | الوظيفة |
|-------|---------|
| `./start-wsl.sh` | تشغيل النظام كاملاً |
| `pkill -f publisher-api.js` | إيقاف Publisher API |
| `pkill -f http-server` | إيقاف HTTP Server |
| `curl http://localhost:3001/api/health` | اختبار API |
| `tail -f /tmp/publisher-api.log` | عرض سجلات API |
| `npm install` | تثبيت المكتبات |

---

## 🎯 سير العمل الموصى به

1. **افتح WSL:**
   ```bash
   wsl
   cd /mnt/c/Users/ramde/Documents/GitHub/technologyksa.com
   ```

2. **شغّل النظام:**
   ```bash
   ./start-wsl.sh
   ```

3. **افتح لوحة التحكم:**
   ```
   http://127.0.0.1:8080/admin/index.html
   ```

4. **اعمل على المشروع...**

5. **عند الانتهاء:**
   ```
   Ctrl + C
   ```

---

## 🆘 إذا استمرت المشكلة

### 1. احذف node_modules وأعد التثبيت:

```bash
rm -rf node_modules package-lock.json
npm install
```

### 2. تأكد من إصدار Node.js:

```bash
node --version  # يجب أن يكون v18 أو أحدث
npm --version
```

### 3. راجع السجلات:

```bash
# سجل Publisher API
tail -f /tmp/publisher-api.log

# سجل HTTP Server
tail -f /tmp/http-server.log
```

### 4. تحقق من الملفات المطلوبة:

```bash
ls -la publisher-api.js
ls -la admin/cms-extended.js
ls -la admin/core-publisher.js
ls -la admin/core-integration.js
```

---

## ✅ التأكد من نجاح التشغيل

بعد تشغيل `./start-wsl.sh`، تحقق من:

- ✅ **Publisher API:** `curl http://localhost:3001/api/health` يعرض JSON
- ✅ **HTTP Server:** `curl http://127.0.0.1:8080` يعرض HTML
- ✅ **Admin Panel:** يفتح في المتصفح بدون أخطاء 404
- ✅ **Console:** لا توجد أخطاء باللون الأحمر (F12)

---

**كل شيء يعمل؟ رائع! ابدأ العمل 🚀**

**لا يزال لا يعمل؟** راجع `README-AR.md` للمزيد من التفاصيل.
