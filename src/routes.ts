import ClientManagement from "./pages/ClientManagement";
import Dashboard from "./pages/Dashboard";
import EditClient from "./components/ClientManagement/EditClient";
import Login from "./pages/Login";
import WelcomeInvitation from "./pages/WelcomeInvitation";
import SetPassword from "./pages/SetPassword";
import ReviewAccount from "./pages/ReviewAccount";
import CompanyLogin from "./pages/CompanyLogin";
import ForgotPassword from "./pages/ForgotPassword";
import CodeVerification from "./pages/CodeVerification";
import SetNewPassword from "./pages/SetNewPassword";
import DashboardRoutes from "./util/DashboardRoutes";
import CategoryManagement from "./pages/CategoryManagement";
import AddSubCategory from "./components/CategoryManagement/AddSubCategory";
import ProductManagement from "./pages/ProductManagement";
import EditProduct from "./components/ProductManagement/EditProduct";
import TicketManagement from "./pages/TicketManagement";
import UserManagement from "./pages/UserManagement";
import PromotionManagement from "./pages/PromotionManagement";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import ViewTicket from "./components/TicketManagement/ViewTicket";
import EditUser from "./components/UserManagement/EditUser";
import EditPromotion from "./components/PromotionManagement/EditPromotion";
import Reports from "./pages/Reports";
import AccountSetting from "./components/Settings/AccountSetting";
import UserDetails from "./components/Settings/UserDetails";
import BranchManagement from "./pages/BranchManagement";
import UnitManagement from "./pages/UnitManagement";
import PromotionCategory from "./pages/PromotionCategory";
import EditCategoryIndex from "./components/CategoryManagement/EditCategoryIndex";

export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  auth?: boolean;
  routes?: RouteConfig[]; // Optional nested routes
}

export const routes: RouteConfig[] = [
  {
    path: "/",
    component: Dashboard,
  },
  {
    path: "/client-management",
    component: ClientManagement,
  },
  {
    path: "/client-management/edit-client/:id",
    component: EditClient,
  },
  {
    path: "/category-management",
    component: CategoryManagement,
  },
  {
    path: "/category-management/edit-industry/:id",
    component: EditCategoryIndex,
  },
  {
    path: "/category-management/add-product/:id",
    component: AddSubCategory,
  },
  {
    path: "/product-management",
    component: ProductManagement,
  },
  {
    path: "/product-management/edit-product/:id",
    component: EditProduct,
  },
  {
    path: "/ticket-management",
    component: TicketManagement,
  },
  {
    path: "/ticket-management/:id",
    component: ViewTicket,
  },
  {
    path: "/user-management",
    component: UserManagement,
  },
  {
    path: "/user-management/:id",
    component: EditUser,
  },
  {
    path: "/promotion-management",
    component: PromotionManagement,
  },
  {
    path: "/promotion-management/category",
    component: PromotionCategory,
  },
  {
    path: "/promotion-management/edit/:id",
    component: EditPromotion,
  },
  {
    path: "/reports",
    component: Reports,
  },
  {
    path: "/settings",
    component: Settings,
  },
  {
    path: "/settings/account",
    component: AccountSetting,
  },
  {
    path: "/settings/account/user-details",
    component: UserDetails,
  },
  {
    path: "/settings/systems",
    component: Settings,
  },
  {
    path: "/help",
    component: Help,
  },
  {
    path: "/branch-management",
    component: BranchManagement,
  },
  {
    path: "/unit-management",
    component: UnitManagement,
  },
];

export const routesApp: RouteConfig[] = [
  {
    path: "/login",
    component: Login,
    auth: false,
  },
  {
    path: "/invitations",
    component: WelcomeInvitation,
    auth: false,
  },
  {
    path: "/set-password/:token",
    component: SetPassword,
    auth: false,
  },
  {
    path: "/review-account",
    component: ReviewAccount,
    auth: false,
  },
  {
    path: "/:name/login",
    component: CompanyLogin,
    auth: false,
  },
  {
    path: "/forgot-password",
    component: ForgotPassword,
    auth: false,
  },
  {
    path: "/code-verification/:token",
    component: CodeVerification,
    auth: false,
  },
  {
    path: "/reset-password/:token",
    component: SetNewPassword,
    auth: false,
  },
  {
    path: "/",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/client-management",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/client-management/edit-client/:id",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/category-management",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/category-management/edit-industry/:id",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/category-management/add-product/:id",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/ticket-management",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/ticket-management/:id",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/user-management",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/user-management/:id",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/promotion-management",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/promotion-management/edit/:id",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/reports",
    component: DashboardRoutes,
  },
  {
    path: "/settings",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/settings/account",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/settings/account/user-details",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/settings/systems",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/help",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/product-management",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/product-management/edit-product/:id",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/branch-management",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/unit-management",
    component: DashboardRoutes,
    auth: true,
  },
  {
    path: "/promotion-management/category",
    component: DashboardRoutes,
    auth: true,
  },
];
