import { create } from 'zustand';

interface UIState {
  isCreatePostOpen: boolean;
  isSearchOpen: boolean;
  isNotificationOpen: boolean;
  toggleCreatePost: () => void;
  toggleSearch: () => void;
  toggleNotification: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCreatePostOpen: false,
  isSearchOpen: false,
  isNotificationOpen: false,
  toggleCreatePost: () => set((state) => ({ isCreatePostOpen: !state.isCreatePostOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  toggleNotification: () => set((state) => ({ isNotificationOpen: !state.isNotificationOpen })),
}));
