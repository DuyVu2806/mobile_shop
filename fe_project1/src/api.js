import axios from 'axios';
import store from './store';
import router from './router';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // URL của API của bạn
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 || error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Gọi hàm làm mới token ở đây nếu bạn có cơ chế refresh token
      // Ví dụ:
      // const newToken = await store.dispatch('refreshToken');
      // apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      // originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

      // Nếu không có refresh token, chuyển hướng đến trang đăng nhập
      store.commit('SET_IS_LOGGED_CUS_IN', false);
      store.commit('SET_CURRENT_CUS', null);
      localStorage.removeItem('isLoggedCusIn');
      localStorage.removeItem('currentCus');
      router.push("/");

      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default apiClient;