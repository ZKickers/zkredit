import axiosInstance from "./axios";
import useGetUser from "./useGetUser";
import { showSnackbar } from "../features/snackbar/snackbarSlice";
import { showSuccessSnackbar } from "../features/snackbar/successSnackbarSlice";
import { useDispatch } from "react-redux";
import DOMPurify from "dompurify";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_SERVER

const useLogin = () => {
  const getUser = useGetUser();
  const url = "/auth/login";
  const dispatch = useDispatch();

  const login = async (data) => {
    try {
      console.log(data);
      const response = await axiosInstance.post(url, data);

      const respo = await axios.post(`${backendUrl}/auth/login`, data);

      console.log(respo);

      if (!response || response.status !== 200) {
        const sanitizedResp = DOMPurify.sanitize(
          response?.data?.message || "Unknown error"
        );
        dispatch(showSnackbar(sanitizedResp));
        return;
      }
      const token = DOMPurify.sanitize(response.data["token"]);
      sessionStorage.setItem("token", token);
      localStorage.setItem("token", token);

      getUser();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        dispatch(showSnackbar("Invalid credentials"));
      } else {
        const sanitizedResp = DOMPurify.sanitize(
          error.response?.data || error.message
        );
        dispatch(showSnackbar(sanitizedResp));
      }
    }
  };

  return login;
};

export default useLogin;
