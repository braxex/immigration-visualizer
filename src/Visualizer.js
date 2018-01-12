/*D3 Visualizer*/
import React, { Component } from 'react';
import './Visualizer.css';
import * as d3 from 'd3';
import * as d3geoproj from 'd3-geo-projection';
import {goFill, fillChoropleth} from './formulas.js';

//Variable Declarations
let worldMap, svg, g, geoPath, projection, sumSelected, tempdat, selData;
let width, height = 0;
let subtotalKeys = ['immediateRelative','familySponsored','employmentBased','refugeeAsylee','diversityLottery','otherLPR'];

export function passFiles(datums, map) { //**
  tempdat = datums;
  worldMap = map;
}

function initializeD3(worldMap, sumSelected, selData, saveAppState) {
  const reactContainer = document.getElementById('D3-holder');
  width = reactContainer.offsetWidth-1;
  height = reactContainer.offsetHeight;
  svg = d3.select('#d3-mount-point').append('svg')
    .attr('id', 'immigration-svg')
    .attr('height', height)
    .attr('max-height','90%')
    .attr('width', width)
    .call(d3.zoom() //begin zoom functionality
      .scaleExtent([1,12])
      .on('zoom',function() {
      svg.attr('transform',d3.event.transform)
    })).append('g'); //end zoom functionality
  g = svg.append('g');
  projection = d3geoproj.geoCylindricalStereographic()
    .scale(165)
    .rotate([-11,0])
    .center([0,22])
    .translate([width/2,height/2]);
  geoPath = d3.geoPath()
    .projection(projection);
  goFill(g,geoPath,'LPR',sumSelected,selData,saveAppState);
}

class Visualizer extends Component {

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(nextProps,svg,g,geoPath) {
    //determine which data to display
    selData = tempdat[(nextProps.radioDataset).toLowerCase()+nextProps.dataYear];
    console.log('selData is',selData);

    getSubtotalKeys(nextProps);
    readData(selData);
    calcSelectedTotal(selData);

    //restyle choropleth paths
    d3.select('#d3-mount-point').selectAll('path')
      .data(selData)
      .attr('fill', function(d) {return fillChoropleth(d, nextProps.radioDataset,sumSelected)})
  }

  componentDidMount() {
    const self = this;

    function checkForData() { //**
      if (tempdat === undefined) {
    } else {
      clearInterval(checkInterval)
      //determine which data to display
      selData = tempdat[(self.props.radioDataset).toLowerCase()+self.props.dataYear];
      console.log('selData is',selData);
      readData(selData);
      calcSelectedTotal(selData);
      initializeD3(worldMap,sumSelected,selData,self.props.saveAppState);
    }
  }
    var checkInterval = setInterval(checkForData,250);
}

  render() {
    return (
      <div id="d3-mount-point" ref={(elem) => { this.div = elem; }} />
    );
  }
}

function getSubtotalKeys(nextProps) {
  subtotalKeys = Object.keys(nextProps[nextProps.radioDataset])
    .filter(key => nextProps[nextProps.radioDataset][key].checkedStatus === true);
}

function readData(data) {
  data.forEach(function(country) {
    if (country.immigrationData !== undefined) {
      let countedImmigrants = null;
      if (subtotalKeys.length === 0) {
        countedImmigrants = 0;
      }
      else if (subtotalKeys.length === 1) {
        countedImmigrants = parseNumberForTotal(country.immigrationData[subtotalKeys[0]]);
      }
      else {
        countedImmigrants = subtotalKeys.reduce(function(acc, subtotalKey) {
          return acc + parseNumberForTotal(country.immigrationData[subtotalKey]);
        }, 0)
      }
      Object.assign(country.immigrationData, {selectedTotal:countedImmigrants});
    }
  })
}

function parseNumberForTotal(value) {
  if (Number.isNaN(value)) {
    return 0;
  }
  else if (typeof value === 'string') {
    const parsedNumber = parseInt(value,10)
    return Number.isNaN(parsedNumber) ? 0 : parsedNumber;
  }
  else if (typeof value === 'number') {
    return value;
  }
}

function calcSelectedTotal(data) {
  sumSelected = data.reduce(function(acc, country) {
    if (country.immigrationData !== undefined) {
      return acc + parseInt(country.immigrationData.selectedTotal,10);
    }
    else { return acc; }
  }, 0)
}

window.addEventListener('resize',function() {
  d3.select('#immigration-svg').attr('width', document.getElementById('D3-holder').offsetWidth-1);
  d3.select('#immigration-svg').attr('height', document.getElementById('D3-holder').offsetHeight-2);
})

export default Visualizer;
