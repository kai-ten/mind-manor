import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import '@aws-amplify/ui-react/styles.css'
import { AmplifyProvider } from '@aws-amplify/ui-react';
import { Authenticator } from '@aws-amplify/ui-react';
import Amplify from '@aws-amplify/core';
import awsmobile from './aws-exports';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';

const root = ReactDOM.createRoot(document.getElementById('root'));

export const client = new AWSAppSyncClient({
  url: awsmobile.aws_appsync_graphqlEndpoint,
  region: awsmobile.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.API_KEY,
    apiKey: awsmobile.aws_appsync_apiKey,
  },
});

root.render(
  // <React.StrictMode>
    <AmplifyProvider>
      <App />
    </AmplifyProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
