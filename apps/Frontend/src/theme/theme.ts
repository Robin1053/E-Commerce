// src/theme.ts
import { createTheme } from "@mui/material/styles";

const fontPrimary = "'Roboto', sans-serif";
const fontSecondary = "'Pacifico', cursive";
const fontAccent = "'Sour Gummy', cursive";

const theme = createTheme({
  colorSchemes: {
    dark: {
      palette: {
        mode: "dark",
      },
    },
    light: {
      palette: {
        primary: {
          main: "#6a93b0", // Seed-Farbe
          light: "#a1c3da",
          dark: "#3f5d73",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#8c7c90", // lavendel
          light: "#c3b1c6",
          dark: "#56485d",
          contrastText: "#ffffff",
        },
        tertiary: {
          main: "#679b8c", // mint/teal Akzent
          light: "#9bcbb9",
          dark: "#375a4f",
          contrastText: "#ffffff",
        },

        background: {
          default: "#f8f9fb",
          paper: "#ffffff",
        },
        error: {
          main: "#ba1a1a",
          light: "#ff897d",
          dark: "#93000a",
          contrastText: "#ffffff",
        },
        text: {
          primary: "#1a1c1e",
          secondary: "#5c5f62",
        },
      },
    },
  },
  typography: {
    fontFamily: fontPrimary,

    h1: {
      fontFamily: fontPrimary,
      fontSize: "2.5rem",
      fontWeight: 400,
    },
    h2: {
      fontFamily: fontPrimary,
      fontSize: "2rem",
      fontWeight: 400,
    },
    h3: {
      fontFamily: fontPrimary,
      fontSize: "1.75rem",
      fontWeight: 500,
    },
    button: {
      fontFamily: fontPrimary,
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiIcon: {
      defaultProps: {
        baseClassName: "material-symbols-outlined",
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "1rem",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "1.5rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        },
      },
    },
  },
});

export default theme;