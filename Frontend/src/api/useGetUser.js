import axiosInstance from "./axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { showSnackbar } from '../features/snackbar/snackbarSlice';
import DOMPurify from 'dompurify';

const useGetUser = () => {
  const dispatch = useDispatch();
  const url = "/auth";

  const getUser = async () => {
<<<<<<< HEAD
    const response = await axiosInstance.get(url).catch((error) => {
      dispatch(showSnackbar(DOMPurify.sanitize(error)));
    });
    if (response.status !== 200) {
      if (response.data)
        dispatch(showSnackbar(DOMPurify.sanitize(response.data)));
      else
        dispatch(showSnackbar("An error occured."));
    }
=======
    try {
      const response = await axiosInstance.get(url);
>>>>>>> 3a2698de602a527b63d9a62834725b03e6714b18

      // Handle cases where response or response.data is undefined
      if (!response || !response.data) {
        dispatch(showSnackbar("Error fetching user data"));
        return;
      }

      const sanitizedData = {
        username: DOMPurify.sanitize(response.data.username),
        accountId: DOMPurify.sanitize(response.data.accountId),
        createdAt: DOMPurify.sanitize(response.data.createdAt),
        isLoggedIn: true,
      };

      dispatch(setUser(sanitizedData));
    } catch (error) {
      // Handle network errors or server errors
      dispatch(showSnackbar(DOMPurify.sanitize(error.message)));
    }
  };

  return getUser;
};

export default useGetUser;
