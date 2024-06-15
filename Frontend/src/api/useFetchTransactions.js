// src/hooks/useFetchTransactions.js
import { useDispatch } from "react-redux";
import axiosInstance from "./axios";
import {
  transactionsLoading,
  transactionsReceived,
  transactionsFailed,
} from "../redux/transactionSlice";

const useFetchTransactions = () => {
  const dispatch = useDispatch();
  const url = "/getTX/:type";

  const fetchTransactions = async ({ accountId, type }) => {
    dispatch(transactionsLoading());

    try {
      const response = await axiosInstance.get(url.replace(":type", type), {
        params: { clientId: accountId },
      });

      if (response.status !== 200) {
        throw new Error(`Error: ${response.status}`);
      }

      dispatch(transactionsReceived(response.data));
    } catch (error) {
      dispatch(transactionsFailed(error.message));
    }
  };

  return fetchTransactions;
};

export default useFetchTransactions;
