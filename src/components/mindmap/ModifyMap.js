import React, { useState } from 'react';

import Typography from '@mui/material/Typography';
import API, { graphqlOperation } from '@aws-amplify/api';
import { Logger } from 'aws-amplify';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MindMapSvg from './MindMapSvg';
import { Autocomplete, Paper } from '@mui/material';
import { createMindMap } from '../../graphql/mutations';

const logger = new Logger('ModifyMap', 'INFO');

const width = document.body.clientWidth;
let textAreaWidth = 20;

// Set the width of the textFields, as fullwidth doesn't work when display is flex
if (width > 1200) {
  textAreaWidth = 40;
} else if (width > 400) {
  textAreaWidth = 30;
} else {
  textAreaWidth = 20;
}

export const ModifyMap = ({mapData}) => {

  const [initialMap, setInitialMap] = useState(mapData?.nodes[0]);
  const [updatedMapData, setUpdatedMapData] = useState({nodes: mapData?.nodes, links: mapData?.links});
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [newNode, setNewNode] = useState({});
  const [vertexType, setVertexType] = useState('section_header');
  const [value, setValue] = useState(mapData?.nodes[0]);
  const [inputValue, setInputValue] = useState('');
  const [sectionState, setSectionState] = useState({
    title: "",
    description: "",
    url: ""
  });

  console.log("This is the source node (addMapData)");
    console.log(value);

  const handleVertexTypeChange = (event) => {
    setVertexType(event.target.value);
  };

  const addMapData = async (e) => {
    console.log("This is the source node (addMapData)");
    // console.log(sourceNode);
    // const source_vertex = mapData?.nodes[sourceNode.target.value];

    // these inputs handle the creation of the vertex and the link (based on source_vertex)
    console.log(vertexType);
    console.log(value);
    console.log(sectionState?.title);
    console.log(sectionState?.description);
    console.log(sectionState?.url);

    API.graphql(
      graphqlOperation(createMindMap, {
        vertex: vertexType,
        source_vertex: value.id,
        title: sectionState.title,
        description: sectionState?.description,
        url: sectionState?.url
      })
    )
    .then(res => {
      const vertex = {
        id: res?.data?.createMindMap?.result,
        label: vertexType,
        title: sectionState?.title,
        description: sectionState?.description,
        url: sectionState?.url
      }
    

      const edge = {
        source: value.id,
        target: vertex.id,
        type: "links_to"
      }

      console.log(edge);

      const mapData = { nodes: [...updatedMapData?.nodes, vertex], links: [...updatedMapData?.links, edge] }
      console.log(mapData);
      setUpdatedMapData(mapData);
      // setOpen(false);
    })
    .catch(err => {
      logger.error(err);
    });

    e.preventDefault();
  }

  const MindMapSvgSelectNode = () => {

  }


  const classes = useStyles();

  return (
    <Grid container className={classes.root}>

      <Grid className={classes.grid} item sm={6}>
        <div className={classes.gridDiv}>
          {updatedMapData?.nodes !== undefined ? (<MindMapSvg map={initialMap} mapData={updatedMapData} MindMapSvgSelectNode={MindMapSvgSelectNode}></MindMapSvg>) : (null)}
        </div>
      </Grid>


      <Grid className={classes.grid} item sm={6}>
        <div className={classes.gridDiv}>
          <Paper className={classes.paper}>
          
            <Typography className={classes.title} variant="h5" component="h2">
              Add a node
            </Typography>
            <div className={classes.formControlDiv}>
              <FormControl>
                <FormLabel className={classes.formLabel}>Type</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="type-row-radio-buttons-group-label"
                  defaultValue="section_header"
                  name="type-radio-buttons-group"
                  value={vertexType}
                  onChange={handleVertexTypeChange}
                >
                  <FormControlLabel value="section_header" control={<Radio />} label="Section Header" />
                  <FormControlLabel value="section" control={<Radio />} label="Section" />
                </RadioGroup>
              </FormControl>
            </div>
            <div className={classes.formControlDiv}>
            <FormControl>
                <FormLabel className={classes.formLabel}>Source Node *</FormLabel>
              <Autocomplete
                disablePortal
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                options={updatedMapData?.nodes}
                getOptionLabel={(option) => option.title}
                className={classes.textField}
                renderInput={(params) => <TextField {...params} label="Source Node *" />}
              />
              </FormControl>
            </div>
            {vertexType === 'section_header' ? (
              <div>
                <div className={classes.formControlDiv}>
                  <FormControl>
                    <FormLabel className={classes.formLabel}>Title *</FormLabel>
                    <TextField
                      required
                      id={'title'}
                      className={classes.textField}
                      variant={'outlined'}
                      name={'title'}
                      label={'Enter title'}
                      fullWidth
                      autoComplete={'title'}
                      value={sectionState?.title}
                      onChange={(e) => setSectionState((prevState) => ({...prevState, title: e.target.value}))}
                    />
                  </FormControl>
                </div>
                <div className={classes.formControlDiv}>
                  <FormControl>
                    <FormLabel className={classes.formLabel}>Description</FormLabel>
                    <TextField
                      minRows={3}
                      multiline
                      id={'description'}
                      className={classes.textField}
                      variant={'outlined'}
                      name={'description'}
                      label={'Enter description'}
                      fullWidth
                      autoComplete={'description'}
                      value={sectionState?.description}
                      onChange={(e) => setSectionState((prevState) => ({...prevState, description: e.target.value}))}
                    />
                    
                    
                  </FormControl>
                </div>
                {(sectionState?.title !== '' && value !== undefined) ? (
                  <div className={classes.submitButtonDiv}>
                  <Button className={classes.button} onClick={addMapData} variant={'contained'}>
                    Save
                  </Button>
                </div>
                ) : (
                  <div className={classes.submitButtonDiv}>
                    <Button className={classes.button} variant={'contained'} disabled>
                      Save
                    </Button>
                  </div>
                )}
              </div>
              
            ) : (
              <div>
                <div className={classes.formControlDiv}>
                  <FormControl>
                    <FormLabel className={classes.formLabel}>Title *</FormLabel>
                    <TextField
                      required
                      id={'title'}
                      className={classes.textField}
                      variant={'outlined'}
                      name={'title'}
                      label={'Enter title'}
                      fullWidth
                      autoComplete={'title'}
                      value={sectionState?.title}
                      onChange={(e) => setSectionState((prevState) => ({...prevState, title: e.target.value}))}
                    />
                  </FormControl>
                </div>
                <div className={classes.formControlDiv}>
                  <FormControl>
                    <FormLabel className={classes.formLabel}>Description</FormLabel>
                    <TextField
                      minRows={3}
                      multiline
                      id={'description'}
                      className={classes.textField}
                      variant={'outlined'}
                      name={'description'}
                      label={'Enter description'}
                      fullWidth
                      autoComplete={'description'}
                      value={sectionState?.description}
                      onChange={(e) => setSectionState((prevState) => ({...prevState, description: e.target.value}))}
                    />
                  </FormControl>
                </div>
                <div className={classes.formControlDiv}>
                  <FormControl>
                    <FormLabel className={classes.formLabel}>URL</FormLabel>
                      <TextField
                        id={'url'}
                        className={classes.textField}
                        variant={'outlined'}
                        name={'url'}
                        label={'Enter URL'}
                        fullWidth
                        autoComplete={'url'}
                        value={sectionState?.url}
                        onChange={(e) => setSectionState((prevState) => ({...prevState, url: e.target.value}))}
                      />
                  </FormControl>
                </div>
                {sectionState?.title !== '' ? (
                  <div className={classes.submitButtonDiv}>
                    <Button className={classes.button} onClick={addMapData} variant={'contained'}>
                      Save
                    </Button>
                  </div>
                  ) : (
                    <div className={classes.submitButtonDiv}>
                      <Button className={classes.button} variant={'contained'} disabled>
                        Save
                      </Button>
                    </div>
                  )}
              </div>
            )}
          </Paper>
        </div>
      </Grid>
    </Grid>
  );
};

export default ModifyMap;

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex'
  },
  grid: {
    padding: 0
  },
  gridDiv: {
    margin: theme.spacing(4)
  },
  paper: {
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    padding: theme.spacing(2)
  },
  formControlDiv: {
    textAlign: 'center'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  container: {
    padding: 'none'
  },
  card: {
    marginBottom: theme.spacing(3)
  },
  cardHeader: {
    fontFamily: 'Open Sans',
    color: '#032e3b',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center'
  },
  input: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center'
  },
  title: {
    color: '#032e3b',
    textAlign: 'center',
    textDecoration: 'underline'
  },
  formLabel: {
    color: '#032e3b',
    margin: '.5rem 0'
  },
  textField: {
    width: textAreaWidth + 'rem'
  },
  icon: {
    color: '#032e3b'
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    justifyContent: 'flex-end',
    backgroundColor: '#f4f4f4',
    color: '#032e3b',
    marginLeft: 16,
    '&:hover': {
      filter: 'brightness(95%)',
      backgroundColor: '#f4f4f4'
    }
  },
  submitButtonDiv: {
    textAlign: 'center',
  }
}));
