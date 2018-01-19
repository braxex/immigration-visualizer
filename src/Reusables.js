
import React, { Component } from 'react';
import { Tooltip } from 'react-tippy';

export class Modal extends Component {
  render() {
    return (
      <div id='modal-holder' className="modal-holder">
          <div className="image"><img src="liberty.png" alt="" title="test"></img></div>
        <div className="main-modal">
          <div className="colossus">From her beacon-hand<br/>
                                    Glows world-wide welcome…<br/>
                                    “Give me your tired, your poor,<br/>
                                    Your huddled masses yearning to breathe free,<br/>
                                    Send these, the homeless, tempest-tost to me.”
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

export class LPRCheckbox extends Component {
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
          <Tooltip
              title={title}
              size='small'
              position='bottom'
              trigger='mouseenter'
              animation='shift'
              hideOnClick={true}>
            {label}
          </Tooltip>
        </label>
      </div>
    )
  }
}

export class NICheckbox extends Component {
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
          <Tooltip
              title={title}
              size='small'
              position='bottom'
              trigger='mouseenter'
              animation='shift'
              hideOnClick={true}>
            {label}
          </Tooltip>
        </label>
      </span>
    )
  }
}
