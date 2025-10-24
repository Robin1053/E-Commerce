import { createTheme } from '@mui/material/styles';

// Definition der Kernfarben, die in beiden Modi verwendet werden (ausserhalb des createTheme-Aufrufs)
const primaryMain = '#00695C'; // Dunkles, elegantes Petrol
const secondaryMain = '#FF7043'; // Leuchtendes Koralle/Orange für CTAs

const theme = createTheme({
  // Hier werden die Farbschemata für Light und Dark definiert
  colorSchemes: {
    // LIGHT THEME (Ihr bereitgestelltes Schema)
    light: {
      palette: {
        primary: {
          main: primaryMain,
          light: '#4DB6AC',
          dark: '#003D33',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: secondaryMain,
          light: '#FFCCBC',
          dark: '#BF360C',
          contrastText: '#000000',
        },
        error: { main: '#D32F2F' },
        warning: { main: '#FF9800' },
        info: { main: '#2196F3' },
        success: { main: '#4CAF50' },
        background: {
          default: '#FFFFFF',
          paper: '#F9F9F9',
        },
        text: {
          primary: '#212121',
          secondary: '#757575',
          disabled: '#BDBDBD',
        },
      },
      // Schatten und Komponenten-Overrides bleiben im Light-Schema,
      // falls sie nicht global sein sollen.
      shadows: [
        'none',
        '0px 2px 4px rgba(0, 0, 0, 0.08)',
        ...Array(23).fill('none'),
      ],
      components: {
        MuiButton: {
          styleOverrides: {
            root: { borderRadius: '4px' },
            containedSecondary: { fontWeight: 700 },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: { boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)' },
          },
        },
      },
    },

    // DARK THEME (Der vervollständigte Vorschlag)
    dark: {
      palette: {
        // Kernfarben bleiben für die Marke gleich
        primary: {
          main: primaryMain,
          light: '#4DB6AC',
          dark: '#003D33',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: secondaryMain,
          light: '#FFCCBC',
          dark: '#BF360C',
          contrastText: '#212121', // Dunkler Text auf hellem Akzent
        },

        // Dark Mode Statusfarben (heller für bessere Lesbarkeit auf Dunkel)
        error: { main: '#FF5252' },
        warning: { main: '#FFB300' },
        info: { main: '#4FC3F7' },
        success: { main: '#66BB6A' },

        // Dark Mode Hintergründe
        background: {
          default: '#121212', // Sehr dunkles Grau
          paper: '#1E1E1E', // Etwas helleres Grau für Oberflächen
        },

        // Dark Mode Textfarben
        text: {
          primary: '#E0E0E0',
          secondary: '#BDBDBD',
          disabled: '#616161',
        },
      },

      // Anpassungen der Komponenten für Dark Mode
      components: {
        MuiButton: {
          styleOverrides: {
            root: { borderRadius: '4px' },
            containedSecondary: { fontWeight: 700 },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              // Sanftere Schatten im Dark Mode
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
            },
          },
        },
        MuiAppBar: {
          defaultProps: {
            color: 'primary',
          },
        },
      },
    },
  },
});

export default theme;
