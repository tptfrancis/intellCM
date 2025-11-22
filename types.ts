
export enum UserRole {
  GUEST = '訪客',
  STUDENT = '學生',
  MASTER = '中醫師',
}

export interface Notification {
  id: string;
  type: 'reply' | 'system' | 'like';
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
  bio: string;
  title?: string; // Job title e.g. Attending Physician
  followers: number;
  following: number;
  specialties?: string[];
  joinedDate: string;
  email?: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  licenseNumber?: string; // For Masters
  profession?: string; // Replaced school
  history: string[]; // IDs of watched videos
  notifications: Notification[];
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastModified: Date;
  tags: string[];
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface ForumPost {
  id: string;
  title: string;
  authorId: string;
  category: string; // New field
  content: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  createdAt: string;
  views: number;
  status: 'draft' | 'published'; // New field
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl?: string; 
  duration: string;
  authorId: string;
  views: number;
  category: string; // The selected category
  customCategory?: string; // If 'Other' is selected
  tags: string[]; 
  isPaid: boolean; 
  status: 'draft' | 'published'; 
  createdAt: string;
  likes: number;
  comments: Comment[];
}