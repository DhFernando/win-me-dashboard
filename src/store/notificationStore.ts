import { create } from "zustand";

interface NotificationStoreState {
    notifications: any[];
    count: number;
    setNotification: (notifications: any[]) => void;
    setCount: (count: number) => void;
  }
  
  export const useNotificationStore = create<NotificationStoreState>((set) => ({
    notifications: [],
    count: 0,
    setNotification: (notifications) => {
      set((state) => ({ ...state, notifications }));
    },
    setCount: (count) => {
      set((state) => ({ ...state, count }));
    },
  }));
  
  