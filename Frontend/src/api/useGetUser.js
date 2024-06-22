import axiosInstance from "./axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { showSnackbar } from '../features/snackbar/snackbarSlice';
import { showSuccessSnackbar } from '../features/snackbar/successSnackbarSlice';
const useGetUser = () => {
  const dispatch = useDispatch();
  const url = "/auth";

  const getUser = async () => {
    const response = await axiosInstance.get(url).catch((error) => {
      throw new Error(error.message);
    });

    if (response.status !== 200) {
      dispatch(showSnackbar(error.message));
      throw new Error(response.status);
    }
    dispatch(
      setUser({
        username: response.data.username,
        accountId: response.data.accountId,
        createdAt: response.data.createdAt,
        isLoggedIn: true,
      })
    );
  };
  return getUser;
};

export default useGetUser;
