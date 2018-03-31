import React, { Component } from 'react';
import logo from './logo.svg';
import './styles/App.css';
import ContactPage from './components/ContactPage.jsx'
import ContactsApi from './components/ContactsApi.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "contacts": []
    };

    this.capi = new ContactsApi("http://localhost:3001");
    this.componentWillMount = this.componentWillMount.bind(this);

  }

  componentWillMount() {
    let that = this;
    that.capi.getContacts().then((res) => {
      debugger;
      console.log(`res = `, res);

      that.setState({"contacts": res.contacts.slice()});

    }).catch((err) => {
      console.log(`err getting contacts: ${err}`);
    });
  };

  render() {
    /*
    let contacts = [];
    contacts.push({ number: "100-100-1000", name: "bob n ferrapples", context: "work", email: 'bob.n.ferrapples@gmail.com'});
    contacts.push({ number: "100-100-1001", name: "trevor w ratliff", context: "work", email: 'trevor.w.ratliff@gmail.com'});
    contacts.push({ number: "100-100-1002", name: "bob n ferrapples", context: "work" });
    contacts.push({ number: "100-100-1003", name: "bob n ferrapples", context: "work" });
    contacts.push({ number: "100-100-1004", name: "bob n ferrapples", context: "work" });
    contacts.push({ number: "100-100-1005", name: "bob n ferrapples", context: "work" });
    contacts.push({ number: "100-100-1006", name: "bob n ferrapples", context: "work" });
    contacts.push({ number: "100-100-1007", name: "bob n ferrapples", context: "work" });
    contacts.push({ number: "100-100-1008", name: "bob n ferrapples", context: "work" });
    contacts.push({ number: "100-100-1009", name: "bob n ferrapples", context: "work" });
    contacts.push({ number: "100-100-1010", name: "bob n ferrapples", context: "work" });
    contacts.push({ number: "100-100-1011", name: "bob n ferrapples", context: "work" });
    contacts.push({ number: "100-100-1012", name: "bob n ferrapples", context: "work" });
    contacts.push({ number: "100-100-1013", name: "bob n ferrapples", context: "work" });
    contacts.push({ number: "100-100-1014", name: "bob n ferrapples", context: "work" });
    contacts.push({ number: "100-100-1015", name: "bob n ferrapples", context: "work" });
    contacts.push({ number: "100-100-1016", name: "bob n ferrapples", context: "work" });
    contacts.push({ number: "100-100-1017", name: "bob n ferrapples", context: "work" });
    contacts.push({ number: "100-100-1018", name: "bob n ferrapples", context: "work" });
    contacts.push({ number: "100-100-1019", name: "bob n ferrapples", context: "work" });
    contacts.push({ number: "100-100-1020", name: "bob n ferrapples", context: "work" });
    */
    //let contacts = this.state.contacts.slice();
    console.log("contacts:", this.state.contacts);

    let startPage = (
      <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );

    return (
      <div className="App">
        <div className="App-page">
          <ContactPage contacts={ this.state.contacts }></ContactPage><br />
        </div>
      </div>
    );
  }
}

export default App;
