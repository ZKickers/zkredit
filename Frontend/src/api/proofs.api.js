import { BACKEND_URL } from "config";
import axios from "axios";
import { useState } from "react";


export const useSendThreshold = (token) => {
  const url = `${BACKEND_URL}/Creditor/trigger-threshold`;
  const [proof, setProof] = useState(null);
  const [error, setError] = useState(null);

  const sendThreshold = async (threshold, txId) => {
  
    try {
      const response = await axios.post(
        url,
        { threshold: threshold, txId: txId },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response)
        setProof(response.data);
      }else{
        setError("Problem connecting with the server!");
      }
    }catch (error) {
      setError(error.message);  
    }
  };
  return { proof, error, sendThreshold };
}

  

export const sendProofStatus = async (transactionId, isAccepted, token) => {
  const url = `${BACKEND_URL}/verifyTx`;
  const data = {
    txId: transactionId,
    accepted: isAccepted,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify(data),
  }).catch((error) => {
    console.log(error);
    throw new Error("Problem connecting with the server!");
  });

  if (response.status !== 200) {
    const message = await response.text();
    throw new Error(message);
  }

  return response.json();
};
