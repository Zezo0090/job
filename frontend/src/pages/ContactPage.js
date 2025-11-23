import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import emailjs from 'emailjs-com';
import { Mail, Phone, MapPin, Send, ArrowLeft, MessageCircle } from 'lucide-react';
import './ContactPage.css';

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      // Send email using EmailJS
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        from_phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        to_email: 'job.ni@outlook.com'
      };

      // For now, we'll simulate email sending
      // You'll need to setup EmailJS account and add credentials
      console.log('Email would be sent:', templateParams);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('فشل الإرسال، يرجى المحاولة مرة أخرى');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page" data-testid="contact-page">
      {/* Header */}
      <div className="contact-header">
        <div className="container">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="back-btn"
            data-testid="back-button"
          >
            <ArrowLeft size={20} />
            العودة للرئيسية
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Left Side - Contact Info */}
            <div className="contact-info-section">
              <div className="contact-hero">
                <h1 data-testid="contact-title">تواصل معنا</h1>
                <p>نحن هنا لمساعدتك! تواصل معنا وسنرد عليك في أقرب وقت</p>
              </div>

              <div className="contact-info-cards">
                <Card className="info-card">
                  <CardContent className="info-card-content">
                    <div className="info-icon">
                      <Mail size={28} />
                    </div>
                    <div>
                      <h3>البريد الإلكتروني</h3>
                      <a href="mailto:job.ni@outlook.com" className="info-link">
                        job.ni@outlook.com
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="info-card">
                  <CardContent className="info-card-content">
                    <div className="info-icon">
                      <MessageCircle size={28} />
                    </div>
                    <div>
                      <h3>للشركات الراغبة بنشر وظائف</h3>
                      <p className="info-text">
                        تواصل معنا عبر البريد الإلكتروني وسنقوم بإنشاء حساب لك
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="info-card">
                  <CardContent className="info-card-content">
                    <div className="info-icon">
                      <MapPin size={28} />
                    </div>
                    <div>
                      <h3>المملكة العربية السعودية</h3>
                      <p className="info-text">منصة Jobni للوظائف الجزئية</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Social Links */}
              <div className="social-section">
                <h3>تابعنا على</h3>
                <div className="social-links">
                  <a 
                    href="https://x.com/JobniWork" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link"
                    data-testid="twitter-link"
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>X (Twitter)</span>
                  </a>
                  <a 
                    href="https://www.linkedin.com/company/jobni-work" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link"
                    data-testid="linkedin-link"
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <Card className="contact-form-card">
              <CardHeader>
                <CardTitle>أرسل لنا رسالة</CardTitle>
                <CardDescription>
                  املأ النموذج وسنتواصل معك في أقرب وقت ممكن
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name">الاسم الكامل *</label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="أدخل اسمك"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      data-testid="name-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">البريد الإلكتروني *</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      data-testid="email-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">رقم الجوال</label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="05xxxxxxxx"
                      value={formData.phone}
                      onChange={handleChange}
                      data-testid="phone-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">الموضوع *</label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="موضوع الرسالة"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      data-testid="subject-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">الرسالة *</label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="اكتب رسالتك هنا..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      required
                      data-testid="message-input"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="submit-btn" 
                    disabled={sending}
                    data-testid="submit-button"
                  >
                    {sending ? (
                      <>
                        <div className="spinner"></div>
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        إرسال الرسالة
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
