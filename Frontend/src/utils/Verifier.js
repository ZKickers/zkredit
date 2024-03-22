import { initialize } from "zokrates-js";
import useGetVK from "api/use-get-vk";
import { useEffect, useState } from "react";

const Verifier = () => {
  const [proof, setProof] = useState(null);
  const [vk, setVk] = useState(null);
  const getVk = useGetVK(setVk);

  useEffect(() => {
    getVk();
  }, []);

  useEffect(() => {
    if (vk) {
      console.log(vk);
    }
  }, [vk]);

  // initialize().then((zokratesProvider) => {
  //   // or verify off-chain
  //   const isVerified = zokratesProvider.verify(keypair.vk, proof);
  // });
};

export default Verifier;
