import Route from "components/atoms/navigation/Route";
import { NavigationProvider } from "contexts/NavigationContext";
import LandingPage from "pages/landing-page/LandingPage";
import DashboardPage from "pages/dashboard-page/DashboardPage";
import ProofsPage from "pages/proofs-page/ProofsPage";

export default function App() {
  return (
    <NavigationProvider>
      <Route routePath={"/landing"}>
        <LandingPage />
      </Route>
      <Route routePath={"/dashboard"}>
        <DashboardPage />
      </Route>
      <Route routePath={"/proofs"}>
        <ProofsPage />
      </Route>
    </NavigationProvider> 
  );
}