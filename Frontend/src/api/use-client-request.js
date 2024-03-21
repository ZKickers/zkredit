import axios from "axios";
import { useContext } from "react";
import AuthContext from "store/auth-context";
import { BACKEND_URL } from "config";

const useClientRequest = () => {
  const auth = useContext(AuthContext);
  const url = `${BACKEND_URL}/ClientRequest`;

  const clientRequest = async (data) => {
    data = { ...data, username: auth.username };
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `${auth.token}`,
      },
    });
    return response;
  };

  return clientRequest;
};

export default useClientRequest;
