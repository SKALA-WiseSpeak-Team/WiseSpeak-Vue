import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: 600000, // 10분
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
