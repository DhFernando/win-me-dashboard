import { create } from "zustand";

interface PostDataStoreState {
    postData: any;
    setPostData: (postData: any) => void;
  }
  
  export const usePostDataStore = create<PostDataStoreState>((set) => ({
    postData: {},
    setPostData: (postData) => {
      set((state) => ({ ...state, postData }));
    },
  }));
  