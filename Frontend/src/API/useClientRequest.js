import axiosInstance from "./axios";
import { showSnackbar } from '../features/snackbar/snackbarSlice';
import { showSuccessSnackbar } from '../features/snackbar/successSnackbarSlice';
const useClientRequest = () => {
  const url = '/ClientRequest/generate-proof';

  const clientRequest = async (data) => {
    const response = await axiosInstance.post(
      url, 
      data
    ).catch((error) => {
      dispatch(showSnackbar(error.message));
      throw new Error(error.message);
    });
    dispatch(showSuccessSnackbar('Transaction issued successfully'));
    return response;
  };

  return clientRequest;
};

export default useClientRequest;
