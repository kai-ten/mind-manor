import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';

import { useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import CreateMap from './CreateMap';
import ModifyMap from './ModifyMap';

export const CreateMindMap = () => {

  const [map, setMap] = useState({});
  const [mapData, setMapData] = useState({nodes: [], links: []})
  const [isMapSaved, setIsMapSaved] = useState(false);
  
  const classes = useStyles();

  const createMindMap = async (newMapResult) => {
    setMap(newMapResult);
    setMapData({nodes: [newMapResult], links: []});
    setIsMapSaved(true);
  };

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
        <Grid container>
            {isMapSaved === false ? (
                <CreateMap createMindMap={createMindMap.bind(this)}></CreateMap>
            ) : (
                mapData?.nodes !== [] ? (<ModifyMap mapData={mapData}></ModifyMap>) : (null)
            )}
        </Grid>
    </main>
  );
};

export default withAuthenticator(CreateMindMap);

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    marginTop: theme.spacing(12),
    display: 'flex',
    backgroundColor: 'white',
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    margin: 'auto',
    justifyContent: 'center',
    alignItems: 'center'
  },
  appBarSpacer: theme.mixins.toolbar
}));
