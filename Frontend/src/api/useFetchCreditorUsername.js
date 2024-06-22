import axiosInstance from "./axios";
import { useState } from "react";
import { showSnackbar } from '../features/snackbar/snackbarSlice';
import { showSuccessSnackbar } from '../features/snackbar/successSnackbarSlice';
import { useDispatch } from "react-redux";
const useFetchCreditorUsername = () => {
  const url = "/getTX/CreditorUsername";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const fetchCreditorUsername = async ({ txId, creditorId }) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(url, {
        params: { txId, creditorId },
      });

      if (response.status !== 200) {
        dispatch(showSnackbar(response.data));
      }

      console.log(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      dispatch(showSnackbar(error.message));
      setError(error.message);
      console.error(error.message);
    }
  };

  return { fetchCreditorUsername, loading, error };
};

export default useFetchCreditorUsername;
