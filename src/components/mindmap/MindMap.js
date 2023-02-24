import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import makeStyles from '@mui/styles/makeStyles';
import { useLocation } from 'react-router-dom';
import MindMapSvg from './MindMapSvg';
import gql from 'graphql-tag';
import { getGraphInfo } from '../../graphql/queries';
import { client } from '../..';

export const MindMap = () => {

  const location = useLocation();
  // TODO: Fix this so that an ID can be entered into the search bar or clicked on from another component
  let { from } = location.state;

  const [mapData, setMapData] = useState({
    nodes: [],
    links: []
  });
  const [selectedNode, setSelectedNode] = useState(from);

  const retrieveMap = async () => {
    await client.query({
      query: gql(getGraphInfo),
      variables: {value: from?.id}
    })
    .then(({ data: { getGraphInfo } }) => {
      if (getGraphInfo?.nodes?.length > 0) {
        setMapData(getGraphInfo);
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  const classes = useStyles();

  useEffect(() => {
    retrieveMap();

    return () => {}
  }, []);

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth={'lg'} className={classes.container}>
          {mapData?.nodes?.length > 0 ? (<MindMapSvg map={from} mapData={mapData} ux={true}></MindMapSvg>) : (null)}
        </Container>
      </main>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  appBarSpacer: {
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    width: '100vw',
    position: 'center'
    // overflow: 'auto'
  }
}));
