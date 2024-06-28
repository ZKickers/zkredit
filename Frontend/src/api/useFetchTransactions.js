import axiosInstance from "./axios";
import { useDispatch } from "react-redux";
import { showSnackbar } from '../features/snackbar/snackbarSlice';
import { showSuccessSnackbar } from '../features/snackbar/successSnackbarSlice';
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
      transactionsReceived = creditorTxRecieved;
      transactionsFailed = creditorTxFailed;
    } else if (type === "client") {
      transactionsLoading = clientTxLoading;
      transactionsReceived = clientTxRecieved;
      transactionsFailed = clientTxFailed;
    } else {
      dispatch(showSnackbar(DOMPurify.sanitize(error.message)));
    }

    dispatch(transactionsLoading());

    try {
      const response = await axiosInstance.get(url.replace(":type", type), {
        params: { clientId: accountId },
      });

      const sanitizedResp = DOMPurify.sanitize(response.data);

      if (response.status !== 200) {
        dispatch(showSnackbar(sanitizedResp));
      }

      dispatch(transactionsReceived(response.data));
    } catch (error) {
      const sanitizedResp = DOMPurify.sanitize(error.message);
      dispatch(showSnackbar(sanitizedResp));
      dispatch(transactionsFailed(sanitizedResp));
    }
  };

  return fetchTransactions;
};

export default useFetchTransactions;
