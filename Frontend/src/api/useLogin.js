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
<<<<<<< HEAD
  const login = async (user) => {
    const response = await axiosInstance.post(
        url, 
        user
      ).catch((error) => {
        dispatch(showSnackbar(DOMPurify.sanitize(error.response.data)));
        throw error;
      });    
      if (response.status !== 200) {
        if (response.data)
          dispatch(showSnackbar(DOMPurify.sanitize(response.data)));
        else
          dispatch(showSnackbar("An error occured."));
=======

  const login = async (data) => {
    try {
      const response = await axiosInstance.post(url, data);

      if (!response || response.status !== 200) {
        const sanitizedResp = DOMPurify.sanitize(
          response?.data?.message || "Unknown error"
        );
        dispatch(showSnackbar(sanitizedResp));
        return;
>>>>>>> 3a2698de602a527b63d9a62834725b03e6714b18
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
