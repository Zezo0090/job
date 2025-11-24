import React, { useState } from 'react';
import { Button } from './ui/button';
import { X, MessageCircle, Send } from 'lucide-react';
import './ChatBot.css';

const FAQ_DATA = [
  {
    question: "ما هو جوبني؟",
    answer: "جوبني منصة تربط بين أصحاب الأعمال والأفراد الباحثين عن وظائف جزئية أو مؤقتة. الهدف إنك تلاقي شغل يناسب وقتك، وأصحاب الأعمال يلاقوا أشخاص موثوقين يغطّون الشفتات أو المشاريع القصيرة."
  },
  {
    question: "كيف أسجل في جوبني؟",
    answer: "ادخل على الموقع، اضغط على 'تسجيل' أو 'إنشاء حساب'، عبِّ البيانات الأساسية مثل الاسم، رقم الجوال، البريد الإلكتروني، ثم أكمل ملفك الشخصي بالمعلومات المهمة عن خبراتك ومهاراتك وتوفرّك."
  },
  {
    question: "كيف أقدّم على وظيفة؟",
    answer: "افتح صفحة الوظائف، اختر الفرصة المناسبة لك، ثم اضغط 'تقديم' أو 'قدّم الآن'، راجع التفاصيل، وبعدها أكّد التقديم. ستصلك إشعارات بحالة طلبك."
  },
  {
    question: "كيف أعرف إذا تم قبولي؟",
    answer: "إذا تم قبولك، راح توصلك رسالة داخل حسابك في جوبني. بعدها تقدر تدخل على صفحة المحادثة الخاصة بالوظيفة للتنسيق مع صاحب العمل."
  },
  {
    question: "كيف أضيف وظيفة جديدة؟",
    answer: "تواصل معنا عبر صفحة 'تواصل معنا' وأذكر بيانات شركتك، وسنقوم بإنشاء حساب لك لنشر الوظائف."
  },
  {
    question: "كيف يتم دفع الأجر؟",
    answer: "الدفع يتم بالاتفاق المباشر بين صاحب العمل والعامل (تحويل بنكي، كاش، أو أي طريقة متفق عليها)."
  },
  {
    question: "نسيت كلمة المرور",
    answer: "من صفحة تسجيل الدخول اختر 'نسيت كلمة المرور'، أدخل بريدك الإلكتروني المسجل، وراح توصلك رسالة لإعادة تعيين كلمة المرور."
  },
  {
    question: "كيف أتواصل مع الدعم؟",
    answer: "تقدر تتواصل معنا عبر صفحة 'اتصل بنا'، أو إرسال رسالة على البريد: job.ni@outlook.com"
  }
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'مرحباً! 👋 أنا مساعدك الذكي في جوبني. كيف يمكنني مساعدتك اليوم؟'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleQuickQuestion = (question) => {
    const faq = FAQ_DATA.find(item => item.question === question);
    if (faq) {
      setMessages([...messages, 
        { sender: 'user', text: question },
        { sender: 'bot', text: faq.answer }
      ]);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = { sender: 'user', text: inputText };
    
    // Find matching FAQ
    const matchedFAQ = FAQ_DATA.find(item => 
      item.question.includes(inputText) || inputText.includes(item.question.split(' ')[0])
    );

    let botResponse;
    if (matchedFAQ) {
      botResponse = { sender: 'bot', text: matchedFAQ.answer };
    } else {
      botResponse = { 
        sender: 'bot', 
        text: 'عذراً، لم أفهم سؤالك بشكل كامل. يمكنك التواصل مع فريق الدعم عبر: job.ni@outlook.com أو اختيار أحد الأسئلة الشائعة أعلاه.' 
      };
    }

    setMessages([...messages, userMessage, botResponse]);
    setInputText('');
  };

  const quickQuestions = [
    "ما هو جوبني؟",
    "كيف أسجل في جوبني؟",
    "كيف أقدّم على وظيفة؟",
    "كيف أتواصل مع الدعم؟"
  ];

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          className="chatbot-float-btn" 
          onClick={() => setIsOpen(true)}
          data-testid="chatbot-open"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window" data-testid="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-content">
              <MessageCircle size={24} />
              <div>
                <h3>مساعد جوبني</h3>
                <span>متصل الآن</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="chatbot-close">
              <X size={20} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                <div className="message-bubble">
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Quick Questions */}
            {messages.length <= 2 && (
              <div className="quick-questions">
                <p>أسئلة شائعة:</p>
                {quickQuestions.map((q, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleQuickQuestion(q)}
                    className="quick-question-btn"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="اكتب سؤالك هنا..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              data-testid="chatbot-input"
            />
            <button onClick={handleSendMessage} className="send-btn">
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
