import axiosInstance from "./axios";
import { useDispatch } from "react-redux";
import { showSnackbar } from '../features/snackbar/snackbarSlice';
import { showSuccessSnackbar } from '../features/snackbar/successSnackbarSlice';
import {
  transactionsLoading as creditorTxLoading,
  transactionsReceived as creditorTxReceived,
  transactionsFailed as creditorTxFailed,
} from "../redux/creditorTransactionSlice";
import {
  transactionsLoading as clientTxLoading,
  transactionsReceived as clientTxReceived,
  transactionsFailed as clientTxFailed,
} from "../redux/clientTransactionSlice";
import DOMPurify from 'dompurify';

const useFetchTransactions = () => {
  const dispatch = useDispatch();
  const url = "/getTX/:type";

  const fetchTransactions = async ({ accountId, type }) => {
    let transactionsLoading;
    let transactionsReceived;
    let transactionsFailed;

    if (type === "creditor") {
      transactionsLoading = creditorTxLoading;
      transactionsReceived = creditorTxReceived;
      transactionsFailed = creditorTxFailed;
    } else if (type === "client") {
      transactionsLoading = clientTxLoading;
      transactionsReceived = clientTxReceived;
      transactionsFailed = clientTxFailed;
    } else {
      dispatch(showSnackbar(DOMPurify.sanitize("Invalid transaction type")));
      return;
    }

    dispatch(transactionsLoading());

    try {
      const response = await axiosInstance.get(url.replace(":type", type), {
        params: { clientId: accountId },
        withCredentials: true // Ensure cookies are sent with requests
      });

      if (!response || response.status !== 200) {
        const sanitizedResp = DOMPurify.sanitize(response?.data || 'Unknown error');
        dispatch(showSnackbar(sanitizedResp));
        return;
      }

      const sanitizedResp = DOMPurify.sanitize(response.data);
      dispatch(transactionsReceived(sanitizedResp));
    } catch (error) {
      const sanitizedResp = DOMPurify.sanitize(error.message);
      dispatch(showSnackbar(sanitizedResp));
      dispatch(transactionsFailed(sanitizedResp));
    }
  };

  return fetchTransactions;
};

export default useFetchTransactions;
