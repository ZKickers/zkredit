import axiosInstance from "./axios";

const useClientRequest = () => {
  const url = '/ClientRequest/generate-proof';

  const clientRequest = async (data) => {
    const response = await axiosInstance.post(
      url, 
      data
    ).catch((error) => {
      throw new Error(error.message);
      // TODO add snakebar
    });
    return response;
    // TODO add snakebar with response.data.message
    // TODO add the response.data.transaction to the redux store 
  };

  return clientRequest;
};

export default useClientRequest;
