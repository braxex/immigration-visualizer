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
      toggleState: 'neither',
      sliderState: this.props.yearBounds[0],
      playState: 'none'
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
          <div id="year-display" className="year-display">Showing Data for {this.state.sliderState}</div>
          <div id="fix">
            <input type="range" className="slider"
              min={this.props.yearBounds[0]}
              max={this.props.yearBounds[1]}
              onChange={(event) => this.changeSliderState(event.target.value)}
              value={this.state.sliderState}>
            </input>
          </div>
        </div>

        {/*Play Control Section*/}
        <div className='play-controls'>
          <i className="fa fa-undo fa-2x" aria-hidden="true"></i>
          <i className="fa fa-play-circle-o fa-2x" aria-hidden="true" onClick={() => this.changePlayStateToPlaying(this.state.playState)}></i>
          <i className="fa fa-pause-circle-o fa-2x" aria-hidden="true" onClick={() => this.changePlayStateToPaused(this.state.playState)}></i>
        </div>

        {/*Radio & Checkbox Control Section*/}
        <div id="controller-box" className="controller-box">
          <div id="lpr-controls" className="controls lpr-controls">
            <div className='toggle-div'>
              <label>LPR
                <input name="radio" type="radio" id="lpr-radio" className="lpr-radio" onChange={() => this.changeToggleToLPR(this.state.toggleState)}></input>
              </label>
            </div>
            <div className='box-div'>
              {this.props.lprItems.map(function(item, index){
                return <LPRCheckbox key={index}
                  checkboxItem={item}
                  itemChecked={this.state.LPR[item.name].checkedStatus}
                  changeLPRCheckboxState={this.changeLPRCheckboxState.bind(this)}/>;
              }, this)}
            </div>
          </div>
          <div id="ni-controls" className="controls ni-controls">
            <div className='toggle-div'>
              <label>NI
                <input name="radio" type="radio" id="ni-radio" className="ni-radio" onChange={() => this.changeToggleToNI(this.state.toggleState)}></input>
              </label>
            </div>
            <div className='box-div'>
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

  changeSliderState(sliderValue,playing) {
    this.setState.bind(this)({
      sliderState: sliderValue
    })
    this.setState.bind(this)({
      playState: 'none'
    })
    //console.log('this will reset the slideshow')
    //TO-DO: reset play sequence, (gray out pause button, darken play button)?
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

  changeToggleToLPR(toggle) {
    this.setState.bind(this)({
      toggleState: 'LPR'
    })
  }

  changeToggleToNI(toggle) {
    this.setState.bind(this)({
      toggleState: 'NI'
    })
  }

  changePlayStateToPlaying(playState) {
    if (playState === 'playing') {}
    else if (playState === 'none') {
      this.setState.bind(this)({
        playState: 'playing'
      })
      //console.log('this will start slideshow')
      //TO-DO: begin play sequence, (gray out play button, darken pause button)?
    } else if (playState === 'paused') {
      this.setState.bind(this)({
        playState: 'playing'
      })
      //console.log('this will resume slideshow')
      //TO-DO: resume play sequence, (gray out play button, darken pause button)?
    }
  }

  changePlayStateToPaused(playState) {
    if (playState === 'none' || playState === 'paused') {}
    else if (playState === 'playing') {
      this.setState.bind(this)({
        playState: 'paused'
      })
      console.log('this will pause the slideshow')
      //TO-DO: pause play sequence, gray out pause button, darken play button
    }
  }
}

class LPRCheckbox extends Component {
  render() {
    const {checkboxItem,itemChecked,changeLPRCheckboxState} = this.props;
    const {name, label} = checkboxItem;
    return (
      <span>
        <input type="checkbox" checked={itemChecked}
               onChange={(event) => {changeLPRCheckboxState(event.target.checked,name)}}
               id={name}>
        </input>
        <label htmlFor={name}>{label}</label>
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
  toggleState: 'neither',
  yearBounds: [
    2005,
    2015
  ],
  playState: 'none'
}

function InfoVis(data) {
  return (
    <div className="info-visualizer">
      {JSON.stringify(data,null,2)}
    </div>
  )
}

export default App;
