//import * as d3 from 'd3';
import {} from './Visualizer.js';
//import * as d3 from 'd3';
//import * as d3sc from 'd3-scale-chromatic';
import {lprScale, niScale} from './App.js';

export function handleMouseover(d, i, sumSelected, saveState, countryDOM) {
console.log(countryDOM.getBoundingClientRect());
  saveState({hoverCountry: {
    id: d.id,
    xLeft: countryDOM.getBoundingClientRect().left,
    yTop: countryDOM.getBoundingClientRect().top,
    xRight: countryDOM.getBoundingClientRect().right,
    yBottom: countryDOM.getBoundingClientRect().bottom,
    xWidth: countryDOM.getBoundingClientRect().width,
    yHeight: countryDOM.getBoundingClientRect().height,
  }});
}

export function handleMouseout(d, i, sumSelected, saveState, countryDOM) {
  saveState({hoverCountry: null});
}

  export function fillChoropleth(d,rdState,sumSelected) {
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

  export function initialFill(g, geoPath,rdState,sumSelected,csvData,saveState, worldMap) {
    g.selectAll('path')
      .data(csvData)
      .enter()
      .append('path')
      //.attr('fill', function(d) {return fillChoropleth(d,rdState,sumSelected)})
      .attr('fill','gray')
      .attr('stroke','#333').attr('stroke-width','.015')
      .attr('d',geoPath)
      .on('mouseover', function(d, i, sumSelected) {handleMouseover(d, i, sumSelected, saveState, this)})
      .on('mouseout', function(d, i, sumSelected) {handleMouseout(d, i, sumSelected, saveState, this)})
  }
