import axiosInstance from "./axios";
import { showSnackbar } from "../features/snackbar/snackbarSlice";
import { showSuccessSnackbar } from "../features/snackbar/successSnackbarSlice";
import { useDispatch } from "react-redux";
import DOMPurify from "dompurify";

export const useGetProof = () => {
  const dispatch = useDispatch();
  const getProof = async (txId) => {
    const url = `/getProof/${txId}`;
    try {
      const response = await axiosInstance.get(url);
      return response.data.proof;
    } catch (error) {
      dispatch(showSnackbar(DOMPurify.sanitize(error)));
    }
  };
  return getProof;
};


export const validateProof = async (transactionId, isAccepted) => {
  const url = "/verifyTx";
  const data = {
    txId: transactionId,
    accepted: isAccepted,
  };
  const response = await axiosInstance.post(url, data).catch((error) => {
    console.log(error);
  });
  if ( response.status === 200) {
    dispatch(showSnackbar(DOMPurify.sanitize(response.data.message)));
  } else {
    dispatch(showSnackbar(DOMPurify.sanitize(response.data)));
  }
  return response.data;
};
