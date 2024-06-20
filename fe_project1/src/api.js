import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // URL của API của bạn
});

export default apiClient;