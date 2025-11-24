import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { User, Mail, Phone, Briefcase, Star, ArrowRight } from 'lucide-react';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const roleLabels = {
    admin: 'مدير النظام',
    employer: 'صاحب عمل',
    job_seeker: 'باحث عن عمل'
  };

  return (
    <div className="profile-page" data-testid="profile-page">
      <div className="container">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="back-btn" data-testid="back-button">
          ← العودة للوحة
        </Button>

        <div className="profile-content">
          <Card className="profile-card">
            <CardHeader>
              <div className="profile-header">
                <div className="profile-avatar" data-testid="profile-avatar">
                  <User size={48} />
                </div>
                <div>
                  <CardTitle className="profile-name" data-testid="profile-name">{ user.name}</CardTitle>
                  <Badge data-testid="profile-role">{roleLabels[user.role]}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="profile-details">
                <div className="profile-item" data-testid="profile-email">
                  <Mail size={20} />
                  <div>
                    <span className="item-label">البريد الإلكتروني</span>
                    <span className="item-value">{user.email}</span>
                  </div>
                </div>

                {user.phone && (
                  <div className="profile-item" data-testid="profile-phone">
                    <Phone size={20} />
                    <div>
                      <span className="item-label">رقم الجوال</span>
                      <span className="item-value">{user.phone}</span>
                    </div>
                  </div>
                )}

                {user.company_name && (
                  <div className="profile-item" data-testid="profile-company">
                    <Briefcase size={20} />
                    <div>
                      <span className="item-label">اسم الشركة</span>
                      <span className="item-value">{user.company_name}</span>
                    </div>
                  </div>
                )}

                <div className="profile-item" data-testid="profile-rating">
                  <Star size={20} />
                  <div>
                    <span className="item-label">التقييم</span>
                    <span className="item-value">{user.rating.toFixed(1)} ({user.total_ratings} تقييم)</span>
                  </div>
                </div>
              </div>

              {user.skills && user.skills.length > 0 && (
                <div className="profile-skills">
                  <h3>المهارات</h3>
                  <div className="skills-list">
                    {user.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" data-testid={`skill-${idx}`}>{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="profile-actions">
                <Button onClick={() => navigate('/dashboard')} data-testid="go-dashboard">
                  لوحة التحكم
                  <ArrowRight className="mr-2" size={20} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
