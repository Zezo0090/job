import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import { ArrowRight, Send, MessageCircle, Home } from 'lucide-react';
import './MessagesPage.css';

const MessagesPage = () => {
  const { user, API } = useContext(AuthContext);
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [jobDetails, setJobDetails] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      const interval = setInterval(() => {
        fetchMessages(selectedConversation.id, true);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API}/conversations`);
      const convs = response.data;
      
      // Fetch job and user details for each conversation
      const enrichedConvs = await Promise.all(
        convs.map(async (conv) => {
          try {
            const jobRes = await axios.get(`${API}/jobs/${conv.job_id}`);
            const otherUserId = user.role === 'admin' || user.role === 'employer' 
              ? conv.candidate_id 
              : conv.employer_id;
            
            const usersRes = await axios.get(`${API}/admin/users`);
            const otherUser = usersRes.data.find(u => u.id === otherUserId);
            
            setJobDetails(prev => ({ ...prev, [conv.job_id]: jobRes.data }));
            setUserDetails(prev => ({ ...prev, [otherUserId]: otherUser }));
            
            return {
              ...conv,
              jobTitle: jobRes.data.title,
              otherUserName: otherUser?.name || 'مستخدم'
            };
          } catch (err) {
            return conv;
          }
        })
      );
      
      setConversations(enrichedConvs);
      if (enrichedConvs.length > 0 && !selectedConversation) {
        setSelectedConversation(enrichedConvs[0]);
      }
    } catch (error) {
      toast.error('فشل تحميل المحادثات');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId, silent = false) => {
    try {
      const response = await axios.get(`${API}/conversations/${conversationId}/messages`);
      setMessages(response.data);
    } catch (error) {
      if (!silent) {
        toast.error('فشل تحميل الرسائل');
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await axios.post(`${API}/conversations/${selectedConversation.id}/messages`, {
        conversation_id: selectedConversation.id,
        message_text: newMessage
      });
      
      setNewMessage('');
      fetchMessages(selectedConversation.id);
    } catch (error) {
      toast.error('فشل إرسال الرسالة');
    }
  };

  if (loading) {
    return <div className="loading-screen">جاري التحميل...</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="messages-page">
        <div className="messages-header">
          <div className="container">
            <div className="header-content">
              <h1>المحادثات</h1>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <ArrowRight size={20} className="ml-2" />
                العودة للوحة التحكم
              </Button>
            </div>
          </div>
        </div>
        <div className="container empty-messages">
          <Card>
            <CardContent className="empty-state-large">
              <MessageCircle size={64} className="empty-icon" />
              <h2>لا توجد محادثات</h2>
              <p>لا توجد محادثات نشطة في الوقت الحالي</p>
              <Button onClick={() => navigate('/dashboard')}>
                <Home size={20} className="ml-2" />
                العودة للوحة التحكم
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <div className="messages-header">
        <div className="container">
          <div className="header-content">
            <h1>المحادثات</h1>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowRight size={20} className="ml-2" />
              العودة للوحة التحكم
            </Button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="messages-container">
          {/* Conversations Sidebar */}
          <div className="conversations-sidebar">
            <CardHeader>
              <CardTitle>المحادثات النشطة</CardTitle>
            </CardHeader>
            <div className="conversations-list">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''}`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className="conversation-avatar">
                    <MessageCircle size={24} />
                  </div>
                  <div className="conversation-info">
                    <h4>{conv.otherUserName}</h4>
                    <p>{conv.jobTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="messages-area">
            {selectedConversation && (
              <>
                <div className="messages-chat-header">
                  <div className="chat-header-info">
                    <div className="chat-avatar">
                      <MessageCircle size={28} />
                    </div>
                    <div>
                      <h3>{selectedConversation.otherUserName}</h3>
                      <p>{selectedConversation.jobTitle}</p>
                    </div>
                  </div>
                  <Badge>نشط</Badge>
                </div>

                <div className="messages-chat-body">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`chat-message ${msg.sender_id === user.id ? 'sent' : 'received'} ${msg.sender_id === 'system' ? 'system' : ''}`}
                    >
                      <div className="message-content">
                        <div className="message-sender">{msg.sender_name}</div>
                        <div className="message-text">{msg.message_text}</div>
                        <div className="message-time">
                          {new Date(msg.created_at).toLocaleTimeString('ar-SA', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="messages-chat-footer">
                  <Input
                    placeholder="اكتب رسالتك هنا..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send size={20} />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
