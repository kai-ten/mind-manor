import React, { useState, useEffect, useRef } from 'react';
import * as d3 from "d3";
import { textwrap } from '../../hooks/textwrap';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';

export const MindMapSvg = (props) => {

    const svgRef = useRef(null);
    const map = props?.map; // sets the default map for the Information 
    let mapData = props?.mapData;

    const classes = useStyles();
    const [selectedNode, setSelectedNode] = useState(map);
    const [nodes, setNodes] = useState(mapData?.nodes);
    const [links, setLinks] = useState(mapData?.links);

    let GraphCreator = function({
      nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
      nodeGroup, // given d in nodes, returns an (ordinal) value for color
      nodeGroups, // an array of ordinal values representing the node groups
      nodeFill = "#023847", // node stroke fill (if not using a group color encoding)
      nodeStroke = "red", // node stroke color
      nodeStrokeWidth = 1, // node stroke width, in pixels
      nodeStrokeOpacity = 1, // node stroke opacity
      nodeRadius = 45, // node radius, in pixels
      nodeStrength = -5,
      linkStroke = "#032e3b", // link stroke color
      linkStrokeOpacity = .5, // link stroke opacity
      linkStrokeWidth = 4, // given d in links, returns a stroke width in pixels
      linkStrokeLinecap = "round", // link stroke linecap
      linkStrength,
      invalidation // when this promise resolves, stop the simulation
    } = {}) {
      const margin = {top: 20, right: 20, bottom: 50, left: 20}
      const width = document.body.clientWidth
      const height = document.body.clientHeight

      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const N = d3.map(nodes, nodeId).map(intern);

      // Construct the forces
      const forceNode = d3.forceManyBody();
      const forceLink = d3.forceLink(links).id(({index: i}) => N[i]);
      if (nodeStrength !== undefined) forceNode.strength(-10);
      if (linkStrength !== undefined) forceLink;

      let zoom = d3.zoom()
        // .scaleExtent([1/10, 10])
        .on('zoom', handleZoom);

      function handleZoom(e) {
        d3.select('svg g')
        .attr('transform', e.transform);
        d3.selectAll('svg text')
        .attr('transform', e.transform);
      }

      let circleColors = function(d) {
        let returnColor;
        
        if (d.label === 'map') {
          returnColor = "rgb(152,200,213)";
        } else if (d.label === 'section_header') {
          returnColor = "rgb(205,205,205)"
        } else {
          returnColor = "rgb(255,255,255)";
        }
        
        return returnColor;
      };

      let simulation;

      // Read-only graphs enjoy the fun spinning effect when loading (aka props.ux)
      // Read-write graphs snap into place and only get forces when dragging nodes
      if (!props.ux) {
        simulation = d3.forceSimulation(nodes)
        .force('x', d3.forceX())
        .force('y', d3.forceY())
        .force("charge", forceNode)
        .force("link", forceLink)
        .force("collide", d3.forceCollide(125).radius(135))
        .force("center", d3.forceCenter(0,0))
        .on("tick", ticked)
        .alphaDecay(.6942080081357734)
      } else {
        simulation = d3.forceSimulation(nodes)
        .force('x', d3.forceX())
        .force('y', d3.forceY())
        .force("charge", forceNode)
        .force("link", forceLink)
        .force("collide", d3.forceCollide(125).radius(135))
        .force("center", d3.forceCenter(0,0))
        .on("tick", ticked);
      }

      const svg = d3.select(svgRef.current)
        .attr("height","100%").attr("width","100%")
        .attr("viewBox", [-innerWidth / 2, -innerHeight / 2, innerWidth, innerHeight])
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .classed("svg-content-responsive", true)
        .style("background-color", "#eaeaea")
        .style("brightness", "97.5%")
        .style("border-radius", ".3em")
        .style("cursor", "move")
        .call(zoom);

      const node = svg.select("svg g")
        .attr("stroke-width", nodeStrokeWidth)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", nodeRadius)
        .attr("fill", circleColors)
        .call(drag(simulation))
        .on("click", clicked);

      const link = svg.select("svg g")
        .selectAll("line")
        .data(links)
        .join("line")
        .style("stroke", linkStroke)
        .attr("stroke-opacity", linkStrokeOpacity)
        .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
        .attr("stroke-linecap", linkStrokeLinecap)
        .lower();
      
      let wrap = textwrap()
        .bounds({height: 400, width: 250})
        .method('tspans');

      const label = svg.selectAll(".circles")
        .data(nodes)
        .enter()
        .append("text")
        .text(d => d.title)
        .attr("id", "text")
        .style("text-anchor", "middle")
        .attr("color", "#032e3b")
        .style("font-size", "1em")
        .on("click", clicked)
        .call(drag(simulation))
        .call(wrap);

      svg.selectAll("svg g")
        .style("cursor", "pointer");
      svg.selectAll("svg text")
        .style("cursor", "pointer");

      function clicked(event, d) {
        // if (event.defaultPrevented) return; // dragged
        drag(simulation);
        setSelectedNode(d);
      }
  
      // Handle invalidation.
      if (invalidation != null) invalidation.then(() => simulation.stop());

      function intern(value) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;
      }

      function ticked() {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x )
          .attr("y2", d => d.target.y )

        node
          .attr("cx", d => d.x )
          .attr("cy", d => d.y )

        label
          .attr("dx", d => d.x)
          .attr("dy", d => d.y)
      }

      function drag(simulation) {
        var wasMoved = true; // Controls whether simulation effect occurs on nodes or not, must set dragstarted().wasMoved to false if you DO NOT want the nodes to jiggle when getting clicked(). 

        function dragstarted(event) {
          wasMoved = true; // set to false if var wasMoved is false, see var
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }
        
        function dragged(event) {
          wasMoved = true;
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }
        
        function dragended(event, d) {
        if(wasMoved) {
          if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
            event.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
            ticked();
          } else {
              // this dramatically slows the force affect on the graph when clicking a node to pause it. 
              // simulation.alphaTarget(0);
          }
            
          wasMoved = false;
        }
        
        return d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
      }

      return node;
    }

  let zoom = d3.zoom()
    .scaleExtent([0.25, 10])
    .on('zoom', handleZoom);
        
  let width = svgRef.current

  function handleZoom(e) {
    d3.select('svg g')
      .attr('transform', e.transform);
    d3.selectAll('svg text')
      .attr('transform', e.transform);
  }

  function zoomIn() {
    d3.select(svgRef.current)
      .transition()
      .call(zoom.scaleBy, 2);
  }

  function zoomOut() {
    d3.select(svgRef.current)
      .transition()
      .call(zoom.scaleBy, 0.5);
  }
  
  function resetZoom() {
    d3.select(svgRef.current)
      .transition()
      .call(zoom.scaleTo, 1);
  }
  
  // TODO - fix this
  // Add ability to show and hide buttons with >... and ...<
  function center() {
    d3.select(svgRef.current)
      .transition()
      .call(zoom.translateTo, 0.5 * width, 0.5 * height);
  }
  
  function panLeft() {
    d3.select(svgRef.current)
      .transition()
      .call(zoom.translateBy, -50, 0);
  }
  
  function panRight() {
    d3.select(svgRef.current)
      .transition()
      .call(zoom.translateBy, 50, 0);
  }

  useEffect(() => {
    setNodes(mapData?.nodes);
    setLinks(mapData?.links);

    d3.selectAll("svg text").remove();
    GraphCreator();

    return () => {
      mapData = null;
    }
  }, [props]);

  return (
    <Grid container spacing={2}>
      <Grid item sm={12}>
        <div className={classes.legend}>
          <div className={classes.legend}>
            <div className={classes.legendSquare} style={{backgroundColor: "#98c8d5"}}></div>
            <p className={classes.legendLabel}>Mind Map</p>
          </div>
          <div className={classes.legend}>
            <div className={classes.legendSquare} style={{backgroundColor: "#cdcdcd"}}></div>
            <p className={classes.legendLabel}>Section Header</p>
          </div>
          <div className={classes.legend}>
            <div className={classes.legendSquare} style={{backgroundColor: "white"}}></div>
            <p className={classes.legendLabel}>Section</p>
          </div>
        </div>
      </Grid>

      <Grid item sm={12}>
        <svg ref={svgRef}>
          <g></g>
        </svg>
      </Grid>

      <Grid className={classes.grid} item xs={12}>
        <Paper className={classes.paper}>
          <Typography className={classes.title}>
            {selectedNode?.title}
          </Typography>
          
          {selectedNode?.description ? (
            <Typography className={classes.details}>
              {selectedNode?.description}
            </Typography>
          ) : (
            null
          )}
          {selectedNode?.author ? (
            <Typography className={classes.details}>
              {selectedNode?.author}
            </Typography>
          ) : (
            null
          )}
          {selectedNode?.url ? (
            <Typography className={classes.details}>
              {selectedNode?.url}
            </Typography>
          ) : (
            null
          )}
          {/* <span style={{paddingLeft: '1rem'}}>
            <Button className={classes.menuButton} onClick={() => {zoomIn()}} variant={'contained'}>
              Zoom in
            </Button>
            <Button className={classes.menuButton} onClick={() => {zoomOut()}} variant={'contained'}>
              Zoom out
            </Button>
            <Button className={classes.menuButton} onClick={() => {resetZoom()}} variant={'contained'}>
              Reset zoom
            </Button>
            <Button className={classes.menuButton} onClick={() => {panLeft()}} variant={'contained'}>
              Pan left
            </Button>
            <Button className={classes.menuButton} onClick={() => {panRight()}} variant={'contained'}>
              Pan right
            </Button>
            <Button className={classes.menuButton} onClick={() => {center()}} variant={'contained'}>
              Center
            </Button>
          </span> */}
          
          {/* <svg ref={svgRef}>
            <g></g>
          </svg> */}
          
        </Paper>
      </Grid>
    </Grid>

  );
};

export default MindMapSvg;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    backgroundColor: '#032e3b',
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardMedia: {
    maxHeight: '220px',
    width: 'auto'
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
  },
  title: {
    color: '#f4f4f4',
    fontSize: '1.5em',
    margin: '.5em',
    fontWeight: 'bold'
  },
  details: {
    color: '#f4f4f4',
    fontSize: '1.25em',
    margin: '.5em'
  },
  legend: {
    display: 'flex',
    float: 'right'
  },
  legendSquare: {
    display: '1',
    width: '1.5rem',
    height: '1.5rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '.2rem',
    border: 'solid .1rem #032e3b'
  },
  legendLabel: {
    display: '1',
    margin: 0,
    padding: '0 .2rem',
    color: '#032e3b'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  fixedHeight: {
    height: 300
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    justifyContent: 'flex-end'
  },
  buttonAlign: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}));
