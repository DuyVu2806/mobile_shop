import apiClient from "@/api";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { createStore } from "vuex";

export default createStore({
  state: {
    drawer: true,
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
    currentAdmin: JSON.parse(localStorage.getItem("currentAdmin")) || null,
    isLoggedCusIn: localStorage.getItem("isLoggedCusIn") === "true",
    currentCus: JSON.parse(localStorage.getItem("currentCus")) || null,
    cart: [],
    cartCount: 0,
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    isLoggedInLocal: () => localStorage.getItem("isLoggedIn") === "true",
    isLoggedCusIn: (state) => state.isLoggedCusIn,
    isLoggedCusInLocal: () => localStorage.getItem("isLoggedCusIn") === "true",
    cartItemCount: (state) => state.cartCount,
    cartItems: (state) => state.cart,
    isCartEmpty: (state) => state.cart.length === 0,
  },
  mutations: {
    toggleDrawer(state) {
      state.drawer = !state.drawer;
    },
    SET_IS_LOGGED_IN(state, value) {
      state.isLoggedIn = value;
      localStorage.setItem("isLoggedIn", value);
    },
    SET_CURRENT_ADMIN(state, admin) {
      state.currentAdmin = admin;
    },
    SET_IS_LOGGED_CUS_IN(state, value) {
      state.isLoggedCusIn = value;
      localStorage.setItem("isLoggedCusIn", value);
    },
    SET_CURRENT_CUS(state, customer) {
      state.currentCus = customer;
    },
    setCartItemCount(state, count) {
      state.cartCount = count;
    },
    setCart(state, cartItems) {
      state.cart = cartItems;
    },
    updateCartItem(state, updatedItem) {
      const index = state.cart.findIndex(
        (item) => item._id === updatedItem._id
      );
      if (index !== -1) {
        state.cart.splice(index, 1, updatedItem);
      }
    },
    removeFromCart(state, { cartId, cusId }) {
      const index = state.cart.findIndex(
        (item) => item._id === cartId && item.customer_id === cusId
      );
      if (index !== -1) {
        state.cart.splice(index, 1);
        state.cartCount--;
      }
    },
    CLEAR_CART(state) {
      state.cart = [];
    },
    resetCartItemCount(state) {
      state.cartCount = 0;
    },
  },
  actions: {
    toggleDrawer({ commit }) {
      commit("toggleDrawer");
    },
    setCurrentAdmin({ commit }, admin) {
      localStorage.setItem("currentAdmin", JSON.stringify(admin));
      commit("SET_CURRENT_ADMIN", admin);
    },
    setCurrentCus({ commit }, customer) {
      localStorage.setItem("currentCus", JSON.stringify(customer));
      commit("SET_CURRENT_CUS", customer);
    },
    async fetchCartItemCount({ commit }, token) {
      if (token) {
        const response = await apiClient.get("/cart/number-cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        commit("setCartItemCount", response.data);
      } else {
        commit("setCartItemCount", 0);
      }
    },
    async fetchCart({ commit }, token) {
      try {
        const response = await apiClient.get("/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const cartItems = response.data;
        commit("setCart", cartItems);
      } catch (error) {
        console.log(error);
      }
    },
    async addToCartAction(
      { dispatch },
      { token, productId, variantId, quantity }
    ) {
      try {
        const response = await apiClient.post(
          "/cart/add-to-cart",
          {
            product_id: productId,
            variant_id: variantId,
            quantity: quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          position: "top-end",
          icon: "success",
          text: `${response.data.message}`,
          showConfirmButton: false,
          toast: true,
          timer: 1500,
          timerProgressBar: true,
          width: "auto",
          padding: "0.7em",
        });
        await dispatch("fetchCartItemCount", token);
      } catch (error) {
        if (error.response) {
          const status = error.response.status;
          switch (status) {
            case 400:
            case 403:
            case 401:
              Swal.fire({
                position: "top-end",
                icon: "warning",
                text: `${error.response.data.message}`,
                showConfirmButton: false,
                toast: true,
                timer: 1500,
                timerProgressBar: true,
                width: "auto",
                padding: "0.7em",
              });
              break;
            default:
              console.log(error);
              break;
          }
        }
      }
    },
    async updateCartItemQuantity({ commit }, { token, cartId, quantity }) {
      try {
        const response = await apiClient.patch(
          `/cart/update-quantity/${cartId}`,
          { quantity: quantity },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        commit("updateCartItem", response.data);
      } catch (error) {
        console.log(error);
      }
    },
    async removeFromCart({ commit }, { token, cartId }) {
      try {
        const cusId = jwtDecode(JSON.stringify(token)).id;
        await apiClient.delete(`/cart/delete/${cartId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        commit("removeFromCart", { cartId, cusId });
        Swal.fire({
          position: "top-end",
          icon: "success",
          text: "Product Removed From Cart",
          showConfirmButton: false,
          toast: true,
          timer: 1500,
          timerProgressBar: true,
          width: "auto",
          padding: "0.7em",
        });
      } catch (error) {
        console.log(error);
      }
    },
    async clearCart({ commit }, token) {
      try {
        await apiClient.delete("/cart/delete-all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        commit("CLEAR_CART");
        commit("resetCartItemCount")
      } catch (error) {
        console.log(error);
      }
    },
  },
  modules: {},
});
