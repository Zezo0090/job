from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, File, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
from io import BytesIO
from fastapi.responses import StreamingResponse

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

class UserBase(BaseModel):
    email: EmailStr
    name: str
    phone: Optional[str] = None
    role: str = "job_seeker"  # admin, employer, job_seeker
    company_name: Optional[str] = None
    skills: List[str] = []
    profile_pic: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    rating: float = 0.0
    total_ratings: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class JobBase(BaseModel):
    title: str
    description: str
    company_name: str
    location: str
    duration_type: str  # hour, hours_5, hours_8, days_4, week, month
    duration_value: str
    salary: float
    category: str
    requirements: List[str] = []
    deadline: Optional[str] = None

class JobCreate(JobBase):
    pass

class Job(JobBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    employer_id: str
    status: str = "active"  # active, closed, completed
    posted_date: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    views: int = 0

class ApplicationBase(BaseModel):
    job_id: str
    message: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class Application(ApplicationBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    applicant_id: str
    employer_id: str
    status: str = "pending"  # pending, accepted, rejected, completed
    applied_date: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class RatingBase(BaseModel):
    job_id: str
    rated_id: str  # user being rated
    rating: float
    comment: Optional[str] = None

class RatingCreate(RatingBase):
    pass

class Rating(RatingBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    rater_id: str  # user giving rating
    date: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class SavedJob(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    job_id: str
    saved_date: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Notification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    type: str
    message: str
    read: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ConversationBase(BaseModel):
    job_id: str
    candidate_id: str
    employer_id: str

class Conversation(ConversationBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class MessageBase(BaseModel):
    conversation_id: str
    message_text: str

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sender_id: str
    sender_name: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UpdateApplicationStatus(BaseModel):
    status: str

# ==================== AUTH FUNCTIONS ====================

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return User(**user)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_dict = user_data.model_dump()
    password = user_dict.pop("password")
    hashed_password = get_password_hash(password)
    
    user = User(**user_dict)
    doc = user.model_dump()
    doc["password"] = hashed_password
    
    await db.users.insert_one(doc)
    
    # Create token
    access_token = create_access_token(data={"sub": user.id})
    
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user_doc = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(credentials.password, user_doc["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_doc.pop("password")
    user = User(**user_doc)
    
    access_token = create_access_token(data={"sub": user.id})
    
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# ==================== JOB ROUTES ====================

@api_router.post("/jobs", response_model=Job)
async def create_job(job_data: JobCreate, current_user: User = Depends(get_current_user)):
    if current_user.role not in ["employer", "admin"]:
        raise HTTPException(status_code=403, detail="Only employers can post jobs")
    
    job = Job(**job_data.model_dump(), employer_id=current_user.id)
    doc = job.model_dump()
    await db.jobs.insert_one(doc)
    
    return job

@api_router.get("/jobs", response_model=List[Job])
async def get_jobs(
    category: Optional[str] = None,
    duration_type: Optional[str] = None,
    location: Optional[str] = None,
    search: Optional[str] = None,
    status: Optional[str] = "active"
):
    query = {}
    if category and category != "all":
        query["category"] = category
    if duration_type and duration_type != "all":
        query["duration_type"] = duration_type
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"company_name": {"$regex": search, "$options": "i"}}
        ]
    if status:
        query["status"] = status
    
    jobs = await db.jobs.find(query, {"_id": 0}).sort("posted_date", -1).to_list(1000)
    return jobs

@api_router.get("/jobs/{job_id}", response_model=Job)
async def get_job(job_id: str):
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Increment views
    await db.jobs.update_one({"id": job_id}, {"$inc": {"views": 1}})
    job["views"] = job.get("views", 0) + 1
    
    return Job(**job)

@api_router.put("/jobs/{job_id}", response_model=Job)
async def update_job(job_id: str, job_data: JobCreate, current_user: User = Depends(get_current_user)):
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job["employer_id"] != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    update_data = job_data.model_dump()
    await db.jobs.update_one({"id": job_id}, {"$set": update_data})
    
    updated_job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    return Job(**updated_job)

@api_router.delete("/jobs/{job_id}")
async def delete_job(job_id: str, current_user: User = Depends(get_current_user)):
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job["employer_id"] != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.jobs.delete_one({"id": job_id})
    return {"message": "Job deleted successfully"}

# ==================== APPLICATION ROUTES ====================

@api_router.post("/applications", response_model=Application)
async def create_application(app_data: ApplicationCreate, current_user: User = Depends(get_current_user)):
    if current_user.role != "job_seeker":
        raise HTTPException(status_code=403, detail="Only job seekers can apply")
    
    # Check if job exists
    job = await db.jobs.find_one({"id": app_data.job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Check if already applied
    existing = await db.applications.find_one({
        "job_id": app_data.job_id,
        "applicant_id": current_user.id
    })
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this job")
    
    application = Application(
        **app_data.model_dump(),
        applicant_id=current_user.id,
        employer_id=job["employer_id"]
    )
    doc = application.model_dump()
    await db.applications.insert_one(doc)
    
    # Create notification for employer
    notification = Notification(
        user_id=job["employer_id"],
        type="new_application",
        message=f"تقدم {current_user.name} على وظيفة {job['title']}"
    )
    await db.notifications.insert_one(notification.model_dump())
    
    return application

@api_router.get("/applications", response_model=List[Application])
async def get_applications(current_user: User = Depends(get_current_user)):
    if current_user.role == "job_seeker":
        query = {"applicant_id": current_user.id}
    elif current_user.role == "employer":
        query = {"employer_id": current_user.id}
    elif current_user.role == "admin":
        query = {}
    else:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    applications = await db.applications.find(query, {"_id": 0}).sort("applied_date", -1).to_list(1000)
    return applications

@api_router.get("/applications/job/{job_id}", response_model=List[Application])
async def get_job_applications(job_id: str, current_user: User = Depends(get_current_user)):
    # Check if user is employer of this job or admin
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job["employer_id"] != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    applications = await db.applications.find({"job_id": job_id}, {"_id": 0}).to_list(1000)
    return applications

@api_router.put("/applications/{app_id}", response_model=Application)
async def update_application_status(
    app_id: str,
    status_data: UpdateApplicationStatus,
    current_user: User = Depends(get_current_user)
):
    application = await db.applications.find_one({"id": app_id}, {"_id": 0})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application["employer_id"] != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.applications.update_one(
        {"id": app_id},
        {"$set": {"status": status_data.status}}
    )
    
    # Create notification for applicant
    job = await db.jobs.find_one({"id": application["job_id"]}, {"_id": 0})
    status_ar = {
        "accepted": "قُبل",
        "rejected": "رُفض",
        "completed": "اكتمل"
    }
    notification = Notification(
        user_id=application["applicant_id"],
        type="application_update",
        message=f"طلبك على وظيفة {job['title']} {status_ar.get(status_data.status, status_data.status)}"
    )
    await db.notifications.insert_one(notification.model_dump())
    
    updated_app = await db.applications.find_one({"id": app_id}, {"_id": 0})
    return Application(**updated_app)

# ==================== RATING ROUTES ====================

@api_router.post("/ratings", response_model=Rating)
async def create_rating(rating_data: RatingCreate, current_user: User = Depends(get_current_user)):
    # Check if application exists and is completed
    application = await db.applications.find_one({
        "job_id": rating_data.job_id,
        "$or": [
            {"applicant_id": current_user.id},
            {"employer_id": current_user.id}
        ]
    }, {"_id": 0})
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application["status"] != "completed":
        raise HTTPException(status_code=400, detail="Can only rate completed jobs")
    
    # Check if already rated
    existing = await db.ratings.find_one({
        "job_id": rating_data.job_id,
        "rater_id": current_user.id,
        "rated_id": rating_data.rated_id
    })
    if existing:
        raise HTTPException(status_code=400, detail="Already rated this user for this job")
    
    rating = Rating(**rating_data.model_dump(), rater_id=current_user.id)
    await db.ratings.insert_one(rating.model_dump())
    
    # Update user's average rating
    all_ratings = await db.ratings.find({"rated_id": rating_data.rated_id}, {"_id": 0}).to_list(1000)
    avg_rating = sum(r["rating"] for r in all_ratings) / len(all_ratings)
    
    await db.users.update_one(
        {"id": rating_data.rated_id},
        {"$set": {"rating": avg_rating, "total_ratings": len(all_ratings)}}
    )
    
    return rating

@api_router.get("/ratings/user/{user_id}", response_model=List[Rating])
async def get_user_ratings(user_id: str):
    ratings = await db.ratings.find({"rated_id": user_id}, {"_id": 0}).to_list(1000)
    return ratings

# ==================== SAVED JOBS ====================

@api_router.post("/saved-jobs/{job_id}")
async def save_job(job_id: str, current_user: User = Depends(get_current_user)):
    # Check if job exists
    job = await db.jobs.find_one({"id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Check if already saved
    existing = await db.saved_jobs.find_one({
        "user_id": current_user.id,
        "job_id": job_id
    })
    if existing:
        raise HTTPException(status_code=400, detail="Job already saved")
    
    saved = SavedJob(user_id=current_user.id, job_id=job_id)
    await db.saved_jobs.insert_one(saved.model_dump())
    
    return {"message": "Job saved successfully"}

@api_router.delete("/saved-jobs/{job_id}")
async def unsave_job(job_id: str, current_user: User = Depends(get_current_user)):
    result = await db.saved_jobs.delete_one({
        "user_id": current_user.id,
        "job_id": job_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Saved job not found")
    
    return {"message": "Job unsaved successfully"}

@api_router.get("/saved-jobs", response_model=List[str])
async def get_saved_jobs(current_user: User = Depends(get_current_user)):
    saved = await db.saved_jobs.find({"user_id": current_user.id}, {"_id": 0}).to_list(1000)
    return [s["job_id"] for s in saved]

# ==================== NOTIFICATIONS ====================

@api_router.get("/notifications", response_model=List[Notification])
async def get_notifications(current_user: User = Depends(get_current_user)):
    notifications = await db.notifications.find(
        {"user_id": current_user.id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return notifications

@api_router.put("/notifications/{notif_id}/read")
async def mark_notification_read(notif_id: str, current_user: User = Depends(get_current_user)):
    await db.notifications.update_one(
        {"id": notif_id, "user_id": current_user.id},
        {"$set": {"read": True}}
    )
    return {"message": "Notification marked as read"}

@api_router.put("/notifications/read-all")
async def mark_all_notifications_read(current_user: User = Depends(get_current_user)):
    await db.notifications.update_many(
        {"user_id": current_user.id},
        {"$set": {"read": True}}
    )
    return {"message": "All notifications marked as read"}

# ==================== ADMIN ROUTES ====================

@api_router.get("/admin/stats")
async def get_admin_stats(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    
    total_users = await db.users.count_documents({})
    total_jobs = await db.jobs.count_documents({})
    active_jobs = await db.jobs.count_documents({"status": "active"})
    total_applications = await db.applications.count_documents({})
    pending_applications = await db.applications.count_documents({"status": "pending"})
    
    employers = await db.users.count_documents({"role": "employer"})
    job_seekers = await db.users.count_documents({"role": "job_seeker"})
    
    return {
        "total_users": total_users,
        "total_jobs": total_jobs,
        "active_jobs": active_jobs,
        "total_applications": total_applications,
        "pending_applications": pending_applications,
        "employers": employers,
        "job_seekers": job_seekers
    }

@api_router.get("/admin/users", response_model=List[User])
async def get_all_users(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    
    users = await db.users.find({}, {"_id": 0, "password": 0}).to_list(1000)
    return users

@api_router.delete("/admin/users/{user_id}")
async def delete_user(user_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    
    await db.users.delete_one({"id": user_id})
    return {"message": "User deleted successfully"}

# ==================== REPORTS & INVOICES ====================

@api_router.get("/reports/invoice/{application_id}")
async def generate_invoice(application_id: str, current_user: User = Depends(get_current_user)):
    # Get application details
    application = await db.applications.find_one({"id": application_id}, {"_id": 0})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application["status"] != "accepted" and application["status"] != "completed":
        raise HTTPException(status_code=400, detail="Invoice only for accepted/completed jobs")
    
    # Get job details
    job = await db.jobs.find_one({"id": application["job_id"]}, {"_id": 0})
    
    # Get user details
    applicant = await db.users.find_one({"id": application["applicant_id"]}, {"_id": 0})
    employer = await db.users.find_one({"id": application["employer_id"]}, {"_id": 0})
    
    # Create PDF
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    # Header
    p.setFont("Helvetica-Bold", 24)
    p.drawString(2*cm, height - 3*cm, "JOBNI - Invoice")
    
    p.setFont("Helvetica", 12)
    p.drawString(2*cm, height - 4*cm, f"Invoice Date: {datetime.now().strftime('%Y-%m-%d')}")
    p.drawString(2*cm, height - 4.5*cm, f"Application ID: {application_id}")
    
    # Job Details
    p.setFont("Helvetica-Bold", 14)
    p.drawString(2*cm, height - 6*cm, "Job Details:")
    p.setFont("Helvetica", 12)
    p.drawString(2*cm, height - 6.7*cm, f"Title: {job['title']}")
    p.drawString(2*cm, height - 7.3*cm, f"Company: {job['company_name']}")
    p.drawString(2*cm, height - 7.9*cm, f"Duration: {job['duration_value']}")
    p.drawString(2*cm, height - 8.5*cm, f"Location: {job['location']}")
    
    # Worker Details
    p.setFont("Helvetica-Bold", 14)
    p.drawString(2*cm, height - 10*cm, "Worker Details:")
    p.setFont("Helvetica", 12)
    p.drawString(2*cm, height - 10.7*cm, f"Name: {applicant['name']}")
    p.drawString(2*cm, height - 11.3*cm, f"Email: {applicant['email']}")
    p.drawString(2*cm, height - 11.9*cm, f"Phone: {applicant.get('phone', 'N/A')}")
    
    # Payment Details
    p.setFont("Helvetica-Bold", 14)
    p.drawString(2*cm, height - 13.5*cm, "Payment Details:")
    p.setFont("Helvetica", 12)
    p.drawString(2*cm, height - 14.2*cm, f"Amount: {job['salary']} SAR")
    p.drawString(2*cm, height - 14.8*cm, f"Status: {application['status'].upper()}")
    
    # Footer
    p.setFont("Helvetica", 10)
    p.drawString(2*cm, 2*cm, "Jobni - Part-Time Jobs Platform")
    p.drawString(2*cm, 1.5*cm, "Thank you for using our service!")
    
    p.showPage()
    p.save()
    
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf", headers={
        "Content-Disposition": f"attachment; filename=invoice_{application_id}.pdf"
    })

@api_router.get("/reports/stats")
async def get_user_stats(current_user: User = Depends(get_current_user)):
    if current_user.role == "employer":
        total_jobs = await db.jobs.count_documents({"employer_id": current_user.id})
        active_jobs = await db.jobs.count_documents({"employer_id": current_user.id, "status": "active"})
        total_applications = await db.applications.count_documents({"employer_id": current_user.id})
        pending = await db.applications.count_documents({"employer_id": current_user.id, "status": "pending"})
        accepted = await db.applications.count_documents({"employer_id": current_user.id, "status": "accepted"})
        
        return {
            "total_jobs": total_jobs,
            "active_jobs": active_jobs,
            "total_applications": total_applications,
            "pending_applications": pending,
            "accepted_applications": accepted
        }
    elif current_user.role == "job_seeker":
        total_applications = await db.applications.count_documents({"applicant_id": current_user.id})
        pending = await db.applications.count_documents({"applicant_id": current_user.id, "status": "pending"})
        accepted = await db.applications.count_documents({"applicant_id": current_user.id, "status": "accepted"})
        completed = await db.applications.count_documents({"applicant_id": current_user.id, "status": "completed"})
        
        # Calculate total earnings
        accepted_apps = await db.applications.find({
            "applicant_id": current_user.id,
            "status": {"$in": ["accepted", "completed"]}
        }, {"_id": 0}).to_list(1000)
        
        total_earnings = 0
        for app in accepted_apps:
            job = await db.jobs.find_one({"id": app["job_id"]}, {"_id": 0})
            if job:
                total_earnings += job["salary"]
        
        return {
            "total_applications": total_applications,
            "pending_applications": pending,
            "accepted_applications": accepted,
            "completed_jobs": completed,
            "total_earnings": total_earnings
        }
    
    return {}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
