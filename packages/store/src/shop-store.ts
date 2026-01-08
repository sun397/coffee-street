// packages/store/src/shop-store.ts
import { create } from 'zustand';

// サーバーデータは TanStack Query が持つので、ここには置かない
interface ShopUIState {
  isEditModalOpen: boolean;
  setEditModalOpen: (open: boolean) => void;
}

export const useShopUIStore = create<ShopUIState>((set) => ({
  isEditModalOpen: false,
  setEditModalOpen: (open) => set({ isEditModalOpen: open }),
}));
