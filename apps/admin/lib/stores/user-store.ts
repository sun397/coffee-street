import { create } from "zustand";
import { User } from "firebase/auth";

interface UserState {
  user: User | null;
  userId: string;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  userId: '999', // ログイン確認中、および未ログイン時は '999'
  setUser: (user) => set({ 
    user, 
    userId: user?.uid ?? '999' 
  }),
}));