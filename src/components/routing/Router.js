import React  from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NavigationBar } from '../NavigationBar';
import { Home } from '../Home';
import { Authenticator } from '@aws-amplify/ui-react';
import { makeStyles } from '@mui/styles';
import ScrollToTop from "./ScrollToTop";
import { MindMap } from '../mindmap/MindMap';
import CreateMindMap from '../mindmap/CreateMindMap';

export const Router = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.appBarSpacer} />
      <BrowserRouter>
        <NavigationBar />
        <ScrollToTop>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/create" element={<Authenticator><CreateMindMap /></Authenticator>} />
            <Route exact path="/welcome" element={<Authenticator><Navigate to="/" /></Authenticator>} />
            <Route path="mindmap/:mindmapId/:mindmapTitle" element={<MindMap />} />
          </Routes>
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100vw',
    maxWidth: '100%',
    justifyContent: 'center',
    alignItems: 'top'
  },
  appBarSpacer: theme.mixins.toolbar
  // route: {
  //   height: '100vh',
  //   maxHeight: '100%'
  // }
}));