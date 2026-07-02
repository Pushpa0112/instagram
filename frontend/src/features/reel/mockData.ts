export interface Reel {
  id: string;
  user: {
    _id: string;
    username: string;
    avatarUrl: string;
  };
  videoUrl: string;
  caption: string;
  likeCount: number;
  commentCount: number;
}

export const MOCK_REELS: Reel[] = [
  {
    id: "r1",
    user: { _id: "u1", username: "alex_designs", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    caption: "Working on some new designs! 🎨 #design #workspace",
    likeCount: 1245,
    commentCount: 84,
  },
  {
    id: "r2",
    user: { _id: "u4", username: "chris_travel", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026705d" },
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // placeholder
    caption: "Beautiful nature scenes 🌿 #travel #nature",
    likeCount: 8900,
    commentCount: 432,
  },
  {
    id: "r3",
    user: { _id: "u2", username: "jane_doe", avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704e" },
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // placeholder
    caption: "Coding session vibes 💻☕",
    likeCount: 560,
    commentCount: 22,
  }
];
