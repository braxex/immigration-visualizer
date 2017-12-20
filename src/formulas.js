//import * as d3 from 'd3';
import {color} from './Visualizer.js';
import * as d3 from 'd3';

let dataFlags;
export let allCombined;

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
      d.other = +d.other;
      d.total = +d.total;
    });
  }
  if (lprni === 'NI') {
    csvData.forEach(function(d) {
      d.temporaryVisitor = +d.temporaryVisitor;
      d.studentExchange = +d.studentExchange;
      d.temporaryWorker = +d.temporaryWorker;
      d.diplomatRep = +d.diplomatRep;
      d.other = +d.other;
      d.total = +d.total;
    });
  }
}


export function handleMouseover(d, i) {     //BUG: the first time a country is moused over, it displays the correct data, but then after that it will display that same data no matter which state it changes to. each country does this and behavior independent
  if (d.immigrationData === undefined) {
    d3.select(this)
      .append('svg:title')
      .text('no immigration data for current year')
  } else {
    //title on hover (temporary)
    /*d3.select(this)
      .append('svg:title')
      .attr('class',function() {return 'path '+d.id})
      .attr('dy','.35em')
      .text(newData.find(item => item.id === d.id).immigrationData.countryName+': '+newData.find(item => item.id === d.id).immigrationData.total.toLocaleString())*/
    //see country data on mouseover
    console.log(allCombined.find(item => item.id === d.id));
  }
}

export function handleMouseout() {
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

  export function fillChoropleth(d) {
    if (d.immigrationData === undefined) {
      return '#dddddd'
    } else {
      return color((d.immigrationData.total/750000)*100)
    }
  }

  export function goFill(g, geoPath) {
    g.selectAll('path')
    //g.append('path')  //topo try^
      .data(allCombined)
      //.datum(topojson.feature(worldMap,worldMap.objects.ne_110m_admin_0_countries.geometries)) //topo try^
      .enter()
      .append('path')
      //.attr('fill', function(d) {return color(fillChoropleth(d))})
      .attr('fill', function(d) {return fillChoropleth(d)})
      .attr('stroke','#333').attr('stroke-width','.015')
      .attr('d',geoPath)
      //for adding
      .on('mouseover', handleMouseover)
      .on('mouseout', handleMouseout);
  }
