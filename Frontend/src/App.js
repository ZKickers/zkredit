import LandingPage from "pages/landing-page/LandingPage";
import { AuthContextProvider } from "store/auth-context";

export default function App() {
  return (
    <AuthContextProvider>
      <LandingPage />
    </AuthContextProvider>
  );
}
