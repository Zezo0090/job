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
                <form action="https://formsubmit.co/job.ni@outlook.com" method="POST" className="contact-form">
                  {/* FormSubmit Hidden Fields */}
                  <input type="hidden" name="_subject" value="رسالة جديدة من موقع Jobni" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="table" />
                  
                  <div className="form-group">
                    <label htmlFor="name">الاسم الكامل *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="أدخل اسمك"
                      required
                      className="form-input"
                      data-testid="name-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">البريد الإلكتروني *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="example@email.com"
                      required
                      className="form-input"
                      data-testid="email-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">رقم الجوال</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      placeholder="05xxxxxxxx"
                      className="form-input"
                      data-testid="phone-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">الموضوع *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="موضوع الرسالة (مثال: طلب إنشاء حساب لنشر وظائف)"
                      required
                      className="form-input"
                      data-testid="subject-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">الرسالة *</label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="اكتب رسالتك هنا... (للشركات: يرجى ذكر اسم الشركة والتفاصيل)"
                      rows={6}
                      required
                      className="form-textarea"
                      data-testid="message-input"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn" 
                    data-testid="submit-button"
                  >
                    <Send size={20} />
                    إرسال الرسالة
                  </button>
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
