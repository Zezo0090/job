import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';
import { MapPin, Clock, DollarSign, Briefcase, ArrowRight, Calendar } from 'lucide-react';
import './JobDetailsPage.css';

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const { user, API } = useContext(AuthContext);
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`${API}/jobs/${jobId}`);
      setJob(response.data);
    } catch (error) {
      toast.error('فشل تحميل بيانات الوظيفة');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      navigate('/auth');
      return;
    }

    if (user.role !== 'job_seeker') {
      toast.error('فقط الباحثين عن عمل يمكنهم التقديم');
      return;
    }

    setApplying(true);
    try {
      await axios.post(`${API}/applications`, {
        job_id: jobId,
        message: applicationMessage
      });
      toast.success('تم التقديم بنجاح!');
      setShowApplyDialog(false);
      setApplicationMessage('');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'فشل التقديم');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="loading-screen">جاري التحميل...</div>;
  }

  if (!job) return null;

  return (
    <div className="job-details-page" data-testid="job-details-page">
      <div className="container">
        <Button variant="ghost" onClick={() => navigate('/jobs')} className="back-btn" data-testid="back-button">
          ← العودة
        </Button>

        <div className="job-details-card">
          <div className="job-header-section">
            <div>
              <h1 className="job-title" data-testid="job-title">{job.title}</h1>
              <p className="job-company" data-testid="job-company">{job.company_name}</p>
            </div>
            <Button 
              size="lg" 
              onClick={() => setShowApplyDialog(true)}
              data-testid="apply-button"
            >
              تقدم الآن
              <ArrowRight className="mr-2" />
            </Button>
          </div>

          <div className="job-meta">
            <div className="meta-item" data-testid="job-location">
              <MapPin size={20} />
              <span>{job.location}</span>
            </div>
            <div className="meta-item" data-testid="job-duration">
              <Clock size={20} />
              <span>{job.duration_value}</span>
            </div>
            <div className="meta-item" data-testid="job-salary">
              <DollarSign size={20} />
              <span>{job.salary} ريال</span>
            </div>
            <div className="meta-item" data-testid="job-posted">
              <Calendar size={20} />
              <span>{new Date(job.posted_date).toLocaleDateString('ar-SA')}</span>
            </div>
          </div>

          <div className="job-section">
            <h2>وصف الوظيفة</h2>
            <p className="job-description" data-testid="job-description">{job.description}</p>
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div className="job-section">
              <h2>المتطلبات</h2>
              <ul className="requirements-list">
                {job.requirements.map((req, idx) => (
                  <li key={idx} data-testid={`requirement-${idx}`}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="job-section">
            <h2>فئة الوظيفة</h2>
            <Badge data-testid="job-category">{job.category}</Badge>
          </div>
        </div>
      </div>

      {/* Apply Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent data-testid="apply-dialog">
          <DialogHeader>
            <DialogTitle>التقديم على الوظيفة</DialogTitle>
            <DialogDescription>
              قدم على {job.title}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="message">رسالة (اختياري)</Label>
            <Textarea
              id="message"
              placeholder="اكتب رسالة قصيرة عن نفسك..."
              value={applicationMessage}
              onChange={(e) => setApplicationMessage(e.target.value)}
              rows={5}
              data-testid="application-message"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowApplyDialog(false)}
              data-testid="cancel-apply"
            >
              إلغاء
            </Button>
            <Button 
              onClick={handleApply} 
              disabled={applying}
              data-testid="confirm-apply"
            >
              {applying ? 'جاري التقديم...' : 'تقديم'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
    {children}
  </label>
);

export default JobDetailsPage;
