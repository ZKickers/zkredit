import axiosInstance from "./axios";
import { useDispatch } from "react-redux";
import { showSnackbar } from '../features/snackbar/snackbarSlice';
import { showSuccessSnackbar } from '../features/snackbar/successSnackbarSlice';
import { updateTransactionStatus } from "../redux/clientTransactionSlice";
import DOMPurify from "dompurify";

const useClientRequest = () => {
  const url = "/ClientRequest/generate-proof";
  const dispatch = useDispatch();

  const clientRequest = async (data) => {
    try {
      const response = await axiosInstance.post(url, data)
      dispatch(showSuccessSnackbar('Data Sent successfully'));
      dispatch(
        updateTransactionStatus({
          id: DOMPurify.sanitize(response.data.transaction._id),
          status: DOMPurify.sanitize(response.data.transaction.status),
        })
      );
      return response.data;
    }
    catch(error){
      console.log(error.response.data)
      dispatch(showSnackbar(error.response.data));
    };
  };

  return clientRequest;
};

export default useClientRequest;
