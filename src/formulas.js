//import * as d3 from 'd3';
import {} from './Visualizer.js';
//import * as d3 from 'd3';
//import * as d3sc from 'd3-scale-chromatic';
import {lprScale, niScale} from './App.js';

let countryData, immSum;

export function handleMouseover(d, i, sumSelected, saveState, countryDOM) {
  saveState({hoverCountry: {
    id: d.id,
    x: countryDOM.getBoundingClientRect().x,
    y: countryDOM.getBoundingClientRect().y,
  }});
  if (d.immigrationData === undefined) {
    console.log('no immigration data for current year')
  } else {
    //log country data on mouseover
    var selCountry = countryData.find(item => item.id === d.id).immigrationData;
    console.log(selCountry.countryName+": "+(selCountry.selectedTotal).toLocaleString()+' people; '+(Math.round((((selCountry.selectedTotal)/immSum)*100)*100)/100).toLocaleString()+'%');
  }
}

export function handleMouseout(d, i, sumSelected, saveState, countryDOM) {
  saveState({hoverCountry: null});
}

  export function fillChoropleth(d,rdState,sumSelected) {
    immSum = sumSelected;
    if (d.immigrationData === undefined) {
      return '#dddddd'
    } else {
      if (rdState === 'LPR') {
        return lprScale((d.immigrationData.selectedTotal/sumSelected)*100)
      }
        else if (rdState === 'NI') {
          return niScale((d.immigrationData.selectedTotal/sumSelected)*100)
      }
    }
  }

  export function goFill(g, geoPath,rdState,sumSelected,selData,saveState) {
    countryData = selData;
    g.selectAll('path')
      .data(selData)
      .enter()
      .append('path')
      .attr('fill', function(d) {return fillChoropleth(d,rdState,sumSelected)})
      .attr('stroke','#333').attr('stroke-width','.015')
      .attr('d',geoPath)
      .on('mouseover', function(d, i, sumSelected) {handleMouseover(d, i, sumSelected, saveState, this)})
      .on('mouseout', function(d, i, sumSelected) {handleMouseout(d, i, sumSelected, saveState, this)})
  }
