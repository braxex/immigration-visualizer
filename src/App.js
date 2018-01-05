import React, { Component } from 'react';
import './App.min.css';
import 'font-awesome/css/font-awesome.min.css';
import {merge} from 'lodash';
import Visualizer from './Visualizer.js';
import Legend from './Legend.js';

let titleNotes = {
  lprMsg: "Lawful permanent residents (LPRs) are non-US citizens who are lawfully authorized to live permanently within the United States. LPRs are often referred to simply as “immigrants”, but are also known as “permanent resident aliens” or “green card holders”. LPRs may accept an offer of employment without special restrictions, own property, receive financial assistance at public colleges and universities, and join the Armed Forces. They may also apply to become US citizens if they meet certain eligibility requirements. LPRs do not include those foreign nationals granted temporary admission to the US, such as temporary workers (including H1B visa holders), students/exchange visitors, diplomats, tourists, or those traveling for business. For more information, visit https://goo.gl/dN78yY.",
  niMsg: "Nonimmigrants (NIs) are foreign nationals granted temporary admission into the United States. The major purposes for which nonimmigrant admission may be authorized include temporary visits for business or pleasure, academic or vocational study, temporary employment, or to act as a representative of a foreign government or international organization, among others. Unlike people granted LPR, or “green card” status, who may live in the United States essentially free of restrictions, nonimmigrants are authorized to enter the country for specific purposes. Nonimmigrant’s duration of stay and lawful activities, such as employment, travel, and accompaniment by dependents, are prescribed by their class of admission. For more information visit https://goo.gl/LJLYzc."
}

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
      initialState.NI[item.name] = {checkedStatus: true};
    })
    this.state = initialState;
  }

  render() {
    return (
      <div className="App">

        {/*Header Section*/}
        <header className="App-header">
          <h1 className="App-title">Immigration Visualizer</h1>
        </header>

        {/*D3 Visualization Section*/}
        <div id="D3-holder" className="D3-holder">
          <Visualizer {...this.state}/>
        </div>
        <div id="legend-holder" className="legend-holder">
          <Legend {...this.state}/>
        </div>
        <div id="year-display" className="year-display">Data: US Department of Homeland Security, {this.state.dataYear}</div>

        {/*Slider & Play Controls Section*/}
        <div id="slider-box" className="slider-box">
          <div>
            <i className={`fa fa-${this.state.isPlaying ? 'pause' : 'play'}-circle-o fa-2x`}
              aria-hidden="true" onClick={() => this.toggleIsPlaying(this.state.isPlaying,this.state.dataYear)}></i>
            <input type="range" className="slider" ref="slider"
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
            <div id='lpr-toggle-box' className='lpr-toggle-box toggle-box'
              style={{color: this.state.radioDataset==='LPR' ? '#000000' : '#666666'}}>
              <label title={titleNotes.lprMsg}>LPR
                <input name="radio" type="radio" id="lpr-radio" className="lpr-radio" value="LPR"
                  defaultChecked={true}
                  onChange={(event) => this.changeRadioDataset(event.target.value)}></input>
              </label>
            </div>
            <div id='ni-toggle-box' className='ni-toggle-box toggle-box'
              style={{color: this.state.radioDataset==='NI' ? '#000000' : '#666666'}}>
              <label title={titleNotes.niMsg}>NI
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

        {/*Information Visualization Section (for build only, not prod)
        <div>
          <InfoVis {...this.state}/>
        </div>*/}
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

  toggleIsPlaying(playState,currYear) {     //BUG3 & BUG4
    console.log('play status',this.state.isPlaying);
    this.setState.bind(this)({
      isPlaying: !playState,
    });
      if (currYear < 2015) {
        this.setState({
          dataYear: this.state.dataYear +1
        })
      }
      else {
        this.setState({
          dataYear: 2005
        })
      }
    }
}

class LPRCheckbox extends Component {
  render() {
    const {checkboxItem,itemChecked,changeLPRCheckboxState} = this.props;
    const {name, label, title} = checkboxItem;
    return (
      <div className="checkbox-item-holder">
        <input className="checkbox" type="checkbox" checked={itemChecked}
               onChange={(event) => {changeLPRCheckboxState(event.target.checked,name)}}
               id={name}>
        </input>
        <label title={title} className="checkbox-label" htmlFor={name}>{label}</label>
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
        <input type="checkbox" checked={itemChecked}
               onChange={(event) => {changeNICheckboxState(event.target.checked,name)}}
               id={name}>
        </input>
        <label title={title} className="checkbox-label" htmlFor={name}>{label}</label>
      </span>
    )
  }
}

App.defaultProps = {
  lprItems: [
    {
      name: "immediateRelative",
      label: "Immediate Relative",
      title: "Immediate Relatives of US Citizens. Accounted for ≈44% of LPRs in 2015. Includes spouses, parents, and minor children (including those being adopted)."
    },
    {
      name: "familySponsored",
      label: "Family-Sponsored",
      title: "Family-Sponsored Preferences. Accounted for ≈20% of LPRs in 2015. Includes unmarried adult children of US citizens and LPRs (and their minor children), as well as immediate relatives of LPRs (includes spouses, minor children, adult children (and their minor children), and adult siblings (and their minor children))."
    },
    {
      name: "refugeeAsylee",
      label: "Refugee & Asylee",
      title: "Refugees and Asylees. Accounted for ≈14% of LPRs in 2015. Includes those who have been persected or fear they will be persecuted on the bsis of race, religion, nationality, and/or membership in a social or political group, as well as their immediate relatives."
    },
    {
      name: "employmentBased",
      label: "Employment-Based",
      title: "Employment-Based Preferences. Accounted for ≈14% of LPRs in 2015. Includes those who emigrate for employement (priority workers, advanced professionals, skilled workers, etc.) and their spouses/minor children."
    },
    {
      name: "diversityLottery",
      label: "Diversity Lottery",
      title: "Diversity Visa Lottery. Accounted for ≈5% of LPRs in 2015. Includes those who seek to immigrate to the US from countries with relatively low levels of immigration (under the Diversity Immigration Visa Program)."
    },
    {
      name: "otherLPR",
      label: "Other",
      title: "Other. Accounted for ≈3% of LPRs in 2015. Includes others who qualify as a result of other special legislation allowing classes of individuals from certain countries and in certain situations."
    }
  ],
  niItems: [
    {
      name: "temporaryVisitor",
      label: "Temporary Visitor",
      title: "Temporary Visitors for Business or Pleasure (Tourists). Accounted for ≈90% of NIs in 2015. Includes those visiting the US for pleasure (tourism, vacation, visting family/friends, or for medical treatment) or business (attending business meetings and conferences/conventions)."
    },
    {
      name: "temporaryWorker",
      label: "Temporary Worker",
      title: "Temporary Workers. Accounted for ≈5% of NIs in 2015. Includes temporary workers/trainees (including intracompany transfers and foreign reporters) and their spouses/minor children."
    },
    {
      name: "studentExchange",
      label: "Student & Exchange",
      title: "Students and Exchange Visitors. Accounted for ≈3% of NIs in 2015. Includes academic students and exchange visitors (scholars, physicians, teachers, etc.) and their spouses/minor children."
    },
    {
      name: "diplomatRep",
      label: "Diplomat & Representative",
      title: "Diplomats and Other Representatives. Accounted for ≈1% of NIs in 2015. Includes all diplomats and representatives (including ambassadors, public ministers, diplomats, consular officers, and accompanying attendants/personal employees) and their spouses/minor children."
    },
    {
      name: "otherNI",
      label: "Other",
      title: "Other. Accounted for ≈1% of NIs in 2015. Includes those in immediate transit through the US, commuter students, fiancé(e)s and spouses of US citizens, etc."
    }
  ],
  yearBounds: [
    2005,
    2015
  ]
}

/*  return (
    <div className="info-visualizer">
      {JSON.stringify(data,null,2)}
    </div>
  )
}*/

export default App;
