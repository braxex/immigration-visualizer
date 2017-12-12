import React, { Component } from 'react';
import './App.min.css';
import 'font-awesome/css/font-awesome.min.css';
import {merge} from 'lodash';
import Visualizer from './Visualizer.js';

class App extends Component {

  constructor(props) {
    super(props)

    //Initial State Definitions
    const initialState = {
      LPR: {},
      NI: {},
      radioDataset: 'LPR',
      dataYear: this.props.yearBounds[0],
      isPlaying: false
    };
    this.props.lprItems.forEach(function(item) {
      initialState.LPR[item.name] = {checkedStatus: true};
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
        <div id="year-display" className="year-display">Data: US Department of Homeland Security, {this.state.dataYear}</div>

        {/*Slider & Play Controls Section*/}
        <div id="slider-box" className="slider-box">
          <div>
            <i className={`fa fa-${this.state.isPlaying ? 'pause' : 'play'}-circle-o fa-2x`}
              aria-hidden="true" onClick={() => this.toggleIsPlaying(this.state.isPlaying)}></i>
            <input type="range" className="slider"
              min={this.props.yearBounds[0]}
              max={this.props.yearBounds[1]}
              onChange={(event) => this.changeDataYear(event.target.value)}
              value={this.state.dataYear}>
            </input>
          </div>
        </div>

        {/*Radio Control Section*/}
        <div id="controller-box" className="controller-box">
          <div id="toggle-controls" className="toggle-controls">
            <label title="Lawful Permanent Resident (LPR)">LPR
              <input name="radio" type="radio" id="lpr-radio" className="lpr-radio" value="LPR"
                defaultChecked={true}
                onChange={(event) => this.changeRadioDataset(event.target.value)}></input>
            </label>
            <label title="Nonimmigrant (NI)">NI
              <input name="radio" type="radio" id="ni-radio" className="ni-radio" value="NI"
                onChange={(event) => this.changeRadioDataset(event.target.value)}></input>
            </label>
          </div>

        {/*Checkbox Control Section*/}
          <div id="main-checkbox-div" className="main-checkbox-div">
              <div className='checkbox-holder lpr-checkbox-div'>
                {this.props.lprItems.map(function(item, index){
                  return <LPRCheckbox key={index}
                    checkboxItem={item}
                    itemChecked={this.state.LPR[item.name].checkedStatus}
                    changeLPRCheckboxState={this.changeLPRCheckboxState.bind(this)}/>;
                }, this)}
              </div>
              <div className='checkbox-holder ni-checkbox-div'>
                {this.props.niItems.map(function(item, index){
                  return <NICheckbox key={index}
                    checkboxItem={item}
                    itemChecked={this.state.NI[item.name].checkedStatus}
                    changeNICheckboxState={this.changeNICheckboxState.bind(this)}/>;
                }, this)}
              </div>
          </div>
        </div>

        {/*Information Visualization Section (for build only, not prod)*/}
        <div>
          <InfoVis {...this.state}/>
        </div>
      </div>
    );
  }

  changeDataYear(sliderValue,playing) {
    this.setState.bind(this)({
      dataYear: sliderValue,
      isPlaying: false
    })
    //console.log('this will reset the slideshow')
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

  changeRadioDataset(radioValue) {
    this.setState.bind(this)({
      radioDataset: radioValue
    })
  }

  toggleIsPlaying(playState) {
    this.setState.bind(this)({
      isPlaying: !playState
    })
  }
}

class LPRCheckbox extends Component {
  render() {
    const {checkboxItem,itemChecked,changeLPRCheckboxState} = this.props;
    const {name, label} = checkboxItem;
    return (
      <div className="checkbox-item-holder">
        <input className="checkbox" type="checkbox" checked={itemChecked}
               onChange={(event) => {changeLPRCheckboxState(event.target.checked,name)}}
               id={name}>
        </input>
        <label className="checkbox-label" htmlFor={name}>{label}</label>
      </div>
    )
  }
}

class NICheckbox extends Component {
  render() {
    const {checkboxItem,itemChecked,changeNICheckboxState} = this.props;
    const {name, label} = checkboxItem;
    return (
      <span>
        <input type="checkbox" checked={itemChecked}
               onChange={(event) => {changeNICheckboxState(event.target.checked,name)}}
               id={name}>
        </input>
        <label htmlFor={name}>{label}</label>
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
