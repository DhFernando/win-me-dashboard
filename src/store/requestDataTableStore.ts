import { create } from "zustand";

interface RequestDataTableStoreState {
    requestData: any[];
    setRequestDataTableStore: (requestData: any[]) => void;
  }
  
  export const useRequestDataTableStore = create<RequestDataTableStoreState>((set) => ({
    requestData: [],
    setRequestDataTableStore: (requestData) => {
      set((state) => ({ ...state, requestData }));
    },
  }));
  
  