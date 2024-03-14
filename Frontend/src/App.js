import { Stack } from "@mui/material";
import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <Stack
      sx={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100vh",
        backgroundColor: "gray",
      }}
    >
      <LandingPage />
    </Stack>
  );
}
