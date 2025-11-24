# 🌐 دليل نشر منصة جوبني على GitHub Pages

<div dir="rtl">

## 📋 نظرة عامة

هذا الدليل يشرح كيفية رفع النسخة HTML الثابتة من منصة جوبني على GitHub Pages مجاناً.

⚠️ **ملاحظة مهمة**: GitHub Pages تدعم فقط المواقع الثابتة (Static Sites). لذلك:
- ✅ **الواجهة الأمامية (Frontend)** ستعمل بشكل كامل
- ❌ **الخادم الخلفي (Backend)** يحتاج استضافة منفصلة (Railway, Vercel, VPS)

---

## 🚀 الطريقة الأولى: رفع ملفات Build مباشرة

### الخطوة 1: إنشاء Repository على GitHub

1. اذهب إلى [GitHub](https://github.com)
2. أنشئ repository جديد باسم `jobni-platform`
3. اجعله **Public**
4. لا تضف README أو .gitignore

### الخطوة 2: رفع المشروع

```bash
# انتقل لمجلد المشروع
cd /app

# تهيئة Git
git init
git add .
git commit -m "Initial commit - Jobni Platform"

# ربط بـ GitHub (استبدل YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/jobni-platform.git
git branch -M main
git push -u origin main
```

### الخطوة 3: تفعيل GitHub Pages

1. اذهب إلى Repository Settings
2. اختر **Pages** من القائمة الجانبية
3. في **Source**، اختر:
   - Branch: `main`
   - Folder: `/frontend/build`
4. اضغط **Save**
5. انتظر 2-3 دقائق

🎉 موقعك سيكون متاحاً على:
```
https://YOUR_USERNAME.github.io/jobni-platform/
```

---

## 🔧 الطريقة الثانية: استخدام gh-pages Branch

هذه الطريقة الأفضل والأكثر احترافية:

### الخطوة 1: تثبيت gh-pages

```bash
cd /app/frontend
yarn add -D gh-pages
```

### الخطوة 2: تعديل package.json

أضف السطرين التاليين في `frontend/package.json`:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/jobni-platform",
  "scripts": {
    "predeploy": "yarn build",
    "deploy": "gh-pages -d build",
    ...
  }
}
```

### الخطوة 3: النشر

```bash
cd /app/frontend
yarn deploy
```

✅ سيتم بناء المشروع ورفعه تلقائياً على branch `gh-pages`!

موقعك سيكون متاحاً على نفس الرابط.

---

## 🔌 ربط Frontend بـ Backend

بعد رفع Frontend على GitHub Pages، تحتاج استضافة Backend منفصلة:

### الخيار 1: Railway (مجاني + سهل)

1. اذهب إلى [Railway.app](https://railway.app)
2. أنشئ مشروع جديد من GitHub
3. اختر مجلد `backend`
4. أضف المتغيرات البيئية:
   ```
   MONGO_URL=mongodb+srv://...
   DB_NAME=jobni_db
   JWT_SECRET=your-secret-key
   CORS_ORIGINS=https://YOUR_USERNAME.github.io
   ```
5. احصل على Railway URL: `https://your-app.railway.app`

### تحديث Frontend URL

في `frontend/.env`:
```env
REACT_APP_BACKEND_URL=https://your-app.railway.app
```

ثم أعد البناء والنشر:
```bash
cd /app/frontend
yarn deploy
```

---

## 📁 نسخة HTML الثابتة الكاملة

الملفات الثابتة موجودة في:
```
/app/frontend/build/
```

محتويات المجلد:
```
build/
├── index.html              ← الصفحة الرئيسية
├── static/
│   ├── css/               ← ملفات CSS
│   ├── js/                ← ملفات JavaScript
│   └── media/             ← الصور والخطوط
├── asset-manifest.json
└── manifest.json
```

يمكنك نسخ كل محتويات `build/` ورفعها على أي استضافة HTML:
- GitHub Pages
- Netlify
- Vercel
- Surge.sh
- أي استضافة مواقع ثابتة

---

## 🌐 خيارات استضافة أخرى (مجانية)

### Netlify (موصى به!)

1. اذهب إلى [Netlify.com](https://netlify.com)
2. سجل دخول بحساب GitHub
3. "Add new site" → "Import an existing project"
4. اختر repository
5. Build settings:
   - Base directory: `frontend`
   - Build command: `yarn build`
   - Publish directory: `frontend/build`
6. Environment variables:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-url.railway.app
   ```
7. Deploy!

### Vercel

1. اذهب إلى [Vercel.com](https://vercel.com)
2. "Add New" → "Project"
3. Import من GitHub
4. Root Directory: `frontend`
5. Framework: Create React App
6. Environment Variable:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-url.railway.app
   ```
7. Deploy!

---

## 🔗 ربط دومين خاص (اختياري)

### في GitHub Pages:

1. Repository Settings → Pages
2. Custom domain: أدخل `yourdomain.com`
3. في مزود الدومين، أضف DNS Records:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```
   ```
   Type: CNAME
   Name: www
   Value: YOUR_USERNAME.github.io
   ```

### في Netlify:

1. Domain settings → Add custom domain
2. اتبع التعليمات لإضافة DNS records

---

## 📦 تحديث الموقع

عند إجراء تعديلات:

```bash
# تحديث Frontend
cd /app/frontend
git add .
git commit -m "Update: وصف التعديل"
git push origin main

# إعادة النشر على GitHub Pages
yarn deploy
```

---

## ⚡ نصائح للأداء الأفضل

### 1. تفعيل HTTPS

GitHub Pages تدعم HTTPS تلقائياً. فقط:
- Settings → Pages → Enforce HTTPS ✅

### 2. إضافة 404 Page

أنشئ ملف `frontend/public/404.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>الصفحة غير موجودة</title>
  <script>
    sessionStorage.redirect = location.href;
    location.replace(location.origin);
  </script>
</head>
<body></body>
</html>
```

### 3. تحسين SEO

أضف في `frontend/public/index.html`:
```html
<meta name="description" content="جوبني - منصة وظائف جزئية في السعودية">
<meta name="keywords" content="وظائف, السعودية, دوام جزئي, عمل حر">
<meta property="og:title" content="جوبني - وظائف جزئية">
<meta property="og:description" content="ابحث عن وظائف جزئية في السعودية">
```

---

## 🆘 حل المشاكل الشائعة

### مشكلة: الصفحات لا تعمل (404)

أضف `_redirects` في `frontend/public/`:
```
/*    /index.html   200
```

### مشكلة: CSS/JS لا يحمّل

تأكد من `homepage` في `package.json`:
```json
"homepage": "https://YOUR_USERNAME.github.io/jobni-platform"
```

### مشكلة: CORS errors

تأكد من إضافة GitHub Pages URL في Backend:
```env
CORS_ORIGINS=https://YOUR_USERNAME.github.io
```

---

## 📊 مقارنة خيارات الاستضافة

| الميزة | GitHub Pages | Netlify | Vercel |
|--------|-------------|---------|--------|
| مجاني | ✅ | ✅ | ✅ |
| HTTPS | ✅ | ✅ | ✅ |
| دومين مخصص | ✅ | ✅ | ✅ |
| Build تلقائي | ❌ | ✅ | ✅ |
| Preview URLs | ❌ | ✅ | ✅ |
| سهولة الاستخدام | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**التوصية**: استخدم **Netlify** أو **Vercel** للنشر الاحترافي!

---

## ✅ Checklist قبل النشر

- [ ] بناء المشروع بنجاح (`yarn build`)
- [ ] تحديث `REACT_APP_BACKEND_URL` في `.env`
- [ ] تحديث `homepage` في `package.json`
- [ ] تحديث `CORS_ORIGINS` في Backend
- [ ] اختبار الموقع محلياً (`serve -s build`)
- [ ] رفع على GitHub
- [ ] تفعيل GitHub Pages / Netlify / Vercel
- [ ] اختبار الموقع المباشر
- [ ] ربط الدومين (اختياري)

---

## 🎉 تهانينا!

موقعك الآن مباشر على الإنترنت! 🚀

للحصول على المساعدة:
- 📧 job.ni@outlook.com
- 🐦 @jobni_sa

</div>

---

**صُنع بـ ❤️ من فريق جوبني**
