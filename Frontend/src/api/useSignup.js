import axiosInstance from "./axios";
import useLogin from "./useLogin";
import { showSnackbar } from '../features/snackbar/snackbarSlice';
import { showSuccessSnackbar } from '../features/snackbar/successSnackbarSlice';
import { useDispatch } from "react-redux";
const useSignUp = () => {
  const login = useLogin();
  const url = "/auth/signup";
  const dispatch = useDispatch();
  const signup = async (user) => {
    const response = await axiosInstance.post(url, user).catch((error) => {
      console.log(error);
      dispatch(showSnackbar(error.response.data));
    });
    console.log(response);

    if (response.status !== 201) {
      dispatch(showSnackbar(response.data));
      throw new Error(response.data);
    }

    login({
      username: user.username,
      password: user.password,
    });
  };

  return signup;
};

export default useSignUp;
