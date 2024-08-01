import create from "zustand";
 
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

