import NavigationContext from "contexts/NavigationContext";
import { useContext } from "react";

export default function useNavigation() {
  return useContext(NavigationContext);
}
