import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/admin/DashboardView.vue";
import IndexView from "../views/admin/IndexView.vue";
import ProductView from "../views/admin/product/ProductsView.vue";
import LoginView from "../views/admin/auth/LoginView.vue";

const routes = [
  {
    path: "/admin",
    component: IndexView,
    meta: {
      navbar: "admin",
      requiresAuth: true,
    },
    children: [
      {
        path: "/admin",
        name: "dashboard",
        component: DashboardView,
        meta: {
          title: "Dashboard",
        },
      },
      {
        path: "/admin/product",
        name: "product",
        component: ProductView,
        meta: {
          title: "Product",
        },
      },
      {
        path: "/admin/product/add",
        name: "add product",
        component: () => import("../views/admin/product/AddProductView.vue"),
        meta: {
          title: "Product",
        },
      },
      {
        path: "/admin/product/edit/:id",
        name: "edit product",
        component: () => import("../views/admin/product/EditProductView.vue"),
        meta: {
          title: "Product",
        },
      },
      {
        path: "/admin/category",
        name: "category view",
        component: () => import("../views/admin/category/CategoryView.vue"),
        meta: {
          title: "Category",
        },
      },
      {
        path: "/admin/chat",
        name: "chat view",
        component: () => import("../views/admin/chat/ChatView.vue"),
      },
      {
        path: "/admin/order",
        name: "order admin view",
        component: () => import("../views/admin/order/OrderView.vue"),
      },
      {
        path: "/admin/order/:order_code",
        name: "order detail admin view",
        component: () => import("../views/admin/order/OrderDetailView.vue"),
      },
      {
        path: "/admin/rating",
        name: "rating view",
        component: () => import("../views/admin/rating/RatingView.vue"),
      },
    ],
  },
  {
    path: "/",
    name: "client view",
    component: () => import("../views/customer/IndexView.vue"),
    children: [
      {
        path: "/",
        name: "homepage view",
        component: () => import("../views/customer/HomePageView.vue"),
      },
      {
        path: "/products",
        name: "product view",
        component: () => import("../views/customer/ProductView.vue"),
      },
      {
        path: "/product/:slug",
        name: "Product Detail View",
        component: () => import("../views/customer/ProductDetailView.vue"),
      },
      {
        path: "/cart",
        name: "cart view",
        component: () => import("../views/customer/CartView.vue"),
        meta: {
          navbar: "customer",
          requiresAuth: true,
        },
      },
      {
        path: "/checkout",
        name: "checkout view",
        component: () => import("../views/customer/CheckoutView.vue"),
        meta: {
          navbar: "customer",
          requiresAuth: true,
        },
        beforeEnter: async (to, from, next) => {
          const token = localStorage.getItem("tokenCus");
          await store.dispatch("fetchCart", token);
          if (store.getters.isCartEmpty) {
            next({ name: "cart view" });
          } else {
            next();
          }
        },
      },
      {
        path: "/blog",
        name: "blog view",
        component: () => import("../views/customer/BlogView.vue"),
        meta: {
          title: "Blog",
        },
      },
      {
        path: "/about",
        name: "about view",
        component: () => import("../views/customer/AboutView.vue"),
        meta: {
          title: "About",
        },
      },
      {
        path: "/order",
        name: "order view",
        component: () => import("../views/customer/OrdersView.vue"),
      },
      {
        path: "/profile",
        name: "profile view",
        component: () => import("../views/customer/ProfileView.vue"),
      },
    ],
  },
  {
    path: "/admin/login",
    name: "login Admin",
    meta: {
      title: "Sign In Admin",
    },
    component: LoginView,
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/customer/auth/LoginView.vue"),
    meta: {
      title: "Sign In",
    },
  },
];

import axios from "axios";
import store from "@/store";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (to.meta.navbar === "admin") {
      const token = localStorage.getItem("tokenAdmin");
      if (!token && !store.getters.isLoggedIn) {
        next("/admin/login");
      } else {
        try {
          await axios.get("http://localhost:3000/api/admin/auth/verify-token", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          next();
        } catch (error) {
          localStorage.removeItem("tokenAdmin");
          next("/admin/login");
        }
      }
    } else if (to.meta.navbar === "customer") {
      const tokenCus = localStorage.getItem("tokenCus");
      if (!tokenCus && !store.getters.isLoggedCusIn) {
        next("/login");
      } else {
        try {
          await axios.get("http://localhost:3000/api/auth/verify-token", {
            headers: {
              Authorization: `Bearer ${tokenCus}`,
            },
          });
          next();
        } catch (error) {
          localStorage.removeItem("tokenCus");
          next("/login");
        }
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

router.afterEach((to) => {
  document.title = to.meta.title || "My App";
});

export default router;
