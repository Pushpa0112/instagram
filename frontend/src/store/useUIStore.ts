import { create } from 'zustand';

interface UIState {
  isCreatePostOpen: boolean;
  isSearchOpen: boolean;
  toggleCreatePost: () => void;
  toggleSearch: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCreatePostOpen: false,
  isSearchOpen: false,
  toggleCreatePost: () => set((state) => ({ isCreatePostOpen: !state.isCreatePostOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
}));
