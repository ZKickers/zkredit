import axios from "axios";
import { useContext } from "react";
import AuthContext from "store/auth-context";
import { BACKEND_URL } from "config";

const useGetVK = (setVk) => {
    const auth = useContext(AuthContext);
    const url = `${BACKEND_URL}/verification-key`;
  
    const vkReq = async () => {
      const response = await axios.get(url, {
        headers: {
          Authorization: `${auth.token}`,
        },
      });
      setVk(response.data);
    };
  
    return vkReq;
  };
  
  export default useGetVK;
  