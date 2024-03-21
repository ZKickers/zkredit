const baseUrl = process.env.REACT_APP_BACKEND_URL;

export const sendThreshold = async (props) => {
  const { token, threshold, txId } = props;
  const url = `${baseUrl}/Creditor/trigger-threshold`;
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: token },
    body: JSON.stringify({ threshold: threshold, txId: txId }),
  }).catch((err) => {
    throw new Error("Error connecting to the server!");
  });

  if (response.status === 200) {
    return response;
  }

  throw new Error(response.statusText);
};