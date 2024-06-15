import { useState } from "react";
import axiosInstance from "./axios";

export const useSendThreshold = (token) => {
  const url = "/Creditor/trigger-threshold";
  const [proof, setProof] = useState(null);
  const [error, setError] = useState(null);

  const sendThreshold = async (threshold, txId) => {
    try {
      const response = await axiosInstance.post(url, {
        threshold: threshold,
        txId: txId,
      });
      if (response.status === 200) {
        console.log(response);
        setProof(response.data);
      } else {
        setError("Problem connecting with the server!");
      }
    } catch (error) {
      setError(error.message);
    }
  };
  return { proof, error, sendThreshold };
};

export const sendProofStatus = async (transactionId, isAccepted, token) => {
  const url = "/verifyTx";
  const data = {
    txId: transactionId,
    accepted: isAccepted,
  };

  const response = await axiosInstance.post(url, data).catch((error) => {
    console.log(error);
    throw new Error("Problem connecting with the server!");
  });

  if (response.status !== 200) {
    const message = response.data;
    throw new Error(message);
  }

  return response.data;
};
