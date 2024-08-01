export const SocialMediaType = Object.freeze({
    FACEBOOK: "FACEBOOK",
    TWITTER: "TWITTER",
    LINKEDIN: "LINKEDIN"
  });
  

  export enum ProductStatus {
    Received = 'Received',
    Pending = 'Pending',
    Confirmed = 'Confirmed',
    Closed = 'Closed',
    NoResponse = 'No Response',
    Completed = 'Completed',
    Expired = 'Expired',
  }

  export enum itemType {
    Category = 'Category',
    Product = 'Product',
  }
  
  export enum ActiveStatus {
    ACTIVE = 'ACTIVE',
    BLOCKED = 'BLOCKED',
  }
  
  export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    USER = 'USER',
  }
  
  export enum OtpAction {
    VerifyAccount = 'VerifyAccount',
    ResetPassword = 'ResetPassword',
    ChangeEmail = 'ChangeEmail',
    ChangePhone = 'ChangePhone',
  }
  
  export enum ContactChangedType {
    Email = 'Email',
    Mobile = 'Mobile',
  }
  
  export enum ChangeOperationType {
    Add = 'Add',
    Change = 'Change',
  }
  
  export enum Language {
    EN = 'English',
    SI = 'Sinhala',
    TA = 'Tamil',
  }
  
  export enum SocketMessage {
    CompanyResponseTimeoutJob = 'CompanyResponseTimeoutJob',
  }
  