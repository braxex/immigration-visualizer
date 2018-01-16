/*D3 Cards*/
import React, { Component } from 'react';
import './Card.css';
import {csvData} from './Visualizer.js';
import {whichSet, whichYear, subtotalKeys} from './Visualizer.js'; //**

let cardWidth, countryData, selectedSet, selectedYear, selectedKeys; //**

cardWidth = 400; // how can i access the cardWidth? self.getBoundingClientRect().width?


class Card extends Component {
  render() {
    let self=this;
    function getCountryData() {  //**
      countryData = csvData.find(item => item.id === self.props.id);
      selectedSet = whichSet;
      selectedYear = whichYear;
      selectedKeys = subtotalKeys;
    }
    getCountryData();
    function xPlacement(left,right,width) { //only handles left side issues  //can I get D3 box parameters from somewhere using refs?
      if (left < cardWidth+17) { //if outside box on left
        return right+25;  //return left of D3box?
      } else { //if inside box on left
        return left-(cardWidth+25);
      }
    }
    function yPlacement(top,bottom,height) { //only handles top issues
      if (top < 70) {
        return top+(height/2);  //return top of D3box?
      } else {
        return top;
      }
    }

    return(
      <div className='card-holder' style={{top: yPlacement(this.props.yTop,this.props.yBottom,this.props.yHeight), left: xPlacement(this.props.xLeft,this.props.xRight,this.props.xWidth)}}>
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
