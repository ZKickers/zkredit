import { ZKREDIT_API } from "config";

export const sendThreshold = async (props) => {
  const { token, threshold, txId } = props;
  const url = `${ZKREDIT_API}/Creditor/trigger-threshold`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-type": "application/json",
        Authorization: token },
    body: JSON.stringify({ threshold: threshold, txId: txId }),
  }).catch((err) => {
    throw new Error("Error connecting to the server!");
  });

  if (response.status === 200) {
    return response;
  }
  throw new Error(response.statusText);
};