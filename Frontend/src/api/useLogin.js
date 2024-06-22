import axiosInstance from "./axios";
import useGetUser from "./useGetUser";
import { showSnackbar } from '../features/snackbar/snackbarSlice';
import { showSuccessSnackbar } from '../features/snackbar/successSnackbarSlice';
const useLogin = () => {
  const getUser = useGetUser();
  const url = '/auth/login';

  const login = async (user) => {
    const response = await axiosInstance.post(
        url, 
        user
      ).catch((error) => {
        if (response.status === 401) {
          dispatch(showSnackbar("Invalid credentials"));
          throw new Error("Invalid credentials");
        }
        dispatch(showSnackbar(error.message));
        throw new Error(error.message);
      });
      console.log(response);
    
      if (response.status !== 200) {
        dispatch(showSnackbar(response.data));
        throw new Error(response.data);
      }
      const token = response.data["token"];
      
      sessionStorage.setItem("token", token);
      localStorage.setItem("token", token);
      
      getUser();
  };

  return login;
};

export default useLogin;
