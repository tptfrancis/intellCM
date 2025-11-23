
import { User, UserRole, ForumPost, Video, ChatSession } from './types';

// Mock Notifications
const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'system', content: '歡迎加入中醫智匯！', isRead: true, createdAt: '2023-01-01' },
  { id: 'n2', type: 'reply', content: '陳醫師回覆了您的文章：請問失眠有什麼...', isRead: false, createdAt: '剛剛', targetId: 'p1', targetType: 'post' },
  { id: 'n3', type: 'like', content: '有人按讚了您的留言', isRead: false, createdAt: '1小時前', targetId: 'v1', targetType: 'video' },
] as const;

export const GUEST_USER: User = {
  id: 'guest',
  name: '訪客',
  role: UserRole.GUEST,
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
  bio: '請登入以體驗完整功能。',
  followers: 0,
  following: 0,
  joinedDate: '剛剛',
  history: [],
  notifications: []
};

export const CURRENT_USER_MASTER: User = {
  id: 'u1',
  name: '陳偉 醫師',
  role: UserRole.MASTER,
  title: '主任醫師',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wei',
  bio: '擁有20年臨床經驗的中醫師，專長於針灸與草藥調理。致力於將古老智慧與現代健康結合，推廣治未病的理念。',
  followers: 12500,
  following: 45,
  specialties: ['針灸', '內科調理', '疼痛管理', '體質調理'],
  joinedDate: '2018年1月',
  email: 'dr.chen@tcm-harmony.com',
  gender: 'male',
  age: 48,
  licenseNumber: 'TCM-0092831',
  history: ['v2'],
  notifications: [...MOCK_NOTIFICATIONS]
};

export const CURRENT_USER_STUDENT: User = {
  id: 'u2',
  name: '林小美',
  role: UserRole.STUDENT,
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  bio: '中醫愛好者，正在學習如何通過食療和穴位按摩來改善家人的健康。',
  followers: 120,
  following: 350,
  joinedDate: '2023年3月',
  email: 'sarah.lin@example.com',
  gender: 'female',
  age: 28,
  profession: '軟體工程師', // Updated field
  history: ['v1', 'v3'],
  notifications: [...MOCK_NOTIFICATIONS]
};

export const MOCK_USERS: Record<string, User> = {
  [CURRENT_USER_MASTER.id]: CURRENT_USER_MASTER,
  [CURRENT_USER_STUDENT.id]: CURRENT_USER_STUDENT,
  [GUEST_USER.id]: GUEST_USER,
  'u3': {
    id: 'u3',
    name: '李大師',
    role: UserRole.MASTER,
    title: '氣功導師',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Li',
    bio: '專注於氣功與太極教學30年，傳授養生之道。',
    followers: 8900,
    following: 12,
    joinedDate: '2019年12月',
    gender: 'male',
    age: 65,
    email: 'master.li@qigong.com',
    history: [],
    notifications: []
  }
};

export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: 'p1',
    title: '請問失眠有什麼好的食療建議？',
    authorId: 'u2',
    category: '藥膳食療',
    content: '最近工作壓力大，晚上很難入睡，常常半夜醒來。聽說酸棗仁湯有效，請問大家有推薦的食譜或用法嗎？不想一直依賴褪黑激素。',
    tags: ['食療', '失眠', '心神不寧'],
    likes: 24,
    comments: [
      { id: 'c1', authorId: 'u1', text: '酸棗仁確實有安神作用。建議可以搭配百合和蓮子煮粥，效果會更溫和。如果症狀持續，建議還是要把脈診斷。', createdAt: '1小時前' },
      { id: 'c2', authorId: 'u3', text: '睡前做10分鐘的靜坐冥想，配合腹式呼吸，對放鬆很有幫助。', createdAt: '30分鐘前' }
    ],
    createdAt: '2小時前',
    views: 342,
    status: 'published'
  },
  {
    id: 'p2',
    title: '深入淺出：十二經絡與臟腑的關係',
    authorId: 'u1',
    category: '中醫理論',
    content: '經絡系統是人體氣血運行的通道。今天我們來探討一下手太陰肺經如何影響我們的呼吸系統與皮膚健康...',
    tags: ['中醫理論', '經絡', '養生'],
    likes: 156,
    comments: [],
    createdAt: '1天前',
    views: 1205,
    status: 'published'
  },
  {
    id: 'p3',
    title: '腎陰虛與腎陽虛的區別是什麼？',
    authorId: 'u2',
    category: '臨床經驗',
    content: '常常聽到這兩個名詞，但不知道具體症狀有什麼不同？怕冷是陽虛嗎？',
    tags: ['診斷', '陰陽', '基礎理論'],
    likes: 12,
    comments: [
        { id: 'c3', authorId: 'u1', text: '簡單來說：陽虛則寒（怕冷、手腳冰冷），陰虛則熱（手心發熱、口乾舌燥）。', createdAt: '2天前' }
    ],
    createdAt: '3天前',
    views: 560,
    status: 'published'
  }
];

export const MOCK_VIDEOS: Video[] = [
  {
    id: 'v1',
    title: '居家常用五大穴位按摩教學',
    description: '學習合谷、足三里、內關等常用穴位的準確位置與按摩手法，緩解日常小病痛。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=1000',
    duration: '12:30',
    authorId: 'u1',
    views: 1200,
    category: '針灸推拿',
    tags: ['穴位', '居家護理', '疼痛'],
    isPaid: false,
    status: 'published',
    createdAt: '1週前',
    likes: 89,
    comments: []
  },
  {
    id: 'v2',
    title: '【VIP】大師級氣功導引：八段錦全套詳解',
    description: '深入解析每一個動作的氣感與呼吸配合，這是付費會員專屬的高階課程。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515023115689-5824739084f3?auto=format&fit=crop&q=80&w=1000',
    duration: '45:00',
    authorId: 'u3',
    views: 5400,
    category: '氣功導引',
    tags: ['八段錦', '養生', '進階'],
    isPaid: true,
    status: 'published',
    createdAt: '2週前',
    likes: 245,
    comments: []
  },
  {
    id: 'v3',
    title: '枸杞的正確吃法與禁忌',
    description: '保溫杯裡泡枸杞真的有用嗎？中醫師教你如何挑選和食用枸杞才能發揮最大功效。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1000',
    duration: '08:45',
    authorId: 'u1',
    views: 890,
    category: '藥膳食療',
    tags: ['枸杞', '食療', '養生'],
    isPaid: false,
    status: 'published',
    createdAt: '3週前',
    likes: 56,
    comments: []
  },
  {
    id: 'v4',
    title: '【VIP】婦科調理專題：月經不順的調理',
    description: '針對女性常見問題，提供系統性的飲食與穴位調理方案。',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=1000',
    duration: '30:20',
    authorId: 'u1',
    views: 3200,
    category: '婦科調理',
    tags: ['女性', '月經', '調理'],
    isPaid: true,
    status: 'published',
    createdAt: '1個月前',
    likes: 180,
    comments: []
  }
];

export const MOCK_CHAT_SESSIONS: ChatSession[] = [
  {
    id: 's1',
    title: '頭痛舒緩諮詢',
    lastModified: new Date(Date.now() - 86400000), // 1 day ago
    tags: ['頭痛', '穴位'],
    messages: [
      { id: 'm1', role: 'user', text: '我有偏頭痛，按什麼穴位好？', timestamp: new Date(Date.now() - 86400000) },
      { id: 'm2', role: 'model', text: '建議您可以按摩太陽穴和合谷穴...', timestamp: new Date(Date.now() - 86390000) }
    ]
  },
  {
    id: 's2',
    title: '冬季進補建議',
    lastModified: new Date(Date.now() - 172800000), // 2 days ago
    tags: ['食療', '冬季'],
    messages: [
      { id: 'm3', role: 'user', text: '冬天手腳冰冷吃什麼好？', timestamp: new Date(Date.now() - 172800000) },
      { id: 'm4', role: 'model', text: '可以多吃羊肉、當歸生薑羊肉湯...', timestamp: new Date(Date.now() - 172700000) }
    ]
  }
];
