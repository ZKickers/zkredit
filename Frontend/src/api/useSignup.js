import axiosInstance from "./axios";
import useLogin from "./useLogin";
import { showSnackbar } from "../features/snackbar/snackbarSlice";
import { showSuccessSnackbar } from "../features/snackbar/successSnackbarSlice";
import { useDispatch } from "react-redux";
import DOMPurify from "dompurify";

const useSignUp = () => {
  const login = useLogin();
  const url = "/auth/signup";
  const dispatch = useDispatch();
  const signup = async (user) => {
    const { email, username, password, loginToken, signUpToken } = user;

    const response = await axiosInstance.post(url, {email, username, password, recaptchaToken: loginToken}).catch((error) => {
      console.log(error);
      dispatch(showSnackbar(DOMPurify.sanitize(error.response.data)));
    });
    console.log(response);

    if (response.status !== 201) {
      const sanitizedResp = response.data;
      dispatch(showSnackbar(sanitizedResp));
      throw new Error(sanitizedResp);
    }

    login({
      username,
      password,
      recaptchaToken: signUpToken,
    });
  };

  return signup;
};

export default useSignUp;
