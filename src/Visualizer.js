/*D3 Visualizer*/
import React, { Component } from 'react';
import './Visualizer.css';
import * as d3 from 'd3';
import * as d3geoproj from 'd3-geo-projection';
import {initialFill, fillChoropleth} from './formulas.js';
import {flags} from './flags.js';

//Variable Declarations
let svg, g, geoPath, projection, sumSelected;
let width, height = 0;
let immigrationData = {};
export let csvData;
export let subtotalKeys = ['immediateRelative','familySponsored','employmentBased','refugeeAsylee','diversityLottery','otherLPR']; //**
export let whichSet;
export let whichYear;

class Visualizer extends Component {

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    const self = this;
    loadData();
    csvData = immigrationData[(this.props.radioDataset).toLowerCase()+this.props.dataYear];
    readData(csvData);
    calcSelectedTotal(csvData);
    initialFill(g,geoPath,'LPR',sumSelected,csvData,self.props.saveAppState,self.props.map);
  }

  componentWillReceiveProps(nextProps,svg,g,geoPath) {
    //determine which data to display
    csvData = immigrationData[(nextProps.radioDataset).toLowerCase()+nextProps.dataYear];

    whichYear = nextProps.dataYear; //** passes to Card.js
    whichSet = nextProps.radioDataset; //**passes to Card.js

    getSubtotalKeys(nextProps);
    readData(csvData);
    calcSelectedTotal(csvData);

    //restyle choropleth paths
    d3.select('#d3-mount-point').selectAll('path')
      .data(csvData)
      .attr('fill', function(d) {return fillChoropleth(d, nextProps.radioDataset,sumSelected)})
  }

  render() {
    return (
      <div id="d3-mount-point" ref={(elem) => { this.div = elem; }} />
    );
  }
}

function loadData() {
  const self = this;
  const immigrationData = {};

  d3.json('./map_geo.json', (err,map) => {
    if (err) {
      console.log(err)
    } else {
        const combinerProgress = {
          filesLeft: (self.props.yearBounds[1] - self.props.yearBounds[0])*2
        };

        this.setState({map})
        initializeD3(map);

        for (let i=self.props.yearBounds[0]; i <= self.props.yearBounds[1]; i++) {
          immigrationData['lpr' + i] = makeMyData(i, 'lpr', combinerProgress, map);
          immigrationData['ni' + i] = makeMyData(i, 'ni', combinerProgress, map);
        }
      }
  });

  function makeMyData(year, radioset, combinerProgress, map) {
    /*loads new dataset and prepares for manipulation*/
    d3.csv(("./"+radioset+year+".csv"), function(err, csvData) {
      if (err) {
        console.log(err)
      } else {
        combinator(map,csvData,flags,year,radioset);
        combinerProgress.filesLeft -= 1;
        if (combinerProgress.filesLeft === 0) {
          self.setState({immigrationData});
        }
      }
    });
  }

  function combinator(world, dataset, flags, year, radioset) {
    if (radioset === 'lpr') {
      dataset.forEach(function(d) {
        d.immediateRelative = +d.immediateRelative;
        d.familySponsored = +d.familySponsored;
        d.employmentBased = +d.employmentBased;
        d.refugeeAsylee = +d.refugeeAsylee;
        d.diversityLottery = +d.diversityLottery;
        d.adoptedOrphans = +d.adoptedOrphans;
        d.otherLPR = +d.otherLPR;
        d.total = +d.total;
      })
    }
    if (radioset === 'ni') {
      dataset.forEach(function(d) {
        d.temporaryVisitor = +d.temporaryVisitor;
        d.studentExchange = +d.studentExchange;
        d.temporaryWorker = +d.temporaryWorker;
        d.diplomatRep = +d.diplomatRep;
        d.otherNI = +d.otherNI;
        d.total = +d.total;
      })
    }
    let dataFlags = dataset.map(data => ({...data, href: flags.find(
      flag => flag[0] === data.ISO)[2]  }))
    immigrationData[radioset+year] = world.features.map(f => ({
      type: 'Feature',
      id: f.properties.iso_a3,
      name: f.properties.name_long,
      formalName: f.properties.formal_en,
      population: f.properties.pop_est,
      geometry: f.geometry,
      immigrationData: dataFlags.find(dataFlag =>
        dataFlag.ISO === f.properties.iso_a3)
    })
  )/*.filter(x => x.immigrationData !== undefined)*/
    .sort((a,b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
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
  d3.select('#immigration-svg').attr('width', document.getElementById('D3-holder').offsetWidth-2);
  d3.select('#immigration-svg').attr('height', document.getElementById('D3-holder').offsetHeight-2);
})

export default Visualizer;
