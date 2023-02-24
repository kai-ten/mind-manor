import React from 'react';
import { Auth } from 'aws-amplify';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { createMindMap } from '../../graphql/mutations';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

let email = '';

Auth.currentAuthenticatedUser({
  bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
})
.then(user => email = user.attributes.email)
.catch(err => console.log(err));

export const CreateMap = (props) => {

  const [state, setState] = useState({
    title: "",
    description: ""
  });

  const create = async (e) => {
    e.preventDefault();

    await API.graphql(
      graphqlOperation(createMindMap, {
        value: 'vertex',
        vertex: 'map',
        title: state?.title,
        description: state?.description,
        author: email,
        contributors: [],
        version: 1
      })
    ).then((res) => {
        const map = {
          id: res.data.createMindMap.result,
          label: 'map',
          title: state?.title,
          description: state?.description,
          author: email,
          contributors: [],
          version: 1
        }
        props.createMindMap(map);
    });
  }

  const classes = useStyles();

  return (
      <Container fixed className={classes.container}>

        <Grid item xs={12}>
          <Card className={classes.card}>
            <CardContent>
              <div className={classes.cardHeader} >
                  <Typography variant={'h5'} component={'h5'}>
                      Start by naming and describing your blog.
                  </Typography>
              </div>
              <br />
                <div className={classes.input}>
                  <Grid item xs={12} sm={6} >
                    <TextField
                      required
                      id={'title'}
                      variant={'outlined'}
                      name={'title'}
                      label={'Enter title'}
                      fullWidth
                      autoComplete={'title'}
                      value={state?.title}
                      className={classes.textField}
                      onChange={(e) => setState((prevState) => ({...prevState, title: e.target.value}))}
                    />
                  </Grid>
                </div>
                
                <div className={classes.input}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      minRows={6}
                      multiline
                      id={'description'}
                      variant={'outlined'}
                      name={'description'}
                      label={'Enter description'}
                      fullWidth
                      autoComplete={'description'}
                      value={state?.description}
                      className={classes.textField}
                      onChange={(e) => setState((prevState) => ({...prevState, description: e.target.value}))}
                    />
                  </Grid>
                </div>
                {state?.title !== '' ? (
                  <div className={classes.input}>
                    <Button onClick={create} className={classes.button} variant={'contained'}>
                      Save and Continue
                    </Button>
                  </div>
                ) : (
                  <div className={classes.input}>
                    <Button className={classes.button} variant={'contained'} disabled>
                      Save and Continue
                    </Button>
                  </div>
                )}

            </CardContent>
          </Card>
        </Grid>
        
      </Container>
  );
};

export default CreateMap;

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  cardHeader: {
    fontFamily: 'Open Sans',
    color: '#032e3b',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center'
  },
  card: {
    marginBottom: theme.spacing(3),
    backgroundColor: '#f4f4f4'
  },
  input: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center'
  },
  textField: {
    backgroundColor: 'white'
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    backgroundColor: '#032e3b',
    color: 'white',
    marginLeft: 16,
    '&:hover': {
      filter: 'brightness(150%)',
      backgroundColor: '#032e3b'
    }
  }
}));
