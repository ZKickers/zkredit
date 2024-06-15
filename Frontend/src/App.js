import Route from "components/atoms/navigation/Route";
import { NavigationProvider } from "contexts/NavigationContext";
import LandingPage from "pages/landing-page/LandingPage";
import DashboardPage from "pages/dashboard-page/DashboardPage";
import ProofsPage from "pages/proofs-page/ProofsPage";
import useGetUser from "api/useGetUser";
import { useEffect } from "react";
import { useSelector } from "react-redux";


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
      <Route routePath={"/proofs"}>
      {(user.isLoggedIn && <ProofsPage />) || <LandingPage />}
      </Route>
    </NavigationProvider>
  );
}
