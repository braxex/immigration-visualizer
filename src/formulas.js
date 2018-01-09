//import * as d3 from 'd3';
import {} from './Visualizer.js';
import * as d3 from 'd3';
import * as d3sc from 'd3-scale-chromatic';

let dataFlags;
export let allCombined;
export let lprScale;
export let niScale;
let immSum;

export let genNotes = {
  'lprNote': 'Immigrant data not shown for those with unknown country of birth and for countries where total immigrant population in a given year was less than 10.',
  'niNote': 'Data not shown for those with unknown or nonexistent country of citizenship and for countries where total immigrant population in currently selected year was less than 10.',
  'dwNote': 'dw = Data withheld to limit disclosure.',
}

export function csvHandler(csvData, lprni) {
  if (lprni === 'LPR') {
    csvData.forEach(function(d) {
      d.immediateRelative = +d.immediateRelative;
      d.familySponsored = +d.familySponsored;
      d.employmentBased = +d.employmentBased;
      d.refugeeAsylee = +d.refugeeAsylee;
      d.diversityLottery = +d.diversityLottery;
      d.adoptedOrphans = +d.adoptedOrphans;
      d.otherLPR = +d.otherLPR;
      d.total = +d.total;
    });
  }
  if (lprni === 'NI') {
    csvData.forEach(function(d) {
      d.temporaryVisitor = +d.temporaryVisitor;
      d.studentExchange = +d.studentExchange;
      d.temporaryWorker = +d.temporaryWorker;
      d.diplomatRep = +d.diplomatRep;
      d.otherNI = +d.otherNI;
      d.total = +d.total;
    });
  }
}

export function handleMouseover(d, i, sumSelected, saveState, countryDOM) {
  saveState({hoverCountry: {
    id: d.id,
    x: countryDOM.getBoundingClientRect().x,
    y: countryDOM.getBoundingClientRect().y,
  }});
  if (d.immigrationData === undefined) {
    console.log('no immigration data for current year')
  } else {
    //see country data on mouseover
    var selCountry = allCombined.find(item => item.id === d.id).immigrationData;
    console.log(selCountry.countryName+": "+(selCountry.selectedTotal).toLocaleString()+' people; '+(Math.round((((selCountry.selectedTotal)/immSum)*100)*100)/100).toLocaleString()+'%');
  }
}

export function handleMouseout(d, i, sumSelected, saveState, countryDOM) {
  saveState({hoverCountry: null});
}

export function combinator(world, dataset, flags) {
  dataFlags = dataset.map(data => ({...data, href: flags.find(flag => flag[0] === data.ISO)[2]  }))
  allCombined = world.features.map(f => ({
    type: 'Feature',
    id: f.properties.iso_a3,
    name: f.properties.name_long,
    formalName: f.properties.formal_en,
    population: f.properties.pop_est,
    geometry: f.geometry,
    immigrationData: dataFlags.find(dataFlag => dataFlag.ISO === f.properties.iso_a3)
  })
)/*.filter(x => x.immigrationData !== undefined)*/
  .sort((a,b) => {
    if (a.name <b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  })
}

  export function fillChoropleth(d,rdState,sumSelected) {
    immSum = sumSelected;
    if (d.immigrationData === undefined) {
      return '#dddddd'
    } else {
      //console.log(d);
      if (rdState === 'LPR') {
        //.domain([0,0.01,0.025,0.25,.5,1,2.5,5,10,15,25])  //old quantile values for both
        lprScale = d3.scaleThreshold()
          .domain([0.05,0.1,0.25,0.75,1.75,4,7.5])
          .range(d3sc.schemePuBuGn[9].slice(1));
        return lprScale((d.immigrationData.selectedTotal/sumSelected)*100)
      }
        else if (rdState === 'NI') {
          niScale = d3.scaleThreshold()
            .domain([0.01,0.1,0.25,.5,1,2.5,5])
            .range(d3sc.schemeYlGnBu[9].slice(1));
          return niScale((d.immigrationData.selectedTotal/sumSelected)*100)
      }
    }
  }

  export function goFill(g, geoPath,rdState,sumSelected,saveState) {
    g.selectAll('path')
    //g.append('path')  //topo try^
      .data(allCombined)
      //.datum(topojson.feature(worldMap,worldMap.objects.ne_110m_admin_0_countries.geometries)) //topo try^
      .enter()
      .append('path')
      //.attr('fill', function(d) {return color(fillChoropleth(d))})
      .attr('fill', function(d) {return fillChoropleth(d,rdState,sumSelected)})
      .attr('stroke','#333').attr('stroke-width','.015')
      .attr('d',geoPath)
      //for adding
      .on('mouseover', function(d, i, sumSelected) {handleMouseover(d, i, sumSelected, saveState, this)})
      .on('mouseout', function(d, i, sumSelected) {handleMouseout(d, i, sumSelected, saveState, this)})
  }
