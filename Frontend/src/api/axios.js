import axios from "axios";
const baseUrl = process.env.REACT_APP_BACKEND_SERVER;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = token;
  }

  const csrfToken = sessionStorage.getItem("csrfToken");
  if (csrfToken) {
    console.log("CSRF Token: ", csrfToken);
    config.headers["X-CSRF-Token"] = csrfToken;
  }

  return config;
});

export default axiosInstance;
