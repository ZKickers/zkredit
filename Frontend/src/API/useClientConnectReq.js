import axiosInstance from "./axios";
import { showSnackbar } from '../features/snackbar/snackbarSlice';
import { showSuccessSnackbar } from '../features/snackbar/successSnackbarSlice';
const useClientConnectReq = () => {
  const url = '/ClientRequest/issue-transaction';

  const ClientConnectReq = async (data) => {
    const response = await axiosInstance.post(
      url, 
      data
    ).catch((error) => {
      // TODO add snakebar
      dispatch(showSnackbar(error.message));
      throw new Error(error.message);
    });
    dispatch(showSuccessSnackbar('Transaction issued successfully'));
    return response;
  };

  return ClientConnectReq;
};

export default useClientConnectReq;
