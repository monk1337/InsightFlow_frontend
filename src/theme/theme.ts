import { ThemeOptions, createTheme } from '@mui/material/styles';

export const darkThemeOptions: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
          main: '#9496e2',
          light: '#3f3f5d',
        },
        secondary: {
          main: '#434354',
        },
        background: {
          default: '#0c0c0e',
          paper: '#22252b'
        },
        text: {
          primary: '#c5c9cb',
        },
      },
      typography: {
        fontFamily: 'Montserrat',
      },
};

export const darkTheme = createTheme(darkThemeOptions)
