import axios from "axios";
const baseUrl = process.env.REACT_APP_BACKEND_SERVER;

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

export default axiosInstance;
