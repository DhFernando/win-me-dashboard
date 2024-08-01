import { ActiveStatus, UserRole } from "./enums";

export type OTPProp = {
  expiresAt: string;
  method: 'MAIL' | 'PHONE';
  token: string;
};

export type VerifiedSession = {
  sessionId: string;
  expiresAt: string;
};

export enum ProductStatus {
  Received = 'Received',
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Closed = 'Closed',
  NoResponse = 'No Response',
  Completed = 'Completed',
  Expired = 'Expired',
}

export type EmailSubscribeResponse = {
  statusCode: number | undefined;
  message: string;
  data?: any;
};

export type User = {
  id: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  name: string;
  avatarUrl: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole;
};

export type ICategory = {
  id: string;
  name: string;
  active: boolean;
  status: ActiveStatus;
  canHaveProducts: boolean;
  coverUrl: string;
  description: string;
  iconUrl: string;
  productRequestForm: any;
  products: {
    nodes: IProduct[];
    totalCount: number;
  };
  slug?: string
  productCategories: IProduct[]
};

export type ICategoryTree = {
  id: string;
  name: string;
  type?: 'category' | 'product';
  iconUrl?: string;
  coverUrl?: string;
  slug?: string;
  parentId?: string;
};

type Company = {
  id: string;
  name: string;
  username: string;
  email: string;
  active?: boolean;
  status?: ActiveStatus;
};

export type IProduct = {
  id: string;
  name: string;
  description: string;
  keyFeatures: string[] | null;
  status: ActiveStatus;
  iconUrl: string;
  coverUrl: string | null;
  createdAt: string;
  updatedAt: string;
  company: Company;
};

export type IProducts = {
  nodes: IProduct[];
  totalCount: number;
};

export type ProductRequestForm = {
  requestFormUiSchema: string;
  requestFormSchema: string;
  requestFields: string;
  responseFields: string;
  responseFormUiSchema: string;
  responseFormSchema: string;
  status: string;
  maxCompanyResponseDuration?: number;
  maxUserResponseDuration?: number;
};

export type IProductCategory = {
  name: string;
  id: string;
  iconUrl: string;
  description: string;
  coverUrl: string | null;
  active: boolean;
  status: ActiveStatus;
  canHaveProducts: boolean;
  products: IProducts;
  productRequestForm: ProductRequestForm;
  slug: string;
  parentId: string;
};

export type IProductRequest = {
  id: string;
  requestData: string;
  referenceId: string;
  maxUserResponseTimeExpiresAt: string;
  maxCompanyResponseTimeExpiresAt: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  user: User;
  productCategory: IProductCategory;
  ticketsWithCount: ITicketsWithCount;
  tickets: {
    nodes: ITicket[];
    updatedAt: string | null;
  }
};

export type ITicketsWithCount = {
  nodes: ITicket[];
  totalCount: number;
};

export type ITicket = {
  id: string;
  confirmedProductId: string | null;
  receivedProductId: string | null;
  requestedProducts: IProduct[];
  userDetails: IUserDetails;
  replies: IReply[];
  status: string;
  customerContactedAt: string | null;
  completedTime: string | null;
  createdAt: string;
  confirmedTime: string | null;
  repliedTime: string | null;
  referenceId: string;
  updatedAt: string;
  // TODO: have to remove once stable with the type 
  productCategory: IProductCategory;
  productRequest: IProductRequest;
  
};

export type IUserDetails = {
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
};

export type IReply = {
  id: string;
  replyData: string;
  product: IProduct;
  createdAt: string | null;
};

export type IProductRequestsResponse = {
  productRequests: {
    requests: IProductRequest[];
    totalCount: number;
  };
};

export interface UserNotificationObject {
  id: string;
  metadata: Record<string, any>;
  title: string;
  event: string;
  read: boolean;
  createdAt: string;
}

export interface PaginatedUserNotifications {
  nodes: UserNotificationObject[];
  totalCount: number;
  unreadCount: number;
}

export interface FetchMyNotificationsData {
  myNotifications: PaginatedUserNotifications;
}

export interface FetchMyNotificationsVars {
  page: number;
  pageSize: number;
}

export interface GroupedNotifications {
  [date: string]: UserNotificationObject[];
}

export interface IStep {
  step: number;
  active: boolean;
  topic: string;
  isCompleted: boolean;
}

export interface CategoryEducation {
  content: string;
  language: string;
  updatedAt: Date;
  createdAt: Date;
}

export type BlogPost = {
  id: string | number;
  title: string;
  coverImg: string;
  category: string;
  date: string;
  author: {
    name?: string;
    img?: string;
    url?: string;
  };
  description: string;
  slug: string;
  excerpt: string;
};

export type BlogCategory = {
  id: string;
  name: string;
};
