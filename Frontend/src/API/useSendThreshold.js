import axiosInstance from "./axios";
import { useDispatch } from "react-redux";
import { updateTransactionStatus } from "../redux/creditorTransactionSlice";

const useSendThreshold = () => {
  const url = "/Creditor/trigger-threshold";
  const dispatch = useDispatch();

  const sendThreshold = async (threshold, txId) => {
    const data = { threshold, txId };

    const response = await axiosInstance.post(url, data).catch((error) => {
      console.log(error.response.data);
      throw new Error(
        `Encountered an error while setting the threshold associated with tx ID ${txId}`
      );
    });
    if (response.status !== 200) {
      throw new Error(`Error: ${response.data}`);
    }
    // dispatch the update
    dispatch(
      updateTransactionStatus({
        id: txId,
        status: response.data.status,
      })
    );
  };
  return { sendThreshold };
};

export default useSendThreshold;
