import axiosInstance from "./axios";
import useGetUser from "./useGetUser";
import { showSnackbar } from '../features/snackbar/snackbarSlice';
import { showSuccessSnackbar } from '../features/snackbar/successSnackbarSlice';
import { useDispatch } from "react-redux";
const useLogin = () => {
  const getUser = useGetUser();
  const url = '/auth/login';
  const dispatch = useDispatch();
  const login = async (user) => {
    const response = await axiosInstance.post(
        url, 
        user
      ).catch((error) => {
        if (error.response.status === 401) {
          dispatch(showSnackbar("Invalid credentials"));
        }
        dispatch(showSnackbar(error.response.data));
        throw error;
      });
      console.log(response);
    
      if (response.status !== 200) {
        dispatch(showSnackbar(response.data));
      }
      const token = response.data["token"];
      
      sessionStorage.setItem("token", token);
      localStorage.setItem("token", token);
      
      getUser();
  };

  return login;
};

export default useLogin;
