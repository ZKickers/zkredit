import { useState } from "react";
import axiosInstance from "./axios";
import { showSnackbar } from '../features/snackbar/snackbarSlice';
import { showSuccessSnackbar } from '../features/snackbar/successSnackbarSlice';
import { useDispatch } from "react-redux";
export const useSendThreshold = () => {
  const url = "/Creditor/trigger-threshold";
  const [proof, setProof] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const sendThreshold = async (threshold, txId) => {
    try {
      const response = await axiosInstance.post(url, {
        threshold: threshold,
        txId: txId,
      });
      if (response.status === 200) {
        console.log(response);
        dispatch(showSuccessSnackbar("Threshold sent Successfully"));
        setProof(response.data);
      } else {
        dispatch(showSnackbar(error.message));
        setError(error.message);
      }
    } catch (error) {
      dispatch(showSnackbar(error.message));
      setError(error.message);
    }
  };
  return { proof, error, sendThreshold };
};

export const sendProofStatus = async (transactionId, isAccepted) => {
  const url = "/verifyTx";
  const dispatch = useDispatch();
  const data = {
    txId: transactionId,
    accepted: isAccepted,
  };

  const response = await axiosInstance.post(url, data).catch((error) => {
    console.log(error);
    dispatch(showSnackbar(error.message));
  });

  if (response.status !== 200) {
    const message = response.data;
    dispatch(showSnackbar(message));
    
  }
  dispatch(showSuccessSnackbar("Proof Sent Successfully"));
  return response.data;
};
