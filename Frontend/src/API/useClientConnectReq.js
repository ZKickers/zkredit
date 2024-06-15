import axiosInstance from "./axios";

const useClientConnectReq = () => {
  const url = '/ClientRequest/issue-transaction';

  const ClientConnectReq = async (data) => {
    const response = await axiosInstance.post(
      url, 
      data
    ).catch((error) => {
      throw new Error(error.message);
      // TODO add snakebar
    });
    return response;
  };

  return ClientConnectReq;
};

export default useClientConnectReq;
