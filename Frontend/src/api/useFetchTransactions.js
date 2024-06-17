import { useDispatch } from "react-redux";
import axiosInstance from "./axios";
import {
  transactionsLoading as creditorTxLoading,
  transactionsReceived as creditorTxRecieved,
  transactionsFailed as creditorTxFailed,
} from "../redux/creditorTransactionSlice";
import {
  transactionsLoading as clientTxLoading,
  transactionsReceived as clientTxRecieved,
  transactionsFailed as clientTxFailed,
} from "../redux/clientTransactionSlice";

const useFetchTransactions = () => {
  const dispatch = useDispatch();
  const url = "/getTX/:type";

  const fetchTransactions = async ({ accountId, type }) => {
    let transactionsLoading;
    let transactionsReceived;
    let transactionsFailed;

    if (type === "creditor") {
      transactionsLoading = creditorTxLoading;
      transactionsReceived = creditorTxRecieved;
      transactionsFailed = creditorTxFailed;
    } else if (type === "client") {
      transactionsLoading = clientTxLoading;
      transactionsReceived = clientTxRecieved;
      transactionsFailed = clientTxFailed;
    } else {
      throw new Error(`Error : there is no type ${type} in fetchTransactions`);
    }

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
