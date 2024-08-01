import { create } from "zustand";

interface ImagesStoreState {
    imagesStore: {
      logoUrl: string;
      bannerUrl: string;
    };
    setImagesStore: (imagesStore: { logoUrl: string; bannerUrl: string }) => void;
  }
  
  export const useImagesStore = create<ImagesStoreState>((set) => ({
    imagesStore: {
      logoUrl: "",
      bannerUrl: "",
    },
    setImagesStore: (imagesStore) => {
      set((state) => ({ ...state, imagesStore }));
    },
  }));
  
  
  