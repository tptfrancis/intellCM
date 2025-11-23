
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
  MessageCircle, 
  Layout, 
  PlaySquare, 
  User as UserIcon, 
  Search, 
  Plus, 
  Heart, 
  Share2, 
  MoreHorizontal, 
  Upload,
  X,
  Send,
  Clock,
  Eye,
  Filter,
  Menu,
  Settings,
  ThumbsUp,
  Edit3,
  Camera,
  LogOut,
  Home,
  Trash2,
  Lock,
  Unlock,
  Bell,
  Tag,
  Image as ImageIcon,
  Save,
  LogIn,
  Moon,
  Sun,
  Facebook,
  Link as LinkIcon,
  MessageSquare,
  Twitter,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import { 
  User, 
  UserRole, 
  Message, 
  ForumPost, 
  Video,
  Comment,
  ChatSession
} from './types';
import { 
  CURRENT_USER_MASTER, 
  CURRENT_USER_STUDENT, 
  GUEST_USER,
  MOCK_FORUM_POSTS, 
  MOCK_VIDEOS,
  MOCK_USERS,
  MOCK_CHAT_SESSIONS
} from './constants';

// --- API Initialization ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Components ---

// 1. Sidebar / Navigation
const Navigation = ({ activeTab, setActiveTab, isMobileMenuOpen, toggleMobileMenu, currentUser, onLogin, onLogout, isDarkMode, toggleTheme }: any) => {
  const navItems = [
    { id: 'home', label: '首頁總覽', icon: Home },
    { id: 'chat', label: 'AI 智能醫師', icon: MessageCircle },
    { id: 'forum', label: '社群論壇', icon: Layout },
    { id: 'videos', label: '影音學堂', icon: PlaySquare },
    { id: 'profile', label: '個人中心', icon: UserIcon },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}
      
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#f8f5f2] dark:bg-stone-900 border-r border-[#e6e0d4] dark:border-stone-800 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-[#e6e0d4] dark:border-stone-800">
          <div className="w-10 h-10 bg-tcm-600 rounded-xl flex items-center justify-center text-white font-serif text-2xl shadow-sm">
            中
          </div>
          <div>
            <h1 className="text-xl font-bold text-tcm-900 dark:text-tcm-400 tracking-wide">中醫智匯</h1>
            <p className="text-xs text-tcm-600 dark:text-tcm-500">TCM Wisdom Hub</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                toggleMobileMenu();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-medium active:scale-95 transform ${
                activeTab === item.id
                  ? 'bg-tcm-100 dark:bg-tcm-900/30 text-tcm-800 dark:text-tcm-300 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800 hover:text-tcm-700 dark:hover:text-tcm-300'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-tcm-600 dark:text-tcm-400' : 'text-stone-400'} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#e6e0d4] dark:border-stone-800 space-y-3">
          <button 
             onClick={toggleTheme}
             className="w-full flex items-center gap-3 px-4 py-2 text-stone-600 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800 rounded-lg transition-colors text-sm font-medium active:scale-95 transform"
          >
             {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
             {isDarkMode ? '切換亮色模式' : '切換深色模式'}
          </button>

          {currentUser.role === UserRole.GUEST ? (
            <button 
              onClick={onLogin}
              className="w-full bg-tcm-600 text-white p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-tcm-700 transition-all shadow-sm active:scale-95 transform"
            >
              <LogIn size={18} />
              <span className="font-bold">登入帳號</span>
            </button>
          ) : (
             <div className="space-y-3">
                 <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-stone-600 dark:text-stone-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all text-sm font-medium active:scale-95 transform"
                 >
                    <LogOut size={18} />
                    登出
                 </button>
                <div className="bg-gradient-to-br from-white to-[#f0fdf4] dark:from-stone-800 dark:to-stone-900 border border-tcm-100 dark:border-stone-700 rounded-xl p-4 shadow-sm">
                  <p className="text-xs font-bold text-tcm-800 dark:text-tcm-300 mb-2 flex items-center gap-1">
                    <span className="text-lg">☯</span> 每日養生智慧
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-serif">"上醫治未病，中醫治欲病，下醫治已病。"</p>
                </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

// 2. Home View
const HomeView = ({ setActiveTab, currentUser, videos, posts, triggerLogin, goToVideo, goToPost }: any) => {
  const featuredVideo = videos[0];
  const latestPost = posts.find((p: any) => p.status === 'published');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {currentUser.role === UserRole.GUEST ? '歡迎來到中醫智匯' : `歡迎回來，${currentUser.name}`}
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">今日氣節：立冬。宜補冬，忌生冷。</p>
        </div>
        <button 
           onClick={() => currentUser.role === UserRole.GUEST ? triggerLogin() : setActiveTab('profile')}
           className="relative p-2 bg-white dark:bg-stone-800 rounded-full border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:text-tcm-600 dark:hover:text-tcm-400 transition-all active:scale-95"
        >
          <Bell size={20} />
          {currentUser.notifications.some((n: any) => !n.isRead) && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-stone-800"></span>
          )}
        </button>
      </header>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => setActiveTab('chat')} className="bg-gradient-to-br from-tcm-500 to-tcm-600 dark:from-tcm-600 dark:to-tcm-800 text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all text-left group active:scale-95">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <MessageCircle size={24} />
          </div>
          <div className="font-bold">AI 問診</div>
          <div className="text-xs text-tcm-100 mt-1">立即諮詢健康問題</div>
        </button>
        <button onClick={() => setActiveTab('videos')} className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-left group hover:border-tcm-300 dark:hover:border-tcm-700 active:scale-95">
           <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <PlaySquare size={24} />
          </div>
          <div className="font-bold text-stone-800 dark:text-stone-100">觀看課程</div>
          <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">學習養生知識</div>
        </button>
        <button onClick={() => setActiveTab('forum')} className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-left group hover:border-tcm-300 dark:hover:border-tcm-700 active:scale-95">
           <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Layout size={24} />
          </div>
          <div className="font-bold text-stone-800 dark:text-stone-100">參與討論</div>
          <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">瀏覽最新話題</div>
        </button>
        <button onClick={() => currentUser.role === UserRole.GUEST ? triggerLogin() : setActiveTab('profile')} className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-4 rounded-xl shadow-sm hover:shadow-md transition-all text-left group hover:border-tcm-300 dark:hover:border-tcm-700 active:scale-95">
           <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <UserIcon size={24} />
          </div>
          <div className="font-bold text-stone-800 dark:text-stone-100">個人中心</div>
          <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">查看記錄與收藏</div>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Featured Content */}
        <div className="lg:col-span-2 space-y-6">
          <section>
             <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-stone-800 dark:text-stone-100">推薦影片</h2>
                <button onClick={() => setActiveTab('videos')} className="text-sm text-tcm-600 dark:text-tcm-400 font-medium hover:underline">查看更多</button>
             </div>
             <div onClick={() => goToVideo(featuredVideo)} className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden flex cursor-pointer group hover:shadow-md transition-all active:scale-[0.99]">
                <div className="w-1/3 relative">
                   <img src={featuredVideo.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   {featuredVideo.isPaid && <div className="absolute top-2 left-2 bg-amber-400 text-white text-[10px] px-1.5 py-0.5 rounded font-bold shadow-sm">VIP</div>}
                </div>
                <div className="p-4 flex-1">
                   <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-2 group-hover:text-tcm-600 dark:group-hover:text-tcm-400 transition-colors">{featuredVideo.title}</h3>
                   <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 mb-3">{featuredVideo.description}</p>
                   <div className="flex items-center gap-2 text-xs text-stone-400 dark:text-stone-500">
                      <span>{featuredVideo.views} 次觀看</span>
                      <span>•</span>
                      <span>{featuredVideo.createdAt}</span>
                   </div>
                </div>
             </div>
          </section>

          <section>
             <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-stone-800 dark:text-stone-100">熱門討論</h2>
                <button onClick={() => setActiveTab('forum')} className="text-sm text-tcm-600 dark:text-tcm-400 font-medium hover:underline">查看更多</button>
             </div>
             {latestPost && (
                 <div onClick={() => goToPost(latestPost.id)} className="bg-white dark:bg-stone-800 p-5 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm cursor-pointer hover:border-tcm-300 dark:hover:border-tcm-700 transition-all active:scale-[0.99]">
                     <div className="flex items-center gap-2 mb-2">
                        <span className="bg-tcm-50 dark:bg-tcm-900/30 text-tcm-700 dark:text-tcm-300 px-2 py-0.5 rounded text-xs font-medium">熱門</span>
                        <span className="text-xs text-stone-400">{latestPost.createdAt}</span>
                     </div>
                     <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-2 group-hover:text-tcm-600">{latestPost.title}</h3>
                     <p className="text-sm text-stone-600 dark:text-stone-300 line-clamp-2 mb-3">{latestPost.content}</p>
                     <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
                        <span className="flex items-center gap-1"><Heart size={12}/> {latestPost.likes}</span>
                        <span className="flex items-center gap-1"><MessageCircle size={12}/> {latestPost.comments.length}</span>
                     </div>
                 </div>
             )}
          </section>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
           <div className="bg-gradient-to-b from-tcm-50 to-white dark:from-stone-800 dark:to-stone-900 p-5 rounded-xl border border-tcm-100 dark:border-stone-700 shadow-sm">
              <h3 className="font-bold text-tcm-800 dark:text-tcm-300 mb-3 flex items-center gap-2">
                 <Clock size={18} /> 
                 養生時鐘
              </h3>
              <div className="text-center py-4">
                 <div className="text-4xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-1">申時</div>
                 <div className="text-sm text-stone-500 dark:text-stone-400">15:00 - 17:00</div>
                 <div className="mt-3 text-sm font-medium text-tcm-700 dark:text-tcm-300 bg-white/50 dark:bg-black/20 py-2 rounded-lg">膀胱經當令，宜多喝水</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// 3. AI Chat Component
const ChatView = ({ currentUser, triggerLogin }: any) => {
  const [sessions, setSessions] = useState<ChatSession[]>(MOCK_CHAT_SESSIONS);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load sessions or start fresh
    if (!currentSessionId && sessions.length > 0) {
      setCurrentSessionId(sessions[0].id);
    }
  }, [sessions]);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleNewChat = () => {
    if (currentUser.role === UserRole.GUEST) {
        triggerLogin();
        return;
    }
    const newSession: ChatSession = {
      id: `s${Date.now()}`,
      title: '新對話',
      messages: [{
        id: 'welcome',
        role: 'model',
        text: '您好！我是您的中醫 AI 助手。請問今天有什麼可以幫您的嗎？',
        timestamp: new Date(),
      }],
      lastModified: new Date(),
      tags: ['一般']
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    if (currentSessionId === id) {
      setCurrentSessionId(newSessions.length > 0 ? newSessions[0].id : null);
    }
  };

  const handleSend = async () => {
    if (currentUser.role === UserRole.GUEST) {
        triggerLogin();
        return;
    }
    if (!input.trim() || !currentSessionId) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    const updatedSessions = sessions.map(s => {
      if (s.id === currentSessionId) {
        const newTitle = s.title === '新對話' ? input.substring(0, 10) + '...' : s.title;
        return {
          ...s,
          messages: [...s.messages, userMsg],
          lastModified: new Date(),
          title: newTitle
        };
      }
      return s;
    });
    
    setSessions(updatedSessions.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime()));
    setInput('');
    setIsThinking(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: input }] }
        ],
        config: {
          systemInstruction: "你是一位精通傳統中醫（Traditional Chinese Medicine）的AI專家。請使用繁體中文回答。",
        }
      });

      const text = response.text || "思考中...";

      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: [...s.messages, {
              id: (Date.now() + 1).toString(),
              role: 'model',
              text: text,
              timestamp: new Date(),
            }]
          };
        }
        return s;
      }));
    } catch (error) {
       // Error handling
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] lg:h-screen bg-stone-50 dark:bg-stone-950 overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-full lg:w-72' : 'w-0'} bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 transition-all duration-300 flex flex-col absolute lg:static z-20 h-full`}>
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-900">
           <h3 className="font-bold text-stone-700 dark:text-stone-300">對話紀錄</h3>
           <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 hover:bg-stone-200 dark:hover:bg-stone-800 rounded">
             <X size={18}/>
           </button>
        </div>
        <div className="p-3">
           <button 
             onClick={handleNewChat}
             className="w-full flex items-center justify-center gap-2 bg-tcm-600 text-white py-2.5 rounded-lg font-medium hover:bg-tcm-700 transition-all shadow-sm active:scale-95"
            >
             <Plus size={18} /> 新增對話
           </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
           {currentUser.role !== UserRole.GUEST && sessions.map(session => (
             <div 
               key={session.id}
               onClick={() => {
                 setCurrentSessionId(session.id);
                 if (window.innerWidth < 1024) setIsSidebarOpen(false);
               }}
               className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${currentSessionId === session.id ? 'bg-tcm-50 dark:bg-tcm-900/20 border border-tcm-100 dark:border-tcm-800' : 'hover:bg-stone-50 dark:hover:bg-stone-800 border border-transparent'}`}
             >
                <div className="flex-1 min-w-0 pr-2">
                   <div className={`font-medium text-sm truncate ${currentSessionId === session.id ? 'text-tcm-900 dark:text-tcm-300' : 'text-stone-700 dark:text-stone-300'}`}>
                     {session.title}
                   </div>
                   <div className="flex items-center gap-2 text-[10px] text-stone-400 dark:text-stone-500 mt-1">
                      <span>{session.lastModified.toLocaleDateString()}</span>
                      {session.tags.slice(0, 1).map(tag => (
                        <span key={tag} className="bg-stone-100 dark:bg-stone-800 px-1 rounded">{tag}</span>
                      ))}
                   </div>
                </div>
                <button 
                  onClick={(e) => handleDeleteChat(e, session.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                >
                  <Trash2 size={14} />
                </button>
             </div>
           ))}
           {currentUser.role === UserRole.GUEST && (
             <div className="p-4 text-center text-stone-400 text-sm">
               請登入以查看歷史紀錄
             </div>
           )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full relative w-full">
        <header className="h-16 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between px-4 sticky top-0 z-10">
           <div className="flex items-center gap-3">
              {!isSidebarOpen && (
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-stone-500 dark:text-stone-400 active:scale-95 transition-transform">
                   <Layout size={20} />
                </button>
              )}
              <div>
                <h2 className="font-bold text-stone-800 dark:text-stone-100 text-sm lg:text-base truncate max-w-[200px] lg:max-w-md">
                   {currentSession?.title || '中醫 AI 助手'}
                </h2>
                <div className="flex gap-2 text-xs">
                   {currentSession?.tags.map(tag => (
                      <span key={tag} className="text-tcm-600 dark:text-tcm-400 bg-tcm-50 dark:bg-tcm-900/30 px-1.5 rounded">{tag}</span>
                   ))}
                </div>
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#faf9f6] dark:bg-stone-950">
            {!currentSessionId || messages.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-stone-400 dark:text-stone-600 opacity-60">
                  <MessageCircle size={48} className="mb-4" />
                  <p>開始一個新的中醫諮詢對話</p>
               </div>
            ) : (
                messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`
                        max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm
                        ${msg.role === 'user' 
                            ? 'bg-tcm-600 text-white rounded-br-none' 
                            : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200/60 dark:border-stone-700 rounded-bl-none'}
                        `}>
                         <div className="whitespace-pre-wrap">{msg.text}</div>
                         <div className={`text-[10px] mt-1 text-right ${msg.role === 'user' ? 'text-tcm-200' : 'text-stone-300 dark:text-stone-500'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </div>
                        </div>
                    </div>
                ))
            )}
            {isThinking && (
               <div className="flex justify-start">
                  <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-2 shadow-sm">
                     <span className="text-xs text-stone-400 mr-2">把脈診斷中...</span>
                     <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-tcm-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-tcm-500 rounded-full animate-bounce delay-75"></span>
                        <span className="w-1.5 h-1.5 bg-tcm-600 rounded-full animate-bounce delay-150"></span>
                     </div>
                  </div>
               </div>
            )}
            <div ref={scrollRef} />
        </div>

        <div className="p-4 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800">
           <div className="relative flex items-center gap-2 max-w-4xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={currentUser.role === UserRole.GUEST ? "請輸入您的問題（需登入）..." : "輸入您的症狀或疑問..."}
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 rounded-full py-3.5 pl-5 pr-12 focus:ring-2 focus:ring-tcm-500 outline-none disabled:bg-stone-100"
              />
              <button
                onClick={handleSend}
                className="absolute right-2 p-2 bg-tcm-600 text-white rounded-full hover:bg-tcm-700 transition-all active:scale-95"
              >
                <Send size={18} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// 4. Forum Component
const ForumView = ({ currentUser, posts, setPosts, triggerLogin, onViewUser, viewingPostId, setViewingPostId }: any) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('全部');
    const [sortBy, setSortBy] = useState('newest'); 
    const [commentInput, setCommentInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
  
    const handleCreatePost = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const isDraft = (e.nativeEvent as any).submitter.name === 'draft';

      const newPost: ForumPost = {
        id: Date.now().toString(),
        title: formData.get('title') as string,
        content: formData.get('content') as string,
        category: formData.get('category') as string,
        authorId: currentUser.id,
        tags: [formData.get('category') as string],
        likes: 0,
        comments: [],
        createdAt: '剛剛',
        views: 0,
        status: isDraft ? 'draft' : 'published'
      };
      setPosts([newPost, ...posts]);
      setIsCreateModalOpen(false);
    };
  
    const handleAddComment = (postId: string) => {
      if (!commentInput.trim()) return;
      const updatedPosts = posts.map((post: ForumPost) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, {
              id: `c${Date.now()}`,
              authorId: currentUser.id,
              text: commentInput,
              createdAt: '剛剛'
            }]
          };
        }
        return post;
      });
      setPosts(updatedPosts);
      setCommentInput('');
    };

    const attemptAction = (action: () => void) => {
        if (currentUser.role === UserRole.GUEST) {
            triggerLogin();
        } else {
            action();
        }
    };

    // Filter and Sort Logic
    const displayedPosts = posts
      .filter((post: ForumPost) => post.status === 'published')
      .filter((post: ForumPost) => activeFilter === '全部' || post.category === activeFilter)
      .filter((post: ForumPost) => post.title.includes(searchQuery) || post.content.includes(searchQuery))
      .sort((a: ForumPost, b: ForumPost) => {
          if (sortBy === 'likes') return b.likes - a.likes;
          if (sortBy === 'oldest') return a.id.localeCompare(b.id);
          return b.id.localeCompare(a.id);
      });
    
    // --- Detail View ---
    if (viewingPostId) {
        const post = posts.find((p: any) => p.id === viewingPostId);
        if (!post) return <div>找不到文章</div>;
        const author = MOCK_USERS[post.authorId] || GUEST_USER;

        return (
            <div className="max-w-4xl mx-auto p-6 animate-in slide-in-from-right duration-200">
                <button onClick={() => setViewingPostId(null)} className="mb-6 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-2 transition-colors active:scale-95 transform">
                    <ArrowLeft size={20} /> 返回討論區
                </button>

                <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 p-8">
                    {/* Post Header */}
                    <div className="flex gap-2 mb-4">
                        <span className="bg-tcm-50 dark:bg-tcm-900/30 text-tcm-700 dark:text-tcm-300 px-3 py-1 rounded-full text-xs font-bold">{post.category}</span>
                        {post.tags.map((tag: string) => (
                             <span key={tag} className="bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 px-3 py-1 rounded-full text-xs">#{tag}</span>
                        ))}
                    </div>

                    <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-6">{post.title}</h1>

                    <div className="flex items-center gap-4 mb-8 border-b border-stone-100 dark:border-stone-800 pb-6">
                        <img 
                            src={author.avatarUrl} 
                            onClick={(e) => { e.stopPropagation(); onViewUser(author.id); }}
                            className="w-12 h-12 rounded-full cursor-pointer hover:opacity-80 transition-opacity" 
                        />
                        <div>
                             <div className="flex items-center gap-2">
                                <span className="font-bold text-stone-900 dark:text-stone-100 cursor-pointer hover:text-tcm-600" onClick={(e) => { e.stopPropagation(); onViewUser(author.id); }}>{author.name}</span>
                                {author.role === UserRole.MASTER && (
                                    <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">中醫師</span>
                                )}
                             </div>
                             <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
                                <span>{post.createdAt}</span>
                                <span>•</span>
                                <span>{post.views} 次瀏覽</span>
                             </div>
                        </div>
                    </div>

                    <div className="text-lg leading-relaxed text-stone-800 dark:text-stone-200 mb-8 whitespace-pre-wrap">
                        {post.content}
                    </div>

                    <div className="flex items-center gap-6 pt-6 border-t border-stone-100 dark:border-stone-800">
                         <button onClick={() => attemptAction(() => {})} className="flex items-center gap-2 text-stone-500 dark:text-stone-400 hover:text-pink-500 transition-colors active:scale-95 transform">
                             <Heart size={24} />
                             <span className="font-medium">{post.likes} 個愛心</span>
                         </button>
                         <button className="flex items-center gap-2 text-stone-500 dark:text-stone-400 hover:text-tcm-600 transition-colors active:scale-95 transform">
                             <Share2 size={24} />
                             <span className="font-medium">分享</span>
                         </button>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-8">
                     <h3 className="font-bold text-xl text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2">
                        <MessageCircle size={24} />
                        留言 ({post.comments.length})
                     </h3>
                     
                     <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 mb-8">
                        <div className="flex gap-4">
                            <img src={currentUser.avatarUrl} className="w-10 h-10 rounded-full" />
                            <div className="flex-1">
                                <textarea
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                    placeholder={currentUser.role === UserRole.GUEST ? "請先登入..." : "撰寫您的留言..."}
                                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-3 focus:ring-2 focus:ring-tcm-500 outline-none resize-none mb-2"
                                    rows={3}
                                />
                                <div className="flex justify-end">
                                    <button 
                                        onClick={() => attemptAction(() => handleAddComment(post.id))}
                                        className="bg-tcm-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-tcm-700 transition-all active:scale-95 transform disabled:opacity-50"
                                        disabled={!commentInput.trim() || currentUser.role === UserRole.GUEST}
                                    >
                                        發送留言
                                    </button>
                                </div>
                            </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        {post.comments.map((comment: any) => {
                             const cAuthor = MOCK_USERS[comment.authorId] || GUEST_USER;
                             return (
                                 <div key={comment.id} className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800">
                                     <div className="flex gap-4">
                                         <img 
                                            src={cAuthor.avatarUrl} 
                                            className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80"
                                            onClick={(e) => { e.stopPropagation(); onViewUser(cAuthor.id); }}
                                         />
                                         <div className="flex-1">
                                             <div className="flex justify-between items-start mb-2">
                                                 <div className="flex items-center gap-2">
                                                     <span className="font-bold text-stone-900 dark:text-stone-100 cursor-pointer" onClick={(e) => { e.stopPropagation(); onViewUser(cAuthor.id); }}>{cAuthor.name}</span>
                                                     {cAuthor.role === UserRole.MASTER && <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">中醫師</span>}
                                                 </div>
                                                 <span className="text-xs text-stone-400">{comment.createdAt}</span>
                                             </div>
                                             <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{comment.text}</p>
                                         </div>
                                     </div>
                                 </div>
                             );
                        })}
                     </div>
                </div>
            </div>
        );
    }
  
    // --- List View ---
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 tracking-tight">中醫社群論壇</h2>
            <p className="text-stone-500 dark:text-stone-400">與同好交流心得，分享治療經驗與養生知識。</p>
          </div>
          <button 
            onClick={() => attemptAction(() => setIsCreateModalOpen(true))}
            className="bg-tcm-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-tcm-700 transition-all flex items-center gap-2 shadow-sm active:scale-95 transform"
          >
            <Plus size={18} />
            發起討論
          </button>
        </header>
  
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-stone-800 p-4 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
              {['全部', '藥膳食療', '針灸推拿', '中醫理論', '臨床經驗'].map((filter) => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border transition-all active:scale-95 transform ${
                    activeFilter === filter 
                      ? 'bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-800 dark:border-stone-100 shadow' 
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-600 hover:border-tcm-500 hover:text-tcm-600'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
                <div className="relative flex-1 md:w-64">
                    <input 
                        type="text" 
                        placeholder="搜尋文章..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:ring-1 focus:ring-tcm-500 outline-none"
                    />
                    <Search className="absolute left-2.5 top-2 text-stone-400" size={16} />
                </div>
                <div className="flex items-center gap-2 min-w-max">
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-sm bg-stone-50 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-tcm-500 cursor-pointer"
                    >
                        <option value="newest">最新發布</option>
                        <option value="oldest">最早發布</option>
                        <option value="likes">最多愛心</option>
                    </select>
                </div>
            </div>
        </div>
  
        <div className="space-y-4">
          {displayedPosts.length > 0 ? displayedPosts.map((post: ForumPost) => {
              const author = MOCK_USERS[post.authorId] || GUEST_USER;
  
              return (
              <article 
                key={post.id} 
                onClick={() => setViewingPostId(post.id)}
                className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-[0.99] transform"
              >
                  <div className="flex items-start gap-4">
                    <img 
                        src={author.avatarUrl} 
                        alt={author.name} 
                        onClick={(e) => { e.stopPropagation(); onViewUser(author.id); }}
                        className="w-10 h-10 rounded-full bg-stone-100 object-cover border border-stone-100 cursor-pointer hover:opacity-80 transition-opacity" 
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span 
                            className="font-semibold text-stone-900 dark:text-stone-100 cursor-pointer hover:text-tcm-600"
                            onClick={(e) => { e.stopPropagation(); onViewUser(author.id); }}
                          >{author.name}</span>
                          {author.role === UserRole.MASTER && (
                              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-800">中醫師</span>
                          )}
                          <span className="text-stone-400 text-xs">• {post.createdAt}</span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2 group-hover:text-tcm-700 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-stone-600 dark:text-stone-300 leading-relaxed mb-4 line-clamp-2">
                          {post.content}
                        </p>
                        
                        <div className="flex items-center justify-between border-t border-stone-50 dark:border-stone-800 pt-4">
                          <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                                <Heart size={18} />
                                <span className="text-sm font-medium">{post.likes}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                                <MessageCircle size={18} />
                                <span className="text-sm font-medium">{post.comments.length} 則留言</span>
                              </div>
                              <div className="flex items-center gap-1 text-stone-400 text-xs">
                                 <Eye size={14} /> {post.views}
                              </div>
                          </div>
                          <div className="flex gap-2">
                              {post.tags.map(tag => (
                              <span key={tag} className="text-xs bg-stone-50 dark:bg-stone-800 text-stone-500 dark:text-stone-400 px-2 py-1 rounded border border-stone-100 dark:border-stone-700">#{tag}</span>
                              ))}
                          </div>
                        </div>
                    </div>
                  </div>
              </article>
              )
          }) : (
            <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-stone-500">
                <Search size={48} className="mx-auto mb-4 text-stone-300" />
                <p>沒有找到相關的討論文章</p>
            </div>
          )}
        </div>
        
        {/* Create Modal */}
        {isCreateModalOpen && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-2xl shadow-2xl p-6 scale-100 border border-stone-100 dark:border-stone-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">發起新討論</h3>
                    <button onClick={() => setIsCreateModalOpen(false)} className="text-stone-400 hover:text-stone-600 active:scale-95 transition-transform">
                    <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleCreatePost} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">標題</label>
                        <input required name="title" className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-2.5 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-tcm-500 outline-none" placeholder="請輸入討論主題" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">分類</label>
                        <select name="category" className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-2.5 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-tcm-500 outline-none">
                            <option value="藥膳食療">藥膳食療</option>
                            <option value="針灸推拿">針灸推拿</option>
                            <option value="中醫理論">中醫理論</option>
                            <option value="臨床經驗">臨床經驗</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">內容</label>
                        <textarea required name="content" rows={5} className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-2.5 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-tcm-500 outline-none resize-none" placeholder="分享您的想法、經驗或問題..." />
                    </div>
                    <div className="flex justify-between pt-2">
                        <button type="submit" name="draft" className="text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 font-medium flex items-center gap-2 active:scale-95 transition-transform">
                            <Save size={16}/> 儲存草稿
                        </button>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-stone-600 dark:text-stone-400 font-medium hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg active:scale-95 transition-transform">取消</button>
                            <button type="submit" name="publish" className="px-6 py-2 bg-tcm-600 text-white font-medium rounded-lg hover:bg-tcm-700 active:scale-95 transition-transform">發佈</button>
                        </div>
                    </div>
                </form>
                </div>
            </div>
        )}
      </div>
    );
};

// Share Modal Component
const ShareModal = ({ isOpen, onClose, url }: { isOpen: boolean, onClose: () => void, url: string }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl p-6 w-full max-w-sm border border-stone-200 dark:border-stone-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100">分享至</h3>
                    <button onClick={onClose} className="active:scale-95 transition-transform"><X size={20} className="text-stone-400"/></button>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <button className="flex flex-col items-center gap-2 text-xs text-stone-600 dark:text-stone-400 hover:text-tcm-600 active:scale-95 transition-transform">
                        <div className="w-12 h-12 bg-[#1877F2] text-white rounded-full flex items-center justify-center text-xl shadow-sm hover:scale-105 transition-transform"><Facebook size={24}/></div>
                        Facebook
                    </button>
                    <button className="flex flex-col items-center gap-2 text-xs text-stone-600 dark:text-stone-400 hover:text-tcm-600 active:scale-95 transition-transform">
                         <div className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center text-xl shadow-sm hover:scale-105 transition-transform"><MessageSquare size={24}/></div>
                        WhatsApp
                    </button>
                    <button className="flex flex-col items-center gap-2 text-xs text-stone-600 dark:text-stone-400 hover:text-tcm-600 active:scale-95 transition-transform">
                         <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl shadow-sm hover:scale-105 transition-transform"><Twitter size={24}/></div>
                        X
                    </button>
                    <button className="flex flex-col items-center gap-2 text-xs text-stone-600 dark:text-stone-400 hover:text-tcm-600 active:scale-95 transition-transform" onClick={() => {navigator.clipboard.writeText(url); onClose();}}>
                         <div className="w-12 h-12 bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-full flex items-center justify-center text-xl shadow-sm hover:scale-105 transition-transform"><LinkIcon size={24}/></div>
                        複製連結
                    </button>
                </div>
                <div className="bg-stone-50 dark:bg-stone-800 p-2 rounded-lg flex items-center justify-between text-xs text-stone-500 border border-stone-200 dark:border-stone-700">
                    <span className="truncate flex-1">{url}</span>
                </div>
             </div>
        </div>
    );
};

// 5. Video Hub Component
const VideoHub = ({ videos, setVideos, currentUser, setCurrentUser, triggerLogin, onViewUser, selectedVideo, setSelectedVideo }: any) => {
  const [commentInput, setCommentInput] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false); // Local toggle for demo
  
  // Filter States
  const [categoryFilter, setCategoryFilter] = useState('全部');
  const [paidFilter, setPaidFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const allTags = Array.from(new Set((videos as Video[]).flatMap((v) => v.tags)));

  // Filter logic: Only show published videos
  const filteredVideos = videos.filter((video: Video) => {
    const isPublished = video.status === 'published';
    const matchCategory = categoryFilter === '全部' || video.category === categoryFilter;
    const matchPaid = paidFilter === 'all' || (paidFilter === 'paid' && video.isPaid) || (paidFilter === 'free' && !video.isPaid);
    const matchTag = !tagFilter || video.tags.includes(tagFilter) || (tagFilter === '其他' && !['穴位','居家護理','疼痛','八段錦','養生','進階','枸杞','食療','女性','月經','調理'].some(t => video.tags.includes(t)));
    return isPublished && matchCategory && matchPaid && matchTag;
  });

  const handleVideoClick = (video: Video) => {
    if (video.isPaid && currentUser.role === UserRole.GUEST) {
        triggerLogin();
        return;
    }

    setSelectedVideo(video);
    setIsSubscribed(false); // Reset subscribe state for new video
    // Add to history
    if (currentUser.role !== UserRole.GUEST && !currentUser.history.includes(video.id)) {
        setCurrentUser({
            ...currentUser,
            history: [video.id, ...currentUser.history]
        });
    }
  };

  const handleAddComment = () => {
      if (currentUser.role === UserRole.GUEST) {
          triggerLogin();
          return;
      }
      if (!selectedVideo || !commentInput.trim()) return;
      const newComment = {
          id: `vc${Date.now()}`,
          authorId: currentUser.id,
          text: commentInput,
          createdAt: '剛剛'
      };
      const updatedVideos = videos.map((v: Video) => {
          if (v.id === selectedVideo.id) {
              return { ...v, comments: [newComment, ...v.comments] };
          }
          return v;
      });
      setVideos(updatedVideos);
      setSelectedVideo({ ...selectedVideo, comments: [newComment, ...selectedVideo.comments] });
      setCommentInput('');
  };

  return (
    <div className="h-full overflow-y-auto bg-stone-50 dark:bg-stone-950">
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} url={window.location.href} />
      
      {selectedVideo ? (
        <div className="max-w-6xl mx-auto p-6 animate-in slide-in-from-right duration-200">
            <button onClick={() => setSelectedVideo(null)} className="mb-4 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-medium flex items-center gap-2 transition-transform active:scale-95">
                <ArrowLeft size={20} /> 返回列表
            </button>
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {/* Simulated Video Player */}
                    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg relative group">
                         <img src={selectedVideo.thumbnailUrl} className="w-full h-full object-cover opacity-60" />
                         
                         {selectedVideo.isPaid && currentUser.role === UserRole.STUDENT && (
                             <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg z-10 flex items-center gap-1">
                                 <Lock size={12} /> VIP 內容
                             </div>
                         )}

                         <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-2xl border border-white/30 active:scale-90">
                                 <div className="ml-2 w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent"></div>
                             </div>
                         </div>
                    </div>

                    <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-100 dark:border-stone-800 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                             <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{selectedVideo.title}</h1>
                        </div>
                        
                        <div className="flex gap-2 mb-4">
                           <span className="text-xs bg-tcm-50 dark:bg-tcm-900/30 text-tcm-700 dark:text-tcm-300 px-2 py-1 rounded-full font-medium">{selectedVideo.category}</span>
                           {selectedVideo.tags.map(tag => (
                             <span key={tag} className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-1 rounded-full">{tag}</span>
                           ))}
                        </div>

                        <div className="flex flex-wrap items-center justify-between text-sm text-stone-500 dark:text-stone-400 border-b border-stone-100 dark:border-stone-800 pb-4 mb-4 gap-4">
                            <div className="flex items-center gap-4">
                                <span>{selectedVideo.views} 次觀看</span>
                                <span>•</span>
                                <span>{selectedVideo.createdAt}</span>
                            </div>
                            <div className="flex gap-4">
                                <button className="flex items-center gap-2 hover:text-tcm-600 transition-colors active:scale-95 transform">
                                    <ThumbsUp size={20}/> {selectedVideo.likes}
                                </button>
                                <button onClick={() => setIsShareOpen(true)} className="flex items-center gap-2 hover:text-tcm-600 transition-colors active:scale-95 transform">
                                    <Share2 size={20}/> 分享
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4 mb-6">
                            <img 
                                src={MOCK_USERS[selectedVideo.authorId].avatarUrl} 
                                className="w-12 h-12 rounded-full object-cover border border-stone-100 dark:border-stone-700 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => onViewUser(selectedVideo.authorId)}
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 
                                            className="font-bold text-stone-900 dark:text-stone-100 text-lg cursor-pointer hover:text-tcm-600 transition-colors"
                                            onClick={() => onViewUser(selectedVideo.authorId)}
                                        >{MOCK_USERS[selectedVideo.authorId].name}</h3>
                                        <p className="text-sm text-stone-500 dark:text-stone-400">{MOCK_USERS[selectedVideo.authorId].followers} 位訂閱者</p>
                                    </div>
                                    <button 
                                        onClick={() => setIsSubscribed(!isSubscribed)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95 transform shadow-sm ${
                                            isSubscribed 
                                                ? 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300' 
                                                : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800'
                                        }`}
                                    >
                                        {isSubscribed ? '已訂閱' : '訂閱'}
                                    </button>
                                </div>
                                <p className="text-stone-700 dark:text-stone-300 leading-relaxed mt-4 bg-stone-50 dark:bg-stone-800/50 p-3 rounded-lg text-sm">
                                    {selectedVideo.description}
                                </p>
                            </div>
                        </div>

                        {/* Video Comments */}
                        <div>
                            <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-4">{selectedVideo.comments.length} 則留言</h3>
                            <div className="flex gap-3 mb-6">
                                <img src={currentUser.avatarUrl} className="w-10 h-10 rounded-full" />
                                <div className="flex-1">
                                    <input 
                                        value={commentInput}
                                        onChange={(e) => setCommentInput(e.target.value)}
                                        placeholder={currentUser.role === UserRole.GUEST ? "請先登入..." : "新增留言..."}
                                        disabled={currentUser.role === UserRole.GUEST}
                                        className="w-full border-b border-stone-300 dark:border-stone-600 pb-2 focus:border-tcm-600 outline-none bg-transparent text-stone-900 dark:text-stone-100 transition-colors"
                                    />
                                    <div className="flex justify-end mt-2">
                                        <button 
                                            onClick={handleAddComment}
                                            disabled={!commentInput.trim()}
                                            className="px-4 py-2 bg-tcm-600 text-white rounded-lg text-sm disabled:opacity-50 hover:bg-tcm-700 active:scale-95 transition-all"
                                        >
                                            留言
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {selectedVideo.comments.map((c: Comment) => {
                                    const user = MOCK_USERS[c.authorId] || GUEST_USER;
                                    return (
                                        <div key={c.id} className="flex gap-3">
                                            <img 
                                                src={user?.avatarUrl} 
                                                className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity" 
                                                onClick={() => onViewUser(c.authorId)}
                                            />
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span 
                                                        className="font-semibold text-sm text-stone-900 dark:text-stone-200 cursor-pointer hover:text-tcm-600"
                                                        onClick={() => onViewUser(c.authorId)}
                                                    >{user?.name}</span>
                                                    <span className="text-xs text-stone-500 dark:text-stone-400">{c.createdAt}</span>
                                                </div>
                                                <p className="text-sm text-stone-800 dark:text-stone-300">{c.text}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Recommended Sidebar */}
                <div className="space-y-4">
                    <h3 className="font-bold text-stone-800 dark:text-stone-100 text-lg">接下來播放</h3>
                    {filteredVideos.filter((v: Video) => v.id !== selectedVideo.id).map((video: Video) => (
                        <div key={video.id} onClick={() => handleVideoClick(video)} className="flex gap-3 cursor-pointer group bg-white dark:bg-stone-900 p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-all active:scale-[0.98] transform">
                            <div className="relative w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                                <img src={video.thumbnailUrl} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"/>
                                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
                                    {video.duration}
                                </span>
                                {video.isPaid && <div className="absolute top-1 left-1 bg-amber-500 text-white text-[8px] px-1 rounded font-bold">VIP</div>}
                            </div>
                            <div className="flex flex-col justify-between py-1">
                                <h4 className="font-semibold text-sm text-stone-900 dark:text-stone-100 line-clamp-2 group-hover:text-tcm-600 leading-tight transition-colors">
                                    {video.title}
                                </h4>
                                <div>
                                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{MOCK_USERS[video.authorId].name}</p>
                                    <p className="text-xs text-stone-400">{video.views} 次觀看</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto p-6">
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">中醫影音學堂</h2>
                <p className="text-stone-500 dark:text-stone-400">跟隨專業中醫師，透過影音學習最正統的養生知識。</p>
            </header>
            
            {/* Filters */}
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 mb-6 space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-stone-400" />
                        <span className="font-bold text-sm text-stone-700 dark:text-stone-300">分類：</span>
                    </div>
                    {['全部', '針灸推拿', '藥膳食療', '氣功導引', '中醫理論', '婦科調理'].map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-3 py-1 rounded-full text-sm transition-all active:scale-95 transform ${categoryFilter === cat ? 'bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                
                <div className="flex items-center gap-4 border-t border-stone-100 dark:border-stone-800 pt-4 flex-wrap">
                     <div className="flex items-center gap-2">
                        <Lock size={16} className="text-stone-400" />
                        <span className="font-bold text-sm text-stone-700 dark:text-stone-300">權限：</span>
                    </div>
                    <button onClick={() => setPaidFilter('all')} className={`px-3 py-1 rounded-full text-sm transition-all active:scale-95 transform ${paidFilter === 'all' ? 'bg-tcm-600 text-white' : 'text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800'}`}>全部</button>
                    <button onClick={() => setPaidFilter('free')} className={`px-3 py-1 rounded-full text-sm transition-all active:scale-95 transform ${paidFilter === 'free' ? 'bg-tcm-600 text-white' : 'text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800'}`}>免費</button>
                    <button onClick={() => setPaidFilter('paid')} className={`px-3 py-1 rounded-full text-sm transition-all active:scale-95 transform ${paidFilter === 'paid' ? 'bg-amber-500 text-white' : 'text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800'}`}>VIP 付費</button>
                </div>

                <div className="flex items-center gap-4 border-t border-stone-100 dark:border-stone-800 pt-4 flex-wrap">
                     <div className="flex items-center gap-2">
                        <Tag size={16} className="text-stone-400" />
                        <span className="font-bold text-sm text-stone-700 dark:text-stone-300">標籤：</span>
                    </div>
                    <button onClick={() => setTagFilter(null)} className={`px-2 py-0.5 text-xs rounded border transition-all active:scale-95 transform ${!tagFilter ? 'border-tcm-500 text-tcm-600' : 'border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400'}`}>不限</button>
                    {allTags.map(tag => (
                        <button 
                            key={tag} 
                            onClick={() => setTagFilter(tag === tagFilter ? null : tag)}
                            className={`px-2 py-0.5 text-xs rounded border transition-all active:scale-95 transform ${tagFilter === tag ? 'bg-tcm-50 dark:bg-tcm-900/30 border-tcm-500 text-tcm-700 dark:text-tcm-400' : 'border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-stone-400'}`}
                        >
                            {tag}
                        </button>
                    ))}
                    <button onClick={() => setTagFilter('其他')} className={`px-2 py-0.5 text-xs rounded border transition-all active:scale-95 transform ${tagFilter === '其他' ? 'border-tcm-500 text-tcm-600' : 'border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400'}`}>其他</button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video: Video) => (
                    <div key={video.id} onClick={() => handleVideoClick(video)} className="group cursor-pointer bg-white dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-all active:scale-[0.98] transform overflow-hidden flex flex-col h-full relative">
                        <div className="relative aspect-video overflow-hidden">
                            <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                                {video.duration}
                            </span>
                            {video.isPaid && (
                                <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-bold px-2 py-1 rounded shadow flex items-center gap-1">
                                    <Lock size={10} /> VIP
                                </div>
                            )}
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                            <h3 className="font-bold text-stone-900 dark:text-stone-100 group-hover:text-tcm-600 line-clamp-2 mb-2 leading-snug flex-1 transition-colors">
                                {video.title}
                            </h3>
                             <div className="flex gap-2 mb-2">
                                <span className="text-[10px] bg-tcm-50 dark:bg-tcm-900/30 text-tcm-700 dark:text-tcm-300 px-1.5 py-0.5 rounded">{video.category}</span>
                                {video.tags.slice(0, 2).map(tag => (
                                    <span key={tag} className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 px-1.5 py-0.5 rounded">{tag}</span>
                                ))}
                            </div>
                            <div className="flex items-start gap-3 mt-auto pt-2 border-t border-stone-50 dark:border-stone-800">
                                <img src={MOCK_USERS[video.authorId].avatarUrl} className="w-8 h-8 rounded-full border border-stone-100 dark:border-stone-700" />
                                <div className="text-xs text-stone-500 dark:text-stone-400">
                                    <p className="font-medium text-stone-700 dark:text-stone-300 mb-0.5">{MOCK_USERS[video.authorId].name}</p>
                                    <p>{video.views} 次觀看 • {video.createdAt}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

// 6. Profile & Upload Component
const ProfileView = ({ 
  currentUser, 
  setCurrentUser,
  videos,
  setVideos,
  posts,
  triggerLogin,
  viewingUserId,
  onBackToSelf,
  goToVideo,
  goToPost
}: any) => {
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'posts' | 'notifications' | 'about'
  const [showUpload, setShowUpload] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState(currentUser);
  
  // Upload State
  const [uploadCategory, setUploadCategory] = useState('針灸推拿');
  const [customCategory, setCustomCategory] = useState('');
  const [uploadThumbnail, setUploadThumbnail] = useState<string | null>(null);

  // If viewing another user
  const isSelf = !viewingUserId || viewingUserId === currentUser.id;
  const displayUser = isSelf ? currentUser : MOCK_USERS[viewingUserId];

  if (currentUser.role === UserRole.GUEST && isSelf) {
      return (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 bg-tcm-100 dark:bg-tcm-900 rounded-full flex items-center justify-center text-tcm-600 dark:text-tcm-400">
                  <UserIcon size={40} />
              </div>
              <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">請先登入</h2>
              <p className="text-stone-500 dark:text-stone-400">登入後即可查看個人檔案、紀錄與通知。</p>
              <button onClick={triggerLogin} className="bg-tcm-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-tcm-700 transition-all active:scale-95 transform">
                  立即登入 / 註冊
              </button>
          </div>
      );
  }

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const isDraft = (e.nativeEvent as any).submitter.name === 'draft';
    
    const finalCategory = uploadCategory === '其他' ? customCategory : uploadCategory;

    const newVideo: Video = {
      id: `v${Date.now()}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      thumbnailUrl: uploadThumbnail || 'https://images.unsplash.com/photo-1515023115689-5824739084f3?auto=format&fit=crop&q=80&w=1000', 
      duration: '10:00',
      authorId: currentUser.id,
      views: 0,
      category: finalCategory,
      tags: [],
      isPaid: false,
      status: isDraft ? 'draft' : 'published',
      createdAt: '剛剛',
      likes: 0,
      comments: []
    };
    
    setVideos([newVideo, ...videos]);
    setShowUpload(false);
    setUploadThumbnail(null);
    setUploadCategory('針灸推拿');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
      e.preventDefault();
      setCurrentUser(editForm);
      setIsEditMode(false);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              if (ev.target?.result) setUploadThumbnail(ev.target.result as string);
          };
          reader.readAsDataURL(e.target.files[0]);
      }
  };

  const handleNotificationClick = (notification: any) => {
      if (notification.targetType === 'video' && notification.targetId) {
          const video = videos.find((v: Video) => v.id === notification.targetId);
          if (video) goToVideo(video);
      } else if (notification.targetType === 'post' && notification.targetId) {
          goToPost(notification.targetId);
      }
  };

  const historyVideos = videos.filter((v: Video) => displayUser.history.includes(v.id));
  
  // For posts: if self, show drafts. If others, only published.
  const userPosts = posts.filter((p: ForumPost) => p.authorId === displayUser.id);
  const displayPosts = isSelf ? userPosts : userPosts.filter((p: ForumPost) => p.status === 'published');

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!isSelf && (
          <button onClick={onBackToSelf} className="mb-4 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-2 active:scale-95 transition-transform">
              ← 返回我的個人中心
          </button>
      )}

      {/* Profile Header */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-8 shadow-sm border border-stone-200 dark:border-stone-800 mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-tcm-100 to-tcm-50 dark:from-tcm-900 dark:to-stone-800 opacity-50"></div>
        <div className="relative flex flex-col md:flex-row items-start gap-6 mt-4">
          <div className="relative group">
            <img src={displayUser.avatarUrl} alt={displayUser.name} className="w-28 h-28 rounded-full border-4 border-white dark:border-stone-800 object-cover shadow-md bg-white dark:bg-stone-800" />
            {isSelf && (
                <button className="absolute bottom-1 right-1 bg-stone-800 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-110 active:scale-95">
                    <Camera size={14} />
                </button>
            )}
          </div>
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    {displayUser.name}
                    {displayUser.title && <span className="text-sm font-normal text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">{displayUser.title}</span>}
                </h1>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border ${displayUser.role === UserRole.MASTER ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'}`}>
                    {displayUser.role}
                  </span>
                </div>
              </div>
              {isSelf && (
                  <div className="flex gap-3">
                    {currentUser.role === UserRole.MASTER && (
                    <button onClick={() => setShowUpload(true)} className="bg-tcm-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-tcm-700 flex items-center gap-2 text-sm shadow-sm transition-all active:scale-95 transform">
                        <Upload size={16} /> 上傳影片
                    </button>
                    )}
                    <button onClick={() => { setEditForm(currentUser); setIsEditMode(true); }} className="border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 px-4 py-2 rounded-lg font-medium hover:bg-stone-50 dark:hover:bg-stone-800 text-sm flex items-center gap-2 bg-white dark:bg-stone-900 transition-all active:scale-95 transform">
                    <Edit3 size={16} /> 編輯資料
                    </button>
                </div>
              )}
            </div>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed max-w-2xl mb-4">{displayUser.bio}</p>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="mb-6 border-b border-stone-200 dark:border-stone-800 overflow-x-auto">
        <div className="flex gap-8 min-w-max">
           {['history', 'posts', 'about', ...(isSelf ? ['notifications'] : [])].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-bold relative capitalize transition-colors ${
                  activeTab === tab ? 'text-tcm-700 dark:text-tcm-400' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                {tab === 'history' && '觀看紀錄'}
                {tab === 'posts' && (isSelf ? '我的文章/草稿' : '發佈文章')}
                {tab === 'notifications' && '通知中心'}
                {tab === 'about' && '詳細資料'}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-tcm-600 rounded-t-full"></div>}
              </button>
           ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'history' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {historyVideos.length > 0 ? historyVideos.map((video: Video) => (
            <div onClick={() => goToVideo(video)} key={video.id} className="flex gap-3 bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow transition-all cursor-pointer group active:scale-[0.98] transform">
                <div className="w-36 h-24 bg-stone-200 dark:bg-stone-800 rounded-lg flex-shrink-0 overflow-hidden relative">
                    <img src={video.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {video.isPaid && <div className="absolute top-1 left-1 bg-amber-500 text-white text-[8px] px-1 rounded font-bold">VIP</div>}
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm line-clamp-2 mb-1 leading-tight group-hover:text-tcm-600 transition-colors">{video.title}</h4>
                    <div className="mt-auto text-xs text-stone-500 dark:text-stone-400">
                        <p>{video.views} 次觀看</p>
                        <p className="text-tcm-600 dark:text-tcm-400">已觀看</p>
                    </div>
                </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12 text-stone-400 dark:text-stone-600 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-dashed border-stone-200 dark:border-stone-800">
              尚無觀看紀錄
            </div>
          )}
        </div>
      )}

      {activeTab === 'notifications' && isSelf && (
         <div className="space-y-3">
            {currentUser.notifications.length > 0 ? currentUser.notifications.map((n: any) => (
               <div 
                    key={n.id} 
                    onClick={() => handleNotificationClick(n)}
                    className={`p-4 rounded-xl border flex items-start gap-4 cursor-pointer transition-all hover:shadow-sm active:scale-[0.99] transform ${n.isRead ? 'bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800' : 'bg-tcm-50 dark:bg-tcm-900/20 border-tcm-100 dark:border-tcm-900'}`}
                >
                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.isRead ? 'bg-stone-300 dark:bg-stone-600' : 'bg-tcm-500'}`}></div>
                  <div className="flex-1">
                     <p className="text-stone-800 dark:text-stone-200 text-sm font-medium hover:text-tcm-600 transition-colors">{n.content}</p>
                     <p className="text-stone-400 text-xs mt-1">{n.createdAt}</p>
                  </div>
               </div>
            )) : (
              <div className="text-center py-12 text-stone-400 dark:text-stone-600 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-dashed border-stone-200 dark:border-stone-800">
                  沒有新通知
              </div>
            )}
         </div>
      )}
      
      {activeTab === 'posts' && (
         <div className="space-y-4">
            {displayPosts.length > 0 ? displayPosts.map((post: ForumPost) => (
                <div key={post.id} onClick={() => goToPost(post.id)} className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow transition-all cursor-pointer group active:scale-[0.99] transform">
                     <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-stone-900 dark:text-stone-100 text-lg group-hover:text-tcm-600 transition-colors">{post.title}</h4>
                        {post.status === 'draft' && <span className="text-xs bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded font-medium">草稿</span>}
                    </div>
                    <p className="text-sm text-stone-600 dark:text-stone-300 line-clamp-2 mb-3">{post.content}</p>
                    <div className="flex gap-4 text-xs text-stone-400 border-t border-stone-50 dark:border-stone-800 pt-3">
                        <span className="flex items-center gap-1"><Heart size={14}/> {post.likes}</span>
                        <span className="flex items-center gap-1"><MessageCircle size={14}/> {post.comments.length}</span>
                        <span className="flex items-center gap-1"><Clock size={14}/> {post.createdAt}</span>
                    </div>
                </div>
            )) : (
                <div className="text-center py-12 text-stone-400 dark:text-stone-600 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-dashed border-stone-200 dark:border-stone-800">
                  沒有文章
              </div>
            )}
         </div>
      )}

      {activeTab === 'about' && (
          <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 text-sm space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-3 text-lg border-b border-stone-100 dark:border-stone-800 pb-2">基本資料</h3>
                    <div className="space-y-2">
                        <p><span className="text-stone-400 w-20 inline-block">性別：</span>{displayUser.gender === 'male' ? '男' : displayUser.gender === 'female' ? '女' : '其他'}</p>
                        <p><span className="text-stone-400 w-20 inline-block">年齡：</span>{displayUser.age} 歲</p>
                        <p><span className="text-stone-400 w-20 inline-block">加入時間：</span>{displayUser.joinedDate}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-3 text-lg border-b border-stone-100 dark:border-stone-800 pb-2">聯絡與專業</h3>
                    <div className="space-y-2">
                         <p><span className="text-stone-400 w-20 inline-block">Email：</span>{displayUser.email || '未公開'}</p>
                         {displayUser.role === UserRole.MASTER && (
                             <>
                                <p><span className="text-stone-400 w-20 inline-block">執照號碼：</span>{displayUser.licenseNumber}</p>
                                <p><span className="text-stone-400 w-20 inline-block">職稱：</span>{displayUser.title}</p>
                             </>
                         )}
                         {displayUser.role === UserRole.STUDENT && (
                             <p><span className="text-stone-400 w-20 inline-block">職業：</span>{displayUser.profession}</p>
                         )}
                    </div>
                  </div>
              </div>
              
              <div>
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-2 text-lg border-b border-stone-100 dark:border-stone-800 pb-2">個人簡介</h3>
                  <p className="leading-relaxed">{displayUser.bio}</p>
              </div>
          </div>
      )}

      {/* Edit Profile Modal (Only for self) */}
      {isEditMode && isSelf && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-stone-900 w-full max-w-2xl rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto border border-stone-100 dark:border-stone-700">
                <div className="flex justify-between items-center mb-6 border-b border-stone-100 dark:border-stone-800 pb-4">
                    <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">編輯個人資料</h3>
                    <button onClick={() => setIsEditMode(false)} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 active:scale-95 transition-transform">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="flex items-center gap-6">
                         <div className="relative">
                             <img src={editForm.avatarUrl} className="w-20 h-20 rounded-full border-4 border-stone-100 dark:border-stone-800 bg-stone-50" />
                         </div>
                         <div className="flex-1">
                             <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">顯示名稱</label>
                             <input 
                                value={editForm.name}
                                onChange={e => setEditForm({...editForm, name: e.target.value})}
                                className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg p-2.5 focus:ring-2 focus:ring-tcm-500 outline-none"
                             />
                         </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Email</label>
                             <input 
                                value={editForm.email || ''}
                                onChange={e => setEditForm({...editForm, email: e.target.value})}
                                className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg p-2.5 focus:ring-2 focus:ring-tcm-500 outline-none"
                             />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">年齡</label>
                             <input 
                                type="number"
                                value={editForm.age || ''}
                                onChange={e => setEditForm({...editForm, age: parseInt(e.target.value)})}
                                className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg p-2.5 focus:ring-2 focus:ring-tcm-500 outline-none"
                             />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">性別</label>
                             <select 
                                value={editForm.gender || 'other'}
                                onChange={e => setEditForm({...editForm, gender: e.target.value as any})}
                                className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg p-2.5 outline-none"
                             >
                                 <option value="male">男</option>
                                 <option value="female">女</option>
                                 <option value="other">其他</option>
                             </select>
                        </div>
                        
                        {editForm.role === UserRole.MASTER ? (
                             <>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">職稱</label>
                                    <input 
                                        value={editForm.title || ''}
                                        onChange={e => setEditForm({...editForm, title: e.target.value})}
                                        className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg p-2.5 focus:ring-2 focus:ring-tcm-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">執照號碼</label>
                                    <input 
                                        value={editForm.licenseNumber || ''}
                                        onChange={e => setEditForm({...editForm, licenseNumber: e.target.value})}
                                        className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg p-2.5 focus:ring-2 focus:ring-tcm-500 outline-none"
                                    />
                                </div>
                             </>
                        ) : (
                             <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">職業</label>
                                <input 
                                    value={editForm.profession || ''}
                                    onChange={e => setEditForm({...editForm, profession: e.target.value})}
                                    className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg p-2.5 focus:ring-2 focus:ring-tcm-500 outline-none"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">個人簡介</label>
                        <textarea 
                            rows={4}
                            value={editForm.bio}
                            onChange={e => setEditForm({...editForm, bio: e.target.value})}
                            className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg p-2.5 focus:ring-2 focus:ring-tcm-500 outline-none resize-none"
                        />
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
                        <button type="button" onClick={() => setIsEditMode(false)} className="px-4 py-2 text-stone-600 dark:text-stone-400 font-medium hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg active:scale-95 transition-transform">取消</button>
                        <button type="submit" className="px-6 py-2 bg-tcm-600 text-white font-medium rounded-lg hover:bg-tcm-700 shadow-sm active:scale-95 transition-transform">儲存變更</button>
                    </div>
                </form>
            </div>
        </div>
      )}

       {/* Enhanced Upload Modal */}
       {showUpload && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white dark:bg-stone-900 w-full max-w-xl rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto border border-stone-100 dark:border-stone-700">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100">上傳教學影片</h3>
               <button onClick={() => setShowUpload(false)} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 active:scale-95 transition-transform">
                 <X size={24} />
               </button>
             </div>
             <form onSubmit={handleUpload} className="space-y-4">
               {/* 1. File Selection Mock */}
               <div className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-xl p-6 text-center hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                  <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 text-stone-400 rounded-full flex items-center justify-center mx-auto mb-2">
                      <PlaySquare size={24} />
                  </div>
                  <p className="text-sm font-bold text-stone-700 dark:text-stone-300">選擇影片檔案</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">MP4, WebM (最大 500MB)</p>
                  <input type="file" accept="video/*" className="hidden" id="video-upload" />
                  <label htmlFor="video-upload" className="inline-block bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 px-3 py-1 text-xs rounded font-medium cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-600 dark:text-stone-200 active:scale-95 transition-transform">瀏覽檔案</label>
               </div>

               {/* 2. Cover Image */}
               <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">封面圖片 (Thumbnail)</label>
                  <div className="flex gap-4 items-start">
                      <div className="w-32 h-20 bg-stone-100 dark:bg-stone-800 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 flex items-center justify-center">
                          {uploadThumbnail ? (
                              <img src={uploadThumbnail} className="w-full h-full object-cover" />
                          ) : (
                              <ImageIcon size={20} className="text-stone-300 dark:text-stone-600" />
                          )}
                      </div>
                      <div className="flex-1">
                          <input type="file" accept="image/*" className="text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-tcm-50 dark:file:bg-tcm-900/20 file:text-tcm-700 dark:file:text-tcm-300 hover:file:bg-tcm-100" onChange={handleThumbnailChange} />
                          <p className="text-[10px] text-stone-400 mt-1">建議尺寸 1280x720</p>
                      </div>
                  </div>
               </div>

               {/* 3. Details */}
               <div>
                 <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">影片標題</label>
                 <input required name="title" className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg p-2.5 focus:ring-2 focus:ring-tcm-500 outline-none" placeholder="例如：五分鐘快速緩解頭痛" />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">分類</label>
                 <div className="space-y-2">
                     <select 
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value)}
                        className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg p-2.5 focus:ring-2 focus:ring-tcm-500 outline-none"
                     >
                         <option value="針灸推拿">針灸推拿</option>
                         <option value="藥膳食療">藥膳食療</option>
                         <option value="氣功導引">氣功導引</option>
                         <option value="婦科調理">婦科調理</option>
                         <option value="其他">其他 (請說明)</option>
                     </select>
                     {uploadCategory === '其他' && (
                         <input 
                            required 
                            placeholder="請輸入自訂分類" 
                            value={customCategory}
                            onChange={e => setCustomCategory(e.target.value)}
                            className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg p-2.5 focus:ring-2 focus:ring-tcm-500 outline-none animate-in fade-in slide-in-from-top-1" 
                         />
                     )}
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">描述</label>
                 <textarea name="description" rows={3} className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg p-2.5 focus:ring-2 focus:ring-tcm-500 outline-none resize-none" placeholder="影片內容簡介..." />
               </div>

               <div className="flex justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
                 <button type="submit" name="draft" className="flex items-center gap-2 px-4 py-2 text-stone-600 dark:text-stone-400 font-medium hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg transition-all active:scale-95 transform">
                    <Save size={18} />
                    儲存草稿
                 </button>
                 <div className="flex gap-2">
                    <button type="button" onClick={() => setShowUpload(false)} className="px-4 py-2 text-stone-600 dark:text-stone-400 font-medium hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg active:scale-95 transition-transform">取消</button>
                    <button type="submit" name="publish" className="px-6 py-2 bg-tcm-600 text-white font-medium rounded-lg hover:bg-tcm-700 shadow-sm active:scale-95 transition-transform">立即發佈</button>
                 </div>
               </div>
             </form>
           </div>
         </div>
       )}
    </div>
  );
};

// --- Login Modal ---
const LoginModal = ({ isOpen, onClose, onLogin }: { isOpen: boolean, onClose: () => void, onLogin: (role: 'student' | 'master') => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden scale-100 border border-stone-100 dark:border-stone-800">
                <div className="relative h-32 bg-tcm-600 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="text-center z-10 text-white">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-serif mx-auto mb-2 backdrop-blur-sm">
                            中
                        </div>
                        <h2 className="text-xl font-bold">登入中醫智匯</h2>
                    </div>
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white active:scale-90 transition-transform">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-8">
                    <p className="text-center text-stone-500 dark:text-stone-400 mb-6 text-sm">請選擇一個演示帳號進行登入</p>
                    <div className="space-y-3">
                        <button 
                            onClick={() => onLogin('student')}
                            className="w-full flex items-center p-3 border border-stone-200 dark:border-stone-700 rounded-xl hover:border-tcm-500 dark:hover:border-tcm-500 hover:bg-tcm-50 dark:hover:bg-tcm-900/20 transition-all group bg-white dark:bg-stone-800 active:scale-95 transform"
                        >
                            <img src={CURRENT_USER_STUDENT.avatarUrl} className="w-10 h-10 rounded-full mr-4 bg-stone-100" />
                            <div className="text-left">
                                <p className="font-bold text-stone-800 dark:text-stone-100 group-hover:text-tcm-700 dark:group-hover:text-tcm-400">我是學生 / 愛好者</p>
                                <p className="text-xs text-stone-500 dark:text-stone-400">體驗課程學習、論壇互動</p>
                            </div>
                        </button>

                        <button 
                             onClick={() => onLogin('master')}
                             className="w-full flex items-center p-3 border border-stone-200 dark:border-stone-700 rounded-xl hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all group bg-white dark:bg-stone-800 active:scale-95 transform"
                        >
                            <img src={CURRENT_USER_MASTER.avatarUrl} className="w-10 h-10 rounded-full mr-4 bg-stone-100" />
                            <div className="text-left">
                                <p className="font-bold text-stone-800 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400">我是中醫師 / 專家</p>
                                <p className="text-xs text-stone-500 dark:text-stone-400">體驗影片上傳、專業回覆</p>
                            </div>
                        </button>
                    </div>
                    <div className="mt-6 text-center">
                        <p className="text-xs text-stone-400">此為原型演示，無需真實密碼</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Main Layout ---
const App = () => {
  const [activeTab, setActiveTab] = useState('home'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Lifted Content State for Deep Linking
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [viewingPostId, setViewingPostId] = useState<string | null>(null);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User>(GUEST_USER);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Content State
  const [posts, setPosts] = useState<ForumPost[]>(MOCK_FORUM_POSTS);
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);

  // Theme Toggle Effect
  useEffect(() => {
     if (isDarkMode) {
        document.documentElement.classList.add('dark');
     } else {
        document.documentElement.classList.remove('dark');
     }
  }, [isDarkMode]);

  const handleLogin = (role: 'student' | 'master') => {
      setCurrentUser(role === 'student' ? CURRENT_USER_STUDENT : CURRENT_USER_MASTER);
      setShowLoginModal(false);
  };

  const handleLogout = () => {
      setCurrentUser(GUEST_USER);
      setActiveTab('home');
      setViewingUserId(null);
  };

  const handleViewUser = (userId: string) => {
      setViewingUserId(userId);
      setActiveTab('profile');
  };

  // Navigation Helpers
  const goToVideo = (video: Video) => {
      setSelectedVideo(video);
      setActiveTab('videos');
  };

  const goToPost = (postId: string) => {
      setViewingPostId(postId);
      setActiveTab('forum');
  };

  return (
    <div className="flex h-screen bg-[#fcfbf7] dark:bg-stone-950 font-sans text-stone-900 dark:text-stone-100 transition-colors duration-300">
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLogin={handleLogin}
      />

      <Navigation 
        activeTab={activeTab} 
        setActiveTab={(tab: string) => { setActiveTab(tab); if(tab === 'profile') setViewingUserId(currentUser.id); }} 
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        currentUser={currentUser}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative shadow-2xl">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 p-4 flex items-center justify-between z-20">
           <div className="flex items-center gap-3">
              <button onClick={() => setIsMobileMenuOpen(true)} className="text-stone-600 dark:text-stone-400">
                  <Menu size={24} />
              </button>
              <span className="font-bold text-stone-900 dark:text-stone-100 text-lg">中醫智匯</span>
           </div>
           
           {currentUser.role !== UserRole.GUEST ? (
                <div 
                    onClick={() => { setActiveTab('profile'); setViewingUserId(currentUser.id); }}
                    className="flex items-center gap-2 bg-stone-50 dark:bg-stone-800 rounded-full px-2 py-1 border border-stone-100 dark:border-stone-700"
                >
                    <span className="text-xs font-medium text-stone-600 dark:text-stone-300 truncate max-w-[80px]">{currentUser.name}</span>
                    <img 
                        src={currentUser.avatarUrl} 
                        className="w-7 h-7 rounded-full object-cover" 
                    />
                </div>
           ) : (
               <button onClick={() => setShowLoginModal(true)} className="text-sm font-bold text-tcm-600 dark:text-tcm-400">
                   登入
               </button>
           )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth bg-[#fcfbf7] dark:bg-stone-950">
          {activeTab === 'home' && (
            <HomeView 
                setActiveTab={setActiveTab} 
                currentUser={currentUser} 
                videos={videos} 
                posts={posts} 
                triggerLogin={() => setShowLoginModal(true)}
                goToVideo={goToVideo}
                goToPost={goToPost}
            />
          )}
          {activeTab === 'chat' && (
            <ChatView 
                currentUser={currentUser} 
                triggerLogin={() => setShowLoginModal(true)} 
            />
          )}
          {activeTab === 'forum' && (
            <ForumView 
                currentUser={currentUser} 
                posts={posts} 
                setPosts={setPosts} 
                triggerLogin={() => setShowLoginModal(true)} 
                onViewUser={handleViewUser}
                viewingPostId={viewingPostId}
                setViewingPostId={setViewingPostId}
            />
          )}
          {activeTab === 'videos' && (
            <VideoHub 
                videos={videos} 
                setVideos={setVideos} 
                currentUser={currentUser} 
                setCurrentUser={setCurrentUser} 
                triggerLogin={() => setShowLoginModal(true)}
                onViewUser={handleViewUser}
                selectedVideo={selectedVideo}
                setSelectedVideo={setSelectedVideo}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileView 
                currentUser={currentUser} 
                setCurrentUser={setCurrentUser} 
                videos={videos} 
                setVideos={setVideos} 
                posts={posts} 
                triggerLogin={() => setShowLoginModal(true)}
                viewingUserId={viewingUserId || currentUser.id}
                onBackToSelf={() => setViewingUserId(currentUser.id)}
                goToVideo={goToVideo}
                goToPost={goToPost}
            />
          )}
        </div>
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
