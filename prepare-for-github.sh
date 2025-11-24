#!/bin/bash

echo "🚀 تحضير المشروع للرفع على GitHub..."
echo ""

# الانتقال لمجلد المشروع
cd /app

# 1. حذف الملفات الكبيرة
echo "🧹 خطوة 1/5: حذف الملفات الكبيرة..."
rm -rf frontend/node_modules/
rm -rf backend/venv/
rm -rf backend/__pycache__/
rm -f *.tar.gz
rm -f test_result.md
rm -f detailed_test.py
rm -rf .emergent/
echo "✅ تم حذف الملفات المؤقتة"
echo ""

# 2. حذف git القديم
echo "🔄 خطوة 2/5: إعادة تهيئة Git..."
rm -rf .git
git init
echo "✅ تم تهيئة Git من جديد"
echo ""

# 3. إضافة الملفات
echo "📦 خطوة 3/5: إضافة الملفات..."
git add .
echo "✅ تم إضافة الملفات"
echo ""

# 4. عرض الإحصائيات
echo "📊 خطوة 4/5: إحصائيات المشروع..."
echo "عدد الملفات: $(git ls-files | wc -l)"
echo "حجم المشروع: $(du -sh . | cut -f1)"
echo ""

# 5. التحقق من عدم وجود ملفات كبيرة
echo "🔍 خطوة 5/5: التحقق النهائي..."
LARGE_FILES=$(find . -type f -size +50M 2>/dev/null | grep -v ".git")
if [ -z "$LARGE_FILES" ]; then
    echo "✅ لا توجد ملفات كبيرة"
else
    echo "⚠️  تحذير: ملفات كبيرة موجودة:"
    echo "$LARGE_FILES"
fi
echo ""

# 6. Commit
echo "💾 إنشاء Commit..."
git commit -m "🚀 Jobni Platform - Initial Commit

✨ Features:
- Complete job board platform for Saudi Arabia
- React Frontend + FastAPI Backend  
- MongoDB integration
- FAQ ChatBot with 8 questions
- Private messaging system
- Admin dashboard with full CRUD
- PDF invoice generation
- Full Arabic RTL support
- Rating system

📦 Tech Stack:
- Backend: FastAPI, MongoDB, JWT
- Frontend: React, Tailwind CSS, Shadcn UI
- Ready for: GitHub Pages, Netlify, Vercel, Docker

🎯 Status: Production Ready"

echo ""
echo "✅ Commit تم بنجاح!"
echo ""

# 7. التعليمات النهائية
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 المشروع جاهز للرفع!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 الخطوات المتبقية:"
echo ""
echo "1️⃣  أنشئ Repository على GitHub:"
echo "   https://github.com/new"
echo ""
echo "2️⃣  نفذ الأوامر التالية (استبدل YOUR_USERNAME و YOUR_REPO):"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3️⃣  فعّل GitHub Pages:"
echo "   Settings → Pages → Source: main → Folder: /frontend/build"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 معلومات المشروع:"
echo "   - عدد الملفات: $(git ls-files | wc -l)"
echo "   - الحجم: $(du -sh . | cut -f1)"
echo "   - الفرع: main"
echo ""
echo "✅ جاهز للرفع!"
