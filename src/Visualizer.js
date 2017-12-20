/*D3 Visualizer*/
import React, { Component } from 'react';
import './Visualizer.css';
import * as d3 from 'd3';
import * as d3geoproj from 'd3-geo-projection';
//import * as d3sel from 'd3-selection';
//import * as d3geo from 'd3-geo';
//import * as topojson from 'topojson-client';
import {csvHandler, combinator, allCombined, goFill, fillChoropleth} from './formulas.js';
import {flags} from './flags.js';


//Variable Declarations
let width = 0;
let height = 0;
let dataset = [{}];
let worldMap;
let svg;
let g;
let geoPath;
let projection;

//Called when Visualizer renders
function initializeD3(worldMap) {
  const reactContainer = document.getElementById('D3-holder');
  width = reactContainer.offsetWidth;
  height = reactContainer.offsetHeight;
  svg = d3.select('#d3-mount-point').append('svg')
    .attr('height', height)
    .attr('width', width)
    //zoom functionality
    .call(d3.zoom()
      .scaleExtent([1,12])   //zoom bounds
      .on('zoom',function() {
      svg.attr('transform',d3.event.transform)
    }))
    .append('g') //needed for zoom

  g = svg.append('g');

  projection = d3geoproj.geoCylindricalStereographic() //more options here: https://goo.gl/9AMQao
    .scale(170)
    .rotate([-11,0])
    .center([0,22])
    .translate([width/2,height/2]);

  geoPath = d3.geoPath()
    .projection(projection);

  goFill(g,geoPath,'LPR');
}

class Visualizer extends Component {
  shouldComponentUpdate() {
    return false; //prevents future re-renders of this component
  }

  //re-runs each time some prop is changed
  componentWillReceiveProps(nextProps,svg,g,geoPath) {
    console.log('State is: ', nextProps);
    /*loads new dataset and prepares for manipulation*/
    d3.csv(("./"+nextProps.radioDataset+nextProps.dataYear+".csv"), function(err, csvData) {
      if (err) {
        console.log(err)
      } else {
        csvHandler(csvData,nextProps.radioDataset);
        dataset = csvData;
        combinator(worldMap,dataset,flags);
        console.log(('DATASET IS '+nextProps.radioDataset+nextProps.dataYear), allCombined);

        //restyle choropleth paths
        d3.select('#d3-mount-point').selectAll('path')
          .data(allCombined)
          .attr('fill', function(d) {return fillChoropleth(d, nextProps.radioDataset)})
      }
    });
  }

  componentDidMount() {
    //mount initial map
    d3.json('./10m-s5p-pres_geo.json', (err,map) => {
    //d3.json('./dum_topo.json', (err,map) => {   //topo try^
      if (err) {
        console.log(err)
      } else {
        /*console.log('MAP DATA:', map)*/
        //load csv data
        d3.csv('./lpr2005.csv', function(err, csvData) {
          if (err) {
            console.log(err)
          } else {
            //convert csv data points to numbers
            csvHandler(csvData,'LPR');
            dataset = csvData;
            worldMap = map;
            combinator(worldMap,dataset,flags);
            console.log(('DATASET IS LPR2015'), allCombined);
            initializeD3(worldMap);
            /*console.log('DATASET IS LPR2005', dataset);*/
          }
        });
      }
    });
  }

  render() {
    return (
      <div id="d3-mount-point" ref={(elem) => { this.div = elem; }} />
    );
  }



}

export default Visualizer;
