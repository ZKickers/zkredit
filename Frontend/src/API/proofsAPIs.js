import axiosInstance from "./axios";

export const getProof = async (txId) => {
  const url = `/getProof/${txId}`;

  const response = await axiosInstance.get(url).catch((error) => {
    console.log(error);
    throw new Error(
      `Encountered an error while fetching the proof associated with tx ID ${txId}`
    );
  });

  return response.data.proof;
};

export const validateProof = async (transactionId, isAccepted ) => {
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
