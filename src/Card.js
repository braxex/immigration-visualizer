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
            <div className='card-nodata'>No data provided.</div>
          :
          <div>
            <div className='card-head'>
              <div className='card-flag'>
                <img src={countryData.immigrationData.href} alt=""></img>
              </div>
              <div className='card-title'>
                <p><b>{countryData.immigrationData.countryName}</b></p>
                <p>{selectedYear} Selected {selectedSet} Total: <b>
                  {selectedSet === "LPR" ?
                      selectedKeys.length === 6 ? countryData.immigrationData.total.toLocaleString()
                      : countryData.immigrationData.selectedTotal.toLocaleString()
                    : selectedKeys.length === 5 ? countryData.immigrationData.total.toLocaleString()
                    : countryData.immigrationData.selectedTotal.toLocaleString()}</b></p>
              </div>
            </div>
            <div className='card-data lpr-card-data'
                 style={{display: selectedSet === "LPR" ? 'block' : 'none'}}>
                 {selectedSet === "LPR" ?
                   <div>
                    <p style={{fontWeight: selectedKeys.indexOf('immediateRelative') !== -1 ? 'bold' : 'normal'}}
                      >Immediate Relative: {isNaN(countryData.immigrationData.immediateRelative) ? 'dw' : countryData.immigrationData.immediateRelative.toLocaleString()}</p>
                    <p style={{fontWeight: selectedKeys.indexOf('familySponsored') !== -1 ? 'bold' : 'normal'}}
                      >Family-Sponsored: {isNaN(countryData.immigrationData.familySponsored) ? 'dw' : countryData.immigrationData.familySponsored.toLocaleString()}</p>
                    <p style={{fontWeight: selectedKeys.indexOf('refugeeAsylee') !== -1 ? 'bold' : 'normal'}}
                      >Refugee & Asylee: {isNaN(countryData.immigrationData.refugeeAsylee) ? 'dw' : countryData.immigrationData.refugeeAsylee.toLocaleString()}</p>
                    <p style={{fontWeight: selectedKeys.indexOf('employmentBased') !== -1 ? 'bold' : 'normal'}}
                      >Employment-Based: {isNaN(countryData.immigrationData.employmentBased) ? 'dw' : countryData.immigrationData.employmentBased.toLocaleString()}</p>
                    <p style={{fontWeight: selectedKeys.indexOf('diversityLottery') !== -1 ? 'bold' : 'normal'}}
                      >Diversity Lottery: {isNaN(countryData.immigrationData.diversityLottery) ? 'dw' : countryData.immigrationData.diversityLottery.toLocaleString()}</p>
                    <p style={{fontWeight: selectedKeys.indexOf('otherLPR') !== -1 ? 'bold' : 'normal'}}
                      >Other: {isNaN(countryData.immigrationData.otherLPR) ? 'dw' : countryData.immigrationData.otherLPR.toLocaleString()}</p>
                  </div>: <div></div>}
            </div>
            <div className='card-data ni-card-data'
                 style={{display: selectedSet === "NI" ? 'block' : 'none'}}>
                 {selectedSet === "NI" ?
                  <div>
                   <p style={{fontWeight: selectedKeys.indexOf('temporaryVisitor') !== -1 ? 'bold' : 'normal'}}
                     >Temporary Visitor: {isNaN(countryData.immigrationData.temporaryVisitor) ? 'dw' : countryData.immigrationData.temporaryVisitor.toLocaleString()}</p>
                   <p style={{fontWeight: selectedKeys.indexOf('temporaryWorker') !== -1 ? 'bold' : 'normal'}}
                     >Temporary Worker: {isNaN(countryData.immigrationData.temporaryWorker) ? 'dw' : countryData.immigrationData.temporaryWorker.toLocaleString()}</p>
                   <p style={{fontWeight: selectedKeys.indexOf('studentExchange') !== -1 ? 'bold' : 'normal'}}
                     >Student & Exchange: {isNaN(countryData.immigrationData.studentExchange) ? 'dw' : countryData.immigrationData.studentExchange.toLocaleString()}</p>
                   <p style={{fontWeight: selectedKeys.indexOf('diplomatRep') !== -1 ? 'bold' : 'normal'}}
                     >Diplomat & Representative: {isNaN(countryData.immigrationData.diplomatRep) ? 'dw' : countryData.immigrationData.diplomatRep.toLocaleString()}</p>
                   <p style={{fontWeight: selectedKeys.indexOf('otherNI') !== -1 ? 'bold' : 'normal'}}
                     >Other: {isNaN(countryData.immigrationData.otherNI) ? 'dw' : countryData.immigrationData.otherNI.toLocaleString()}</p>
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
