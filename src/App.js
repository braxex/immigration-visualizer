import React, { Component } from 'react';
import './App.min.css';
import {merge} from 'lodash';
import Visualizer from './Visualizer.js';

class App extends Component {

  constructor(props) {
    super(props)

    //Initial State Definitions
    const initialState = {
      LPR: {},
      NI: {},
      slider: this.props.yearBounds[0]
    };
    this.props.lprItems.forEach(function(item) {
      initialState.LPR[item.name] = {checkedStatus: false};
    })
    this.props.niItems.forEach(function(item) {
      initialState.NI[item.name] = {checkedStatus: false};
    })
    this.state = initialState;
  }

  render() {
    return (
      <div className="App">

        {/*Header Section*/}
        <header title="I'm a header" className="App-header">
          <h1 className="App-title">Immigration Visualizer</h1>
        </header>

        {/*D3 Visualization Section*/}
        <div id="D3-holder" className="D3-holder">
          <Visualizer {...this.state}/>
        </div>

        {/*Slider Controls Section*/}
        <div id="slider-box" className="slider-box">
          <div id="year-display" className="year-display">Showing Data for {this.state.slider}</div>
          <input type="range" className="slider"
            min={this.props.yearBounds[0]}
            max={this.props.yearBounds[1]}
            onChange={(event) => this.changeSliderState(event.target.value)}
            value={this.state.slider}>
          </input>
        </div>

        {/*Radio & Checkbox Control Section*/}
        <div id="controller-box" className="controller-box">

          <div id="lpr-controls" className="lpr-controls">
            <label>LPR
              <input name="radio" type="radio" id="lpr-radio" className="lpr-radio"></input>
            </label>
            {this.props.lprItems.map(function(item, index){
              return <LPRCheckbox key={index}
                checkboxItem={item}
                itemChecked={this.state.LPR[item.name].checkedStatus}
                changeLPRCheckboxState={this.changeLPRCheckboxState.bind(this)}/>;
            }, this)}
          </div>

          <div id="ni-controls" className="ni-controls">
            <label>NI
              <input name="radio" type="radio" id="ni-radio" className="ni-radio"></input>
            </label>
            {this.props.niItems.map(function(item, index){
              return <NICheckbox key={index}
                checkboxItem={item}
                itemChecked={this.state.NI[item.name].checkedStatus}
                changeNICheckboxState={this.changeNICheckboxState.bind(this)}/>;
            }, this)}
          </div>
        </div>

        {/*Information Visualization Section (for build only, not prod)*/}
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

  changeLPRCheckboxState(shouldBeChecked,checkboxName) {
    const newState = merge({},this.state,{
      LPR: {
        [checkboxName]: {checkedStatus: shouldBeChecked}
      }
    })
    this.setState.bind(this)(newState)
  }

  changeNICheckboxState(shouldBeChecked,checkboxName) {
    const newState = merge({},this.state,{
      NI: {
        [checkboxName]: {checkedStatus: shouldBeChecked}
      }
    })
    this.setState.bind(this)(newState)
  }
}

class LPRCheckbox extends Component {
  render() {
    const {checkboxItem,itemChecked,changeLPRCheckboxState} = this.props;
    const {name, label} = checkboxItem;
    return (
      <span>
        <label htmlFor={name}>{label}</label>
        <input type="checkbox" checked={itemChecked}
               onChange={(event) => {changeLPRCheckboxState(event.target.checked,name)}}
               id={name}>
        </input>
      </span>
    )
  }
}

class NICheckbox extends Component {
  render() {
    const {checkboxItem,itemChecked,changeNICheckboxState} = this.props;
    const {name, label} = checkboxItem;
    return (
      <span>
        <label htmlFor={name}>{label}</label>
        <input type="checkbox" checked={itemChecked}
               onChange={(event) => {changeNICheckboxState(event.target.checked,name)}}
               id={name}>
        </input>
      </span>
    )
  }
}

App.defaultProps = {
  lprItems: [
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
      label: "Refugee & Asylee"
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
      name: "otherLPR",
      label: "Other"
    }
  ],
  niItems: [
    {
      name: "temporaryVisitor",
      label: "Temporary Visitor"
    },
    {
      name: "studentExchange",
      label: "Student & Exchange"
    },
    {
      name: "temporaryWorker",
      label: "Temporary Worker"
    },
    {
      name: "diplomatRep",
      label: "Diplomat & Representative"
    },
    {
      name: "otherNI",
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
