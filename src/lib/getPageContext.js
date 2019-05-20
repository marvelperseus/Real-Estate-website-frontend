/* eslint-disable no-underscore-dangle */

import { SheetsRegistry } from 'react-jss';
import { createMuiTheme, createGenerateClassName } from '@material-ui/core/styles';
import red from 'material-ui/colors/red';
import blue from 'material-ui/colors/blue';
import { lighten, darken } from 'polished';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: lighten(0.2, '#272A2E'),
      main: '#272A2E',
      dark: darken(0.2, '#272A2E'),
    },
    secondary: {
      light: red[300],
      main: red[500],
      dark: red[700],
    },
  },
  custom: {
    submitBlue: {
      transparentLightBackground: 'rgba(30,150,243,.2)',
      light: blue[300],
      main: blue[500],
      dark: blue[700],
    },
    dangerRed: {
      transparentLightBackground: 'rgba(244,67,54,.2)',
      light: red[300],
      main: red[500],
      dark: red[700],
    },
  },
  frontEnd: {
    typography: {
      fontFamily: {
        serif: 'Alegreya, serif',
        sansSerif: "'Alegreya Sans', sans-serif",
        sansSerif2: 'Roboto, sans-serif',
      },
    },
    colors: {
      primary: {
        main: '#D93F2A',
        dark: darken(0.1, '#D93F2A'),
      },
    },
  },
});

function createPageContext() {
  return {
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName(),
  };
}

export default function getPageContext() {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!process.browser) {
    return createPageContext();
  }

  // Reuse context on the client-side.
  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createPageContext();
  }

  return global.__INIT_MATERIAL_UI__;
}
