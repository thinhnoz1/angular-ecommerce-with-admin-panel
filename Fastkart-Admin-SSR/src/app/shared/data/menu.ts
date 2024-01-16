import { Menu } from "../interface/menu.interface";

export const menu: Menu[] = [
    {
      id: 1,
      title: "dashboard",
      path: "/dashboard",
      active: false,
      icon: "ri-home-line",
      type: "sub",
      level: 1
    },
    {
      id: 2,
      title: "users",
      active: false,
      icon: "ri-contacts-line",
      type: "sub",
      level: 1,
      acl_permission: ["user.index", "user.create", "role.index"],
      children: [
        {
          parent_id: 2,
          title: "add user",
          path: "/user/create",
          type: "link",
          level: 2,
          permission: ["user.index", "user.create"],
        },
        {
          parent_id: 2,
          title: "all users",
          path: "/user",
          type: "link",
          level: 2,
          permission: ["user.index"],
        },
        {
          parent_id: 2,
          title: "role",
          path: "/role",
          type: "link",
          level: 2,
          permission: ["role.index"],
        }
      ],
    },
    {
      id: 3,
      title: "products",
      active: false,
      icon: "ri-store-3-line",
      type: "sub",
      level: 1,
      acl_permission: ["product.index", "product.create", "attribute.index"],
      children: [
        {
          parent_id: 3,
          title: "add product",
          path: "/product/create",
          type: "link",
          level: 2,
          permission: ["product.index", "product.create"]
        },
        {
          parent_id: 3,
          title: "all products",
          path: "/product",
          type: "link",
          badgeType: 'badge bg-warning text-dark ml-3', 
          badgeValue: 0,
          level: 2,
          permission: ["product.index"]
        },
        {
          parent_id: 3,
          title: "categories",
          path: "/category",
          type: "link",
          level: 2,
          permission: ["category.index"]
        },
        {
          parent_id: 3,
          title: "tags",
          path: "/tag",
          type: "link",
          level: 2,
          permission: ["tag.index"]
        }
      ],
    },
    {
      id: 5,
      title: "orders",
      active: false,
      icon: "ri-list-unordered",
      type: "sub",
      level: 1,
      acl_permission: ["order.index", "order.create"],
      children: [
        {
          parent_id: 5,
          title: "all orders",
          path: "/order",
          type: "link",
          level: 2,
          permission: ["order.index"]
        },
        {
          parent_id: 5,
          title: "create order",
          path: "/order/create",
          type: "link",
          level: 2,
          permission: ["order.index", "order.create"]
        }
      ],
    },
    {
      id: 6,
      title: "media",
      path: "/media",
      active: false,
      icon: "ri-image-line",
      type: "sub",
      level: 1,
      permission: ["attachment.index"]
    },
    {
      id: 9,
      title: "taxes",
      path: "/tax",
      active: false,
      icon: "ri-percent-line",
      type: "sub",
      level: 1,
      permission: ["tax.index"]
    },
    {
      id: 11,
      title: "coupons",
      path: "/coupon",
      active: false,
      icon: "ri-coupon-2-line",
      type: "sub",
      level: 1,
      permission: ["coupon.index"]
    },
    {
      id: 15,
      title: "refund",
      path: "/refund",
      active: false,
      icon: "ri-exchange-dollar-line",
      type: "sub",
      badgeType: 'badge bg-danger ml-3', 
      badgeValue: 0,
      level: 1,
      permission: ["refund.index"]
    },
    {
      id: 18,
      title: "store front",
      active: false,
      icon: "ri-window-line",
      type: "sub",
      level: 1,
      acl_permission: ["theme.index", "theme_option.index"],
      children: [
        {
          parent_id: 18,
          title: "theme options",
          path: "/theme-option",
          type: "link",
          level: 2,
          permission: ["theme_option.index"]
        }
      ]
    },
    {
      id: 19,
      title: "settings",
      path: "/setting",
      active: false,
      icon: "ri-settings-3-line",
      type: "sub",
      level: 1,
      permission: ["setting.index"]
    }
];
