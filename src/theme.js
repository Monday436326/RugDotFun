import { createTheme } from '@mui/material/styles';

// Define your custom fonts
const customFont = {
    fontFamily: 'Arial, sans-serif', // Replace with your custom font
};

const theme = createTheme({
    palette: {
        mode: 'dark', // Enable dark mode
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
        background: {
            default: '#121212',
            paper: '#1d1d1d',
        },
        text: {
            primary: '#ffffff',
            secondary: '#aaaaaa',
        },
    },
    typography: {
        fontFamily: customFont.fontFamily,
        h1: {
            fontFamily: customFont.fontFamily,
        },
        h2: {
            fontFamily: customFont.fontFamily,
        },
        h3: {
            fontFamily: customFont.fontFamily,
        },
        h4: {
            fontFamily: customFont.fontFamily,
        },
        h5: {
            fontFamily: customFont.fontFamily,
        },
        h6: {
            fontFamily: customFont.fontFamily,
        },
        body1: {
            fontFamily: customFont.fontFamily,
        },
        body2: {
            fontFamily: customFont.fontFamily,
        },
        button: {
            fontFamily: customFont.fontFamily,
        },
    },
});

export default theme;
