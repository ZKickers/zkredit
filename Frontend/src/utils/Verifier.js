import { initialize } from "zokrates-js";
import getVK from "api/use-get-vk";

const Verifier = async (proof,setVerification) => {
  console.log("Entered Verification func");
  const vk = await getVK();
  console.log(vk)
  setVerification( new Promise((resolve, reject) => {
    initialize().then((zokratesProvider) => {
      try {
        const isVerified = zokratesProvider.verify(vk, proof);
        console.log(isVerified)
        console.log(proof['inputs'][2])
        resolve(isVerified && proof['inputs'][2]);
      } catch (error) {
        reject(error);
      }
    });
  })
);
};

export default Verifier;