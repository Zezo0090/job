import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import { ArrowRight, Lock, Mail, User, Briefcase } from 'lucide-react';
import './AuthPage.css';

const AuthPage = () => {
  const { login, API } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'job_seeker',
    company_name: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const response = await axios.post(`${API}/auth/login`, {
          email: formData.email,
          password: formData.password
        });
        login(response.data.access_token, response.data.user);
        navigate('/jobs');
      } else {
        const response = await axios.post(`${API}/auth/register`, formData);
        login(response.data.access_token, response.data.user);
        navigate('/jobs');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'حدث خطأ ما');
    } finally {
      setLoading(false);
    }
  };

  const handleNafath = () => {
    toast.info('نفاذ قيد التفعيل قريباً...');
  };

  return (
    <div className="auth-page" data-testid="auth-page">
      <div className="auth-container">
        <div className="auth-card-wrapper">
          <Card className="auth-card">
            <CardHeader>
              <div className="auth-logo" data-testid="auth-logo">JOBNI</div>
              <CardTitle data-testid="auth-title">
                {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </CardTitle>
              <CardDescription>
                {isLogin ? 'مرحباً بعودتك!' : 'انضم إلى منصة الوظائف الجزئية'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Nafath Button */}
              <Button 
                variant="outline" 
                className="nafath-button"
                onClick={handleNafath}
                disabled
                data-testid="nafath-button"
              >
                <img 
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23047857'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z'/%3E%3C/svg%3E" 
                  alt="Nafath" 
                  width="24" 
                  height="24"
                  className="nafath-icon"
                />
                تسجيل الدخول عبر نفاذ (قريباً)
              </Button>

              <div className="divider" data-testid="auth-divider">
                <span>أو</span>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                {!isLogin && (
                  <>
                    <div className="form-group">
                      <Label htmlFor="name" data-testid="name-label">الاسم الكامل</Label>
                      <div className="input-with-icon">
                        <User className="input-icon" size={20} />
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
                    </div>

                    <div className="form-group">
                      <Label htmlFor="role" data-testid="role-label">نوع الحساب</Label>
                      <Select 
                        value={formData.role} 
                        onValueChange={(value) => setFormData({...formData, role: value})}
                      >
                        <SelectTrigger data-testid="role-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="job_seeker" data-testid="role-job-seeker">باحث عن عمل</SelectItem>
                          <SelectItem value="employer" data-testid="role-employer">صاحب عمل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.role === 'employer' && (
                      <div className="form-group">
                        <Label htmlFor="company_name" data-testid="company-label">اسم الشركة</Label>
                        <div className="input-with-icon">
                          <Briefcase className="input-icon" size={20} />
                          <Input
                            id="company_name"
                            name="company_name"
                            placeholder="أدخل اسم الشركة"
                            value={formData.company_name}
                            onChange={handleChange}
                            data-testid="company-input"
                          />
                        </div>
                      </div>
                    )}

                    <div className="form-group">
                      <Label htmlFor="phone" data-testid="phone-label">رقم الجوال</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="05xxxxxxxx"
                        value={formData.phone}
                        onChange={handleChange}
                        data-testid="phone-input"
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <Label htmlFor="email" data-testid="email-label">البريد الإلكتروني</Label>
                  <div className="input-with-icon">
                    <Mail className="input-icon" size={20} />
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
                </div>

                <div className="form-group">
                  <Label htmlFor="password" data-testid="password-label">كلمة المرور</Label>
                  <div className="input-with-icon">
                    <Lock className="input-icon" size={20} />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="أدخل كلمة المرور"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      data-testid="password-input"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="submit-button" 
                  disabled={loading}
                  data-testid="submit-button"
                >
                  {loading ? 'جاري التحميل...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء حساب')}
                  <ArrowRight className="mr-2" size={20} />
                </Button>
              </form>
            </CardContent>

            <CardFooter className="auth-footer">
              <p>
                {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
                <button 
                  type="button"
                  className="toggle-auth"
                  onClick={() => setIsLogin(!isLogin)}
                  data-testid="toggle-auth-button"
                >
                  {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
                </button>
              </p>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                data-testid="back-home-button"
              >
                العودة للرئيسية
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
