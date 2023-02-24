import React, { useEffect } from 'react';

import Amplify from '@aws-amplify/core';
import awsmobile from './aws-exports';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import { Router } from './components/routing/Router';
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

const theme = createTheme();

Amplify.configure({awsmobile});

// export const client = new AWSAppSyncClient({
//   url: awsmobile.aws_appsync_graphqlEndpoint,
//   region: awsmobile.aws_appsync_region,
//   auth: {
//     type: AUTH_TYPE.API_KEY,
//     apiKey: awsmobile.aws_appsync_apiKey,
//   },
// });

Amplify.Logger.LOG_LEVEL = "DEBUG";


const App = () => {
  const classes = useStyles();
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Router />
      </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  }
}));
