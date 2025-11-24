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
                onClick={() => navigate('/contact')}
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
          <div className="footer-content-new">
            <div className="footer-main">
              <div className="footer-brand">
                <h3>JOBNI</h3>
                <p>منصة العمل الجزئي الوطنية</p>
                <p className="footer-email">job.ni@outlook.com</p>
              </div>
              
              <div className="footer-links-section">
                <div>
                  <h4>روابط سريعة</h4>
                  <a href="#features">المميزات</a>
                  <a href="#jobs">الوظائف</a>
                  <button onClick={() => navigate('/contact')} className="footer-link-btn">تواصل معنا</button>
                </div>
                
                <div>
                  <h4>تابعنا</h4>
                  <div className="footer-social">
                    <a 
                      href="https://x.com/JobniWork" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="footer-social-link"
                      data-testid="footer-twitter"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      X (Twitter)
                    </a>
                    <a 
                      href="https://www.linkedin.com/company/jobni-work" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="footer-social-link"
                      data-testid="footer-linkedin"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="footer-bottom">
              <p>© 2025 Jobni. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
