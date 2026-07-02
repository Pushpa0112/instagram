export interface Story {
  id: string;
  user: {
    _id: string;
    username: string;
    avatarUrl: string;
  };
  mediaUrl: string;
  viewed: boolean;
  createdAt: string;
}

export const MOCK_STORIES: Story[] = [
  {
    id: "s1",
    user: { _id: "u1", username: "alex_designs", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
    mediaUrl: "https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=800&auto=format&fit=crop",
    viewed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "s2",
    user: { _id: "u2", username: "jane_doe", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704e" },
    mediaUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop",
    viewed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "s3",
    user: { _id: "u3", username: "sam_photo", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704f" },
    mediaUrl: "https://images.unsplash.com/photo-1531297172864-45d164d1f564?q=80&w=800&auto=format&fit=crop",
    viewed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "s4",
    user: { _id: "u4", username: "chris_travel", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026705d" },
    mediaUrl: "https://images.unsplash.com/photo-1506744626753-eda8184649b1?q=80&w=800&auto=format&fit=crop",
    viewed: false,
    createdAt: new Date().toISOString(),
  },
];
