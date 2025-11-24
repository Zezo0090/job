# 🚀 دليل البدء السريع - منصة جوبني

<div dir="rtl">

## 📦 تحميل المشروع من GitHub

### الخطوة 1: رفع المشروع على GitHub

```bash
# من مجلد المشروع الحالي
cd /app

# إزالة git القديم (إن وجد)
rm -rf .git

# تهيئة git جديد
git init

# إضافة جميع الملفات
git add .

# Commit أولي
git commit -m "Initial commit - Jobni Platform"

# إضافة remote repository (استبدل YOUR_USERNAME و YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# رفع المشروع
git branch -M main
git push -u origin main
```

### الخطوة 2: نسخ المشروع على سيرفرك

```bash
# استنساخ من GitHub
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

---

## ⚡ النشر السريع (15 دقيقة)

### الطريقة 1: Vercel + Railway (الأسهل - مجاني!)

#### Backend على Railway:
1. اذهب إلى https://railway.app
2. Login بحساب GitHub
3. "New Project" → "Deploy from GitHub"
4. اختر repository جوبني
5. أضف المتغيرات البيئية:
   ```
   MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/jobni_db
   DB_NAME=jobni_db
   JWT_SECRET=اكتب-مفتاح-عشوائي-طويل-هنا
   CORS_ORIGINS=https://yourdomain.com
   ```
6. Settings → Root Directory: `backend`
7. Settings → Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
8. احفظ Railway URL: `https://your-app.railway.app`

#### Frontend على Vercel:
1. اذهب إلى https://vercel.com
2. Login بحساب GitHub
3. "New Project" → اختر repository
4. Root Directory: `frontend`
5. Environment Variable:
   ```
   REACT_APP_BACKEND_URL=https://your-app.railway.app
   ```
6. Deploy!

#### ربط الدومين:
**في Vercel:**
- Settings → Domains → أضف yourdomain.com
- في مزود الدومين أضف DNS Record:
  ```
  Type: A
  Name: @
  Value: 76.76.21.21
  ```

**في Railway:**
- Settings → Domains → أضف api.yourdomain.com
- في مزود الدومين أضف DNS Record:
  ```
  Type: CNAME
  Name: api
  Value: your-app.railway.app
  ```

**حدّث CORS في Railway:**
```
CORS_ORIGINS=https://yourdomain.com
```

---

### الطريقة 2: VPS الخاص (للمحترفين)

```bash
# 1. تحديث النظام
sudo apt update && sudo apt upgrade -y

# 2. تثبيت المتطلبات
sudo apt install python3-pip python3-venv nginx mongodb certbot python3-certbot-nginx -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g yarn pm2

# 3. استنساخ المشروع
cd /var/www
sudo git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git jobni
cd jobni
sudo chown -R $USER:$USER /var/www/jobni

# 4. إعداد Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# إنشاء .env
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=jobni_db
JWT_SECRET=$(openssl rand -hex 32)
CORS_ORIGINS=https://yourdomain.com
EOF

# تشغيل Backend
pm2 start "uvicorn server:app --host 0.0.0.0 --port 8001" --name jobni-backend
pm2 save
pm2 startup

# 5. إعداد Frontend
cd /var/www/jobni/frontend
echo "REACT_APP_BACKEND_URL=https://yourdomain.com" > .env
yarn install
yarn build
sudo mkdir -p /var/www/html/jobni
sudo cp -r build/* /var/www/html/jobni/

# 6. إعداد Nginx
sudo cp /var/www/jobni/nginx-vps.conf /etc/nginx/sites-available/jobni
# عدّل الملف وضع اسم دومينك
sudo nano /etc/nginx/sites-available/jobni
sudo ln -s /etc/nginx/sites-available/jobni /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 7. SSL Certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 8. إنشاء مستخدم Admin
cd /var/www/jobni/backend
source venv/bin/activate
python3 scripts/create_admin.py
```

---

## 🗄️ إعداد MongoDB Atlas (مجاني)

1. اذهب إلى https://www.mongodb.com/cloud/atlas
2. أنشئ حساب → Create Cluster (M0 Free)
3. Database Access → Add User → احفظ Username/Password
4. Network Access → Add IP → `0.0.0.0/0`
5. Connect → Connection String:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/jobni_db
   ```

---

## 🔐 إنشاء مستخدم Admin

بعد النشر، قم بإنشاء مستخدم Admin:

```bash
# على VPS
cd /var/www/jobni/backend
source venv/bin/activate
python3 << 'EOF'
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from passlib.context import CryptContext

async def create_admin():
    load_dotenv()
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = client[os.environ['DB_NAME']]
    pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
    
    admin_user = {
        'id': 'admin-001',
        'email': 'admin@jobni.work',
        'name': 'مدير النظام',
        'phone': '+966500000000',
        'role': 'admin',
        'password': pwd_context.hash('adminpassword'),
        'company_name': 'جوبني',
        'skills': [],
        'rating': 5.0,
        'total_ratings': 0,
        'created_at': '2024-01-01T00:00:00Z'
    }
    
    await db.users.insert_one(admin_user)
    print('✓ Admin created: admin@jobni.work / adminpassword')
    client.close()

asyncio.run(create_admin())
EOF
```

أو باستخدام Railway CLI:
```bash
railway run python3 scripts/create_admin.py
```

---

## ✅ التحقق من النشر

### اختبار Backend:
```bash
curl https://api.yourdomain.com/api/jobs
```

### اختبار Frontend:
افتح المتصفح: `https://yourdomain.com`

### تسجيل الدخول:
- البريد: `admin@jobni.work`
- كلمة المرور: `adminpassword`

⚠️ **مهم جداً:** غيّر كلمة المرور فوراً بعد أول تسجيل دخول!

---

## 📝 الملفات المهمة

- `README.md` - توثيق شامل للمشروع
- `DEPLOYMENT.md` - دليل النشر المفصل
- `docker-compose.yml` - للنشر بـ Docker
- `.env.example` - نموذج للمتغيرات البيئية

---

## 🆘 المساعدة

### مشاكل شائعة:

**1. Backend لا يعمل:**
```bash
pm2 logs jobni-backend
sudo systemctl status mongodb
```

**2. CORS errors:**
تحقق من `CORS_ORIGINS` في Backend .env

**3. Frontend صفحة بيضاء:**
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

---

## 📧 التواصل

لأي استفسارات:
- البريد: job.ni@outlook.com
- Twitter/X: @jobni_sa

</div>

---

**صُنع بـ ❤️ من فريق جوبني**
