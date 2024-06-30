import axiosInstance from "./axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { showSnackbar } from '../features/snackbar/snackbarSlice';
import { showSuccessSnackbar } from '../features/snackbar/successSnackbarSlice';
import DOMPurify from 'dompurify';


const useGetUser = () => {
  const dispatch = useDispatch();
  const url = "/auth";

  const getUser = async () => {
    const response = await axiosInstance.get(url).catch((error) => {
      dispatch(showSnackbar(DOMPurify.sanitize(error)));
    });
    if (response.status !== 200) {
      if (response.data)
        dispatch(showSnackbar(DOMPurify.sanitize(response.data)));
      else
        dispatch(showSnackbar("An error occured."));
    }

    dispatch(
      setUser({
        username: DOMPurify.sanitize(response.data.username),
        accountId: DOMPurify.sanitize(sanitizedResp.accountId),
        createdAt: DOMPurify.sanitize(sanitizedResp.createdAt),
        isLoggedIn: true,
      })
    );
  };
  return getUser;
};

export default useGetUser;
