import { BACKEND_URL } from "config";

export const sendThreshold = async (props) => {
  const { token, threshold, txId } = props;
  const url = `${BACKEND_URL}/Creditor/trigger-threshold`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-type": "application/json", Authorization: token },
    body: JSON.stringify({ threshold: threshold, txId: txId }),
  }).catch((err) => {
    throw new Error("Error connecting to the server!");
  });
  const proof = await response.json()
  if (response.status === 200) {
    return proof;
  }
  
  throw new Error(response.statusText);
};

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
