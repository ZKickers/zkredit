import axiosInstance from "./axios";
import { useState } from "react";

const useFetchCreditorUsername = () => {
  const url = "/getTX/CreditorUsername";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCreditorUsername = async ({ txId, creditorId }) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(url, {
        params: { txId, creditorId },
      });

      if (response.status !== 200) {
        throw new Error(`Error: ${response.data}`);
      }

      console.log(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      setError(error.message);
      console.error(error.message);
    }
  };

  return { fetchCreditorUsername, loading, error };
};

export default useFetchCreditorUsername;
