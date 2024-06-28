import { useDispatch } from "react-redux";
import { removeUser } from "../redux/userSlice";
import {clearTransactions as clientClearTransactions} from "../redux/clientTransactionSlice";
import {clearTransactions as creditorClearTransactions} from "../redux/creditorTransactionSlice";
import useNavigation from "./use-navigation";

const useLogout = () => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    dispatch(removeUser());
    dispatch(clientClearTransactions());
    dispatch(creditorClearTransactions());

    navigate("/");
  };
  return logout;
};

export default useLogout;
