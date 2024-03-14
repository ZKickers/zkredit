// src/theme.js
import { createTheme } from "@mui/material/styles";
import "@fontsource/montserrat/";

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, sans-serif",
    fontWeightLight: 400,
    fontWeightRegular: 600,
    fontWeightMedium: 600,
    fontWeightBold: 800,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Set to "none" to disable text transform
          "&:hover": {
            // Add custom styling for hover effect
            // backgroundColor: "lightblue",
            // color: "darkblue",
          },
          disableRipple: true,
        },
        defaultProps: {
          disableRipple: true, // No more ripple on the whole application.
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true, // No more ripple on the whole application.
      },
    },
  },
});

export default theme;
