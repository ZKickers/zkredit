import axios from "axios";
import { BACKEND_URL } from "config";
import AuthContext from "store/auth-context";
import { useContext } from "react";

const useGetVK = () => {
  const auth = useContext(AuthContext)
  const url = `${BACKEND_URL}/verification-key`;

  const getVK = async () => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `${auth.token}`, 
        },
      });
      return response.data; 
    } catch (error) {
      console.error("Error fetching the verification key:", error);
      throw error; 
    }
  };
  return getVK;
}

  
  export default useGetVK;
  