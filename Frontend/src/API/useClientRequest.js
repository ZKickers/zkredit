import axiosInstance from "./axios";
import { useDispatch } from "react-redux";
import { updateTransactionStatus } from "../redux/clientTransactionSlice";

const useClientRequest = () => {
  const url = "/ClientRequest/generate-proof";
  const dispatch = useDispatch();

  const clientRequest = async (data) => {
    const response = await axiosInstance.post(url, data).catch((error) => {
      throw new Error(error.message);
      // TODO add snakebar
    });
    // TODO add snakebar with response.data.message
    // dispatch the update
    dispatch(
      updateTransactionStatus({
        id: response.data.transaction._id,
        status: response.data.transaction.status,
      })
    );
    return response.data;
  };

  return clientRequest;
};

export default useClientRequest;
