import axiosInstance from "./axios";
import useGetUser from "./useGetUser";
import { showSnackbar } from "../features/snackbar/snackbarSlice";
import { showSuccessSnackbar } from "../features/snackbar/successSnackbarSlice";
import { useDispatch } from "react-redux";
import DOMPurify from "dompurify";

const useLogin = () => {
  const getUser = useGetUser();
  const url = "/auth/login";
  const dispatch = useDispatch();

  const login = async (data) => {
    try {
      const response = await axiosInstance.post(url, data);

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
