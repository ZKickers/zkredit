import axiosInstance from "./axios";
import { showSnackbar } from '../features/snackbar/snackbarSlice';
import { showSuccessSnackbar } from '../features/snackbar/successSnackbarSlice';
import { useDispatch } from "react-redux";
const useClientRequest = () => {
  const url = '/ClientRequest/generate-proof';
  const dispatch = useDispatch();
  const clientRequest = async (data) => {
    const response = await axiosInstance.post(
      url, 
      data
    ).then(()=>{
      dispatch(showSuccessSnackbar('Data Sent successfully'));
    }).catch((error) => {
      dispatch(showSnackbar(error.response.data));
     
    });
    
    return response;
  };

  return clientRequest;
};

export default useClientRequest;
