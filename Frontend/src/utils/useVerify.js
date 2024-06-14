import { initialize } from "zokrates-js";
import useGetVK from "api/use-get-vk";
import { useState } from "react";

const useVerify = (token) => {

  const [isVerified, setIsVerified] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);


  const verify = async (proof) => {
    const getVK = useGetVK(token);
    const vk = await getVK();

    initialize().then((zokratesProvider) => {
      try {
        const isVerified = zokratesProvider.verify(vk, proof);
        console.log(isVerified);
        setIsVerified(isVerified);
        if(isVerified){
          console.log(proof["inputs"][2]);
          let result = parseInt(proof["inputs"][2].replace(/^0x/i, ''), 16);
          setVerificationResult(result===1);
        }
        console.log(proof["inputs"][2]);
      } catch (error) {
        console.error("Error verifying the proof:", error);
        setError("Error verifying the proof: " + error);
      }
    }).catch((error) => {
      console.error("Error initializing the zokrates provider:", error);
      setError("Error initializing the zokrates provider:" + error);
    });
  };

  return { verify, isVerified, verificationResult, error };

};

export default useVerify;
