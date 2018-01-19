/*D3 Cards*/
import React, { Component } from 'react';
import './Card.css';

const cardWidth = 400; // how can i access the cardWidth? self.getBoundingClientRect().width?


class Card extends Component {

  render() {

    const self = this;
    const { countryImmigrationData, selectedCategories } = this.props

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
      <div className='card-holder'
        style={{top: yPlacement(this.props.yTop,this.props.yBottom,this.props.yHeight),
          left: xPlacement(this.props.xLeft,this.props.xRight,this.props.xWidth)}}>
        {Object.keys(countryImmigrationData).length === 0 ?
            <div className='card-nodata'>No data provided.</div>
          :
          <div>
            <div className='card-head'>
              <div className='card-flag'>
                <img src={countryImmigrationData.href} alt=""></img>
              </div>
              <div className='card-title'>
                <p><b>{countryImmigrationData.countryName}</b></p>
                <p>{this.props.dataYear} Selected {this.props.radioDataset} Total: <b>
                  {this.props.radioDataset === "LPR" ?
                      selectedCategories.length === 6 ? countryImmigrationData.total.toLocaleString()
                      : countryImmigrationData.countrySelectedTotal.toLocaleString()
                    : selectedCategories.length === 5 ? countryImmigrationData.total.toLocaleString()
                    : countryImmigrationData.countrySelectedTotal.toLocaleString()}</b></p>
              </div>
            </div>
            <div className='card-data lpr-card-data'
                 style={{display: this.props.radioDataset === "LPR" ? 'block' : 'none'}}>
                 {this.props.radioDataset === "LPR" ?
                   <div>
                    <p className={this.embolden('immediateRelative')}
                      >Immediate Relative: {this.formatNumber(countryImmigrationData.immediateRelative)}</p>
                    <p className={this.embolden('familySponsored')}
                      >Family-Sponsored: {this.formatNumber(countryImmigrationData.familySponsored)}</p>
                    <p className={this.embolden('refugeeAsylee')}
                      >Refugee & Asylee: {this.formatNumber(countryImmigrationData.refugeeAsylee)}</p>
                    <p className={this.embolden('employmentBased')}
                      >Employment-Based: {this.formatNumber(countryImmigrationData.employmentBased)}</p>
                    <p className={this.embolden('diversityLottery')}
                      >Diversity Lottery: {this.formatNumber(countryImmigrationData.diversityLottery)}</p>
                    <p className={this.embolden('otherLPR')}
                      >Other: {this.formatNumber(countryImmigrationData.otherLPR)}</p>
                  </div>: <div></div>}
            </div>
            <div className='card-data ni-card-data'
                 style={{display: this.props.radioDataset === "NI" ? 'block' : 'none'}}>
                 {this.props.radioDataset === "NI" ?
                  <div>
                   <p className={this.embolden('temporaryVisitor')}
                     >Temporary Visitor: {this.formatNumber(countryImmigrationData.temporaryVisitor)}</p>
                   <p className={this.embolden('temporaryWorker')}
                     >Temporary Worker: {this.formatNumber(countryImmigrationData.temporaryWorker)}</p>
                   <p className={this.embolden('studentExchange')}
                     >Student & Exchange: {this.formatNumber(countryImmigrationData.studentExchange)}</p>
                   <p className={this.embolden('diplomatRep')}
                     >Diplomat & Representative: {this.formatNumber(countryImmigrationData.diplomatRep)}</p>
                   <p className={this.embolden('otherNI')}
                     >Other: {this.formatNumber(countryImmigrationData.otherNI)}</p>
                  </div>: <div></div>}
            </div>
          {countryImmigrationData.countryNote && <div className='card-notes'>
            <p>Note: {countryImmigrationData.countryNote}</p>
          </div>}
        </div>

        }
      </div>
    )
  }

  formatNumber(value) {
    return isNaN(value) ? 'dw' : value.toLocaleString()
  }

  embolden(value) {
    if(this.props.selectedCategories.indexOf(value) !== -1) {
      return 'counted-category';
    } else return '';
  }

}

export default Card;
