# 🚀 منصة جوبني (Jobni) - منصة وظائف جزئية

<div dir="rtl">

## 📋 نظرة عامة

جوبني هي منصة متكاملة للوظائف الجزئية في المملكة العربية السعودية، تربط بين أصحاب الأعمال والباحثين عن عمل جزئي.

### ✨ الميزات الرئيسية

- 🔐 **نظام مصادقة آمن** (JWT)
- 💼 **إدارة الوظائف** (إنشاء، تعديل، حذف، بحث)
- 📝 **نظام التقديم على الوظائف**
- 🤖 **شات بوت FAQ ذكي** (8 أسئلة شائعة)
- 💬 **نظام رسائل خاصة** (محادثات تلقائية عند قبول الطلب)
- 📊 **لوحة تحكم Admin** (إحصائيات شاملة)
- ⭐ **نظام تقييم المستخدمين**
- 📄 **توليد فواتير PDF**
- 🌐 **دعم كامل للغة العربية** (RTL)

## 🛠️ التقنيات المستخدمة

### Backend
- **FastAPI** (Python)
- **MongoDB** (قاعدة البيانات)
- **JWT** (المصادقة)
- **ReportLab** (توليد PDF)
- **Motor** (MongoDB Async Driver)

### Frontend
- **React** (مكتبة واجهة المستخدم)
- **React Router** (التنقل)
- **Axios** (طلبات HTTP)
- **Shadcn/UI** (مكونات الواجهة)
- **Tailwind CSS** (التنسيقات)

## 📦 التثبيت والإعداد

### المتطلبات الأساسية

- Node.js (v16 أو أحدث)
- Python 3.9+
- MongoDB
- Yarn أو npm

### 1. استنساخ المشروع

```bash
git clone <repository-url>
cd jobni-platform
```

### 2. إعداد Backend

```bash
cd backend

# إنشاء بيئة افتراضية
python -m venv venv
source venv/bin/activate  # في Windows: venv\Scripts\activate

# تثبيت المكتبات
pip install -r requirements.txt

# إعداد المتغيرات البيئية
cp .env.example .env
# عدّل ملف .env وأضف بيانات MongoDB والمفاتيح السرية
```

### 3. إعداد Frontend

```bash
cd frontend

# تثبيت المكتبات
yarn install
# أو
npm install

# إعداد المتغيرات البيئية
cp .env.example .env
# عدّل ملف .env وأضف رابط Backend
```

### 4. تشغيل المشروع

#### Backend
```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

#### Frontend
```bash
cd frontend
yarn start
# أو
npm start
```

## 🗄️ إعداد قاعدة البيانات

### إنشاء مستخدم Admin

```python
python -c "
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
    print('✓ Admin user created')
    client.close()

asyncio.run(create_admin())
"
```

## 🌐 النشر على الإنتاج

### متغيرات البيئة المطلوبة

#### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=jobni_db
JWT_SECRET=your-super-secret-key-change-this
CORS_ORIGINS=https://yourdomain.com
```

#### Frontend (.env)
```env
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

### خيارات النشر

#### 1. النشر على Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel):**
```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
cd frontend
vercel --prod
```

**Backend (Railway):**
1. أنشئ حساب على [Railway.app](https://railway.app)
2. اربط GitHub repository
3. أضف MongoDB database
4. أضف المتغيرات البيئية
5. انشر!

#### 2. النشر على VPS (Digital Ocean, AWS, etc.)

**استخدام Nginx + PM2:**

```bash
# تثبيت PM2
npm install -g pm2

# تشغيل Backend
cd backend
pm2 start "uvicorn server:app --host 0.0.0.0 --port 8001" --name jobni-backend

# بناء Frontend
cd frontend
yarn build

# نسخ ملفات البناء إلى Nginx
sudo cp -r build/* /var/www/jobni/
```

**إعداد Nginx:**

```nginx
# /etc/nginx/sites-available/jobni
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/jobni;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 3. النشر باستخدام Docker

```bash
# بناء الصور
docker-compose build

# تشغيل الخدمات
docker-compose up -d
```

## 📱 بيانات الدخول الافتراضية

- **البريد:** admin@jobni.work
- **كلمة المرور:** adminpassword

⚠️ **مهم:** غيّر كلمة المرور بعد أول تسجيل دخول!

## 🔧 API Endpoints الرئيسية

### المصادقة
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - بيانات المستخدم الحالي

### الوظائف
- `GET /api/jobs` - قائمة الوظائف
- `POST /api/jobs` - إنشاء وظيفة (Admin/Employer)
- `PUT /api/jobs/{id}` - تعديل وظيفة
- `DELETE /api/jobs/{id}` - حذف وظيفة

### الطلبات
- `POST /api/applications` - التقديم على وظيفة
- `GET /api/applications` - قائمة الطلبات
- `PUT /api/applications/{id}` - تحديث حالة الطلب

### المحادثات
- `GET /api/conversations` - قائمة المحادثات
- `GET /api/conversations/{id}/messages` - رسائل محادثة
- `POST /api/conversations/{id}/messages` - إرسال رسالة

### Admin
- `GET /api/admin/stats` - إحصائيات النظام
- `GET /api/admin/users` - قائمة المستخدمين

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📝 الترخيص

هذا المشروع مرخص تحت MIT License

## 📞 التواصل

- **البريد الإلكتروني:** job.ni@outlook.com
- **Twitter/X:** [حساب جوبني](https://x.com/jobni_sa)
- **LinkedIn:** [صفحة جوبني](https://linkedin.com/company/jobni)

## 🙏 شكر وتقدير

شكراً لاستخدامك منصة جوبني! نأمل أن تساعد المنصة في ربط الباحثين عن عمل بالفرص المناسبة.

</div>

---

<div align="center">
  Made with ❤️ by Jobni Team
</div>