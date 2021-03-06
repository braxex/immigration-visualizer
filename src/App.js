
import React, { Component } from 'react';
import './App.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'react-tippy/dist/tippy.css';
import * as d3 from 'd3';
import * as d3sc from 'd3-scale-chromatic';
import {merge} from 'lodash';
import { Tooltip } from 'react-tippy';
import Visualizer from './Visualizer.js';
import Legend from './Legend.js';
import Card from './Card.js';
import {flags} from './Flagfile.js';
import {LPRCheckbox, NICheckbox, Modal} from './Reusables.js';
import {lprStatics, niStatics, noteStatics} from './Statics.js';

//Variable Declarations
export let lprScale = d3.scaleThreshold()
                .domain([0.05,0.1,0.25,0.75,1.5,4,7.5])
                .range(d3sc.schemePuBuGn[9].slice(1));
export let niScale = d3.scaleThreshold()
                .domain([0.01,0.1,0.25,.5,1,2.5,5])
                .range(d3sc.schemeYlGnBu[9].slice(1));
export let map;
let yearBounds = [2005,2016];
let playing;


class App extends Component {

  constructor(props) {
    super(props)

    //Initial State Definitions
    const initialState = {
      LPR: {},
      NI: {},
      radioDataset: 'LPR',
      dataYear: this.props.yearBounds[0],
      isPlaying: false,
      hoverCountry: null,
      map: null,
      mapBox: null,
      datums: null,
      modal: true,
    };
    this.props.lprItems.forEach(function(item) {
      initialState.LPR[item.name] = {checkedStatus: true};
    })
    this.props.niItems.forEach(function(item) {
      initialState.NI[item.name] = {checkedStatus: true};
    })
    this.state = initialState;
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    const selectedCategories = this.getSelectedCategories();
    const selectedDataset = (
      this.state.datums &&
      this.state.datums[(this.state.radioDataset).toLowerCase()+this.state.dataYear]
    );
    let countryImmigrationData = selectedDataset && selectedDataset.find(item => {

      return item.id === (this.state.hoverCountry && this.state.hoverCountry.id)})
      if (countryImmigrationData) {
        countryImmigrationData = countryImmigrationData.immigrationData || {};
      } else {
          countryImmigrationData = {};
      }
    const colors = (this.state.radioDataset === 'LPR') ?
                    this.props.lprColors : this.props.niColors;
    const thresholds = (this.state.radioDataset === 'LPR') ?
                        this.props.lprThresholds : this.props.niThresholds;
    const mapBox = this.state.mapBox;

    return (

      <div className="App">
        {/*Header Section*/}
        <header className="App-header">
          <h1 className="App-title">
            <Tooltip
              title={this.props.noteItems.headMsg}
              size='small'
              position='bottom'
              trigger='mouseenter'
              animation='shift'
              interactive='true'
              hideOnClick={true}>
              US Immigration Visualizer
            </Tooltip>
          </h1>
        </header>

        {/*Modal Section*/}
        <div className='modal-manager'
             style={{display: this.state.modal ? 'block' : 'none'}}
             onClick={() => {
               this.hideModal();
             }}>
          <Modal />
        </div>

        {/*D3 Visualization Section*/}
        <div id="D3-holder"
          className="D3-holder"
          ref='D3box'>
          <Visualizer
            {...this.state}
            {...this.defaultProps}
            saveAppState={this.setState.bind(this)}
            selectedCategories={selectedCategories}
            selectedDataset={selectedDataset}/>
        </div>
        {/*Card Section*/}
        {this.state.hoverCountry && <Card
          radioDataset= {this.state.radioDataset}
          dataYear= {this.state.dataYear} {...this.state.hoverCountry}
          countryImmigrationData={countryImmigrationData}
          selectedCategories={selectedCategories}
          mapBox={mapBox}/>
          }

        {/*Legend & Year Display Section*/}
        <div id="legend-holder" className="legend-holder">
          <Legend
            colors={colors}
            thresholds={thresholds}/>
        </div>
        <div id="year-display" className="year-display">
          <Tooltip
            title={this.props.noteItems.genMsg}
            size='small'
            position='bottom'
            trigger='mouseenter'
            animation='shift'
            interactive='true'
            hideOnClick={true}>
            Data: US Department of Homeland Security, {this.state.dataYear}
          </Tooltip>
        </div>

        {/*Slider & Play Controls Section*/}
        <div id="slider-box" className="slider-box">
          <div>
            <i className={`fa fa-${this.state.isPlaying ? 'pause' : 'play'}-circle-o fa-2x`}
               aria-hidden="true"
               onClick={() => {
                this.playToggle(this.state.isPlaying,this.state.dataYear);
              }}
            ></i>
            <input type="range" className="slider"
              min={this.props.yearBounds[0]}
              max={this.props.yearBounds[1]}
              onChange={(event) => this.changeDataYear(parseInt(event.target.value,10))}
              value={this.state.dataYear}>
            </input>
          </div>
        </div>

        {/*RadioDataset Control Section*/}
        <div id="controller-box" className="controller-box">
          <div id="toggle-controls" className="toggle-controls">
            <div id='lpr-toggle-box' className='lpr-toggle-box toggle-box'
              style={{color: this.state.radioDataset==='LPR' ? '#000000' : '#AAAAAA'}}>
              <label>
                <Tooltip
                  title={this.props.noteItems.lprMsg}
                  size='small'
                  position='left-start'
                  trigger='mouseenter'
                  animation='shift'
                  interactive='true'
                  hideOnClick={true}>LPR
                </Tooltip>
                <input id="lpr-radio" className="lpr-radio"
                  name="radio"
                  type="radio"
                  value="LPR"
                  defaultChecked={true}
                  onChange={(event) => this.changeRadioDataset(event.target.value)}></input>
              </label>
            </div>
            <div id='ni-toggle-box' className='ni-toggle-box toggle-box'
              style={{color: this.state.radioDataset==='NI' ? '#000000' : '#AAAAAA'}}>
              <label>
                <Tooltip
                  title={this.props.noteItems.niMsg}
                  size='small'
                  position='right-start'
                  trigger='mouseenter'
                  animation='shift'
                  interactive='true'
                  hideOnClick={true}>NI
                </Tooltip>
                <input id="ni-radio" className="ni-radio"
                  name="radio"
                  type="radio"
                  value="NI"
                  onChange={(event) =>
                    this.changeRadioDataset(event.target.value)}></input>
              </label>
            </div>
          </div>

        {/*Checkbox Control Section*/}
          <div id="main-checkbox-div" className="main-checkbox-div">
              <div className='checkbox-holder lpr-checkbox-div'
                style={{display: this.state.radioDataset==='LPR' ? 'block' : 'none'}}>
                {this.props.lprItems.map(function(item, index){
                  return <LPRCheckbox
                    key={index}
                    checkboxItem={item}
                    itemChecked={this.state.LPR[item.name].checkedStatus}
                    changeLPRCheckboxState={this.changeLPRCheckboxState.bind(this)}/>;
                }, this)}
              </div>
              <div className='checkbox-holder ni-checkbox-div'
                style={{display: this.state.radioDataset==='NI' ? 'block' : 'none'}}>
                {this.props.niItems.map(function(item, index){
                  return <NICheckbox
                    key={index}
                    checkboxItem={item}
                    itemChecked={this.state.NI[item.name].checkedStatus}
                    changeNICheckboxState={this.changeNICheckboxState.bind(this)}/>;
                }, this)}
              </div>
          </div>
        </div>
      </div>
    );
  }

  hideModal() {
    this.setState.bind(this)({
      modal: false
    })
  }

  changeDataYear(sliderValue) {
    this.setState.bind(this)({
      dataYear: sliderValue,
      isPlaying: false
    })
    clearInterval(playing);
  }

  changeLPRCheckboxState(shouldBeChecked,checkboxName) {
    const newState = merge({},this.state.LPR,{
      [checkboxName]: {checkedStatus: shouldBeChecked}
    })
    this.setState.bind(this)({
      LPR: newState
    })
  }

  changeNICheckboxState(shouldBeChecked,checkboxName) {
    const newState = merge({},this.state.NI,{
      [checkboxName]: {checkedStatus: shouldBeChecked}
    })
    this.setState.bind(this)({
      NI: newState
    })
  }

  changeRadioDataset(radioValue) {
    this.setState.bind(this)({
      radioDataset: radioValue
    })
  }

  playToggle() {
    if (!this.state.isPlaying) {
      this.slideHandler(true);
      playing = setInterval(this.slideHandler.bind(this),750);
    } else {
      clearInterval(playing);
      this.setState.bind(this)({
        isPlaying: false
      })
    }
  }

  slideHandler(firstTime) {
    if (firstTime) {
      this.setState.bind(this)({
        isPlaying: true
      })
    }
    else {
      if (!this.state.isPlaying) {
        this.setState.bind(this)({
          isPlaying: true,
          dataYear: parseInt(this.state.dataYear,10)+1,
        })
      }
      else {
        if (this.state.dataYear < 2016) {
          this.setState.bind(this)({
            dataYear: parseInt(this.state.dataYear,10)+1,
          })
        } else {
          this.setState.bind(this)({
            dataYear: 2005,
            isPlaying: false,
          })
          clearInterval(playing);
        }
      }
    }
  }

  getSelectedCategories() {
    const self = this;
    return Object.keys(self.state[self.state.radioDataset])
      .filter(key => self.state[self.state.radioDataset][key].checkedStatus === true);
  }

  loadData() {
    const self = this;
    const datums = {};

    d3.json('./map_geo.json', (err,map) => {
      if (err) {
        console.log(err)
      } else {
          const combinerProgress = {
            filesLeft: (yearBounds[1] - yearBounds[0])*2
          };
          this.setState({map})

          for (let i=yearBounds[0]; i <= yearBounds[1]; i++) {
            datums['lpr' + i] = makeMyData(i, 'lpr', combinerProgress, map);
            datums['ni' + i] = makeMyData(i, 'ni', combinerProgress, map);
          }
        }
    });

    function makeMyData(year, radioset, combinerProgress, map) {
      /*loads new dataset and prepares for manipulation*/
      d3.csv(("./"+radioset+year+".csv"), function(err, csvData) {
        if (err) {
          console.log(err)
        } else {
          combinator(map,csvData,flags,year,radioset);
          combinerProgress.filesLeft -= 1;
          if (combinerProgress.filesLeft === 0) {
            self.setState({datums});
          }
        }
      });
    }

    function combinator(world, dataset, flags, year, radioset) {
      if (radioset === 'lpr') {
        dataset.forEach(function(d) {
          d.immediateRelative = +d.immediateRelative;
          d.familySponsored = +d.familySponsored;
          d.employmentBased = +d.employmentBased;
          d.refugeeAsylee = +d.refugeeAsylee;
          d.diversityLottery = +d.diversityLottery;
          d.adoptedOrphans = +d.adoptedOrphans;
          d.otherLPR = +d.otherLPR;
          d.total = +d.total;
        })
      }
      if (radioset === 'ni') {
        dataset.forEach(function(d) {
          d.temporaryVisitor = +d.temporaryVisitor;
          d.studentExchange = +d.studentExchange;
          d.temporaryWorker = +d.temporaryWorker;
          d.diplomatRep = +d.diplomatRep;
          d.otherNI = +d.otherNI;
          d.total = +d.total;
        })
      }
      let dataFlags = dataset.map(data => ({...data, href: flags.find(
        flag => flag[0] === data.ISO)[2]  }))
      datums[radioset+year] = world.features.map(f => ({
        type: 'Feature',
        id: f.properties.iso_a3,
        name: f.properties.name_long,
        formalName: f.properties.formal_en,
        population: f.properties.pop_est,
        geometry: f.geometry,
        immigrationData: dataFlags.find(dataFlag =>
          dataFlag.ISO === f.properties.iso_a3)
      })
    )
      .sort((a,b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    }
  }
}

App.defaultProps = {
  lprItems: lprStatics,
  niItems: niStatics,
  noteItems: noteStatics,
  yearBounds: yearBounds,
  lprThresholds: lprScale.domain(),
  lprColors: lprScale.range(),
  niThresholds: niScale.domain(),
  niColors: niScale.range(),
}

export default App;
