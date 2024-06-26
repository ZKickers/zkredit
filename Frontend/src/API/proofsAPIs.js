import axiosInstance from "./axios";

// ! An ignored part
/*
export const useSendThreshold = () => {
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
*/

export const sendThreshold = async ({ threshold, txId }) => {
  const url = "/Creditor/trigger-threshold";
  const data = { threshold, txId };

  const response = await axiosInstance.post(url, data).catch((error) => {
    console.log(error);
    throw new Error(
      `Encountered an error while setting the threshold associated with tx ID ${txId}`
    );
  });

  console.log("Attempted a send threshold request. Response:\n", response);

  return response.data; // * May not return any data.
};

export const getProof = async (txId) => {
  const url = `/getProof/${txId}`;

  const response = await axiosInstance.get(url).catch((error) => {
    console.log(error);
    throw new Error(
      `Encountered an error while fetching the proof associated with tx ID ${txId}`
    );
  });

  return response.data;
};

export const validateProof = async ({ transactionId, isAccepted }) => {
  const url = "/verify-proof"; // TODO: DOUBLE CHECK THE API CALL
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
