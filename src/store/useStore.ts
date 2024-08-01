import create from "zustand";
import { devtools, persist } from "zustand/middleware";

// Define your store state and actions types
interface StoreState {
  profileData: any;
  accessToken: any;
  refreshToken: any;
  authUser: boolean;
  activeSideMenu: boolean;
  clientData: any;
  activeRoute: string;
  setLogUser: (authUser: boolean, accessToken: any, refreshToken: any) => void;
  setProfileData: (profileData: any) => void;
  setSettingData: (activeSideMenu: boolean) => void;
  setClientData: (clientData: any) => void;
  setActiveRoute: (activeRoute: string) => void;
}

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        profileData: [],
        accessToken: {},
        refreshToken: {},
        authUser: false,
        activeSideMenu: false,
        clientData: {},
        activeRoute: "dashboard",

        setLogUser: (authUser, accessToken, refreshToken) => {
          set((state) => ({
            ...state,
            authUser: authUser,
            accessToken: accessToken,
            refreshToken: refreshToken,
          }));
        },

        setProfileData: (profileData) => {
          set((state) => ({ ...state, profileData: profileData }));
        },

        setSettingData: (activeSideMenu) => {
          set((state) => ({ ...state, activeSideMenu: activeSideMenu }));
        },

        setClientData: (clientData) => {
          set((state) => ({ ...state, clientData: clientData }));
        },

        setActiveRoute: (activeRoute) => {
          set((state) => ({ ...state, activeRoute: activeRoute }));
        },
      }),
      { name: "z" }
    )
  )
);