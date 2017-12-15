/*D3 Visualizer*/
import React, { Component } from 'react';
import './Visualizer.css';
import * as d3 from 'd3';
import * as d3geoproj from 'd3-geo-projection';
import * as d3sc from 'd3-scale-chromatic';
//import * as d3geo from 'd3-geo';
import * as topojson from 'topojson-client';

var hackD3 = d3;
var hackD3SC = d3sc;

//Variable Declarations
/*Dataset Variables/Messages*/
//let lprMainNote = "Immigrant data not shown for those with unknown country of birth and for countries where total immigrant population in a given year was less than 10.";
//let niMainNote = "Data not shown for those with unknown or nonexistent country of citizenship and for countries where total immigrant population in currently selected year was less than 10. ";
//let dwMainNote = "DW = Data withheld to limit disclosure.";
//let aoMainNote = "Adopted orphan data included in 'other' category";

/*Other Variables*/
//const circleRadius = 10;
//const circleDiameter = circleRadius*2;
let width = 0;
let height = 0;
let dataset = [{}];
let worldMap;
let baseCountryColor= "#"+((1<<24)*Math.random()|0).toString(16);
//let baseBoundaryColor= '#ffffff';

var x = d3.scaleLinear()
    .domain([2,10])
    .rangeRound([600, 860]);

var color = d3.scaleLinear()
    //.domain(d3.range(140, 1379302771))
    .domain([0,2.5,5,7.5,10])
    .range(d3sc.schemeBlues[9].slice(3));


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
      .scaleExtent([1,5])   //zoom bounds
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
    .data(worldMap.features)
    .enter()
    .append('path')
    .attr('fill', function(d) {return color((d.properties.POP_EST/7383089462)*100)})
    //.attr('fill', function(d) {return color(d.properties.POP_EST)})
    .attr('d',geoPath);
}

class Visualizer extends Component {
  shouldComponentUpdate() {
    return false; //prevents future re-renders of this component
  }

  //re-runs each time some prop is changed
  componentWillReceiveProps(nextProps) {

    /*shows state change*/
    //console.log('State was: ', this.props);
    console.log('State is: ', nextProps);

    /*loads new dataset and prepares for manipulation*/
    d3.csv(("./"+nextProps.radioDataset+nextProps.dataYear+".csv"), function(err, data) {
      if (err) {
        console.log(err)
      } else {
        data.forEach(function(d) {
          /*convert data to dataset array*/
          if(nextProps.radioDataset==="LPR") {
            /*lpr-specific headings*/
            d.immediateRelative = +d.immediateRelative;
            d.familySponsored = +d.familySponsored;
            d.employmentBased = +d.employmentBased;
            d.refugeeAsylee = +d.refugeeAsylee;
            d.diversityLottery = +d.diversityLottery;
            d.adoptedOrphans = +d.adoptedOrphans;
          } else {
            /*ni-specific headings*/
            d.temporaryVisitor = +d.temporaryVisitor;
            d.studentExchange = +d.studentExchange;
            d.temporaryWorker = +d.temporaryWorker;
            d.diplomatRep = +d.diplomatRep;
          }
          /*shared headings*/
          d.other = +d.other;
          d.total = +d.total;
        });
      dataset = data;
      /*shows new dataset array*/
      console.log(('DATASET IS '+nextProps.radioDataset+nextProps.dataYear), dataset);
      }
    });
  }

  componentDidMount() {
    //mount initial map
    d3.json('./dum_geo.json', (err,map) => {
      if (err) {
        console.log(err)
      } else {
        console.log('MAP DATA:', map)

        d3.csv('./lpr2005.csv', function(err, countries) {
          if (err) {
            console.log(err)
          } else {
            //mount initial dataset
            countries.forEach(function(d) {
              d.immediateRelative = +d.immediateRelative;
              d.familySponsored = +d.familySponsored;
              d.employmentBased = +d.employmentBased;
              d.refugeeAsylee = +d.refugeeAsylee;
              d.diversityLottery = +d.diversityLottery;
              d.other = +d.other;
              d.adoptedOrphans = +d.adoptedOrphans;
              d.total = +d.total;
            });
            worldMap = map;
            initializeD3(worldMap);
          dataset = countries;

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

//for lpr files
d3.csv('./lpr2005.csv', function(err, data) {
  if (err) {
    console.log(err)
  } else {
    data.forEach(function(d) {
      d.immediateRelative = +d.immediateRelative;
      d.familySponsored = +d.familySponsored;
      d.employmentBased = +d.employmentBased;
      d.refugeeAsylee = +d.refugeeAsylee;
      d.diversityLottery = +d.diversityLottery;
      d.other = +d.other;
      d.adoptedOrphans = +d.adoptedOrphans;
      d.total = +d.total;
    });
  dataset = data;
  }
});

// the three buckets
// var worldMap = worldMap.features
// var countries = csvData
// var flags = [['name', 'href']]

// var countryFlags = countries.map(country => {...country, href: flags.find(flag => flag[0] === country.birthCountry)[1]  })
/*
countryFlagsWorldMap = worldMap.features.map(f => ({
  name: f.properties.NAME,
  population: f.properties.POP_EST,
  id: f.properties.ISO_A3,
  geometry: f.geometry,
  formalName: f.FORMAL_EN,
  immigrationData: countryFlags.find(countryFlag => countryFlag.id === f.properties.ISO_A3) //AFG
})
//.filter (x => x.immigrationData !== null)
)
.sort(
  (a,b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  }
)*/

export default Visualizer;
