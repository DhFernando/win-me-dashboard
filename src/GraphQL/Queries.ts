import { gql } from "@apollo/client";

export const ME = gql`
  query {
    me {
      id
      email
      phone
      firstName
      lastName
      name
      avatarUrl
      createdAt
      updatedAt
      role
      companyBranchRoles {
        role
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
          logoUrl
          bannerUrl
          subscriptionExpiresAt
          status
          country {
            id
            name
          }
          category {
            id
            name
          }
        }
        companyBranch {
          id
          name
          phone
          address
          hotlines
          active
        }
        companyProfile {
          designation
          phone
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const COMPANY_CATEGORIES = gql`
  query {
    companyCategories {
      id
      name
    }
  }
`;

export const COUNTRY_LIST = gql`
  query {
    countries {
      id
      name
      countryCode
    }
  }
`;

export const COMPANIES = gql`
  query companies(
    $page: Int
    $pageSize: Int
    $order: Ordering
    $sortBy: CompanySortBy
    $query: String
  ) {
    companies(
      page: $page
      pageSize: $pageSize
      order: $order
      sortBy: $sortBy
      filter: { query: $query }
    ) {
      nodes {
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
        logoUrl
        bannerUrl
        createdAt
        subscriptionExpiresAt
        status
        active
        country {
          id
          name
          countryCode
        }
        category {
          id
          name
        }
        products {
          nodes {
            id
            name
          }
          totalCount
        }
      }
      totalCount
    }
  }
`;

export const COMPANY = gql`
  query company($id: String!) {
    company(companyId: $id) {
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
      socialLinks {
        provider
        link
      }
      logoUrl
      bannerUrl
      createdAt
      subscriptionExpiresAt
      status
      country {
        id
        name
      }
      category {
        id
        name
      }
      products {
        nodes {
          id
          name
        }
      }
    }
  }
`;

export const COMPANY_INVITATION_BY_TOKEN = gql`
  query companyInvitationByToken($token: String!) {
    companyInvitationByToken(token: $token) {
      ... on UserInvitation {
        companyRoleName
        companyName
        companyBranchName
        invitedUser {
          firstName
          lastName
          name
          email
          passwordSetupRequired
        }
      }
      ... on CompanyInvitationExpiredError {
        message
      }
    }
  }
`;

export const PRODUCT_CATEGORIES = gql`
  query productCategories($parentId: String!) {
    productCategories(parentId: $parentId) {
      id
      name
      description
      iconUrl
      coverUrl
      active
      status
      canHaveProducts
      products(page: 0, pageSize: 10, order: ASC, sortBy: CREATED_AT) {
        nodes {
          id
          name
          description
          keyFeatures
          iconUrl
          coverUrl
          createdAt
          updatedAt
          status
          company {
            id
            name
            name
            username
            email
          }
        }
      }
      productCategories {
        id
        name
        description
        iconUrl
        coverUrl
        active
        status
        canHaveProducts
        products {
          nodes {
            id
            name
          }
        }
        productCategories {
          id
          name
          description
          iconUrl
          coverUrl
          active
          status
          canHaveProducts
          products {
            nodes {
              id
              name
            }
          }
          productCategories {
            id
            name
            productCategories {
              id
              name
              productCategories {
                id
                name
                productCategories {
                  id
                  name
                  productCategories {
                    id
                    name
                    productCategories {
                      id
                      name
                      productCategories {
                        id
                        name
                        productCategories {
                          id
                          name
                          productCategories {
                            id
                            name
                            productCategories {
                              id
                              name
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const PRODUCT_CATEGORY = gql`
  query productCategory($id: String!) {
    productCategory(id: $id) {
      id
      name
      description
      iconUrl
      coverUrl
      active
      status
      slug
      canHaveProducts
      products(page: 0, pageSize: 10, order: ASC, sortBy: NAME) {
        nodes {
          id
          name
          description
          keyFeatures
          status
          iconUrl
          coverUrl
          createdAt
          updatedAt
          company {
            id
            name
            name
            username
            email
          }
        }
      }
      productCategories {
        id
        name
        description
        iconUrl
        coverUrl
        active
        status
        canHaveProducts
        products {
          nodes {
            id
            name
          }
        }
        productCategories {
          id
          name
          description
          iconUrl
          status
        }
      }
      productRequestForm {
        requestFormUiSchema
        requestFormSchema
        responseFormUiSchema
        responseFormSchema
        status
        createdAt
        updatedAt
        maxCompanyResponseDuration
        maxUserResponseDuration
        responseFields
        requestFields
        __typename
      }
    }
  }
`;

export const PRODUCTS = gql`
  query products(
    $page: Int
    $pageSize: Int
    $order: Ordering
    $sortBy: ProductSortBy
    $companyId: ID
    $productCategoryId: ID
    $query: String
  ) {
    products(
      page: $page
      pageSize: $pageSize
      order: $order
      sortBy: $sortBy
      filter: {
        companyId: $companyId
        productCategoryId: $productCategoryId
        query: $query
      }
    ) {
      nodes {
        id
        name
        description
        keyFeatures
        status
        iconUrl
        coverUrl
        createdAt
        updatedAt
        company {
          id
          name
          username
          email
        }
        category {
          id
          name
          description
          iconUrl
          coverUrl
          active
          canHaveProducts
        }
      }
      totalCount
    }
  }
`;

export const PRODUCT = gql`
  query product($id: String!) {
    product(id: $id) {
      id
      name
      description
      keyFeatures
      status
      iconUrl
      coverUrl
      createdAt
      updatedAt
      company {
        id
        name
      }
      category {
        id
        name
        description
        iconUrl
        coverUrl
        active
        canHaveProducts
      }
    }
  }
`;

export const TICKETS = gql`
  query tickets(
    $companyId: ID
    $status: TicketStatus
    $page: Int
    $pageSize: Int
    $order: Ordering
    $sortBy: TicketSortBy
    $productCategoryId: ID
    $productRequestId: ID
    $fromDate: DateTime
    $toDate: DateTime
  ) {
    tickets(
      page: $page
      pageSize: $pageSize
      order: $order
      sortBy: $sortBy
      filter: {
        productCategoryId: $productCategoryId
        productRequestId: $productRequestId
        companyId: $companyId
        status: $status
        fromDate: $fromDate
        toDate: $toDate
        query: null
      }
    ) {
      nodes {
        id
        status
        referenceId
        createdAt
        updatedAt
        customerContactedAt
        repliedTime
        confirmedTime
        completedTime
        company {
          id
          name
          username
          email
        }
        requestedProducts {
          id
          name
          description
          keyFeatures
          status
          category {
            id
            name
            description
          }
          company {
            id
            name
            username
            email
          }
        }
        replies {
          id
          replyData
          product {
            id
            name
            description
            keyFeatures
            status
            iconUrl
            coverUrl
          }
        }
        repliedBranch {
          id
          name
          phone
          address
          hotlines
          active
        }
        productRequest {
          id
          requestData
          referenceId
          maxUserResponseTimeExpiresAt
          maxCompanyResponseTimeExpiresAt
          createdAt
          updatedAt
          productCategory {
            id
            name
          }
          user {
            id
            email
            phone
            firstName
            lastName
          }
          tickets(page: 0, pageSize: 10, order: DESC, sortBy: CREATED_AT) {
            nodes {
              id
              status
              referenceId
              createdAt
              updatedAt
            }
          }
          status
        }
        productCategory {
          id
          name
          description
        }
        userDetails {
          email
          firstName
          lastName
          phone
          name
          avatarUrl
        }
      }
      totalCount
    }
  }
`;

export const TICKET = gql`
  query ticket($id: String!) {
    ticket(id: $id) {
      id
      status
      referenceId
      createdAt
      updatedAt
      customerContactedAt
      confirmedProductId
      company {
        id
        name
        username
        email
      }
      requestedProducts {
        id
        name
        description
        keyFeatures
        status
        category {
          id
          name
          description
        }
        company {
          id
          name
          username
          email
        }
      }
      replies {
        id
        replyData
        product {
          id
          name
          description
          keyFeatures
          status
          iconUrl
          coverUrl
        }
      }
      repliedBranch {
        id
        name
        phone
        address
        hotlines
        active
      }
      productRequest {
        id
        requestData
        referenceId
        maxUserResponseTimeExpiresAt
        maxCompanyResponseTimeExpiresAt
        createdAt
        updatedAt
        productCategory {
          id
          name
        }
        user {
          id
          email
          phone
          firstName
          lastName
        }
        tickets(page: 0, pageSize: 10, order: DESC, sortBy: CREATED_AT) {
          nodes {
            id
            status
            referenceId
            createdAt
            updatedAt
          }
        }
        status
      }
      productCategory {
        id
        name
        description
        iconUrl
        coverUrl
        productRequestForm {
          requestFormUiSchema
          requestFormSchema
          responseFormUiSchema
          responseFormSchema
          status
          createdAt
          updatedAt
          maxCompanyResponseDuration
          maxUserResponseDuration
          responseFields
          requestFields
          featuredResponseFields
        }
      }
      userDetails {
        email
        firstName
        lastName
        phone
        name
        avatarUrl
      }
    }
  }
`;

export const ALL_PROMOTIONS = gql`
  query allPromotions(
    $page: Int
    $pageSize: Int
    $order: Ordering
    $sortBy: PromotionSortBy
    $featured: Boolean
    $active: Boolean
    $companyId: ID
    $promotionCategoryId: ID
  ) {
    allPromotions(
      page: $page
      pageSize: $pageSize
      order: $order
      sortBy: $sortBy
      filter: {
        featured: $featured
        active: $active
        companyId: $companyId
        promotionCategoryId: $promotionCategoryId
      }
    ) {
      nodes {
        id
        title
        description
        highlights
        active
        featured
        expiresAt
        imageUrl
        bannerUrl
        company {
          id
          name
          username
          email
        }
        product {
          id
          name
          description
          keyFeatures
          status
          iconUrl
          coverUrl
        }
      }
      totalCount
    }
  }
`;

export const ALL_PROMOTION_CATEGORIES = gql`
  query allPromotionCategories(
    $page: Int
    $pageSize: Int
    $order: Ordering
    $sortBy: PromotionCategorySortBy
    $active: Boolean
  ) {
    allPromotionCategories(
      page: $page
      pageSize: $pageSize
      order: $order
      sortBy: $sortBy
      filter: { active: $active }
    ) {
      nodes {
        id
        name
        iconUrl
        active
      }
      totalCount
    }
  }
`;

export const PROMOTION = gql`
  query promotion($promotionId: ID!) {
    promotion(promotionId: $promotionId) {
      id
      title
      description
      highlights
      active
      featured
      expiresAt
      imageUrl
      bannerUrl
      company {
        id
        name
        username
        email
        logoUrl
      }
      product {
        id
        name
        description
        keyFeatures
        status
        iconUrl
        coverUrl
      }
    }
  }
`;

export const ALL_PROMOTIONS_OF_COMPANY = gql`
  query allPromotionsOfCompany(
    $page: Int
    $pageSize: Int
    $order: Ordering
    $sortBy: PromotionSortBy
    $featured: Boolean
    $active: Boolean
    $companyId: ID!
    $promotionCategoryId: ID
  ) {
    allPromotionsOfCompany(
      page: $page
      pageSize: $pageSize
      order: $order
      sortBy: $sortBy
      companyId: $companyId
      filter: {
        featured: $featured
        active: $active
        promotionCategoryId: $promotionCategoryId
      }
    ) {
      nodes {
        id
        title
        description
        highlights
        active
        featured
        expiresAt
        imageUrl
        bannerUrl
        company {
          id
          name
          username
          email
        }
        product {
          id
          name
          description
          keyFeatures
          status
          iconUrl
          coverUrl
        }
      }
      totalCount
    }
  }
`;

export const ALL_USERS = gql`
  query allUsers(
    $page: Int
    $pageSize: Int
    $order: Ordering
    $sortBy: UserSortBy
    $verified: Boolean
    $role: UserRoles
  ) {
    allUsers(
      page: $page
      pageSize: $pageSize
      order: $order
      sortBy: $sortBy
      filter: { verified: $verified, role: $role }
    ) {
      nodes {
        id
        email
        phone
        firstName
        lastName
        name
        avatarUrl
        createdAt
        updatedAt
        verified
        role
        companyBranchRoles {
          role
          company {
            id
            name
            username
          }
          companyBranch {
            id
            name
            address
            phone
            hotlines
            active
          }
          companyProfile {
            designation
            phone
            createdAt
            updatedAt
          }
        }
      }
      totalCount
    }
  }
`;

export const DASHBOARD = gql`
  query {
    companies(page: 0) {
      totalCount
    }
    products(page: 0) {
      totalCount
    }
    productCategories(parentId: null) {
      id
      name
    }
    tickets(page: 0) {
      totalCount
    }
  }
`;

export const GET_EDUCATION_BY_PRODUCT_CATEGORY_ID = gql`
  query getEducationByProductCategoryId($productCategoryId: String!, $language: String!) {
    getEducationByProductCategoryId(productCategoryId: $productCategoryId, language: $language) {
      id
      content
      language
      updatedAt
      createdAt
      status
    }
  }
`;

export const GET_EDUCATION_STATE_BY_CATEGORY_ID = gql` 
  query getEducationStateByCategoryId($productCategoryId: ID!) {
    getEducationStateByCategoryId(input: { productCategoryId: $productCategoryId }) 
  }
`;
