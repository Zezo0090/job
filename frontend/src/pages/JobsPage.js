import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import axios from 'axios';
import { Search, MapPin, Clock, DollarSign, Heart, Briefcase, Menu, X, User, LogOut } from 'lucide-react';
import './JobsPage.css';

const JobsPage = () => {
  const { user, logout, API } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    duration_type: 'all',
    location: ''
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
    if (user) {
      fetchSavedJobs();
    }
  }, []);

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.duration_type !== 'all') params.append('duration_type', filters.duration_type);
      if (filters.location) params.append('location', filters.location);
      if (filters.search) params.append('search', filters.search);
      
      const response = await axios.get(`${API}/jobs?${params.toString()}`);
      setJobs(response.data);
    } catch (error) {
      toast.error('فشل تحميل الوظائف');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await axios.get(`${API}/saved-jobs`);
      setSavedJobs(response.data);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const handleSaveJob = async (jobId) => {
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      navigate('/auth');
      return;
    }

    try {
      if (savedJobs.includes(jobId)) {
        await axios.delete(`${API}/saved-jobs/${jobId}`);
        setSavedJobs(savedJobs.filter(id => id !== jobId));
        toast.success('تم إلغاء حفظ الوظيفة');
      } else {
        await axios.post(`${API}/saved-jobs/${jobId}`);
        setSavedJobs([...savedJobs, jobId]);
        toast.success('تم حفظ الوظيفة');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'حدث خطأ ما');
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchJobs();
  };

  const categories = [
    { value: 'all', label: 'كل الفئات' },
    { value: 'التجزئة', label: 'التجزئة' },
    { value: 'الفعاليات', label: 'الفعاليات' },
    { value: 'التقنية', label: 'التقنية' },
    { value: 'التسويق', label: 'التسويق' },
    { value: 'الضيافة', label: 'الضيافة' },
    { value: 'التعليم', label: 'التعليم' },
  ];

  const durations = [
    { value: 'all', label: 'كل المدد' },
    { value: 'hour', label: 'ساعة واحدة' },
    { value: 'hours_5', label: '5 ساعات' },
    { value: 'hours_8', label: '8 ساعات' },
    { value: 'days_4', label: '4 أيام' },
    { value: 'week', label: 'أسبوع' },
    { value: 'month', label: 'شهر' },
  ];

  return (
    <div className="jobs-page" data-testid="jobs-page">
      {/* Header */}
      <header className="jobs-header" data-testid="jobs-header">
        <div className="container header-container">
          <div className="logo" onClick={() => navigate('/')} data-testid="jobs-logo">JOBNI</div>
          
          <div className="header-actions">
            {user ? (
              <>
                <Button variant="ghost" onClick={() => navigate('/dashboard')} data-testid="dashboard-button">
                  <Briefcase size={20} className="ml-2" />
                  لوحة التحكم
                </Button>
                <Button variant="ghost" onClick={() => navigate('/profile')} data-testid="profile-button">
                  <User size={20} className="ml-2" />
                  الملف الشخصي
                </Button>
                <Button variant="outline" onClick={logout} data-testid="logout-button">
                  <LogOut size={20} className="ml-2" />
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')} data-testid="auth-button">تسجيل الدخول</Button>
            )}
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="filters-section" data-testid="filters-section">
        <div className="container">
          <div className="filters-grid">
            <div className="filter-item">
              <Input
                placeholder="ابحث عن وظيفة..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                data-testid="search-input"
              />
            </div>
            
            <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
              <SelectTrigger data-testid="category-filter" style={{ position: 'relative', zIndex: 1 }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={{ position: 'relative', zIndex: 9999 }}>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.duration_type} onValueChange={(value) => setFilters({...filters, duration_type: value})}>
              <SelectTrigger data-testid="duration-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {durations.map(dur => (
                  <SelectItem key={dur.value} value={dur.value}>{dur.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="الموقع"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              data-testid="location-input"
            />

            <Button onClick={handleSearch} data-testid="search-button">
              <Search size={20} className="ml-2" />
              بحث
            </Button>
          </div>
        </div>
      </section>

      {/* Jobs Grid */}
      <section className="jobs-section" data-testid="jobs-section">
        <div className="container">
          <div className="section-header">
            <h2>الوظائف المتاحة</h2>
            <Badge variant="secondary">{jobs.length} وظيفة</Badge>
          </div>

          {loading ? (
            <div className="loading-state">جاري التحميل...</div>
          ) : jobs.length === 0 ? (
            <div className="empty-state" data-testid="empty-jobs">
              <p>لا توجد وظائف متاحة</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map(job => (
                <div key={job.id} className="job-card" data-testid={`job-card-${job.id}`}>
                  <div className="job-header">
                    <div>
                      <h3 className="job-title">{job.title}</h3>
                      <p className="job-company">{job.company_name}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSaveJob(job.id)}
                      className={savedJobs.includes(job.id) ? 'saved' : ''}
                      data-testid={`save-job-${job.id}`}
                    >
                      <Heart size={20} fill={savedJobs.includes(job.id) ? 'currentColor' : 'none'} />
                    </Button>
                  </div>

                  <div className="job-details">
                    <div className="job-detail">
                      <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                    <div className="job-detail">
                      <Clock size={16} />
                      <span>{job.duration_value}</span>
                    </div>
                    <div className="job-detail">
                      <DollarSign size={16} />
                      <span>{job.salary} ريال</span>
                    </div>
                  </div>

                  <div className="job-category">
                    <Badge>{job.category}</Badge>
                  </div>

                  <Button 
                    className="job-apply-btn" 
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    data-testid={`view-job-${job.id}`}
                  >
                    عرض التفاصيل
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default JobsPage;
