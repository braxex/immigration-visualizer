/*D3 Visualizer*/
import React, { Component } from 'react';
import './Visualizer.css';
import * as d3 from 'd3';
import * as d3geoproj from 'd3-geo-projection';
import * as d3sc from 'd3-scale-chromatic';
//import * as d3geo from 'd3-geo';
//import * as topojson from 'topojson-client';
import {csvHandler, combinator, genNotes, handleMouseover, handleMouseout} from './formulas.js';

//Variable Declarations
let width = 0;
let height = 0;
let dataset = [{}];
let worldMap;
var color = d3.scaleLinear()
    .domain([-0.1,0.25,0.5,1,2.5,5,10,50])
    .range(d3sc.schemeOrRd[9].slice(1));


//Called when Visualizer renders
function initializeD3(worldMap) {
  const reactContainer = document.getElementById('D3-holder');
  width = reactContainer.offsetWidth;
  height = reactContainer.offsetHeight;
  let svg = d3.select('#d3-mount-point').append('svg')
    .attr('height', height)
    .attr('width', width)
    //makes zoom possible
    .call(d3.zoom()
      .scaleExtent([1,12])   //zoom bounds
      .on('zoom',function() {
      svg.attr('transform',d3.event.transform)
    }))
    .append('g') //needed for zoom

  var g = svg.append('g');

  var projection = d3geoproj.geoCylindricalStereographic() //more options here: https://goo.gl/9AMQao
    .scale(170)
    .rotate([-11,0])
    .center([0,22])
    .translate([width/2,height/2]);

  var geoPath = d3.geoPath()
    .projection(projection);

  g.selectAll('path')
  //g.append('path')  //topo try^
    .data(worldMap.features)
    //.datum(topojson.feature(worldMap,worldMap.objects.ne_110m_admin_0_countries.geometries)) //topo try^
    .enter()
    .append('path')
    .attr('fill', function(d) {return color((d.properties.pop_est/7383089462)*100)})
    .attr('stroke','#444444').attr('stroke-width','.1')
    .attr('d',geoPath)

    //for adding
    .on('mouseover',handleMouseover)
    .on('mouseout',handleMouseout)

    //add title on mouseover (temporary)
    .append('svg:title')
    .attr('class',function(d) {return 'path ' +d.id})
    .attr('transform',function(d) {return 'translate('+geoPath.centroid(d) +')'; })
    .attr('dy','.35em')
    .text(function(d) {return d.properties.name_long+": "+d.properties.pop_est.toLocaleString()})
}

class Visualizer extends Component {
  shouldComponentUpdate() {
    return false; //prevents future re-renders of this component
  }

  //re-runs each time some prop is changed
  componentWillReceiveProps(nextProps) {
    console.log('State is: ', nextProps);

    /*loads new dataset and prepares for manipulation*/
    d3.csv(("./"+nextProps.radioDataset+nextProps.dataYear+".csv"), function(err, csvData) {
      if (err) {
        console.log(err)
      } else {
        csvHandler(csvData,nextProps.radioDataset);
        dataset = csvData;
        console.log(('DATASET IS '+nextProps.radioDataset+nextProps.dataYear), dataset);
      }
    });
  }

  componentDidMount() {
    //mount old geojson file
    d3.json('./dum_geo.json', (err,old) => {
      if (err) {
        console.log(err);
      } else {
        console.log('DUM_GEO: ',old);
      }
    })


    //mount initial map
    d3.json('./5p_geo.json', (err,map) => {
    //d3.json('./dum_topo.json', (err,map) => {   //topo try^
      if (err) {
        console.log(err)
      } else {
        console.log('MAP DATA:', map)
        //load csv data
        d3.csv('./lpr2005.csv', function(err, csvData) {
          if (err) {
            console.log(err)
          } else {
            //convert csv data points to numbers
            csvHandler(csvData,'LPR');
            worldMap = map;
            initializeD3(worldMap);
          dataset = csvData;
          console.log('DATASET IS LPR2005', dataset);
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
