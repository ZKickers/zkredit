import axiosInstance from "./axios";
import { showSnackbar } from "../features/snackbar/snackbarSlice";
import { showSuccessSnackbar } from "../features/snackbar/successSnackbarSlice";
import { addTransaction } from "../redux/clientTransactionSlice";
import { useDispatch } from "react-redux";

const useClientConnectReq = () => {
  const url = "/ClientRequest/issue-transaction";
  const dispatch = useDispatch();

  const ClientConnectReq = async (data) => {
    try {
      const response = await axiosInstance.post(url, data);
      dispatch(showSuccessSnackbar("Transaction issued successfully"));
      dispatch(addTransaction(response.data.transaction));
      return response.data;
    } catch (error) {
      dispatch(
        showSnackbar(error.response?.data?.error || "An error occurred")
      );
      throw error;
    }
  };

  return ClientConnectReq;
};

export default useClientConnectReq;
