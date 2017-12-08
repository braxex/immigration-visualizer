/*D3 Visualizer*/
import React, { Component } from 'react';
import './Visualizer.css';
import * as d3 from 'd3';
import * as d3geoproj from 'd3-geo-projection';
//import * as d3geo from 'd3-geo';
//import * as topojson from 'topojson-client';

//Variable Declaration
//const circleRadius = 10;
//const circleDiameter = circleRadius*2;
let width = 0;
let height = 0;
//let dataset = [{}];
let worldMap;
let baseCountryColor= '#444444';
//let baseBoundaryColor= '#ffffff';

//Called when Visualizer renders
function initializeD3(worldMap) {
  const reactContainer = document.getElementById('D3-holder');
  width = reactContainer.offsetWidth;
  height = reactContainer.offsetHeight;
  let svg = d3.select('#d3-mount-point').append('svg')
    .attr('height', height)
    .attr('width', width)
    .call(d3.zoom()
      .scaleExtent([1,5])   //zoom bounds
      .on('zoom',function() {
      svg.attr('transform',d3.event.transform)
    }))
    .append('g')

  var g = svg.append('g');

  var projection = d3geoproj.geoCylindricalStereographic() //more options here: https://goo.gl/9AMQao
    .scale(170)
    .rotate([-11,0])
    .center([0,22])
    .translate([width/2,height/2]);

  var geoPath = d3.geoPath()
    .projection(projection);

  g.selectAll('path')
    .data(worldMap.features)
    .enter()
    .append('path')
    .attr('fill',baseCountryColor)
    .attr('d',geoPath);

  /*svg.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
      .attr('cx',d => circleRadius+Math.random()*(width-circleDiameter))
      .attr('cy',d => circleRadius+Math.random()*(height-circleDiameter))
      .attr('r',circleRadius)
      .attr('fill','#666666')*/
}

class Visualizer extends Component {
  shouldComponentUpdate() {
    return false; //prevents future re-renders of this component
  }

  //re-runs each time some prop is changed
  /*componentWillReceiveProps(nextProps) {
    //console.log('State was: ', this.props);
    console.log('State is: ', nextProps);
    const svg = d3.select('#thesvg');
    svg.selectAll('circle')
      .data(dataset)
      .attr('fill',() => '#'+Math.floor(Math.random()*16777215).toString(16))
      .attr('cx',d => circleRadius+Math.random()*(width-circleDiameter))
      .attr('cy',d => circleRadius+Math.random()*(height-circleDiameter))
  }*/


  componentDidMount() {
    d3.json('./dum_geo.json', (err,data) => {
      if (err) {
        console.log(err)
      } else {
        console.log('map data loaded: ', data)
        worldMap = data;
        initializeD3(worldMap);
      }
    });
  }

    /*d3.csv('./lpr2015.csv', (err, data) => {
      if (err) {
        console.log(err)
      } else {
        console.log('Current dataset: ', data)
        dataset = data;
        initializeD3(dataset);
      }
    })*/

  render() {
    return (
      <div id="d3-mount-point" ref={(elem) => { this.div = elem; }} />
    );
  }



}




export default Visualizer;
