import axiosInstance from "./axios";
import { showSnackbar } from "../features/snackbar/snackbarSlice";
import { showSuccessSnackbar } from "../features/snackbar/successSnackbarSlice";
import { useDispatch } from "react-redux";

export const useGetProof = () => {
  const dispatch = useDispatch();
  const getProof = async (txId) => {
    const url = `/getProof/${txId}`;

    const response = await axiosInstance.get(url).catch((error) => {
      console.log(error);
      dispatch(showSnackbar(error.message));
    });

    dispatch(showSuccessSnackbar("Threshold sent Successfully"));
    return response.data.proof;
  };
  return getProof;
};

export const validateProof = async (transactionId, isAccepted) => {
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
