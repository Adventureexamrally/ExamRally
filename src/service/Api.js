import axios from 'axios';

const Api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  // withCredentials: true,
});

export default Api;
