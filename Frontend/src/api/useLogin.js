import axiosInstance from "./axios";
import useGetUser from "./useGetUser";
import { showSnackbar } from '../features/snackbar/snackbarSlice';
import { showSuccessSnackbar } from '../features/snackbar/successSnackbarSlice';
import { useDispatch } from "react-redux";
import DOMPurify from 'dompurify';


const useLogin = () => {
  const getUser = useGetUser();
  const url = '/auth/login';
  const dispatch = useDispatch();
  const login = async (user) => {
    const response = await axiosInstance.post(
        url, 
        user
      ).catch((error) => {
        dispatch(showSnackbar(DOMPurify.sanitize(error.response.data)));
        throw error;
      });    
      const sanitizedResp = DOMPurify.sanitize(response.data)
      if (response.status !== 200) {
        dispatch(showSnackbar(sanitizedResp));
      }
      const token = DOMPurify.sanitize(response.data["token"]);
      
      sessionStorage.setItem("token", token);
      localStorage.setItem("token", token);
      
      getUser();
  };

  return login;
};

export default useLogin;
