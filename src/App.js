import React, { Component } from 'react';
import './App.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'react-tippy/dist/tippy.css';
import {merge} from 'lodash';
import * as d3 from 'd3';
import * as d3sc from 'd3-scale-chromatic';
import { Tooltip } from 'react-tippy';
import Visualizer from './Visualizer.js';
import {passFiles} from './Visualizer.js';
import Card from './Card.js';
import Legend from './Legend.js';
import {flags} from './flags.js';

let titleNotes, playing, dataFlags;
let yearSpan = [2005,2015];
export let lprScale = d3.scaleThreshold()
                .domain([0.05,0.1,0.25,0.75,1.75,4,7.5])
                .range(d3sc.schemePuBuGn[9].slice(1));
export let niScale = d3.scaleThreshold()
                .domain([0.01,0.1,0.25,.5,1,2.5,5])
                .range(d3sc.schemeYlGnBu[9].slice(1));
export let map;
export let datums = {};


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
      modal: true, //set to true before prod
    };
    this.props.lprItems.forEach(function(item) {
      initialState.LPR[item.name] = {checkedStatus: true};
    })
    this.props.niItems.forEach(function(item) {
      initialState.NI[item.name] = {checkedStatus: true};
    })
    this.state = initialState;
  }

  render() {
    let colors = (this.state.radioDataset === 'LPR') ? this.props.lprColors : this.props.niColors;
    let thresholds = (this.state.radioDataset === 'LPR') ? this.props.lprThresholds : this.props.niThresholds;
    return (
      <div className="App">

        {/*Header Section*/}
        <header className="App-header">
          <h1 className="App-title">Immigration Visualizer</h1>
        </header>

        {/*Modal Section*/}
        <div className='modal-manager' style={{display: this.state.modal ? 'block' : 'none'}}
          onClick={() => {
            this.hideModal();
          }}>
          <Modal />
        </div>

        {/*D3 Visualization Section*/}
        <div id="D3-holder" className="D3-holder">
          <Visualizer {...this.state} saveAppState={this.setState.bind(this)}/>
        </div>
        {this.state.hoverCountry && <Card {...this.state.hoverCountry}/>}

        <div id="legend-holder" className="legend-holder">
          <Legend colors={colors} thresholds={thresholds}/>
        </div>
        <div id="year-display" className="year-display">
          <Tooltip title={titleNotes.genMsg} size='small' position='bottom' trigger='mouseenter'
            animation='shift' hideOnClick={true}>
            Data: US Department of Homeland Security, {this.state.dataYear}
          </Tooltip>
        </div>

        {/*Slider & Play Controls Section*/}
        <div id="slider-box" className="slider-box">
          <div>
            <i className={`fa fa-${this.state.isPlaying ? 'pause' : 'play'}-circle-o fa-2x`}
              aria-hidden="true" onClick={() => {
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
              style={{color: this.state.radioDataset==='LPR' ? '#000000' : '#666666'}}>
              <label>
                <Tooltip title={titleNotes.lprMsg} size='small' position='left-start' trigger='mouseenter'
                  animation='shift' interactive='true' hideOnClick={true}>LPR
                </Tooltip>
                <input name="radio" type="radio" id="lpr-radio" className="lpr-radio" value="LPR"
                  defaultChecked={true}
                  onChange={(event) => this.changeRadioDataset(event.target.value)}></input>
              </label>
            </div>
            <div id='ni-toggle-box' className='ni-toggle-box toggle-box'
              style={{color: this.state.radioDataset==='NI' ? '#000000' : '#666666'}}>
              <label>
                <Tooltip title={titleNotes.niMsg} size='small' position='right-start' trigger='mouseenter'
                  animation='shift' interactive='true' hideOnClick={true}>NI
                </Tooltip>
                <input name="radio" type="radio" id="ni-radio" className="ni-radio" value="NI"
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
                  return <LPRCheckbox key={index}
                    checkboxItem={item}
                    itemChecked={this.state.LPR[item.name].checkedStatus}
                    changeLPRCheckboxState={this.changeLPRCheckboxState.bind(this)}/>;
                }, this)}
              </div>
              <div className='checkbox-holder ni-checkbox-div'
                style={{display: this.state.radioDataset==='NI' ? 'block' : 'none'}}>
                {this.props.niItems.map(function(item, index){
                  return <NICheckbox key={index}
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

  slideHandler(firstTime) { //BUG3
    if (firstTime) {
      console.log('should linger');
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
        if (this.state.dataYear < 2015) {
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
}


class Modal extends Component {
  render() {
    return (
      <div id='modal-holder' className="modal-holder">
          <div className="image"><img src="liberty.png" alt="" title="test"></img></div>
        <div className="main-modal">
          <div className="colossus">From her beacon-hand<br/>
                                    Glows world-wide welcome…<br/>
                                    “Give me your tired, your poor,<br/>
                                    Your huddled masses yearning to breathe free<br/>
                                    Send these, the homeless, tempest-tost to me”
          </div>
          <div className="image-credit">image:
            <a href="https://goo.gl/Wt4S3r" alt=""
              target="_blank" rel="noopener noreferrer"> andrewasmith</a>
          </div>
        </div>
      </div>
    )
  }
}

class LPRCheckbox extends Component {
  render() {
    const {checkboxItem,itemChecked,changeLPRCheckboxState} = this.props;
    const {name, label, title} = checkboxItem;
    return (
      <div className="checkbox-item-holder">
        <label>
          <input className="checkbox" type="checkbox" checked={itemChecked}
            onChange={(event) => {changeLPRCheckboxState(event.target.checked,name)}}
            id={name}>
          </input>
          <Tooltip title={title} size='small' position='bottom' trigger='mouseenter'
            animation='shift' hideOnClick={true}>
            {label}
          </Tooltip>
        </label>
      </div>
    )
  }
}

class NICheckbox extends Component {
  render() {
    const {checkboxItem,itemChecked,changeNICheckboxState} = this.props;
    const {name, label, title} = checkboxItem;
    return (
      <span>
        <label>
          <input type="checkbox" checked={itemChecked}
            onChange={(event) => {changeNICheckboxState(event.target.checked,name)}}
            id={name}>
          </input>
          <Tooltip title={title} size='small' position='bottom' trigger='mouseenter'
            animation='shift' hideOnClick={true}>
            {label}
          </Tooltip>
        </label>
      </span>
    )
  }
}


d3.json('./map_geo.json', (err,geofile) => {
  if (err) {
    console.log(err)
  } else {
    map = geofile;
    for (let i=yearSpan[0]; i <= yearSpan[1]; i = i + 1) {
      datums['lpr' + i] = makeMyData(i, 'lpr');
      datums['ni' + i] = makeMyData(i, 'ni');
    }
  }
})

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
  dataFlags = dataset.map(data => ({...data, href: flags.find(flag => flag[0] === data.ISO)[2]  }))
  datums[radioset+year] = world.features.map(f => ({
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
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
  if (year === 2005 && radioset === 'lpr') { //**only the first
  passFiles(datums,map);
  }
  if (year === 2015 && radioset === 'ni') { //**and the last
  passFiles(datums,map);
  }
}

function makeMyData(year, radioset) {
  /*loads new dataset and prepares for manipulation*/
  d3.csv(("./"+radioset+year+".csv"), function(err, csvData) {
    if (err) {
      console.log(err)
    } else {
      combinator(map,csvData,flags,year,radioset);
    }
  });
}

App.defaultProps = {
  lprItems: [
    {
      name: "immediateRelative",
      label: "Immediate Relative",
      title: "Spouses, parents, and minor children (including those being adopted) of US citizens.<br/>Accounts for ≈44.3% of LPRs annually."
    },
    {
      name: "familySponsored",
      label: "Family-Sponsored",
      title: "Unmarried adult children of US citizens and LPRs (and their minor children), as well as immediate relatives of LPRs (spouses, minor children, adult children (and their minor children), and adult siblings (and their minor children)).<br/>Accounts for ≈20.1% of LPRs annually."
    },
    {
      name: "refugeeAsylee",
      label: "Refugee & Asylee",
      title: "Those who have been persecuted or fear they will be persecuted on the basis of race, religion, nationality, and/or membership in a social or political group, as well as their immediate relatives.<br/>Accounts for ≈14.9% of LPRs annually."
    },
    {
      name: "employmentBased",
      label: "Employment-Based",
      title: "Those who emigrate for employment (priority workers, advanced professionals, skilled workers, etc.) and their spouses/minor children.<br/>Accounts for ≈14.3% of LPRs annually."
    },
    {
      name: "diversityLottery",
      label: "Diversity Lottery",
      title: "Those who emigrate to the US from countries with relatively low levels of immigration under the Diversity Immigration Visa Program.<br/>Accounts for ≈4.3% of LPRs annually."
    },
    {
      name: "otherLPR",
      label: "Other",
      title: "Others who qualify as a result of other special legislation extending LPR status to classes of individuals from certain countries and in certain situations.<br/>Accounts for ≈2.1% of LPRs annually."
    }
  ],
  niItems: [
    {
      name: "temporaryVisitor",
      label: "Temporary Visitor",
      title: "Those visiting the US for pleasure (vacation, visiting family/friends, or for medical treatment) or business (attending business meetings and conferences/conventions).<br/>Accounts for ≈88.9% of NIs annually."
    },
    {
      name: "temporaryWorker",
      label: "Temporary Worker",
      title: "Temporary workers/trainees (intracompany transfers, foreign reporters) and their spouses/minor children.<br/>Accounts for ≈3.7% of NIs annually."
    },
    {
      name: "studentExchange",
      label: "Student & Exchange",
      title: "Students and exchange visitors (scholars, physicians, teachers, etc.) and their spouses/minor children.<br/>Accounts for ≈5.2% of NIs annually."
    },
    {
      name: "diplomatRep",
      label: "Diplomat & Representative",
      title: "Diplomats and representatives (ambassadors, public ministers, diplomats, consular officers, and accompanying attendants/personal employees) and their spouses/minor children.<br/>Accounts for ≈0.7% of NIs annually."
    },
    {
      name: "otherNI",
      label: "Other",
      title: "Those in immediate transit through the US, commuter students, fiancé(e)s and spouses of US citizens, etc.<br/>Accounts for ≈1.5% of NIs annually."
    }
  ],
  yearBounds: yearSpan,
  lprThresholds: lprScale.domain(),
  lprColors: lprScale.range(),
  niThresholds: niScale.domain(),
  niColors: niScale.range(),
  datums
}

titleNotes = {
  lprMsg: "Lawful permanent residents (LPRs, often referred to as “immigrants” or “green card holders”) are non-citizens who are lawfully authorized to live permanently in the US. LPRs may apply to become US citizens if they meet certain eligibility requirements. LPRs do not include foreign nationals granted temporary admission to the US, such as tourists and temporary workers (including H1B visa holders). 5-year average: ≈1.03 million/year. <br/> <br/> For more information, visit <a href='https://goo.gl/dN78yY'>https://goo.gl/dN78yY</a>.",
  niMsg: "Nonimmigrants (NIs) are foreign nationals granted temporary admission into the US for reasons including  tourism and business trips, academic/vocational study, temporary employment, and to act as a representative of a foreign government or international organization. NIs are authorized to enter the country for specific purposes and defined periods of time, which are prescribed by their class of admission. 5-year average: ≈63.72 million/year. <br/> <br/> For more information visit <a href='https://goo.gl/LJLYzc'>https://goo.gl/LJLYzc</a>.",
  genMsg: "Data not shown for those with unknown country of birth/origin and for countries where total activity count was less than 10 people. <br/> DW = Data withheld to limit disclosures, per government sources."
}

export default App;
