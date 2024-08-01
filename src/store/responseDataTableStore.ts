import { create } from "zustand";

interface ResponseDataTableStoreState {
    responseData: any[];
    setResponseDataTableStore: (responseData: any[]) => void;
  }
  
  export const useResponseDataTableStore = create<ResponseDataTableStoreState>((set) => ({
    responseData: [],
    setResponseDataTableStore: (responseData) => {
      set((state) => ({ ...state, responseData }));
    },
  }));
  