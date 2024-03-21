import Route from "components/atoms/navigation/Route";
import { NavigationProvider } from "contexts/NavigationContext";
import LandingPage from "pages/landing-page/LandingPage";
import DashboardPage from "pages/dashboard-page/DashboardPage";
import ProofsPage from "pages/proofs-page/ProofsPage";
import AuthContext from "store/auth-context";
import { useContext, useEffect } from "react";

export default function App() {
  const auth = useContext(AuthContext);

  return (
    <NavigationProvider>
      <Route routePath={"/landing"}>
        <LandingPage />
      </Route>
      <Route routePath={"/"}>
        {(auth.isLoggedIn && <DashboardPage />) || <LandingPage />}
      </Route>
      <Route routePath={"/dashboard"}>
        {(auth.isLoggedIn && <DashboardPage />) || <LandingPage />}
      </Route>
      <Route routePath={"/proofs"}>
        <ProofsPage />
      </Route>
    </NavigationProvider>
  );
}
