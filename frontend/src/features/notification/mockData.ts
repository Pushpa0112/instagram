import { User } from "@/types/api";

export type NotificationType = "like" | "comment" | "follow" | "mention";

export interface AppNotification {
  id: string;
  type: NotificationType;
  actor: Pick<User, "_id" | "username" | "profilePicture">;
  text?: string; // e.g. the comment text or action text
  targetImage?: string; // thumbnail of the post
  createdAt: string;
  isRead: boolean;
}

const mockUsers = [
  {
    _id: "user1",
    username: "john_doe",
    profilePicture: "https://i.pravatar.cc/150?u=user1",
  },
  {
    _id: "user2",
    username: "jane_smith",
    profilePicture: "https://i.pravatar.cc/150?u=user2",
  },
  {
    _id: "user3",
    username: "alex_jones",
    profilePicture: "https://i.pravatar.cc/150?u=user3",
  },
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif_1",
    type: "like",
    actor: mockUsers[0],
    text: "liked your photo.",
    targetImage: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    isRead: false,
  },
  {
    id: "notif_2",
    type: "comment",
    actor: mockUsers[1],
    text: 'commented: "This is amazing! 😍"',
    targetImage: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hr ago
    isRead: false,
  },
  {
    id: "notif_3",
    type: "follow",
    actor: mockUsers[2],
    text: "started following you.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isRead: true,
  },
  {
    id: "notif_4",
    type: "mention",
    actor: mockUsers[0],
    text: "mentioned you in a comment.",
    targetImage: "https://images.unsplash.com/photo-1682687220198-88e9bdea9931",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    isRead: true,
  },
];
