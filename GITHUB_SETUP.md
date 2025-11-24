# 📤 دليل رفع المشروع على GitHub

<div dir="rtl">

## 🎯 الخطوات السريعة

### 1. إنشاء Repository جديد على GitHub

1. اذهب إلى [GitHub](https://github.com)
2. اضغط على **"New repository"** أو **"+"** → **"New repository"**
3. اسم Repository: `jobni-platform` (أو أي اسم تريده)
4. الوصف: `منصة جوبني - منصة وظائف جزئية في السعودية`
5. اختر: **Public** أو **Private**
6. **لا تضف** README, .gitignore, أو License (لأنها موجودة بالفعل)
7. اضغط **"Create repository"**

### 2. تحضير المشروع للرفع

افتح Terminal في مجلد المشروع:

```bash
# انتقل لمجلد المشروع
cd /app

# تهيئة Git (إذا لم يكن موجود)
git init

# إضافة جميع الملفات
git add .

# عمل Commit
git commit -m "Initial commit - Jobni Platform 🚀

✅ Complete job board platform for part-time jobs in Saudi Arabia

Features:
- 🔐 JWT Authentication
- 💼 Job Management (CRUD)
- 📝 Application System
- 🤖 FAQ ChatBot (8 questions)
- 💬 Private Messaging
- 📊 Admin Dashboard
- ⭐ Rating System
- 📄 PDF Invoice Generation
- 🌐 Full Arabic RTL Support

Tech Stack:
- Backend: FastAPI + MongoDB
- Frontend: React + Tailwind CSS
- Deployment: Docker ready"
```

### 3. ربط المشروع بـ GitHub

استبدل `YOUR_USERNAME` و `YOUR_REPO` باسم حسابك واسم Repository:

```bash
# إضافة remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# تسمية الـ branch الرئيسي
git branch -M main

# رفع المشروع
git push -u origin main
```

### 4. إضافة وصف جميل للـ Repository

في صفحة GitHub Repository:

1. اضغط على **"About"** ⚙️ (في الأعلى يمين)
2. أضف **Description**: `منصة جوبني - منصة وظائف جزئية متكاملة في السعودية 🇸🇦`
3. أضف **Website**: URL الموقع (بعد النشر)
4. أضف **Topics/Tags**:
   - `saudi-arabia`
   - `jobs-platform`
   - `part-time-jobs`
   - `react`
   - `fastapi`
   - `mongodb`
   - `arabic`
   - `rtl`
   - `chatbot`
5. احفظ التغييرات

---

## 🔄 تحديث المشروع لاحقاً

عند إجراء تعديلات على المشروع:

```bash
# إضافة التغييرات
git add .

# عمل Commit مع وصف التغيير
git commit -m "وصف التغيير الذي قمت به"

# رفع التحديثات
git push origin main
```

---

## 🎨 إضافة README جميل (اختياري)

في صفحة Repository على GitHub، الـ README.md سيظهر تلقائياً بتنسيق جميل لأننا أنشأناه مسبقاً.

---

## 📋 المحتويات الموجودة في Repository

بعد الرفع، ستجد هذه الملفات:

```
jobni-platform/
├── 📄 README.md              - توثيق شامل بالعربية
├── 📄 DEPLOYMENT.md          - دليل النشر المفصل
├── 📄 QUICK_START.md         - دليل البدء السريع
├── 📄 GITHUB_SETUP.md        - هذا الملف
├── 📄 LICENSE                - رخصة MIT
├── 📄 .gitignore            - ملفات محظورة من Git
├── 📄 docker-compose.yml    - إعداد Docker
├── 📄 nginx-vps.conf        - إعداد Nginx
│
├── 📁 backend/
│   ├── server.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   └── scripts/
│       └── create_admin.py
│
└── 📁 frontend/
    ├── src/
    ├── public/
    ├── package.json
    ├── Dockerfile
    ├── nginx.conf
    └── .env.example
```

---

## 🔒 ملفات محمية (لن ترفع)

الملفات التالية **لن ترفع** على GitHub (محمية في .gitignore):

- ❌ `.env` (المتغيرات البيئية السرية)
- ❌ `node_modules/` (مكتبات Node.js)
- ❌ `venv/` (بيئة Python الافتراضية)
- ❌ `build/` (ملفات البناء)
- ❌ `.DS_Store` (ملفات النظام)
- ❌ `*.log` (ملفات السجلات)

⚠️ **مهم جداً**: لا تضيف ملفات `.env` أبداً لأنها تحتوي على معلومات سرية!

---

## 🌟 نصائح إضافية

### إضافة صورة للمشروع (Social Preview)

1. اذهب إلى Settings → Social preview
2. ارفع صورة (1280x640 px)
3. هذه الصورة ستظهر عند مشاركة الرابط

### تفعيل GitHub Pages (اختياري)

إذا أردت استضافة التوثيق:

1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: /docs (إنشاء مجلد docs أولاً)

### إضافة Badges

أضف في أول README.md:

```markdown
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Arabic](https://img.shields.io/badge/lang-Arabic-red.svg)
```

---

## ❓ حل المشاكل الشائعة

### مشكلة: "remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

### مشكلة: "Permission denied"

استخدم GitHub Personal Access Token بدلاً من كلمة المرور:

1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token
3. حدد الصلاحيات اللازمة
4. استخدم Token كـ password عند الرفع

### مشكلة: ملفات كبيرة جداً

```bash
# لإزالة ملف كبير من Git
git rm --cached big_file.zip
echo "big_file.zip" >> .gitignore
git add .gitignore
git commit -m "Remove large file"
```

---

## 🎉 تهانينا!

الآن المشروع موجود على GitHub ويمكنك:
- ✅ نشره على أي منصة
- ✅ مشاركته مع الآخرين
- ✅ تتبع التغييرات
- ✅ العمل الجماعي

---

## 📞 هل تحتاج مساعدة؟

راجع الملفات التالية:
- `README.md` - توثيق شامل
- `DEPLOYMENT.md` - دليل النشر
- `QUICK_START.md` - البدء السريع

أو تواصل معنا:
- 📧 job.ni@outlook.com
- 🐦 @jobni_sa

</div>

---

**صُنع بـ ❤️ من فريق جوبني**
