import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      // Nav
      'features': 'المميزات',
      'jobs': 'الوظائف',
      'contact': 'تواصل معنا',
      'login': 'تسجيل الدخول',
      'register': 'إنشاء حساب',
      'logout': 'تسجيل الخروج',
      'dashboard': 'لوحة التحكم',
      'profile': 'الملف الشخصي',
      
      // Hero
      'hero.title': 'اختر وقتك.. واشتغل',
      'hero.subtitle': 'وظائف جزئية ومرنة من ساعة إلى شهر',
      'search.jobs': 'ابحث عن وظيفة',
      'post.job': 'انشر وظيفة',
      
      // Durations
      'duration.hour': 'ساعة',
      'duration.hours_5': '5 ساعات',
      'duration.hours_8': '8 ساعات',
      'duration.days_4': '4 أيام',
      'duration.week': 'أسبوع',
      'duration.month': 'شهر',
      
      // Auth
      'auth.login': 'تسجيل الدخول',
      'auth.register': 'إنشاء حساب جديد',
      'auth.welcome': 'مرحباً بعودتك!',
      'auth.join': 'انضم إلى منصة الوظائف الجزئية',
      'auth.nafath': 'تسجيل الدخول عبر نفاذ (قريباً)',
      'auth.or': 'أو',
      'auth.name': 'الاسم الكامل',
      'auth.email': 'البريد الإلكتروني',
      'auth.password': 'كلمة المرور',
      'auth.phone': 'رقم الجوال',
      'auth.role': 'نوع الحساب',
      'auth.company': 'اسم الشركة',
      'auth.job_seeker': 'باحث عن عمل',
      'auth.employer': 'صاحب عمل',
      'auth.no_account': 'ليس لديك حساب؟',
      'auth.have_account': 'لديك حساب بالفعل؟',
      'auth.back_home': 'العودة للرئيسية',
      
      // Jobs
      'jobs.available': 'الوظائف المتاحة',
      'jobs.search': 'ابحث عن وظيفة...',
      'jobs.category': 'الفئة',
      'jobs.duration': 'المدة',
      'jobs.location': 'الموقع',
      'jobs.view_details': 'عرض التفاصيل',
      'jobs.apply': 'تقدم الآن',
      'jobs.save': 'حفظ',
      'jobs.saved': 'محفوظ',
      
      // Contact
      'contact.title': 'تواصل معنا',
      'contact.subtitle': 'نحن هنا لمساعدتك',
      'contact.name': 'الاسم',
      'contact.email': 'البريد الإلكتروني',
      'contact.message': 'رسالتك',
      'contact.send': 'إرسال',
      'contact.success': 'تم إرسال رسالتك بنجاح!',
      'contact.error': 'فشل الإرسال، حاول مرة أخرى',
      
      // Footer
      'footer.about': 'منصة Jobni',
      'footer.description': 'منصة العمل الجزئي الوطنية',
      'footer.follow': 'تابعنا',
      'footer.rights': 'جميع الحقوق محفوظة',
      
      // Dashboard
      'dashboard.welcome': 'مرحباً',
      'dashboard.admin': 'لوحة الأدمن',
      'dashboard.employer': 'لوحة صاحب العمل',
      'dashboard.jobseeker': 'لوحة الباحث عن عمل',
      'dashboard.home': 'الرئيسية',
      'dashboard.messages': 'المحادثات',
      'dashboard.create_job': 'نشر وظيفة',
      'dashboard.stats': 'الإحصائيات',
      'dashboard.applications': 'الطلبات',
      'dashboard.my_applications': 'طلباتي',
      'dashboard.received_applications': 'الطلبات الواردة',
      'dashboard.posted_jobs': 'الوظائف المنشورة',
      'dashboard.no_applications': 'لا توجد طلبات',
      'dashboard.no_jobs': 'لم تنشر أي وظائف بعد',
      'dashboard.accept': 'قبول',
      'dashboard.reject': 'رفض',
      'dashboard.complete': 'تحديد كمكتمل',
      'dashboard.download_invoice': 'تحميل فاتورة',
      'dashboard.edit': 'تعديل',
      'dashboard.delete': 'حذف',
      'dashboard.applicant': 'المتقدم',
      'dashboard.date': 'التاريخ',
      'dashboard.status': 'الحالة',
      'dashboard.pending': 'معلق',
      'dashboard.accepted': 'مقبول',
      'dashboard.rejected': 'مرفوض',
      'dashboard.completed': 'مكتمل',
      
      // Job Form
      'job.title': 'عنوان الوظيفة',
      'job.company': 'اسم الشركة',
      'job.description': 'وصف الوظيفة',
      'job.location': 'الموقع',
      'job.salary': 'الراتب (ريال)',
      'job.duration_type': 'نوع المدة',
      'job.duration_value': 'مدة العمل',
      'job.category': 'الفئة',
      'job.requirements': 'المتطلبات (كل متطلب في سطر)',
      'job.create_title': 'نشر وظيفة جديدة',
      'job.edit_title': 'تعديل الوظيفة',
      'job.post': 'نشر الوظيفة',
      'job.update': 'تحديث الوظيفة',
      
      // Categories
      'category.retail': 'التجزئة',
      'category.events': 'الفعاليات',
      'category.tech': 'التقنية',
      'category.marketing': 'التسويق',
      'category.hospitality': 'الضيافة',
      'category.education': 'التعليم',
      
      // Messages
      'messages.title': 'المحادثات',
      'messages.active': 'المحادثات النشطة',
      'messages.no_conversations': 'لا توجد محادثات',
      'messages.no_conversations_desc': 'لا توجد محادثات نشطة في الوقت الحالي',
      'messages.type_message': 'اكتب رسالتك هنا...',
      'messages.send': 'إرسال',
      
      // Common
      'loading': 'جاري التحميل...',
      'search': 'بحث',
      'all': 'الكل',
      'back': 'العودة',
      'cancel': 'إلغاء',
      'confirm': 'تأكيد',
      'submit': 'إرسال',
    }
  },
  en: {
    translation: {
      // Nav
      'features': 'Features',
      'jobs': 'Jobs',
      'contact': 'Contact Us',
      'login': 'Login',
      'register': 'Sign Up',
      'logout': 'Logout',
      'dashboard': 'Dashboard',
      'profile': 'Profile',
      
      // Hero
      'hero.title': 'Choose Your Time.. Work',
      'hero.subtitle': 'Flexible part-time jobs from 1 hour to 1 month',
      'search.jobs': 'Search Jobs',
      'post.job': 'Post Job',
      
      // Durations
      'duration.hour': '1 Hour',
      'duration.hours_5': '5 Hours',
      'duration.hours_8': '8 Hours',
      'duration.days_4': '4 Days',
      'duration.week': '1 Week',
      'duration.month': '1 Month',
      
      // Auth
      'auth.login': 'Login',
      'auth.register': 'Create Account',
      'auth.welcome': 'Welcome Back!',
      'auth.join': 'Join Part-Time Jobs Platform',
      'auth.nafath': 'Login with Nafath (Coming Soon)',
      'auth.or': 'OR',
      'auth.name': 'Full Name',
      'auth.email': 'Email Address',
      'auth.password': 'Password',
      'auth.phone': 'Phone Number',
      'auth.role': 'Account Type',
      'auth.company': 'Company Name',
      'auth.job_seeker': 'Job Seeker',
      'auth.employer': 'Employer',
      'auth.no_account': "Don't have an account?",
      'auth.have_account': 'Already have an account?',
      'auth.back_home': 'Back to Home',
      
      // Jobs
      'jobs.available': 'Available Jobs',
      'jobs.search': 'Search for a job...',
      'jobs.category': 'Category',
      'jobs.duration': 'Duration',
      'jobs.location': 'Location',
      'jobs.view_details': 'View Details',
      'jobs.apply': 'Apply Now',
      'jobs.save': 'Save',
      'jobs.saved': 'Saved',
      
      // Contact
      'contact.title': 'Contact Us',
      'contact.subtitle': 'We\'re here to help',
      'contact.name': 'Name',
      'contact.email': 'Email',
      'contact.message': 'Your Message',
      'contact.send': 'Send',
      'contact.success': 'Message sent successfully!',
      'contact.error': 'Failed to send, please try again',
      
      // Footer
      'footer.about': 'Jobni Platform',
      'footer.description': 'National Part-Time Jobs Platform',
      'footer.follow': 'Follow Us',
      'footer.rights': 'All Rights Reserved',
      
      // Common
      'loading': 'Loading...',
      'search': 'Search',
      'all': 'All',
      'back': 'Back',
      'cancel': 'Cancel',
      'confirm': 'Confirm',
      'submit': 'Submit',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
