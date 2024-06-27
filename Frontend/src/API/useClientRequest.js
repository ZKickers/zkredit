import axiosInstance from "./axios";
import { useDispatch } from "react-redux";
import { showSnackbar } from '../features/snackbar/snackbarSlice';
import { showSuccessSnackbar } from '../features/snackbar/successSnackbarSlice';
import { updateTransactionStatus } from "../redux/clientTransactionSlice";

const useClientRequest = () => {
  const url = "/ClientRequest/generate-proof";
  const dispatch = useDispatch();

  const clientRequest = async (data) => {
    let error = false;
    const response = await axiosInstance.post(url, data).catch((error) => {
      dispatch(showSnackbar(error.response.data));
      error = true;
    });
    if(!error){
      dispatch(showSuccessSnackbar('Data Sent successfully'));
      dispatch(
        updateTransactionStatus({
          id: response.data.transaction._id,
          status: response.data.transaction.status,
        })
      );
      return response.data;
    }

  };

  return clientRequest;
};

export default useClientRequest;
