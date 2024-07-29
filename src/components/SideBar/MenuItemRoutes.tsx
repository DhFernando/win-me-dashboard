export const menuItems = [
  {
    name: "Dashboard",
    exact: true,
    to: "/",
    iconClassName: "bi bi-cast",
    route_key: "dashboard",
    privilege: ["SUPER_ADMIN", "ADMIN", "USER"],
  },
  {
    name: "Client Management",
    exact: true,
    to: "/client-management",
    iconClassName: "bi bi-people",
    route_key: "client-management",
    privilege: ["SUPER_ADMIN", "ADMIN"],
  },

  {
    name: "Category Management",
    exact: true,
    to: "/category-management",
    iconClassName: "bi bi-handbag",
    route_key: "category-management",
    privilege: ["SUPER_ADMIN", "ADMIN"],
  },

  {
    name: "Product Management",
    exact: true,
    to: "/product-management",
    iconClassName: "bi bi-kanban",
    route_key: "product-management",
    privilege: ["USER"],
  },

  {
    name: "Branch Management",
    exact: true,
    to: "/branch-management",
    iconClassName: "bi bi-collection",
    route_key: "branch-management",
    privilege: ["USER"],
  },

  {
    name: "Unit Management",
    exact: true,
    to: "/unit-management",
    iconClassName: "bi bi-clipboard",
    route_key: "unit-management",
    privilege: ["USER"],
  },

  {
    name: "Ticket Management",
    exact: true,
    to: "/ticket-management",
    iconClassName: "bi bi-journal-bookmark",
    route_key: "ticket-management",
    privilege: ["SUPER_ADMIN", "ADMIN", "USER"],
  },

  {
    name: "User Management",
    exact: true,
    to: "/user-management",
    iconClassName: "bi bi-person",
    route_key: "user-management",
    privilege: ["SUPER_ADMIN", "ADMIN"],
  },

  {
    name: "Promotion Management",
    exact: true,
    to: "/promotion-management",
    iconClassName: "bi bi-megaphone",
    route_key: "promotion-management",
    privilege: ["SUPER_ADMIN", "ADMIN", "USER"],
    subMenus: [
      {
        name: "Promotion Category",
        exact: true,
        route_key: "promotion-category",
        to: "/promotion-management/category",
        privilege: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },

  {
    name: "Reports",
    exact: true,
    to: "/reports",
    iconClassName: "bi bi-clipboard-data",
    route_key: "reports",
    privilege: ["SUPER_ADMIN", "ADMIN", "USER"],
  },

  {
    name: "Settings",
    exact: true,
    to: "/settings",
    iconClassName: "bi bi-gear",
    route_key: "settings",
    privilege: ["SUPER_ADMIN", "ADMIN", "USER"],
  },

  {
    name: "Help",
    exact: true,
    to: "/help",
    iconClassName: "bi bi-shield-check",
    route_key: "help",
    privilege: ["SUPER_ADMIN", "ADMIN", "USER"],
  },
];
