import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Briefcase, MapPin, TrendingUp, Users, Shield, Bell, Star, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const durations = [
    { icon: Clock, label: 'ساعة', time: '1 ساعة' },
    { icon: Clock, label: '5 ساعات', time: '5 ساعات' },
    { icon: Clock, label: '8 ساعات', time: '8 ساعات' },
    { icon: Clock, label: '4 أيام', time: '4 أيام' },
    { icon: Clock, label: 'أسبوع', time: 'أسبوع' },
    { icon: Clock, label: 'شهر', time: 'شهر' },
  ];

  const stats = [
    { number: '6.8%', label: 'معدل بطالة السعوديين Q2 2025' },
    { number: '67%', label: 'نسبة الشباب تحت 30 عام' },
    { number: '493.76M$', label: 'حجم سوق العمل الجزئي الخليجي 2030' },
    { number: '142%', label: 'نمو اقتصاد العمل الحر 2023' },
  ];

  const features = [
    { icon: Briefcase, title: 'البحث الذكي', desc: 'تصفية الوظائف حسب الموقع، المهارات، والراتب' },
    { icon: Clock, title: 'مرونة العمل', desc: 'وظائف دوام جزئي تناسب جدولك اليومي' },
    { icon: Shield, title: 'التوثيق الإلكتروني', desc: 'عقود موثقة قانونياً وحماية حقوق الطرفين' },
    { icon: Star, title: 'نظام التقييم', desc: 'تقييمات شفافة تساعد في بناء سمعة مهنية' },
    { icon: Bell, title: 'التنبيهات الفورية', desc: 'إشعارات لحظية عند توفر وظائف مناسبة' },
    { icon: TrendingUp, title: 'إحصائيات تفصيلية', desc: 'تقارير شاملة لمتابعة الأداء والنتائج' },
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header" data-testid="landing-header">
        <div className="container header-container">
          <div className="logo" data-testid="logo">JOBNI</div>
          <nav className="nav-links">
            <a href="#features" data-testid="nav-features">المميزات</a>
            <a href="#jobs" data-testid="nav-jobs">الوظائف</a>
            <a href="#contact" data-testid="nav-contact">تواصل معنا</a>
          </nav>
          <div className="header-actions">
            <Button 
              variant="outline" 
              onClick={() => navigate('/auth')} 
              data-testid="login-button"
            >
              تسجيل الدخول
            </Button>
            <Button 
              onClick={() => navigate('/auth')} 
              data-testid="register-button"
            >
              إنشاء حساب
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" data-testid="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title" data-testid="hero-title">
              اختر وقتك.. واشتغل
            </h1>
            <p className="hero-subtitle" data-testid="hero-subtitle">
              وظائف جزئية ومرنة من ساعة إلى شهر
            </p>
            
            <div className="duration-icons">
              {durations.map((duration, idx) => (
                <div key={idx} className="duration-item" data-testid={`duration-${idx}`}>
                  <div className="duration-icon">
                    <duration.icon size={24} />
                  </div>
                  <div className="duration-label">{duration.label}</div>
                </div>
              ))}
            </div>

            <div className="hero-cta">
              <Button 
                size="lg" 
                onClick={() => navigate('/jobs')} 
                data-testid="search-jobs-button"
              >
                ابحث عن وظيفة
                <ArrowRight className="mr-2" size={20} />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/auth')}
                data-testid="post-job-button"
              >
                انشر وظيفة
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" data-testid="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card" data-testid={`stat-${idx}`}>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section" data-testid="features-section">
        <div className="container">
          <h2 className="section-title">لماذا تختار منصة Jobni؟</h2>
          <p className="section-subtitle">
            نوفر حلولاً متكاملة للباحثين عن عمل وأصحاب الأعمال
          </p>

          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card" data-testid={`feature-${idx}`}>
                <div className="feature-icon">
                  <feature.icon size={32} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" data-testid="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>ابدأ رحلتك المهنية اليوم</h2>
            <p>انضم لآلاف المستخدمين الذين وجدوا فرصهم المثالية</p>
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')} 
              data-testid="cta-start-button"
            >
              ابدأ الآن
              <ArrowRight className="mr-2" size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer" data-testid="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>JOBNI</h3>
              <p>منصة العمل الجزئي الوطنية</p>
            </div>
            <div className="footer-links">
              <div>
                <h4>روابط سريعة</h4>
                <a href="#features">المميزات</a>
                <a href="#jobs">الوظائف</a>
                <a href="#contact">تواصل معنا</a>
              </div>
            </div>
            <div className="footer-copy">
              <p>© 2025 Jobni. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
