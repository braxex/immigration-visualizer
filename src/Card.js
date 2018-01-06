/*D3 Cards*/
import React, { Component } from 'react';
import './Card.css';

class Card extends Component {
  render() {
    return(
      <div className='country-card' style={{top: this.props.y, left: this.props.x}}>
        card
      </div>
    )

  }
}



export default Card;
