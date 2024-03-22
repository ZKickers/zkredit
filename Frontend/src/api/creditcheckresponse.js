export const verifyTransaction = async (transactionId, accepted ,token) => {
    const url = `${BACKEND_URL}/verifyTx`;
    const data = {
      txId: transactionId,
      accepted: accepted
    };
  
    const response = await fetch(url, {
      method: "GET", 
      headers: { Authorization: `${token}` },
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
  