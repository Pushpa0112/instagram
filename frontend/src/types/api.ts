// Placeholder interfaces for API models

export interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  gender?: 'male' | 'female';
  followers: string[];
  following: string[];
  posts: string[];
  bookmarks: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  author: User; // We assume populated author in the UI mapper
  image: string;
  caption?: string;
  likeCount: number;
  isLikedByMe: boolean;
  commentCount: number;
  isBookmarkedByMe: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  text: string;
  author: User;
  createdAt: string;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
}

export interface Conversation {
  _id: string;
  participants: string[];
  messages: Message[] | string[];
}
