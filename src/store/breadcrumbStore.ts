import { create } from "zustand";

interface BreadcrumbStoreState {
    breadcrumb: any[];
    setBreadcrumb: (breadcrumb: any[]) => void;
  }
  
  export const useBreadcrumbStore = create<BreadcrumbStoreState>((set) => ({
    breadcrumb: [],
    setBreadcrumb: (breadcrumb) => {
      set((state) => ({ ...state, breadcrumb }));
    },
  }));
  
  