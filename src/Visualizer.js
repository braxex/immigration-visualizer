/*D3 Visualizer*/
import React, { Component } from 'react';
import './Visualizer.css';
import * as d3 from 'd3';
import * as d3geoproj from 'd3-geo-projection';
import {combinator, allCombined, goFill, fillChoropleth} from './formulas.js';
import {flags} from './flags.js';

//Variable Declarations
let worldMap, svg, g, geoPath, projection, newCombined, sumSelected;
let width, height = 0;
let dataset = [{}];
let subtotalKeys = ['immediateRelative','familySponsored','employmentBased','refugeeAsylee','diversityLottery','otherLPR'];

function initializeD3(worldMap, sumSelected, saveAppState) {
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
  goFill(g,geoPath,'LPR',sumSelected,saveAppState);
}

class Visualizer extends Component {

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(nextProps,svg,g,geoPath) {
    console.log('State is: ', nextProps);

    /*loads new dataset and prepares for manipulation*/
    d3.csv(("./"+nextProps.radioDataset+nextProps.dataYear+".csv"), function(err, csvData) {
      if (err) {
        console.log(err)
      } else {
        dataset = csvData;
        combinator(worldMap,dataset,flags);
        newCombined = allCombined;

        //determine which data to display (based on checkboxes)
        getSubtotalKeys(nextProps);
        readData(newCombined);
        calcSelectedTotal(newCombined);

        //restyle choropleth paths
        d3.select('#d3-mount-point').selectAll('path')
          .data(newCombined)
          .attr('fill', function(d) {return fillChoropleth(d, nextProps.radioDataset,sumSelected)})
      }
    });
  }

  componentDidMount() {
    const self = this;
    //mount initial map
    d3.json('./map_geo.json', (err,map) => {
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
            dataset = csvData;
            worldMap = map;
            combinator(worldMap,dataset,flags);
            //console.log(('DATASET IS LPR2005'), allCombined);

            newCombined = allCombined;
            //determine which data to display (based on checkboxes)
            readData(newCombined);
            calcSelectedTotal(newCombined);
            initializeD3(worldMap,sumSelected,self.props.saveAppState);
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
