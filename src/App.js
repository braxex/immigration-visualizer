import React, { Component } from 'react';
import './App.css';



//const ChooserButtons = () => <div>
//                  <input name='lprOrNi' type="radio"></input>
//                  <input name='lprOrNi' type="radio"></input>
//                </div>

//const ChooserButtons = () => (
//  <div>
//                  <input name='lprOrNi' type="radio"></input>
//                  <input name='lprOrNi' type="radio"></input>
//                </div>
//)

//const ChooserButtons = (props) => (
//  <div>
//                  <input name='lprOrNi' type="radio"></input>
//                  <input name='lprOrNi' type="radio"></input>
//                </div>
//)

//const ChooserButtons = () => {
//  return <div>
//                  <input name='lprOrNi' type="radio"></input>
//                  <input name='lprOrNi' type="radio"></input>
//                </div>
//}

function ChooserButtons() {
  return <div>
          <input name='lprOrNi' type="radio" ></input>
          <input name='lprOrNi' type="radio"></input>
         </div>
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Immigration Visualizer</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {React.createElement('p', null, 'hi there')}
        <ChooserButtons/>
      </div>
    );
  }

  componentWillReceiveProps() {

  }

  makeItGreen() {

  }
}

export default App;
