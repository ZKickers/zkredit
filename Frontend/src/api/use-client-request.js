import axiosInstance from "./axios";

const useClientRequest = () => {
  const url = '/ClientRequest';

  const clientRequest = async (data) => {
    const response = await axiosInstance.post(
      url, 
      data
    ).catch((error) => {
      throw new Error(error.message);
      // TODO add snakebar
    });
    return response;
  };

  return clientRequest;
};

export default useClientRequest;
