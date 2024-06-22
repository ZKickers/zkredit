import axiosInstance from "./axios";
import { addTransaction } from "../redux/clientTransactionSlice";
import { useDispatch } from "react-redux";

const useClientConnectReq = () => {
  const url = "/ClientRequest/issue-transaction";
  const dispatch = useDispatch();

  const ClientConnectReq = async (data) => {
    const response = await axiosInstance.post(url, data).catch((error) => {
      throw new Error(error.message);
      // TODO add snakebar
    });
    // TODO add snakebar of response.data.message
    console.log(response.data.message);
    console.log(response.data.transaction);
    dispatch(addTransaction(response.data.transaction));

    return response.data;
  };

  return ClientConnectReq;
};

export default useClientConnectReq;
