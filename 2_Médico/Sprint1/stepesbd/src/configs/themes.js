import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#2196f3',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#fff',
        },
        info: {
            main: '#ff0000'
        }
    },
});

export default theme;

/*
primary.main
secondary.main
error.main
warning.main
info.main
success.main
text.primary
text.secondary
text.disabled
*/