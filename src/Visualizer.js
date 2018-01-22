
import React, { Component } from 'react';
import './Visualizer.css';
import * as d3 from 'd3';
import * as d3geoproj from 'd3-geo-projection';
import {lprScale, niScale} from './App.js';

//Variable Declarations
let svg, g, geoPath, projection;
let width, height = 0;

class Visualizer extends Component {

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    window.addEventListener('resize', this.setAndSaveMapBox.bind(this));
    this.setAndSaveMapBox();
  }

  setAndSaveMapBox() {
    const d3Holder = document.getElementById('D3-holder');
    const newMapWidth = d3Holder.offsetWidth -2;
    const newMapHeight = d3Holder.offsetHeight -2;
    const newMapBox = d3Holder.getBoundingClientRect();

    d3.select('#immigration-svg').attr('width', newMapWidth);
    d3.select('#immigration-svg').attr('height', newMapHeight);

    this.props.saveAppState({
      mapBox: newMapBox,
    });
  }

  componentWillReceiveProps(nextProps) {
    const {map, selectedDataset, radioDataset, selectedCategories, modal} = nextProps;

    if (this.props.map !== map && this.props.map === null) {
      initializeD3(map);
    }

    //to run once when data is available
    if (this.props.selectedDataset !== selectedDataset && this.props.selectedDataset === null) {
      setInitialFillAndBindings(g, geoPath, selectedDataset, nextProps.saveAppState);
    }

    //to run each time after initial data is available
    if (!modal && selectedDataset) {
      readData(selectedDataset, selectedCategories);
      d3.select('#d3-mount-point').selectAll('path')
        .data(selectedDataset)
        .attr('fill', (d) => fillChoropleth(d, radioDataset, calcWorldSelectedTotal(selectedDataset)))
    }
  }

  render() {
    return (
      <div id="d3-mount-point" ref={(elem) => { this.d3box = elem; }} />
    );
  }
}

function initializeD3(worldMap) {
  //create d3 map container
  const reactContainer = document.getElementById('D3-holder');
  width = reactContainer.offsetWidth-2;
  height = reactContainer.offsetHeight-2;

  svg = d3.select('#d3-mount-point').append('svg')
    .attr('id', 'immigration-svg')
    .attr('height', height)
    .attr('max-height','90%')
    .attr('width', width)
    .call(d3.zoom() //zoom functionality
      .scaleExtent([1,12])
      .on('zoom',function() {
      svg.attr('transform',d3.event.transform)
    })).append('g');

  g = svg.append('g');

  projection = d3geoproj.geoCylindricalStereographic()
    .scale(165)
    .rotate([-11,0])
    .center([0,22])
    .translate([width/2,height/2]);

  geoPath = d3.geoPath()
    .projection(projection);
}

function readData(data, selectedCategories) {
  data.forEach(function(country) {
    if (country.immigrationData !== undefined) {
      let countedImmigrants = null;
      if (selectedCategories.length === 0) {
        countedImmigrants = 0;
      }
      else if (selectedCategories.length === 1) {
        countedImmigrants = parseNumberForTotal(country.immigrationData[selectedCategories[0]]);
      }
      else {
        countedImmigrants = selectedCategories.reduce(function(acc, category) {
          return acc + parseNumberForTotal(country.immigrationData[category]);
        }, 0)
      }
      Object.assign(country.immigrationData, {countrySelectedTotal:countedImmigrants});
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

function calcWorldSelectedTotal(data) {
  return data.reduce(function(acc, country) {
    if (country.immigrationData !== undefined) {
      return acc + parseInt(country.immigrationData.countrySelectedTotal,10);
    }
    else { return acc; }
  }, 0)
}

function setInitialFillAndBindings(g, geoPath,selectedDataset, saveState) {
  g.selectAll('path')
    .data(selectedDataset)
    .enter()
    .append('path')
    .attr('fill','gray')
    .attr('stroke','#333').attr('stroke-width','.015')
    .attr('d',geoPath)
    .on('mouseover', function(d) {handleMouseover(d, saveState, this)})
    .on('mouseout', function(d) {handleMouseout(d, saveState, this)})
}

function handleMouseover(d, saveState, countryDOM) {
  const elementBox = countryDOM.getBoundingClientRect();
  console.log('country box',d.id, elementBox);  //^ remove before prod
  saveState({hoverCountry: {
    id: d.id,
    xLeft: elementBox.left,
    yTop: elementBox.top,
    xRight: elementBox.right,
    yBottom: elementBox.bottom,
    xWidth: elementBox.width,
    yHeight: elementBox.height,
  }});
}

function handleMouseout(d, saveState, countryDOM) {
  saveState({hoverCountry: null});
}

function fillChoropleth(d,radioDataset,worldSelectedTotal) {
    if (d.immigrationData === undefined) {
      return '#dddddd'
    } else {
      if (radioDataset === 'LPR') {
        return lprScale((d.immigrationData.countrySelectedTotal/worldSelectedTotal)*100)
      }
        else if (radioDataset === 'NI') {
          return niScale((d.immigrationData.countrySelectedTotal/worldSelectedTotal)*100)
      }
    }
}

export default Visualizer;
