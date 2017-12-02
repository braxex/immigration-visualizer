/*D3 Visualizer*/
import React, { Component } from 'react';
import './Visualizer.css';
import {merge} from 'lodash';
import * as d3 from 'd3';
let dataset = [{}];

const circleRadius = 10;
const circleDiameter = circleRadius*2;
let width = 0;
let height = 0;

function initializeD3(dataset) {
  const reactContainer = document.getElementById('D3-holder');
  width = reactContainer.offsetWidth;
  height = reactContainer.offsetHeight;
  console.log(d3.select);
  console.log(d3);
  console.log(d3.select('#d3-mount-point'));
  const svg = d3.select('#d3-mount-point').append('svg')
    .attr('height', height)
    .attr('width', width)
    .attr('id','thesvg')
  svg.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
      .attr('cx',d => circleRadius+Math.random()*(width-circleDiameter))
      .attr('cy',d => circleRadius+Math.random()*(height-circleDiameter))
      .attr('r',circleRadius)
      .attr('fill','#666666')
}

class Visualizer extends Component {

  shouldComponentUpdate() {
    return false; // This prevents future re-renders of this component
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props);
    console.log(nextProps);
    console.log(this.props.LPR.total.checkedStatus);
    console.log(nextProps.LPR.total.checkedStatus);
    const svg = d3.select('#thesvg');
    svg.selectAll('circle')
      .data(dataset)
      .attr('fill',() => '#'+Math.floor(Math.random()*16777215).toString(16))
      .attr('cx',d => circleRadius+Math.random()*(width-circleDiameter))
      .attr('cy',d => circleRadius+Math.random()*(height-circleDiameter))
  }

  componentDidMount() {
    d3.csv('./lpr2015.csv', (err, data) => {
      if (err) {

        console.log(err)
      } else {
        console.log(data)
        dataset = data;
        initializeD3(dataset);
      }
    })
    }



  render() {
    return (
      <div id="d3-mount-point" ref={(elem) => { this.div = elem; }} />
    );
  }
}




export default Visualizer;
