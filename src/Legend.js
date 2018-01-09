/*Legend*/
import React, { Component } from 'react';
import './Legend.css';

/*const reactContainer = document.getElementById('legend-holder');
width = reactContainer.offsetWidth;*/
let width = 30;

class Legend extends Component {

  render() {
    const thresholds = this.props.thresholds;
    const self = this;
    return (
      <div className='legend'>
        <div className='legend-title'>% of Annual Activity</div>
        <div>
          {this.props.colors.map(function(item, index){
            return <div key={index} className='legend-section' style={{backgroundColor: item}}>
              <div className='legend-number' ref={(elem) => {
                  self.elems[index] = elem;
                }}>{thresholds[index]}</div>
            </div>
          })}
        </div>
      </div>
    );
  }
  componentDidMount() {
    const self = this;
    Object.keys(this.elems).forEach(function(item){
      const elem = self.elems[item];
      elem.style.left=(width-(elem.offsetWidth/2))+'px';
    }
  )}

  componentDidUpdate() {
    const self = this;
    Object.keys(this.elems).forEach(function(item){
      const elem = self.elems[item];
      elem.style.left=(width-(elem.offsetWidth/2))+'px';
    })
  }
  componentWillMount() {
    this.elems={};
  }
}


export default Legend;
