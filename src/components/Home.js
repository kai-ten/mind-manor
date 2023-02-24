import React, { useEffect, useState } from 'react';
import Amplify from '@aws-amplify/core';
import awsmobile from '../aws-exports';
import gql from 'graphql-tag';

import { getMaxResults } from '../../src/graphql/queries';

import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import BackgroundImage from './../assets/network-1920.jpg';
import { Button, Card, CardContent, List, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { client } from '..';

Amplify.configure(awsmobile);

export const Home = () => {
  const [title, setTitle] = useState('');
  const [state, setState] = useState([]);
  const [searchTitle, setSearchTitle] = useState([]);

  const executeQuery = async () => {

    setSearchTitle(title);

    await client.query({
      query: gql(getMaxResults),
      variables: {value:'all'}
    }).then(({ data: { getMaxResults } }) => {
      // console.log(getMaxResults);
      setState(getMaxResults);
    });

    setTitle('');
  }

  useEffect(() => {
    executeQuery();
  }, []);
  

  const classes = useStyles();

  return (
    <div className={classes.root}>
        <main className={classes.content}>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item lg={2}></Grid>

                    <Grid item xs={12} lg={8}>
                        <Card className={classes.card}>
                            <CardContent>
                                <div className={classes.cardHeader}>
                                  <Typography variant={'h3'} component={'h3'}>
                                      Connect the dots.
                                  </Typography>
                                </div>
                                <br />
                                <Typography variant={'h5'} gutterBottom>
                                    Discover visual blogs that facilitate a new way to share and display knowledge, written by creators across the internet.
                                </Typography>
                                {/* <br />
                                <div className={classes.buttonAlign}>
                                    <Button
                                        variant={'contained'}
                                        size={'large'}
                                        className={classes.button}
                                        >
                                        Start learning
                                    </Button>
                                </div> */}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={2}>
              <Grid item md={1}></Grid>
              <Grid item xs={12} md={10}>
                <Paper className={classes.mindmapCardContainer}>
                  <Card className={classes.mindmapCardTitle}>
                    <CardContent>
                      <Typography gutterBottom variant={'h4'} component={'h4'}>
                        View community visual blogs
                      </Typography>
                    </CardContent>
                  </Card>

                  {state?.length !== 0 ? (
                    state?.map((row) => (
                      <List className={classes.list} key={'row_' + row?.id}>
                        <Card className={classes.mindmapCard} key={'row_' + row?.id}>
                          <Link className={classes.link} to={`/mindmap/${row?.id}/${row?.title}`} state={{ from: row }}>
                            <CardContent>
                              <Typography gutterBottom variant={'h6'} component={'h6'} defaultValue={row?.title}>
                                {row?.title}
                              </Typography>
                              <Typography gutterBottom variant={'body1'} component={'p'} defaultValue={row?.description}>
                                {row?.description}
                              </Typography>
                            </CardContent>
                          </Link>
                        </Card>
                      </List>
                    ))
                    ) : (
                      <Card className={classes.mindmapCardNoResults}>
                        <CardContent>
                          <Typography component={'span'} color={'textSecondary'} variant={'h6'}>
                            No Results
                          </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Paper>
              </Grid>
            </Grid>
        </main>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    marginTop: theme.spacing(12)
  },
  content: {
    flexGrow: 1,
  },
  paper: {
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100vw',
    maxWidth: '100%',
    alignContent: 'center'
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  title: {
    flexGrow: 1,
    fontFamily: 'Open Sans',
    fontSize: 30
  },
  link: {
    color: 'inherit',
    fontFamily: 'Open Sans',
    fontSize: 18,
    textDecoration: 'none'
  },
  appBarSpacer: theme.mixins.toolbar,
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  card: {
    opacity: '0.9',
    margin: theme.spacing(20),
    padding: theme.spacing(4),
    fontFamily: 'Open Sans',
    color: '#032e3b'
  },
  mindmapCardContainer: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    padding: theme.spacing(4)
  },
  mindmapCardTitle: {
    fontFamily: 'Open Sans',
    color: '#032e3b',
    border: 'none',
    boxShadow: 'none',
    textAlign: 'center'
  },
  mindmapCard: {
    fontFamily: 'Open Sans',
    color: '#032e3b',
    backgroundColor: '#fafafa',
    filter: 'brightness(97.5%)',
    textAlign: 'center',
    '&:hover': {
      cursor: 'pointer',
      filter: 'brightness(95%)'
    }
  },
  mindmapCardNoResults: {
    fontFamily: 'Open Sans',
    color: '#032e3b',
    textAlign: 'center'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center'
  },
  buttonAlign: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center'
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    fontFamily: 'Open Sans',
    color: 'white',
    fontSize: '1.2rem',
    backgroundColor: '#023847',
    textTransform: 'none',
    letterSpacing: '.1rem',
    fontWeight: 'bold',
    '&:hover': {
      opacity: .87,
      backgroundColor: '#023847'
    }
  }
}));
