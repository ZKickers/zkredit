import { BACKEND_URL } from "config";

export const sendProofStatus = async (transactionId, isAccepted ,token) => {
    const url = `${BACKEND_URL}/verifyTx`;
    const data = {
      txId: transactionId,
      accepted: isAccepted
    };
  
    const response = await fetch(url, {
      method: "POST", 
      headers: { 
        "Content-type": "application/json",
        Authorization: `${token}` },
      body: JSON.stringify(data)
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
  