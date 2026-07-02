import { create } from 'zustand';
import { User } from '@/types/api';
import { persist } from 'zustand/middleware';

interface MessageStoreState {
  activeUserId: string | null;
  setActiveUserId: (id: string | null) => void;
  // Temporary workaround: since there's no backend GET /conversations,
  // we track users we've chatted with locally.
  knownPartners: User[];
  addKnownPartner: (user: User) => void;
  removeKnownPartner: (userId: string) => void;
}

export const useMessageStore = create<MessageStoreState>()(
  persist(
    (set) => ({
      activeUserId: null,
      setActiveUserId: (id) => set({ activeUserId: id }),
      knownPartners: [],
      addKnownPartner: (user) => set((state) => {
        if (state.knownPartners.some(p => p._id === user._id)) return state;
        return { knownPartners: [user, ...state.knownPartners] };
      }),
      removeKnownPartner: (userId) => set((state) => ({
        knownPartners: state.knownPartners.filter(p => p._id !== userId)
      })),
    }),
    {
      name: 'message-store',
      partialize: (state) => ({ knownPartners: state.knownPartners }), // Persist only knownPartners
    }
  )
);
