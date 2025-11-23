import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import axios from 'axios';
import { Briefcase, Clock, Users, TrendingUp, Plus, Check, X, Download, Home } from 'lucide-react';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, API } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    company_name: user?.company_name || '',
    location: '',
    duration_type: 'hour',
    duration_value: '',
    salary: '',
    category: 'التجزئة',
    requirements: ''
  });

  useEffect(() => {
    fetchData();
  }, [user?.role]);

  const fetchData = async () => {
    try {
      const statsResponse = await axios.get(`${API}/reports/stats`);
      setStats(statsResponse.data);

      if (user.role === 'admin') {
        const adminStatsResponse = await axios.get(`${API}/admin/stats`);
        setStats(adminStatsResponse.data);
        
        const jobsResponse = await axios.get(`${API}/jobs`);
        setJobs(jobsResponse.data);
        
        const usersResponse = await axios.get(`${API}/admin/users`);
        setAllUsers(usersResponse.data);
      } else if (user.role === 'employer') {
        const jobsResponse = await axios.get(`${API}/jobs`);
        setJobs(jobsResponse.data.filter(j => j.employer_id === user.id));
      }

      const appsResponse = await axios.get(`${API}/applications`);
      setApplications(appsResponse.data);
      
      // Fetch applicant and job details for each application
      const enrichedApps = await Promise.all(
        appsResponse.data.map(async (app) => {
          try {
            const [jobRes, applicantRes] = await Promise.all([
              axios.get(`${API}/jobs/${app.job_id}`),
              axios.get(`${API}/admin/users`).then(res => res.data.find(u => u.id === app.applicant_id))
            ]);
            return {
              ...app,
              jobTitle: jobRes.data.title,
              applicantName: applicantRes?.name || 'غير معروف'
            };
          } catch (err) {
            return app;
          }
        })
      );
      setApplications(enrichedApps);
    } catch (error) {
      toast.error('فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async () => {
    try {
      const requirements = jobForm.requirements.split('\n').filter(r => r.trim());
      await axios.post(`${API}/jobs`, {
        ...jobForm,
        salary: parseFloat(jobForm.salary),
        requirements
      });
      toast.success('تم نشر الوظيفة!');
      setShowCreateJob(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'فشل نشر الوظيفة');
    }
  };

  const handleUpdateApplication = async (appId, status) => {
    try {
      await axios.put(`${API}/applications/${appId}`, { status });
      toast.success('تم تحديث الطلب');
      fetchData();
    } catch (error) {
      toast.error('فشل التحديث');
    }
  };

  const downloadInvoice = async (appId) => {
    try {
      const response = await axios.get(`${API}/reports/invoice/${appId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${appId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('تم تحميل الفاتورة');
    } catch (error) {
      toast.error('فشل تحميل الفاتورة');
    }
  };

  if (loading) {
    return <div className="loading-screen">جاري التحميل...</div>;
  }

  return (
    <div className="dashboard-page" data-testid="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1 data-testid="dashboard-title">مرحباً {user.name}</h1>
              <p>{user.role === 'admin' ? 'لوحة الأدمن' : user.role === 'employer' ? 'لوحة صاحب العمل' : 'لوحة الباحث عن عمل'}</p>
            </div>
            <div className="header-actions">
              <Button variant="outline" onClick={() => navigate('/')} data-testid="home-button">
                <Home size={20} className="ml-2" />
                الرئيسية
              </Button>
              {(user.role === 'employer' || user.role === 'admin') && (
                <Button onClick={() => setShowCreateJob(true)} data-testid="create-job-button">
                  <Plus size={20} className="ml-2" />
                  نشر وظيفة
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container dashboard-content">
        {/* Stats Cards */}
        {stats && (
          <div className="stats-grid" data-testid="stats-grid">
            {Object.entries(stats).map(([key, value]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle>{formatStatLabel(key)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="stat-value">{value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Applications List */}
        <Card className="applications-card">
          <CardHeader>
            <CardTitle data-testid="applications-title">
              {user.role === 'job_seeker' ? 'طلباتي' : 'الطلبات الواردة'}
            </CardTitle>
            <CardDescription>{applications.length} طلب</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <p className="empty-state" data-testid="empty-applications">لا توجد طلبات</p>
            ) : (
              <div className="applications-list">
                {applications.map(app => (
                  <div key={app.id} className="application-item-enhanced" data-testid={`application-${app.id}`}>
                    <div className="app-main-info">
                      <div className="app-details">
                        <h3 className="app-job-title">{app.jobTitle || 'وظيفة'}</h3>
                        <p className="app-applicant">المتقدم: {app.applicantName || 'غير معروف'}</p>
                        <p className="app-id">رقم الطلب: {app.id.slice(0, 8)}</p>
                        <p className="app-date">التاريخ: {new Date(app.applied_date).toLocaleDateString('ar-SA')}</p>
                        {app.message && <p className="app-message">الرسالة: {app.message}</p>}
                      </div>
                      <div className="app-status-badge">
                        <Badge variant={
                          app.status === 'accepted' ? 'success' : 
                          app.status === 'rejected' ? 'destructive' : 
                          'default'
                        }>
                          {app.status === 'pending' ? 'معلق' : 
                           app.status === 'accepted' ? 'مقبول' : 
                           app.status === 'rejected' ? 'مرفوض' : 
                           app.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="app-actions">
                      {(user.role === 'employer' || user.role === 'admin') && app.status === 'pending' && (
                        <>
                          <Button size="sm" onClick={() => handleUpdateApplication(app.id, 'accepted')} data-testid={`accept-${app.id}`} className="btn-accept">
                            <Check size={16} className="ml-1" /> قبول
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleUpdateApplication(app.id, 'rejected')} data-testid={`reject-${app.id}`} className="btn-reject">
                            <X size={16} className="ml-1" /> رفض
                          </Button>
                        </>
                      )}
                      {(app.status === 'accepted' || app.status === 'completed') && (
                        <Button size="sm" variant="outline" onClick={() => downloadInvoice(app.id)} data-testid={`invoice-${app.id}`}>
                          <Download size={16} className="ml-1" /> تحميل فاتورة
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Jobs List (For Employers/Admin) */}
        {(user.role === 'employer' || user.role === 'admin') && (
          <Card>
            <CardHeader>
              <CardTitle data-testid="jobs-title">الوظائف المنشورة</CardTitle>
              <CardDescription>{jobs.length} وظيفة</CardDescription>
            </CardHeader>
            <CardContent>
              {jobs.length === 0 ? (
                <p className="empty-state" data-testid="empty-jobs">لم تنشر أي وظائف بعد</p>
              ) : (
                <div className="jobs-list">
                  {jobs.map(job => (
                    <div key={job.id} className="job-item" data-testid={`job-${job.id}`}>
                      <div>
                        <h3>{job.title}</h3>
                        <p>{job.company_name} - {job.location}</p>
                      </div>
                      <Badge>{job.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Job Dialog */}
      <Dialog open={showCreateJob} onOpenChange={setShowCreateJob}>
        <DialogContent className="max-w-2xl" data-testid="create-job-dialog">
          <DialogHeader>
            <DialogTitle>نشر وظيفة جديدة</DialogTitle>
          </DialogHeader>
          <div className="job-form">
            <div className="form-row">
              <div>
                <Label htmlFor="title">عنوان الوظيفة</Label>
                <Input id="title" value={jobForm.title} onChange={(e) => setJobForm({...jobForm, title: e.target.value})} data-testid="job-title-input" />
              </div>
              <div>
                <Label htmlFor="company">اسم الشركة</Label>
                <Input id="company" value={jobForm.company_name} onChange={(e) => setJobForm({...jobForm, company_name: e.target.value})} data-testid="job-company-input" />
              </div>
            </div>
            <div>
              <Label htmlFor="description">وصف الوظيفة</Label>
              <Textarea id="description" value={jobForm.description} onChange={(e) => setJobForm({...jobForm, description: e.target.value})} rows={4} data-testid="job-description-input" />
            </div>
            <div className="form-row">
              <div>
                <Label htmlFor="location">الموقع</Label>
                <Input id="location" value={jobForm.location} onChange={(e) => setJobForm({...jobForm, location: e.target.value})} data-testid="job-location-input" />
              </div>
              <div>
                <Label htmlFor="salary">الراتب (ريال)</Label>
                <Input id="salary" type="number" value={jobForm.salary} onChange={(e) => setJobForm({...jobForm, salary: e.target.value})} data-testid="job-salary-input" />
              </div>
            </div>
            <div className="form-row">
              <div>
                <Label htmlFor="duration_type">نوع المدة</Label>
                <Select value={jobForm.duration_type} onValueChange={(val) => setJobForm({...jobForm, duration_type: val})}>
                  <SelectTrigger data-testid="job-duration-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hour">ساعة</SelectItem>
                    <SelectItem value="hours_5">5 ساعات</SelectItem>
                    <SelectItem value="hours_8">8 ساعات</SelectItem>
                    <SelectItem value="days_4">4 أيام</SelectItem>
                    <SelectItem value="week">أسبوع</SelectItem>
                    <SelectItem value="month">شهر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration_value">مدة العمل</Label>
                <Input id="duration_value" value={jobForm.duration_value} onChange={(e) => setJobForm({...jobForm, duration_value: e.target.value})} placeholder="مثل: 8 ساعات" data-testid="job-duration-value" />
              </div>
            </div>
            <div>
              <Label htmlFor="category">الفئة</Label>
              <Select value={jobForm.category} onValueChange={(val) => setJobForm({...jobForm, category: val})}>
                <SelectTrigger data-testid="job-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="التجزئة">التجزئة</SelectItem>
                  <SelectItem value="الفعاليات">الفعاليات</SelectItem>
                  <SelectItem value="التقنية">التقنية</SelectItem>
                  <SelectItem value="التسويق">التسويق</SelectItem>
                  <SelectItem value="الضيافة">الضيافة</SelectItem>
                  <SelectItem value="التعليم">التعليم</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="requirements">المتطلبات (كل متطلب في سطر)</Label>
              <Textarea id="requirements" value={jobForm.requirements} onChange={(e) => setJobForm({...jobForm, requirements: e.target.value})} rows={3} data-testid="job-requirements" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateJob(false)} data-testid="cancel-create-job">إلغاء</Button>
            <Button onClick={handleCreateJob} data-testid="submit-create-job">نشر الوظيفة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const formatStatLabel = (key) => {
  const labels = {
    total_users: 'إجمالي المستخدمين',
    total_jobs: 'إجمالي الوظائف',
    active_jobs: 'وظائف نشطة',
    total_applications: 'إجمالي الطلبات',
    pending_applications: 'طلبات معلقة',
    accepted_applications: 'طلبات مقبولة',
    completed_jobs: 'وظائف مكتملة',
    total_earnings: 'إجمالي الأرباح (ريال)',
    employers: 'أصحاب عمل',
    job_seekers: 'باحثين عن عمل'
  };
  return labels[key] || key;
};

export default DashboardPage;
