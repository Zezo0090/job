#!/usr/bin/env python3
"""
Script to create admin user for Jobni platform
"""
import asyncio
import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from passlib.context import CryptContext
from datetime import datetime, timezone

async def create_admin():
    """Create admin user in database"""
    
    # Load environment variables
    env_path = Path(__file__).parent.parent / '.env'
    load_dotenv(env_path)
    
    # Get MongoDB connection
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME')
    
    if not mongo_url or not db_name:
        print("❌ Error: MONGO_URL or DB_NAME not found in .env")
        return
    
    print(f"Connecting to MongoDB: {mongo_url}")
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Check if admin already exists
    existing_admin = await db.users.find_one({'email': 'admin@jobni.work'})
    
    if existing_admin:
        print("⚠️  Admin user already exists!")
        print("   Email: admin@jobni.work")
        print("   If you forgot the password, delete the user from DB and run this script again.")
        client.close()
        return
    
    # Create password hash
    pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
    
    # Admin user data
    admin_user = {
        'id': 'admin-001',
        'email': 'admin@jobni.work',
        'name': 'مدير النظام',
        'phone': '+966500000000',
        'role': 'admin',
        'password': pwd_context.hash('adminpassword'),
        'company_name': 'جوبني',
        'skills': [],
        'profile_pic': None,
        'rating': 5.0,
        'total_ratings': 0,
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    
    # Insert admin user
    await db.users.insert_one(admin_user)
    
    print("\n✅ Admin user created successfully!")
    print("\n📧 Login Credentials:")
    print("   Email: admin@jobni.work")
    print("   Password: adminpassword")
    print("\n⚠️  IMPORTANT: Change the password immediately after first login!\n")
    
    client.close()

if __name__ == "__main__":
    try:
        asyncio.run(create_admin())
    except KeyboardInterrupt:
        print("\n\n❌ Operation cancelled by user")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        sys.exit(1)