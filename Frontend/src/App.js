import Route from "components/atoms/navigation/Route";
import { NavigationProvider } from "contexts/NavigationContext";
import LandingPage from "pages/landing-page/LandingPage";
import DashboardPage from "pages/dashboard-page/DashboardPage";
import ProofsPage from "pages/proofs-page/ProofsPage";
import useGetUser from "API/useGetUser";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Snackbar from './components/atoms/Snackbar/Snackbar';
import SuccessSnackbar from './components/atoms/Snackbar/SuccessSnackbar';
export default function App() {
  const getUser = useGetUser();
  const user = useSelector((state) => state.user);
  console.log(user);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      sessionStorage.setItem("token", localStorage.getItem("token"));
      getUser();
    }
  }, []);

  return (
    <NavigationProvider>
      <Route routePath={"/landing"}>
        <LandingPage />
      </Route>
      <Route routePath={"/"}>
        {(user.isLoggedIn && <DashboardPage />) || <LandingPage />}
      </Route>
      <Route routePath={"/dashboard"}>
        {(user.isLoggedIn && <DashboardPage />) || <LandingPage />}
      </Route>
      <Route routePath={"/received"}>
        {(user.isLoggedIn && <ProofsPage isCreditor={true} />) || <LandingPage />}
      </Route>
      <Route routePath={"/sent"}>
        {(user.isLoggedIn && <ProofsPage isCreditor={false} />) || <LandingPage />}
      </Route>
      <Snackbar />
      <SuccessSnackbar />
    </NavigationProvider>
  );
}
