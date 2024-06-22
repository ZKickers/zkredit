import axiosInstance from "./axios";
import { showSnackbar } from '../features/snackbar/snackbarSlice';
import { showSuccessSnackbar } from '../features/snackbar/successSnackbarSlice';
import { useDispatch } from "react-redux";
const useGetVK = (token) => {
  const url = "/verification-key";
  const dispatch = useDispatch();
  const getVK = async () => {
    try {
      const response = await axiosInstance.get(url);
      return response.data; 
    } catch (error) {
      dispatch(showSnackbar(error.message));
      console.error("Error fetching the verification key:", error);
      throw error; 
    }
  };
  return getVK;
}

  
  export default useGetVK;
  