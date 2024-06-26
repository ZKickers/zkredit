import axios from "axios";
import { BACKEND_URL } from "config";

const useGetVK = (token) => {
  const url = `${BACKEND_URL}/verification-key`;
  const getVK = async () => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `${token}`, 
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
  