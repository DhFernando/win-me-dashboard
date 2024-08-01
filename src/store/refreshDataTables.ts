import { create } from "zustand";

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
  