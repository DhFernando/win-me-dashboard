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


interface CompanyAdminState {
  companyAdmin: any;
  setCompanyAdmin: (companyAdmin: any) => void;
}

export const useCompanyAdmin = create<CompanyAdminState>((set) => ({
  companyAdmin: {},
  setCompanyAdmin: (companyAdmin) => {
    set((state) => ({ ...state, companyAdmin }));
  },
}));

interface RefreshDataTablesState {
  refreshDataTables: boolean;
  setRefreshDataTables: (refreshDataTables: boolean) => void;
}

export const useRefreshDataTables = create<RefreshDataTablesState>((set) => ({
  refreshDataTables: false,
  setRefreshDataTables: (refreshDataTables) => {
    set((state) => ({ ...state, refreshDataTables }));
  },
}));

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
