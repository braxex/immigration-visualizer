/*D3 Cards*/
import React, { Component } from 'react';
import './Card.css';
import {csvData} from './Visualizer.js';
import {whichSet, whichYear, subtotalKeys} from './Visualizer.js'; //**

let countryData, selectedSet, selectedYear, selectedKeys; //**

class Card extends Component {
  render() {
    let self=this;
    function getCountryData() {  //**
      countryData = csvData.find(item => item.id === self.props.id);
      selectedSet = whichSet;
      selectedYear = whichYear;
      selectedKeys = subtotalKeys;
      console.log(selectedKeys);
      //selectedSet = ;
      //selected Year;
      console.log('countryData',countryData);
    }
    getCountryData();

    return(
      <div className='card-holder' style={{top: (this.props.y), left: this.props.x-425}}>
        {!countryData.immigrationData ?
            <div className='card-nodata'>No data available.</div>
          :
          <div>
            <div className='card-head'>
              <div className='card-flag'>
                <img src={countryData.immigrationData.href} alt=""></img>
              </div>
              <div className='card-title'>
                <p><b>{countryData.immigrationData.countryName}</b></p>
                <p>{selectedYear} Selected Total: <b>{countryData.immigrationData.selectedTotal.toLocaleString()}</b></p>
              </div>
            </div>
            <div className='card-data lpr-card-data'
                 style={{display: selectedSet === "LPR" ? 'block' : 'none'}}>
                 {selectedSet === "LPR" ?
                   <div>
                    <p style={{fontWeight: selectedKeys.indexOf('immediateRelative') !== -1 ? 'bold' : 'normal'}}
                      >Immediate Relative: {countryData.immigrationData.immediateRelative.toLocaleString() ? countryData.immigrationData.immediateRelative.toLocaleString(): 'DW'}</p>
                    <p style={{fontWeight: selectedKeys.indexOf('familySponsored') !== -1 ? 'bold' : 'normal'}}
                      >Family-Sponsored: {countryData.immigrationData.familySponsored.toLocaleString() ? countryData.immigrationData.familySponsored.toLocaleString(): 'DW'}</p>
                    <p style={{fontWeight: selectedKeys.indexOf('refugeeAsylee') !== -1 ? 'bold' : 'normal'}}
                      >Refugee & Asylee: {countryData.immigrationData.refugeeAsylee.toLocaleString() ? countryData.immigrationData.refugeeAsylee.toLocaleString(): 'DW'}</p>
                    <p style={{fontWeight: selectedKeys.indexOf('employmentBased') !== -1 ? 'bold' : 'normal'}}
                      >Employment-Based: {countryData.immigrationData.employmentBased.toLocaleString() ? countryData.immigrationData.employmentBased.toLocaleString(): 'DW'}</p>
                    <p style={{fontWeight: selectedKeys.indexOf('diversityLottery') !== -1 ? 'bold' : 'normal'}}
                      >Diversity Lottery: {countryData.immigrationData.diversityLottery.toLocaleString() ? countryData.immigrationData.diversityLottery.toLocaleString(): 'DW'}</p>
                    <p style={{fontWeight: selectedKeys.indexOf('otherLPR') !== -1 ? 'bold' : 'normal'}}
                      >Other: {countryData.immigrationData.otherLPR.toLocaleString() ? countryData.immigrationData.otherLPR.toLocaleString(): 'DW'}</p>
                  </div>: <div></div>}
            </div>
            <div className='card-data ni-card-data'
                 style={{display: selectedSet === "NI" ? 'block' : 'none'}}>
                 {selectedSet === "NI" ?
                  <div>
                   <p style={{fontWeight: selectedKeys.indexOf('temporaryVisitor') !== -1 ? 'bold' : 'normal'}}
                     >Temporary Visitor: {countryData.immigrationData.temporaryVisitor.toLocaleString() ? countryData.immigrationData.temporaryVisitor.toLocaleString(): 'DW'}</p>
                   <p style={{fontWeight: selectedKeys.indexOf('temporaryWorker') !== -1 ? 'bold' : 'normal'}}
                     >Temporary Worker: {countryData.immigrationData.temporaryWorker.toLocaleString() ? countryData.immigrationData.temporaryWorker.toLocaleString(): 'DW'}</p>
                   <p style={{fontWeight: selectedKeys.indexOf('studentExchange') !== -1 ? 'bold' : 'normal'}}
                     >Student & Exchange: {countryData.immigrationData.studentExchange.toLocaleString() ? countryData.immigrationData.studentExchange.toLocaleString(): 'DW'}</p>
                   <p style={{fontWeight: selectedKeys.indexOf('diplomatRep') !== -1 ? 'bold' : 'normal'}}
                     >Diplomat & Representative: {countryData.immigrationData.diplomatRep.toLocaleString() ? countryData.immigrationData.diplomatRep.toLocaleString(): 'DW'}</p>
                   <p style={{fontWeight: selectedKeys.indexOf('otherNI') !== -1 ? 'bold' : 'normal'}}
                     >Other: {countryData.immigrationData.otherNI.toLocaleString() ? countryData.immigrationData.otherNI.toLocaleString(): 'DW'}</p>
                  </div>: <div></div>}
            </div>
          <div className='card-notes'
               style={{display: countryData.immigrationData.countryNote === "" ? 'none' : 'block'}}>
            <p>Note: {countryData.immigrationData.countryNote}</p>
          </div>
        </div>

        }
      </div>
    )

  }
}



export default Card;
