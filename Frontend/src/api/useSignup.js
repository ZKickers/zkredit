import axiosInstance from "./axios";
import useLogin from "./useLogin";
import { showSnackbar } from '../features/snackbar/snackbarSlice';
import { showSuccessSnackbar } from '../features/snackbar/successSnackbarSlice';
import { useDispatch } from "react-redux";
import DOMPurify from 'dompurify';


const useSignUp = () => {
  const login = useLogin();
  const url = "/auth/signup";
  const dispatch = useDispatch();
  const signup = async (user) => {
    const response = await axiosInstance.post(url, user).catch((error) => {
      console.log(error);
      dispatch(showSnackbar(DOMPurify.sanitize(error.response.data)));
    });

    if (response.status !== 201) {
      const sanitizedResp = response.data;
      dispatch(showSnackbar(sanitizedResp));
      throw new Error(sanitizedResp);
    }

    login({
      username: user.username,
      password: user.password,
    });
  };

  return signup;
};

export default useSignUp;
