import React, { Component } from 'react';
import './App.css';
import {merge} from 'lodash';
import Visualizer from './Visualizer.js';

class App extends Component {

  constructor(props) {
    super(props)
    const initialState = {
      LPR: {},
      NI: {},
      slider: this.props.yearBounds[0]
    };
    this.props.lprItems.forEach(function(item) {
      initialState.LPR[item.name] = {checkedStatus: false};
    })
    this.state = initialState;
  }

  render() {
    return (
      <div className="App">
        <header title="I'm a header" className="App-header">
          <h1 className="App-title">Immigration Visualizer</h1>
        </header>
      <div id="D3-holder" className="D3-holder">
        <Visualizer {...this.state}/>


      </div>
        <div id="slider-box" className="slider-box">
          <input type="range" className="slider"
            min={this.props.yearBounds[0]}
            max={this.props.yearBounds[1]}
            onChange={(event) => this.changeSliderState(event.target.value)}
            value={this.state.slider}>
          </input>
      </div>
      <div id="controller-box" className="controller-box">
        <div>
          <label>LPR
            <input name="radio" type="radio" id="lpr-radio" className="lpr-radio"></input>
          </label>
          {this.props.lprItems.map(function(item, index){
            return <Checkbox key={index}
            checkboxItem={item}
            itemChecked={this.state.LPR[item.name].checkedStatus}
            changeCheckboxState={ this.changeCheckboxState.bind(this)}/>;
          }, this)}
        </div>
        <div>
          <input name="radio" type="radio" id="ni-radio" className="ni-radio"></input>
        </div>
      </div>
        <div>
          <InfoVis {...this.state}/>
        </div>
      </div>
    );
  }

  changeSliderState(sliderValue) {
    this.setState.bind(this)({
      slider: sliderValue
    })
  }

  changeCheckboxState(shouldBeChecked,checkboxName) {
    const newState = merge({},this.state,{
      LPR: {
        [checkboxName]: {checkedStatus: shouldBeChecked}
      }
    })
    this.setState.bind(this)(newState)
  }
}

class Checkbox extends Component {
  render() {
    const {checkboxItem,itemChecked,changeCheckboxState} = this.props;
    const {name, label} = checkboxItem;
    return (
      <span>
      <label htmlFor={name}>{label}</label>
      <input type="checkbox" checked={itemChecked}
      onChange={(event) => {changeCheckboxState(event.target.checked,name)}}
      id={name}></input>
      </span>
    )
  }
}

App.defaultProps = {
  lprItems: [
    {
      name: "total",
      label: "View All"
    },
    {
      name: "immediateRelative",
      label: "Immediate Relative"
    },
    {
      name: "familySponsored",
      label: "Family Sponsored"
    },
    {
      name: "employmentBased",
      label: "Employment Based"
    },
    {
      name: "refugeeAsylee",
      label: "Refugee/Asylee"
    },
    {
      name: "diversityLottery",
      label: "Diversity Lottery"
    },
    {
      name: "adoptedOrphans",
      label: "Adopted Orphans"
    },
    {
      name: "other",
      label: "Other"
    }
  ],
  yearBounds: [
    2005,
    2015
  ]
}

function InfoVis(data) {
  return (
    <div className="info-visualizer">
      {JSON.stringify(data,null,2)}
    </div>
  )
}


export default App;
