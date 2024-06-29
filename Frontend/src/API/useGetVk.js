import axiosInstance from "./axios";
import { showSnackbar } from "../features/snackbar/snackbarSlice";
import { useDispatch } from "react-redux";
import { vkLoading, vkReceived, vkFailed } from "../redux/vkSlice";
import DOMPurify from 'dompurify';

const useGetVK = () => {
  const url = "/verification-key";
  const dispatch = useDispatch();

  const getVK = async () => {
    dispatch(vkLoading());
    const response = await axiosInstance.get(url).catch((error) => {
      const sanitizedError = DOMPurify.sanitize(error.message);
      dispatch(showSnackbar(sanitizedError));
      vkFailed(sanitizedError);
    });
    const sanitizedResp = DOMPurify.sanitize(response.data);
    if (response.status !== 200) {
      dispatch(showSnackbar(sanitizedResp));
      vkFailed(sanitizedResp);
    }else{
      dispatch(vkReceived(response.data));
      return response.data;
    }
  };
  return getVK;
};

export default useGetVK;
