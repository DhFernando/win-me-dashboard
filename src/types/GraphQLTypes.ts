export enum GraphQLError {
  DuplicateSlugError='DuplicateSlugError',
  CompanyUsernameTakenError='CompanyUsernameTakenError',
  CompanyCategoryNotFoundError='CompanyCategoryNotFoundError',
  CountryNotFoundError='CountryNotFoundError'
}

export enum GraphQLSuccess {
  UserUpdated = 'UserUpdated', 
  ProductCategoryUpdated="ProductCategoryUpdated",
  ProductRequestFormUpserted='ProductRequestFormUpserted',
  ProductCategoryCreated='ProductCategoryCreated',
  CompanyUpdated='CompanyUpdated',
  CompanyCreated='CompanyCreated',
  CompanyInvitationCreated='CompanyInvitationCreated',
  ProductUpdated='ProductUpdated',
  ProductCreated='ProductCreated',
  ProductDeleted='ProductDeleted',
  PromotionUpdated='PromotionUpdated',
  PromotionCategoryCreated='PromotionCategoryCreated',
  PromotionCategoryUpdated='PromotionCategoryUpdated',
  PromotionDeleted='PromotionDeleted',
  PromotionCreated='PromotionCreated',
  PasswordChanged='PasswordChanged',
  UserAvatarUpdated='UserAvatarUpdated',
  TicketReplied='TicketReplied',
  PasswordResetRequestVerification='PasswordResetRequestVerification',
  PasswordResetRequest='PasswordResetRequest',
  PasswordResetSuccess='PasswordResetSuccess'
}
