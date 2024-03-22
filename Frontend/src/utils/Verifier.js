import { initialize } from "zokrates-js";
import useGetVK from "api/use-get-vk";
import { useEffect, useState } from "react";

const Verifier = (proof) => {
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

  initialize().then((zokratesProvider) => {
    const isVerified = zokratesProvider.verify(vk, proof);
    return isVerified
  });
};

export default Verifier;
