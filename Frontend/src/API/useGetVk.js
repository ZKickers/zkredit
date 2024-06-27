import axiosInstance from "./axios";
import { useDispatch } from "react-redux";
import { vkLoading, vkReceived, vkFailed } from "../redux/vkSlice";

const useGetVK = () => {
  const url = "/verification-key";
  const dispatch = useDispatch();

  const getVK = async () => {
    dispatch(vkLoading());
    const response = await axiosInstance.get(url).catch((error) => {
      vkFailed(error.response.data);
      console.error(
        "Error fetching the verification key:",
        error.response.data
      );
    });
    if (response.status !== 200) {
      console.error("Error fetching the verification key:", response.data);
      vkFailed(response.data);
    }
    console.log(response.data);
    dispatch(vkReceived(response.data));
    return response.data;
  };
  return getVK;
};

export default useGetVK;
