#!/usr/bin/env python3
import sys
sys.path.insert(0, '/app/backend')

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import os
from datetime import datetime, timezone
import uuid

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed_data():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(mongo_url)
    db = client['test_database']
    
    print("🌱 جاري إضافة البيانات التجريبية...")
    
    # Clear existing data
    await db.users.delete_many({})
    await db.jobs.delete_many({})
    await db.applications.delete_many({})
    
    # Create Admin
    admin = {
        "id": str(uuid.uuid4()),
        "email": "admin@jobni.com",
        "password": pwd_context.hash("Admin123!"),
        "name": "مدير النظام",
        "phone": "0501234567",
        "role": "admin",
        "company_name": None,
        "skills": [],
        "profile_pic": None,
        "rating": 5.0,
        "total_ratings": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(admin)
    print("✅ تم إنشاء حساب الأدمن: admin@jobni.com / Admin123!")
    
    # Create Employer
    employer = {
        "id": str(uuid.uuid4()),
        "email": "company@jobni.com",
        "password": pwd_context.hash("Company123!"),
        "name": "أحمد الشركة",
        "phone": "0509876543",
        "role": "employer",
        "company_name": "شركة التقنية الحديثة",
        "skills": [],
        "profile_pic": None,
        "rating": 4.8,
        "total_ratings": 12,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(employer)
    print("✅ تم إنشاء حساب صاحب عمل: company@jobni.com / Company123!")
    
    # Create Job Seeker
    job_seeker = {
        "id": str(uuid.uuid4()),
        "email": "employee@jobni.com",
        "password": pwd_context.hash("Employee123!"),
        "name": "محمد العامل",
        "phone": "0551234567",
        "role": "job_seeker",
        "company_name": None,
        "skills": ["خدمة العملاء", "مبيعات", "تصميم"],
        "profile_pic": None,
        "rating": 4.5,
        "total_ratings": 8,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(job_seeker)
    print("✅ تم إنشاء حساب باحث عن عمل: employee@jobni.com / Employee123!")
    
    # Create Sample Jobs
    jobs = [
        {
            "id": str(uuid.uuid4()),
            "title": "مساعد مبيعات في معرض تقني",
            "description": "نبحث عن مساعد مبيعات للعمل في معرض تقني لمدة 8 ساعات. المهام تشمل استقبال الزوار وشرح المنتجات والإجابة على الاستفسارات.",
            "company_name": "شركة التقنية الحديثة",
            "employer_id": employer["id"],
            "location": "الرياض",
            "duration_type": "hours_8",
            "duration_value": "8 ساعات",
            "salary": 400.0,
            "category": "التجزئة",
            "requirements": ["خبرة في المبيعات", "مهارات تواصل جيدة", "معرفة بالتقنية"],
            "status": "active",
            "posted_date": datetime.now(timezone.utc).isoformat(),
            "views": 45
        },
        {
            "id": str(uuid.uuid4()),
            "title": "منسق فعالية - مهرجان صيفي",
            "description": "منسق لفعالية مهرجان صيفي لمدة 4 أيام. المهام تشمل التنسيق بين الفرق وإدارة الجدول الزمني.",
            "company_name": "الهيئة العامة للترفيه",
            "employer_id": employer["id"],
            "location": "جدة",
            "duration_type": "days_4",
            "duration_value": "4 أيام",
            "salary": 3000.0,
            "category": "الفعاليات",
            "requirements": ["خبرة في تنسيق الفعاليات", "مهارات قيادية", "القدرة على العمل تحت الضغط"],
            "status": "active",
            "posted_date": datetime.now(timezone.utc).isoformat(),
            "views": 78
        },
        {
            "id": str(uuid.uuid4()),
            "title": "مصمم جرافيك - مشروع إعلاني",
            "description": "مطلوب مصمم جرافيك لمشروع إعلاني قصير المدى. التصميم يشمل بوسترات ومحتوى سوشيال ميديا.",
            "company_name": "وكالة الإبداع الرقمي",
            "employer_id": employer["id"],
            "location": "عن بعد",
            "duration_type": "week",
            "duration_value": "أسبوع واحد",
            "salary": 2500.0,
            "category": "التقنية",
            "requirements": ["إتقان Adobe Suite", "محفظة أعمال سابقة", "الالتزام بالمواعيد"],
            "status": "active",
            "posted_date": datetime.now(timezone.utc).isoformat(),
            "views": 92
        },
        {
            "id": str(uuid.uuid4()),
            "title": "خدمة عملاء - فترة العيد",
            "description": "مطلوب موظف خدمة عملاء للعمل خلال فترة عيد الفطر في مركز تسوق كبير.",
            "company_name": "مركز الرياض بارك",
            "employer_id": employer["id"],
            "location": "الرياض",
            "duration_type": "week",
            "duration_value": "أسبوعين",
            "salary": 150.0,
            "category": "الضيافة",
            "requirements": ["مهارات تواصل ممتازة", "اللباقة", "القدرة على العمل ضمن فريق"],
            "status": "active",
            "posted_date": datetime.now(timezone.utc).isoformat(),
            "views": 156
        },
        {
            "id": str(uuid.uuid4()),
            "title": "معلم لغة إنجليزية - دروس خصوصية",
            "description": "مطلوب معلم لغة إنجليزية لإعطاء دروس خصوصية لطالب ثانوي لمدة شهر.",
            "company_name": "مستقل",
            "employer_id": employer["id"],
            "location": "الدمام",
            "duration_type": "month",
            "duration_value": "شهر",
            "salary": 5000.0,
            "category": "التعليم",
            "requirements": ["شهادة في اللغة الإنجليزية", "خبرة في التدريس", "صبر ومرونة"],
            "status": "active",
            "posted_date": datetime.now(timezone.utc).isoformat(),
            "views": 67
        }
    ]
    
    await db.jobs.insert_many(jobs)
    print(f"✅ تم إنشاء {len(jobs)} وظائف تجريبية")
    
    print("\\n🎉 تم إضافة البيانات التجريبية بنجاح!")
    print("\\n📋 الحسابات المتاحة:")
    print("   Admin: admin@jobni.com / Admin123!")
    print("   Employer: company@jobni.com / Company123!")
    print("   Job Seeker: employee@jobni.com / Employee123!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
