import axiosInstance from "./axios";
import useLogin from "./useLogin";

const useSignUp = () => {
  const login = useLogin();
  const url = "/auth/signup";

  const signup = async (user) => {
    const response = await axiosInstance.post(url, user).catch((error) => {
      throw new Error(error.message);
    });
    console.log(response);

    if (response.status !== 201) {
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
