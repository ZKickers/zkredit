import axiosInstance from "./axios";
import { useDispatch } from "react-redux";
import { updateTransactionStatus } from "../redux/creditorTransactionSlice";
import DOMPurify from "dompurify";
import { showSnackbar } from "features/snackbar/snackbarSlice";

const useSendThreshold = () => {
  const url = "/Creditor/trigger-threshold";
  const dispatch = useDispatch();

  const sendThreshold = async (threshold, txId) => {
    const data = { threshold, txId };
    try {
      const response = await axiosInstance.post(url, data)
      dispatch(
        updateTransactionStatus({
          id: DOMPurify.sanitize(txId),
          status: DOMPurify.sanitize(response.data.status),
        })
      )
    }catch(error) {
      console.log(error)
      const serializedResp = DOMPurify.sanitize(error.response.data);
      dispatch(showSnackbar(serializedResp));
    }
  };
  return { sendThreshold };
};

export default useSendThreshold;
