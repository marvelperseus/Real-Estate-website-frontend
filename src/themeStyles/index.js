import { lighten, darken } from 'polished';

const primaryColor = '#272A2E';
const secondaryColor = darken(0.1, primaryColor);
const accentColor = '#D0021B';
const tertiaryColor = darken(0.1, '#fff');
const lightFontColor = '#fff';
const darkFontColor = 'rgb(50,50,50)';
const sansSerifFont = '"Alegreya Sans", sans-serif';
const serifFont = 'Alegreya, serif';

const theme = {
  primaryColor,
  secondaryColor,
  accentColor,
  tertiaryColor,
  lightFontColor,
  sansSerifFont,
  serifFont,
  darkFontColor,
};

export default theme;
