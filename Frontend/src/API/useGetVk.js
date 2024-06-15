import axiosInstance from "./axios";

const useGetVK = (token) => {
  const url = "/verification-key";
  const getVK = async () => {
    try {
      const response = await axiosInstance.get(url);
      return response.data; 
    } catch (error) {
      console.error("Error fetching the verification key:", error);
      throw error; 
    }
  };
  return getVK;
}

  
  export default useGetVK;
  