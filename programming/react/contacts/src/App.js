import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ContactPage from './components/ContactPage.jsx'
import ContactCard from './components/ContactCard.jsx'
import ContactListItem from './components/ContactListItem.js'

class App extends Component {
  render() {
    let contact = { number: 123, name: "bob n ferrapples", context: "work" };

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div id="page">
          .<ContactPage contacts={ [contact] }></ContactPage>.<br />
          +<ContactCard contact={ contact } />+<br />
          -<ContactListItem contact={ contact } />-
        </div>
      </div>
    );
  }
}

export default App;
