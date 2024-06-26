import { useDispatch } from "react-redux";
import { removeUser } from "../redux/userSlice";
import useNavigation from "./use-navigation";

const useLogout = () => {
    const { navigate, path } = useNavigation();
    const dispatch = useDispatch();

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    dispatch(removeUser());

    navigate("/");
  };
  return logout;
};

export default useLogout;
