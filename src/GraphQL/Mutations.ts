import { gql } from "@apollo/client";

export const USER_LOGIN = gql`
  mutation loginUserWithPassword($login: String!, $password: String!, $fcmToken: String!) {
    loginUserWithPassword(
      input: { login: $login, password: $password, fcmToken: $fcmToken, client: WEB }
    ) {
      __typename
      ... on LoginSuccess {
        accessToken {
          expiresAt
          token
        }
        refreshToken {
          expiresAt
          token
        }
      }
      ... on UserNotVerifiedError {
        message
      }
      ... on InvalidLoginError {
        message
      }
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation loginUserWithRefreshToken($token: String!) {
    loginUserWithRefreshToken(input: { token: $token }) {
      __typename
      ... on LoginSuccess {
        accessToken {
          expiresAt
          token
        }
        refreshToken {
          expiresAt
          token
        }
      }
      ... on UserNotVerifiedError {
        message
      }
      ... on InvalidLoginError {
        message
      }
    }
  }
`;

export const REVOKE_REFRESH_TOKEN = gql`
  mutation revokeRefreshToken($token: String!) {
    revokeRefreshToken(input: { token: $token })
  }
`;

export const CREATE_COMPANY = gql`
  mutation createCompany(
    $companyCategoryId: ID!
    $countryId: ID!
    $rating: Float
    $socialLinks: [SocialLinkInput!]
    $name: String!
    $username: String!
    $email: String
    $address: String
    $location: String
    $website: String
    $phone: String
    $description: String
    $hotlines: [String!]
    $subscriptionExpiresAt: DateTime
    $logoUrl: String
    $bannerUrl: String
    $active: Boolean
  ) {
    createCompany(
      input: {
        companyCategoryId: $companyCategoryId
        countryId: $countryId
        rating: $rating
        socialLinks: $socialLinks
        name: $name
        username: $username
        email: $email
        address: $address
        location: $location
        website: $website
        phone: $phone
        description: $description
        hotlines: $hotlines
        subscriptionExpiresAt: $subscriptionExpiresAt
        logoUrl: $logoUrl
        bannerUrl: $bannerUrl
        active: $active
      }
    ) {
      __typename
      ... on CompanyCreated {
        company {
          id
          name
        }
        mainBranch {
          id
          name
        }
      }
      ... on CompanyCategoryNotFoundError {
        message
      }
      ... on CompanyUsernameTakenError {
        message
      }
      ... on CountryNotFoundError {
        message
      }
      ... on DisplayableError {
        message
      }
    }
  }
`;

export const SEND_COMPANY_INVITATION = gql`
  mutation sendCompanyInvitation(
    $companyId: String!
    $companyBranchId: String!
    $email: String!
    $firstName: String!
    $lastName: String!
    $designation: String!
    $phone: String!
  ) {
    sendCompanyInvitation(
      input: {
        companyId: $companyId
        companyBranchId: $companyBranchId
        companyRole: COMPANY_ADMIN
        email: $email
        firstName: $firstName
        lastName: $lastName
        designation: $designation
        phone: $phone
      }
    ) {
      __typename
      ... on CompanyInvitationCreated {
        invitation {
          id
          role
          expiresAt
          email
          createdAt
          updatedAt
        }
      }
      ... on CompanyNotFoundError {
        message
      }
      ... on CompanyBranchNotFoundError {
        message
      }
      ... on MemberAlreadyInvitedError {
        message
      }
    }
  }
`;

export const UPDATE_COMPANY = gql`
  mutation updateCompany(
    $companyCategoryId: ID
    $countryId: ID
    $rating: Float
    $socialLinks: [SocialLinkInput!]
    $name: String
    $username: String
    $email: String
    $address: String
    $location: String
    $website: String
    $phone: String
    $description: String
    $hotlines: [String!]
    $subscriptionExpiresAt: DateTime
    $logoUrl: String
    $bannerUrl: String
    $id: ID!
    $status: CompanyStatus
    $active: Boolean
  ) {
    updateCompany(
      input: {
        companyCategoryId: $companyCategoryId
        countryId: $countryId
        rating: $rating
        socialLinks: $socialLinks
        name: $name
        username: $username
        email: $email
        address: $address
        location: $location
        website: $website
        phone: $phone
        description: $description
        hotlines: $hotlines
        subscriptionExpiresAt: $subscriptionExpiresAt
        logoUrl: $logoUrl
        bannerUrl: $bannerUrl
        id: $id
        status: $status
        active: $active
      }
    ) {
      __typename
      ... on CompanyUpdated {
        company {
          id
          name
          username
          email
          rating
          address
          location
          website
          phone
          description
          hotlines
          subscriptionExpiresAt
          logoUrl
          bannerUrl
          status
          active
          socialLinks {
            provider
            link
          }
          country {
            id
          }
          category {
            id
          }
        }
      }
      ... on CompanyCategoryNotFoundError {
        message
      }
      ... on CompanyUsernameTakenError {
        message
      }
      ... on CountryNotFoundError {
        message
      }
      ... on CompanyNotFoundError {
        message
      }
    }
  }
`;

export const ACCEPT_COMPANY_INVITATION = gql`
  mutation acceptCompanyInvitation($token: String!, $password: String!) {
    acceptCompanyInvitation(input: { token: $token, password: $password }) {
      __typename
      ... on CompanyInvitationAccepted {
        success
      }

      ... on CompanyInvitationExpiredError {
        message
      }

      ... on UserNotFoundError {
        message
      }

      ... on PasswordSetupRequiredError {
        message
      }
    }
  }
`;

export const CREATE_PRODUCT_CATEGORY = gql`
  mutation createProductCategory(
    $parentId: ID
    $name: String!
    $description: String
    $iconUrl: String
    $coverUrl: String
    $canHaveProducts: Boolean
    $slug: String!
  ) {
    createProductCategory(
      input: {
        parentId: $parentId
        name: $name
        description: $description
        iconUrl: $iconUrl
        coverUrl: $coverUrl
        canHaveProducts: $canHaveProducts
        slug: $slug
      }
    ) {
      __typename
      ... on ProductCategoryCreated {
        productCategory {
          id
          name
          description
          iconUrl
          coverUrl
          canHaveProducts
        }
      }
      ... on ProductCategoryNotFoundError {
        message
      }
    }
  }
`;

export const UPDATE_PRODUCT_CATEGORY = gql`
  mutation updateProductCategory(
    $id: ID!
    $name: String
    $description: String
    $iconUrl: String
    $coverUrl: String
    $canHaveProducts: Boolean
    $active: Boolean
    $status: ProductStatus!
    $slug: String
  ) {
    updateProductCategory(
      input: {
        id: $id
        name: $name
        description: $description
        iconUrl: $iconUrl
        coverUrl: $coverUrl
        canHaveProducts: $canHaveProducts
        active: $active
        status: $status
        slug: $slug
      }
    ) {
      __typename
      ... on ProductCategoryUpdated {
        productCategory {
          id
          name
          description
          iconUrl
          coverUrl
          canHaveProducts
          status
          slug
        }
      }
      ... on ProductCategoryNotFoundError {
        message
      }
        
      ... on DuplicateSlugError {
        message
      } 

      ... on ProductCategorySlugHasSpecialCharacterError {
        message
      } 
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation createProduct(
    $productCategoryId: ID!
    $companyId: ID!
    $name: String!
    $description: String
    $iconUrl: String
    $coverUrl: String
    $keyFeatures: [String!]
  ) {
    createProduct(
      input: {
        productCategoryId: $productCategoryId
        companyId: $companyId
        name: $name
        description: $description
        iconUrl: $iconUrl
        coverUrl: $coverUrl
        keyFeatures: $keyFeatures
      }
    ) {
      __typename
      ... on ProductCreated {
        product {
          id
          name
          description
          iconUrl
          coverUrl
          keyFeatures
        }
      }
      ... on ProductCategoryNotFoundError {
        message
      }
      ... on ProductCategoryDoesNotAllowProductsError {
        message
      }
      ... on CompanyNotFoundError {
        message
      }
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation updateProduct(
    $productCategoryId: ID
    $id: ID!
    $name: String!
    $description: String!
    $iconUrl: String!
    $coverUrl: String!
    $keyFeatures: [String!]
    $status: ProductStatus!
  ) {
    updateProduct(
      input: {
        productCategoryId: $productCategoryId
        id: $id
        name: $name
        description: $description
        iconUrl: $iconUrl
        coverUrl: $coverUrl
        keyFeatures: $keyFeatures
        status: $status
      }
    ) {
      __typename
      ... on ProductUpdated {
        product {
          id
          name
          description
          iconUrl
          coverUrl
          keyFeatures
        }
      }
      ... on ProductNotFoundError {
        message
      }
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation deleteProduct($id: ID!) {
    deleteProduct(input: { id: $id }) {
      __typename
      ... on ProductDeleted {
        id
      }
      ... on ProductNotFoundError {
        message
      }
    }
  }
`;

export const UPSERT_PRODUCT_REQUEST_FORM = gql`
  mutation upsertProductRequestForm(
    $productCategoryId: ID!
    $requestFormUiSchema: JSONString!
    $requestFormSchema: JSONSchemaString!
    $responseFormUiSchema: JSONString!
    $responseFormSchema: JSONSchemaString!
    $maxCompanyResponseDurationSeconds: Int
    $maxUserResponseDurationSeconds: Int
    $status: ProductRequestFormStatus
    $requestFields: JSONString
    $responseFields: JSONString
  ) {
    upsertProductRequestForm(
      input: {
        productCategoryId: $productCategoryId
        requestFormUiSchema: $requestFormUiSchema
        requestFormSchema: $requestFormSchema
        responseFormUiSchema: $responseFormUiSchema
        responseFormSchema: $responseFormSchema
        maxCompanyResponseDurationSeconds: $maxCompanyResponseDurationSeconds
        maxUserResponseDurationSeconds: $maxUserResponseDurationSeconds
        status: $status
        requestFields: $requestFields
        responseFields: $responseFields
      }
    ) {
      __typename
      ... on ProductRequestFormUpserted {
        productRequestForm {
          requestFormUiSchema
          requestFormSchema
          responseFormUiSchema
          responseFormSchema
        }
      }
      ... on ProductCategoryNotFoundError {
        message
      }
    }
  }
`;

export const REPLY_TICKET = gql`
  mutation replyTicket(
    $replies: [TicketReplyInput!]!
    $ticketId: String!
    $repliedBranchId: String!
  ) {
    replyTicket(
      input: {
        replies: $replies
        ticketId: $ticketId
        repliedBranchId: $repliedBranchId
      }
    ) {
      __typename
      ... on TicketReplied {
        ticket {
          id
          status
        }
      }
      ... on TicketNotFoundError {
        message
      }
    }
  }
`;

export const MARK_TICKET_AS_COMPLETED = gql`
  mutation markTicketAsCompleted($ticketId: ID!) {
    markTicketAsCompleted(input: { ticketId: $ticketId }) {
      __typename
      ... on TicketCompleted {
        ticket {
          id
          status
        }
      }
      ... on TicketNotFoundError {
        message
      }
      ... on IncorrectTicketStateError {
        message
      }
    }
  }
`;

export const CREATE_PROMOTION = gql`
  mutation createPromotion(
    $description: String
    $highlights: [String!]
    $companyId: ID!
    $active: Boolean
    $featured: Boolean
    $productId: ID!
    $expiresAt: DateTime!
    $imageUrl: String
    $bannerUrl: String
    $promotionCategoryIds: [ID]!
    $title: String!
  ) {
    createPromotion(
      input: {
        description: $description
        highlights: $highlights
        companyId: $companyId
        active: $active
        featured: $featured
        productId: $productId
        expiresAt: $expiresAt
        imageUrl: $imageUrl
        bannerUrl: $bannerUrl
        promotionCategoryIds: $promotionCategoryIds
        title: $title
      }
    ) {
      __typename
      ... on PromotionCreated {
        promotion {
          id
          title
          description
          highlights
        }
      }
      ... on InvalidProductError {
        message
      }
    }
  }
`;

export const CREATE_PROMOTION_CATEGORY = gql`
  mutation createPromotionCategory(
    $active: Boolean
    $name: String!
    $iconUrl: String
  ) {
    createPromotionCategory(
      input: { active: $active, name: $name, iconUrl: $iconUrl }
    ) {
      __typename
      ... on PromotionCategoryCreated {
        promotionCategory {
          id
          name
          iconUrl
          active
        }
      }
    }
  }
`;

export const UPDATE_PROMOTION_CATEGORY = gql`
  mutation updatePromotionCategory(
    $active: Boolean
    $name: String!
    $iconUrl: String
    $promotionCategoryId: ID!
  ) {
    updatePromotionCategory(
      input: {
        active: $active
        name: $name
        iconUrl: $iconUrl
        promotionCategoryId: $promotionCategoryId
      }
    ) {
      __typename
      ... on PromotionCategoryUpdated {
        promotionCategory {
          id
          name
          iconUrl
          active
        }
      }
      ... on PromotionCategoryNotFoundError {
        message
      }
    }
  }
`;

export const DELETE_PROMOTION = gql`
  mutation deletePromotion($promotionId: String!) {
    deletePromotion(input: { promotionId: $promotionId }) {
      __typename
      ... on PromotionDeleted {
        promotion {
          id
          title
        }
      }
      ... on PromotionNotFoundError {
        message
      }
    }
  }
`;

export const UPDATE_PROMOTION = gql`
  mutation updatePromotion(
    $promotionId: ID!
    $description: String
    $highlights: [String!]
    $active: Boolean
    $featured: Boolean
    $expiresAt: DateTime!
    $imageUrl: String
    $bannerUrl: String
    $title: String
  ) {
    updatePromotion(
      input: {
        promotionId: $promotionId
        description: $description
        highlights: $highlights
        active: $active
        featured: $featured
        expiresAt: $expiresAt
        imageUrl: $imageUrl
        bannerUrl: $bannerUrl
        title: $title
      }
    ) {
      __typename
      ... on PromotionUpdated {
        promotion {
          id
          title
          description
          highlights
        }
      }
      ... on PromotionNotFoundError {
        message
      }
    }
  }
`;

export const ACTIVATE_USER_ACCOUNT = gql`
  mutation activateUserAccount($userId: ID!) {
    activateUserAccount(input: { userId: $userId }) {
      __typename
      ... on UserUpdated {
        user {
          id
          name
        }
      }
      ... on UserNotFoundError {
        message
      }
    }
  }
`;

export const DEACTIVATE_USER_ACCOUNT = gql`
  mutation deactivateUserAccount($userId: ID!) {
    deactivateUserAccount(input: { userId: $userId }) {
      __typename
      ... on UserUpdated {
        user {
          id
          name
        }
      }
      ... on UserNotFoundError {
        message
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($id: ID!, $firstName: String, $lastName: String) {
    updateUser(input: { id: $id, firstName: $firstName, lastName: $lastName }) {
      __typename
      ... on UserUpdated {
        user {
          id
          name
          firstName
          lastName
        }
      }
      ... on UserNotFoundError {
        message
      }
    }
  }
`;

export const CHANGE_USER_PASSWORD = gql`
  mutation changeUserPassword($oldPassword: String!, $newPassword: String!) {
    changeUserPassword(
      input: { oldPassword: $oldPassword, newPassword: $newPassword }
    ) {
      __typename
      ... on PasswordChanged {
        success
      }
      ... on RecentPasswordReusedError {
        message
      }
      ... on PasswordMismatchError {
        message
      }
      ... on UserNotFoundError {
        message
      }
    }
  }
`;

export const UPDATE_USER_AVATAR = gql`
  mutation updateUserAvatar(
    $filename: String!
    $contentMd5: String!
    $contentType: String!
    $userId: ID
  ) {
    updateUserAvatar(
      input: {
        filename: $filename
        contentMd5: $contentMd5
        contentType: $contentType
        userId: $userId
      }
    ) {
      __typename
      ... on UserAvatarUpdated {
        presignedUrl {
          path
          presignedUrl
          expiresIn
          method
          publicUrl
        }
      }
      ... on UserNotFoundError {
        message
      }
    }
  }
`;

export const REQUEST_PASSWORD_RESET_OTP = gql`
  mutation requestPasswordResetOtp($login: String!) {
    requestPasswordResetOtp(input: { login: $login }) {
      __typename
      ... on PasswordResetRequest {
        otpSession {
          token
          expiresAt
          method
        }
      }
      ... on UserNotFoundError {
        message
      }
    }
  }
`;

export const VERIFY_PASSWORD_RESET_REQUEST_OTP = gql`
  mutation verifyPasswordResetRequestOtp($otpCode: String!, $token: String!) {
    verifyPasswordResetRequestOtp(input: { otpCode: $otpCode, token: $token }) {
      __typename
      ... on PasswordResetRequestVerification {
        sessionId
        expiresAt
      }
      ... on OtpCodeInvalidError {
        message
      }
      ... on ExpiredOtpSessionError {
        message
      }
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation resetPassword($sessionId: String!, $password: String!) {
    resetPassword(input: { sessionId: $sessionId, password: $password }) {
      __typename
      ... on PasswordResetSuccess {
        success
      }
      ... on PasswordResetSessionExpiredError {
        message
      }
      ... on RecentPasswordReusedError {
        message
      }
      ... on UserNotFoundError {
        message
      }
    }
  }
`;

export const CREATE_OR_UPDATE_PRODUCT_CATEGORY_EDUCATION = gql`
  mutation CreateOrUpdateProductCategoryEducation($input: CreateEducationInput!) {
    createOrUpdateProductCategoryEducation(input: $input) {
      __typename
      ... on ProductCategoryEducationCreated{
        productCategoryEducation{
          id
          content
          language
          createdAt
          updatedAt
          status
        }
      }
      ... on ProductCategoryNotFoundError{
        message
      }
    }
  }
`;


export const UPDATE_BLOCK_STATE_OF_EDUCATION = gql`
  mutation updatedBlockStateOfEducation($productCategoryId: ID!, $blocked: Boolean!) {
    updatedBlockStateOfEducation(input: {
      productCategoryId: $productCategoryId
      blocked: $blocked
    })
  }
`;
