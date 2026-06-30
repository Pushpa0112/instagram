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
  _id: string;
  caption?: string;
  image: string;
  author: User | string;
  likes: string[];
  comments: Comment[] | string[];
}

export interface Comment {
  _id: string;
  text: string;
  author: User | string;
  post: string;
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
