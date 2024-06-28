import axiosInstance from "./axios";
import { showSnackbar } from "../features/snackbar/snackbarSlice";
import { useDispatch } from "react-redux";
import { vkLoading, vkReceived, vkFailed } from "../redux/vkSlice";

const useGetVK = () => {
  const url = "/verification-key";
  const dispatch = useDispatch();

  const getVK = async () => {
    dispatch(vkLoading());
    const response = await axiosInstance.get(url).catch((error) => {
      dispatch(showSnackbar(error.message));
      vkFailed(error.message);
    });
    if (response.status !== 200) {
      dispatch(showSnackbar(response.data));
      console.error("Error fetching the verification key:", response.data);
      vkFailed(response.data);
    }else{
      console.log(response.data);
      dispatch(vkReceived(response.data));
      return response.data;
    }
  };
  return getVK;
};

export default useGetVK;
