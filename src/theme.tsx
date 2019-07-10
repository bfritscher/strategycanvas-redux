// import red from '@material-ui/core/colors/red';
// red.A400
import { createMuiTheme } from '@material-ui/core/styles';
// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
    palette: {
      primary: {
        light: '#e5e5e5',
        main: '#727272',
        dark: '#363839',
        contrastText: '#fff'
      },
      secondary: {
        light: '#ff5e50',
        main: '#e41e26',
        dark: '#a90000',
        contrastText: '#fff'
      }
    }
  });

export default theme;
