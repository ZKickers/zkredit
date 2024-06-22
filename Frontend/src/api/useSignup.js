import axiosInstance from "./axios";
import useLogin from "./useLogin";
import { showSnackbar } from '../features/snackbar/snackbarSlice';
import { showSuccessSnackbar } from '../features/snackbar/successSnackbarSlice';
const useSignUp = () => {
  const login = useLogin();
  const url = "/auth/signup";

  const signup = async (user) => {
    const response = await axiosInstance.post(url, user).catch((error) => {
      dispatch(showSnackbar(error.message));
      throw new Error(error.message);
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
