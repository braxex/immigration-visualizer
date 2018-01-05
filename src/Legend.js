/*Legend*/
import React, { Component } from 'react';
import * as d3 from 'd3';
import * as d3sc from 'd3-scale-chromatic';

let svg, width, height, g, selScale;
let lprScale = d3.scaleThreshold()
                .domain([0.05,0.1,0.25,0.75,1.75,4,7.5])
                .range(d3sc.schemePuBuGn[9].slice(1));

let niScale = d3.scaleThreshold()
                .domain([0.01,0.1,0.25,.5,1,2.5,5])
                .range(d3sc.schemeYlGnBu[9].slice(1));


function initLegend() {

  //add LPR/NI logic here
    /*selScale = radioDataset === 'LPR' ? lprScale : niScale;  */
  selScale = lprScale;

  const reactContainer = document.getElementById('legend-holder');
  width = reactContainer.offsetWidth;
  height = 50;
  svg = d3.select('#legend-mount-point').append('svg')
    .attr('height', height)
    .attr('width', width)
  g = svg.append('g');

  //Third Legend Attempt
  var formatNumber = d3.format('2');

  var x = d3.scaleLinear()
    .domain([0,15])
    .range([0,750]);  //essentially the width of the legend placement

  var xAxis = d3.axisBottom(x)
    .tickSize(15)
    .tickValues(lprScale.domain())
    .tickFormat(function(d) { return formatNumber(d); });

  var h = d3.select('g').call(xAxis);
  var itemWidth = 50;

  h.select('.domain').remove();
  h.selectAll("rect")
    .data(selScale.range().map(function(color) {
      var d = selScale.invertExtent(color);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      console.log(d);
      return d;
    }))
    .enter().insert("rect",'.tick')
      .attr('height',8)
      .attr('width', itemWidth)//.attr('width', function(d) { return x(d[1]) - x(d[0]); })
      .attr('x',function(d) { return (selScale.domain().indexOf(d[0])*itemWidth)+itemWidth})//.attr('x', function(d) { return x(d[0]); })
      .attr('fill', function(d) { return selScale(d[0]); });

  //Second Legend Attempt

    /*var formatPercent = d3.format('.0%');
    var formatNumber = d3.format('.0f');
    var x = d3.scaleLinear().domain([0,1]).range([0,100]);
    var xAxis = d3.axisBottom(x)
      .tickSize(13)
      .tickValues(quant.domain())
      .tickFormat(function(d) { return d === 0.5 ? formatPercent(d) : formatNumber(100*d);});

      var h = d3.select('g').call(xAxis);
      var dsubz;
      var dsubo;

      h.select('.domain').remove();

      h.selectAll('rect')
      .data(quant.range().map(function(color) {
        var d = quant.invertExtent(color);
        if (d[0] == null) dsubz = x.domain()[0];
        if (d[1] == null) dsubo = x.domain()[1];
      }))
      .enter().insert('rect','.tick')
        .attr('height',8)
        .attr('x',function(d) { return x(dsubz); })
        .attr('width', function(d) { return x(dsubo) - x(dsubz); })
        .attr('fill', function(d) { return quant(dsubz); })

    h.append('text')
      .attr('font-weight','bold')
      .attr('text-anchor','start')
      .attr('y',-6)
      .text('Did this work');


    //First Legend Attempt
    /*var legend = d3.select('body').append('svg')
        .attr('class','legend')
        .attr('width',500)
        .attr('height',200)
        .attr('transform','translate(900,-300)')
      .selectAll('g')
        .data(color.domain().slice().reverse())
      .enter().append('g')
        .attr('transform',function(d,i) { return 'translate(400,' +i*20 + ')';});

    legend.append('rect')
      .attr('width',30)
      .attr('height',50)
      .style('fill',color);*/




















}

class Legend extends Component {
  shouldComponentUpdate() {
    return true; //ensure future re-renders of this component
  }

  componentWillReceiveProps(nextProps) {
  //mount subsequent LPR or NI legend
  }

  componentDidMount() {
  //mount initial LPR legend
  initLegend();
  }

  render() {
    return (
      <div id="legend-mount-point" ref={(elem) => { this.div = elem; }} />
    );
  }
}

export default Legend;
