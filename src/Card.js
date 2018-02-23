
import React, { Component } from 'react';
import './Card.css';


class Card extends Component {

  render() {

    const { countryImmigrationData, selectedCategories } = this.props;

    return(
      <div className='card-holder'
        ref={ref => this.card = ref}>
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
                      selectedCategories.length === 6 ?
                      countryImmigrationData.total.toLocaleString()
                      : countryImmigrationData.countrySelectedTotal.toLocaleString()
                    : selectedCategories.length === 5 ?
                    countryImmigrationData.total.toLocaleString()
                    : countryImmigrationData.countrySelectedTotal.toLocaleString()}</b></p>
              </div>
            </div>
            <div className='card-data lpr-card-data'
                 style={{display: this.props.radioDataset === "LPR" ? 'block' : 'none'}}>
                 {this.props.radioDataset === "LPR" ?
                   <div>
                    <p className={this.embolden('immediateRelative')}
                      >Immediate Relative:
                        {" "+this.formatNumber(countryImmigrationData.immediateRelative)}</p>
                    <p className={this.embolden('familySponsored')}
                      >Family-Sponsored:
                        {" "+this.formatNumber(countryImmigrationData.familySponsored)}</p>
                    <p className={this.embolden('refugeeAsylee')}
                      >Refugee & Asylee:
                        {" "+this.formatNumber(countryImmigrationData.refugeeAsylee)}</p>
                    <p className={this.embolden('employmentBased')}
                      >Employment-Based:
                        {" "+this.formatNumber(countryImmigrationData.employmentBased)}</p>
                    <p className={this.embolden('diversityLottery')}
                      >Diversity Lottery:
                        {" "+this.formatNumber(countryImmigrationData.diversityLottery)}</p>
                    <p className={this.embolden('otherLPR')}
                      >Other:
                        {" "+this.formatNumber(countryImmigrationData.otherLPR)}</p>
                  </div>: <div></div>}
            </div>
            <div className='card-data ni-card-data'
                 style={{display: this.props.radioDataset === "NI" ? 'block' : 'none'}}>
                 {this.props.radioDataset === "NI" ?
                  <div>
                   <p className={this.embolden('temporaryVisitor')}
                     >Temporary Visitor:
                        {" "+this.formatNumber(countryImmigrationData.temporaryVisitor)}</p>
                   <p className={this.embolden('temporaryWorker')}
                     >Temporary Worker:
                        {" "+this.formatNumber(countryImmigrationData.temporaryWorker)}</p>
                   <p className={this.embolden('studentExchange')}
                     >Student & Exchange:
                        {" "+this.formatNumber(countryImmigrationData.studentExchange)}</p>
                   <p className={this.embolden('diplomatRep')}
                     >Diplomat & Representative:
                        {" "+this.formatNumber(countryImmigrationData.diplomatRep)}</p>
                   <p className={this.embolden('otherNI')}
                     >Other:
                        {" "+this.formatNumber(countryImmigrationData.otherNI)}</p>
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

  xPlacement(countryLeft,countryRight,countryWidth, mapBox, cardBox) {
    if (countryLeft-mapBox.left>cardBox.width+25) {
      return countryLeft-(cardBox.width+25)
    } else if (countryLeft-mapBox.left<cardBox.width+25) {
        if (mapBox.right-countryRight>cardBox.width) {
          return countryRight+25
        } else return mapBox.left
    }
  }

  yPlacement(countryTop,countryBottom,countryHeight, mapBox, cardBox) {
    if (countryTop > mapBox.top) {
      if (countryTop + cardBox.height > mapBox.bottom) {
        return mapBox.bottom-cardBox.height
      } else return countryTop
    } else if (countryTop < mapBox.top) {
      if (countryTop + cardBox.height > mapBox.bottom) {
        return mapBox.bottom-cardBox.height
        }
      return mapBox.top
    }
  }

  componentDidMount(previousProps, previousState) {
    const cardBox = this.card.getBoundingClientRect();
    const top = this.yPlacement(this.props.yTop,this.props.yBottom,this.props.yHeight,this.props.mapBox,cardBox);
    const left = this.xPlacement(this.props.xLeft,this.props.xRight,this.props.xWidth,this.props.mapBox,cardBox);

    this.card.style.left = left + 'px';
    this.card.style.top = top + 'px';
  }

}

export default Card;
