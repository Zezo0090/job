# 🚀 دليل النشر الشامل لمنصة جوبني

<div dir="rtl">

## 📋 نظرة عامة

هذا الدليل يشرح خطوات نشر منصة جوبني على دومينك الخاص بطرق مختلفة.

## ⚡ الطريقة السريعة: Vercel + MongoDB Atlas

### الخطوة 1: إعداد MongoDB Atlas (مجاني)

1. انتقل إلى [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. أنشئ حساب جديد أو سجل دخول
3. أنشئ Cluster جديد (اختر المجاني M0)
4. في "Database Access"، أنشئ مستخدم DB
5. في "Network Access"، أضف `0.0.0.0/0` للسماح بالوصول من أي مكان
6. احصل على Connection String:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/jobni_db
   ```

### الخطوة 2: نشر Backend على Railway

1. انتقل إلى [Railway.app](https://railway.app)
2. سجل دخول بحساب GitHub
3. انقر "New Project" → "Deploy from GitHub repo"
4. اختر repository جوبني
5. أضف المتغيرات البيئية:
   ```
   MONGO_URL=mongodb+srv://...
   DB_NAME=jobni_db
   JWT_SECRET=your-random-secret-key-here
   CORS_ORIGINS=https://yourdomain.com
   ```
6. في Settings → Service:
   - Root Directory: `/backend`
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
7. احصل على Railway URL (مثل: `https://jobni-backend.up.railway.app`)

### الخطوة 3: نشر Frontend على Vercel

1. انتقل إلى [Vercel.com](https://vercel.com)
2. سجل دخول بحساب GitHub
3. انقر "Add New" → "Project"
4. اختر repository جوبني
5. في Framework Preset، اختر "Create React App"
6. في Build Settings:
   - Root Directory: `frontend`
   - Build Command: `yarn build`
   - Output Directory: `build`
7. في Environment Variables:
   ```
   REACT_APP_BACKEND_URL=https://jobni-backend.up.railway.app
   ```
8. انقر "Deploy"
9. بعد النشر، احصل على Vercel URL

### الخطوة 4: ربط الدومين الخاص

#### في Vercel (للـ Frontend):
1. اذهب إلى Project Settings → Domains
2. أضف دومينك (مثل: `jobni.com`)
3. أضف DNS Records في مزود الدومين:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

#### في Railway (للـ Backend):
1. اذهب إلى Settings → Domains
2. أضف Custom Domain (مثل: `api.jobni.com`)
3. أضف DNS Record:
   ```
   Type: CNAME
   Name: api
   Value: <your-railway-domain>
   ```

### الخطوة 5: تحديث CORS

ارجع إلى Railway وحدّث متغير البيئة:
```
CORS_ORIGINS=https://jobni.com,https://www.jobni.com
```

### الخطوة 6: إنشاء مستخدم Admin

```bash
# استخدم Railway CLI أو Console
railway run python -c "...(نفس كود create_admin)..."
```

---

## 🖥️ الطريقة الثانية: VPS (Digital Ocean, AWS, Linode)

### المتطلبات:
- Ubuntu 20.04+ VPS
- دومين مربوط بـ IP الـ VPS
- SSH access

### الخطوة 1: إعداد السيرفر

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت المكتبات الأساسية
sudo apt install python3-pip python3-venv nginx mongodb certbot python3-certbot-nginx -y

# تثبيت Node.js & Yarn
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g yarn pm2
```

### الخطوة 2: نسخ المشروع

```bash
cd /var/www
sudo git clone <your-repo-url> jobni
cd jobni
sudo chown -R $USER:$USER /var/www/jobni
```

### الخطوة 3: إعداد Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# إنشاء ملف .env
cat > .env << EOF
MONGO_URL=mongodb://localhost:27017
DB_NAME=jobni_db
JWT_SECRET=$(openssl rand -hex 32)
CORS_ORIGINS=https://yourdomain.com
EOF

# تشغيل Backend بـ PM2
pm2 start "uvicorn server:app --host 0.0.0.0 --port 8001" --name jobni-backend
pm2 save
pm2 startup
```

### الخطوة 4: إعداد Frontend

```bash
cd /var/www/jobni/frontend

# إنشاء ملف .env
echo "REACT_APP_BACKEND_URL=https://api.yourdomain.com" > .env

# بناء المشروع
yarn install
yarn build

# نسخ ملفات البناء
sudo mkdir -p /var/www/html/jobni
sudo cp -r build/* /var/www/html/jobni/
```

### الخطوة 5: إعداد Nginx

```bash
sudo nano /etc/nginx/sites-available/jobni
```

أضف المحتوى التالي:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/html/jobni;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

فعّل الموقع:

```bash
sudo ln -s /etc/nginx/sites-available/jobni /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### الخطوة 6: SSL Certificate (HTTPS)

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### الخطوة 7: إنشاء مستخدم Admin

```bash
cd /var/www/jobni/backend
source venv/bin/activate
python3 << EOF
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
    print('✓ Admin created')
    client.close()

asyncio.run(create_admin())
EOF
```

---

## 🐳 الطريقة الثالثة: Docker

### إنشاء ملف docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    restart: always
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=jobni_db

  backend:
    build: ./backend
    restart: always
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=mongodb://mongodb:27017
      - DB_NAME=jobni_db
      - JWT_SECRET=${JWT_SECRET}
      - CORS_ORIGINS=${CORS_ORIGINS}
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    restart: always
    ports:
      - "3000:80"
    environment:
      - REACT_APP_BACKEND_URL=${BACKEND_URL}
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### تشغيل Docker Compose

```bash
# إنشاء ملف .env
cat > .env << EOF
JWT_SECRET=$(openssl rand -hex 32)
CORS_ORIGINS=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
EOF

# بناء وتشغيل
docker-compose up -d
```

---

## 🔒 إجراءات الأمان المهمة

### 1. تغيير JWT Secret
```bash
openssl rand -hex 32
```

### 2. تحديث CORS Origins
أضف فقط الدومينات المسموحة:
```
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3. Firewall
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 4. MongoDB Security
```bash
# إنشاء مستخدم MongoDB
mongosh
use admin
db.createUser({
  user: "jobni_admin",
  pwd: "strong_password_here",
  roles: [{role: "readWrite", db: "jobni_db"}]
})
```

ثم حدّث MONGO_URL:
```
MONGO_URL=mongodb://jobni_admin:password@localhost:27017/jobni_db
```

---

## 📊 المراقبة والصيانة

### مراقبة Backend
```bash
pm2 logs jobni-backend
pm2 monit
```

### مراقبة Nginx
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Backup MongoDB
```bash
mongodump --db jobni_db --out /backup/$(date +%Y%m%d)
```

---

## ❓ استكشاف الأخطاء

### Backend لا يعمل
```bash
pm2 logs jobni-backend
# تحقق من MongoDB
sudo systemctl status mongodb
```

### Frontend لا يعمل
```bash
sudo nginx -t
sudo systemctl status nginx
```

### مشاكل CORS
تأكد من:
- `CORS_ORIGINS` يحتوي على دومينك
- Frontend يستخدم HTTPS إذا كان Backend يستخدم HTTPS

---

## 🎉 تهانينا!

منصة جوبني الآن تعمل على دومينك الخاص! 🚀

</div>