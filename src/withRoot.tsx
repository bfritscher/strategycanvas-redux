import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { ApolloProvider } from 'react-apollo';
import client from './graphql/client';
import * as React from 'react';
import theme from './theme';

function withRoot(Component: any) {
  function WithRoot(props: object) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          {/* Reboot kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...props} />
        </ThemeProvider>
      </ApolloProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
