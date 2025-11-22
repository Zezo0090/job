import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import { ArrowRight, Lock, Mail, User, Briefcase, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import './AuthPageNew.css';

const AuthPageNew = () => {
  const { t } = useTranslation();
  const { login, API } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  
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
    toast.info(t('auth.nafath'));
  };

  const nextStep = () => {
    if (step === 1 && (!formData.name || !formData.role)) {
      toast.error('يرجى إكمال جميع الحقول');
      return;
    }
    setStep(2);
  };

  return (
    <div className=\"auth-page-new\" data-testid=\"auth-page\">\n      <div className=\"auth-background\">\n        <div className=\"auth-shape shape-1\"></div>\n        <div className=\"auth-shape shape-2\"></div>\n        <div className=\"auth-shape shape-3\"></div>\n      </div>\n\n      <div className=\"auth-container\">\n        <div className=\"auth-card-wrapper\">\n          <Card className=\"auth-card-new\">\n            <CardHeader className=\"auth-header\">\n              <div className=\"auth-logo-new\" data-testid=\"auth-logo\">JOBNI</div>\n              <CardTitle className=\"auth-title-new\" data-testid=\"auth-title\">\n                {t(isLogin ? 'auth.login' : 'auth.register')}\n              </CardTitle>\n              <CardDescription className=\"auth-description\">\n                {t(isLogin ? 'auth.welcome' : 'auth.join')}\n              </CardDescription>\n            </CardHeader>\n\n            <CardContent className=\"auth-content\">\n              {/* Nafath Button */}\n              <Button \n                variant=\"outline\" \n                className=\"nafath-button-new\"\n                onClick={handleNafath}\n                disabled\n                data-testid=\"nafath-button\"\n              >\n                <div className=\"nafath-icon-wrapper\">\n                  <svg viewBox=\"0 0 24 24\" fill=\"currentColor\" className=\"nafath-icon\">\n                    <path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z\"/>\n                  </svg>\n                </div>\n                {t('auth.nafath')}\n              </Button>\n\n              <div className=\"divider-new\" data-testid=\"auth-divider\">\n                <span>{t('auth.or')}</span>\n              </div>\n\n              <form onSubmit={handleSubmit} className=\"auth-form-new\">\n                {!isLogin && (\n                  <div className={`form-step ${step === 1 ? 'active' : 'hidden'}`}>\n                    <div className=\"form-group-new\">\n                      <Label htmlFor=\"name\" className=\"label-new\">\n                        <User size={18} />\n                        {t('auth.name')}\n                      </Label>\n                      <Input\n                        id=\"name\"\n                        name=\"name\"\n                        placeholder={t('auth.name')}\n                        value={formData.name}\n                        onChange={handleChange}\n                        required={!isLogin}\n                        className=\"input-new\"\n                        data-testid=\"name-input\"\n                      />\n                    </div>\n\n                    <div className=\"form-group-new\">\n                      <Label htmlFor=\"role\" className=\"label-new\">\n                        <Briefcase size={18} />\n                        {t('auth.role')}\n                      </Label>\n                      <Select \n                        value={formData.role} \n                        onValueChange={(value) => setFormData({...formData, role: value})}\n                      >\n                        <SelectTrigger className=\"select-new\" data-testid=\"role-select\">\n                          <SelectValue />\n                        </SelectTrigger>\n                        <SelectContent>\n                          <SelectItem value=\"job_seeker\" data-testid=\"role-job-seeker\">\n                            {t('auth.job_seeker')}\n                          </SelectItem>\n                          <SelectItem value=\"employer\" data-testid=\"role-employer\">\n                            {t('auth.employer')}\n                          </SelectItem>\n                        </SelectContent>\n                      </Select>\n                    </div>\n\n                    {formData.role === 'employer' && (\n                      <div className=\"form-group-new fade-in\">\n                        <Label htmlFor=\"company_name\" className=\"label-new\">\n                          <Briefcase size={18} />\n                          {t('auth.company')}\n                        </Label>\n                        <Input\n                          id=\"company_name\"\n                          name=\"company_name\"\n                          placeholder={t('auth.company')}\n                          value={formData.company_name}\n                          onChange={handleChange}\n                          className=\"input-new\"\n                          data-testid=\"company-input\"\n                        />\n                      </div>\n                    )}\n\n                    <div className=\"form-group-new\">\n                      <Label htmlFor=\"phone\" className=\"label-new\">\n                        <Phone size={18} />\n                        {t('auth.phone')}\n                      </Label>\n                      <Input\n                        id=\"phone\"\n                        name=\"phone\"\n                        placeholder=\"05xxxxxxxx\"\n                        value={formData.phone}\n                        onChange={handleChange}\n                        className=\"input-new\"\n                        data-testid=\"phone-input\"\n                      />\n                    </div>\n\n                    <Button \n                      type=\"button\"\n                      onClick={nextStep}\n                      className=\"next-button\"\n                    >\n                      التالي\n                      <ArrowRight size={20} />\n                    </Button>\n                  </div>\n                )}\n\n                <div className={`form-step ${(isLogin || step === 2) ? 'active' : 'hidden'}`}>\n                  <div className=\"form-group-new\">\n                    <Label htmlFor=\"email\" className=\"label-new\">\n                      <Mail size={18} />\n                      {t('auth.email')}\n                    </Label>\n                    <Input\n                      id=\"email\"\n                      name=\"email\"\n                      type=\"email\"\n                      placeholder=\"example@email.com\"\n                      value={formData.email}\n                      onChange={handleChange}\n                      required\n                      className=\"input-new\"\n                      data-testid=\"email-input\"\n                    />\n                  </div>\n\n                  <div className=\"form-group-new\">\n                    <Label htmlFor=\"password\" className=\"label-new\">\n                      <Lock size={18} />\n                      {t('auth.password')}\n                    </Label>\n                    <div className=\"password-input-wrapper\">\n                      <Input\n                        id=\"password\"\n                        name=\"password\"\n                        type={showPassword ? 'text' : 'password'}\n                        placeholder=\"••••••••\"\n                        value={formData.password}\n                        onChange={handleChange}\n                        required\n                        className=\"input-new\"\n                        data-testid=\"password-input\"\n                      />\n                      <button\n                        type=\"button\"\n                        onClick={() => setShowPassword(!showPassword)}\n                        className=\"password-toggle\"\n                      >\n                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}\n                      </button>\n                    </div>\n                  </div>\n\n                  {!isLogin && step === 2 && (\n                    <Button \n                      type=\"button\"\n                      variant=\"ghost\"\n                      onClick={() => setStep(1)}\n                      className=\"back-button\"\n                    >\n                      ← {t('back')}\n                    </Button>\n                  )}\n\n                  <Button \n                    type=\"submit\" \n                    className=\"submit-button-new\" \n                    disabled={loading}\n                    data-testid=\"submit-button\"\n                  >\n                    {loading ? (\n                      <>\n                        <div className=\"spinner\"></div>\n                        {t('loading')}\n                      </>\n                    ) : (\n                      <>\n                        <CheckCircle2 size={20} />\n                        {t(isLogin ? 'auth.login' : 'auth.register')}\n                      </>\n                    )}\n                  </Button>\n                </div>\n              </form>\n            </CardContent>\n\n            <CardFooter className=\"auth-footer-new\">\n              <p className=\"footer-text\">\n                {t(isLogin ? 'auth.no_account' : 'auth.have_account')}\n                <button \n                  type=\"button\"\n                  className=\"toggle-auth-new\"\n                  onClick={() => {\n                    setIsLogin(!isLogin);\n                    setStep(1);\n                  }}\n                  data-testid=\"toggle-auth-button\"\n                >\n                  {t(isLogin ? 'auth.register' : 'auth.login')}\n                </button>\n              </p>\n              <Button \n                variant=\"ghost\" \n                onClick={() => navigate('/')}\n                className=\"home-button\"\n                data-testid=\"back-home-button\"\n              >\n                {t('auth.back_home')}\n              </Button>\n            </CardFooter>\n          </Card>\n        </div>\n      </div>\n    </div>\n  );\n};\n\nconst Phone = ({ size }) => (\n  <svg width={size} height={size} viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\">\n    <path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"></path>\n  </svg>\n);\n\nexport default AuthPageNew;\n