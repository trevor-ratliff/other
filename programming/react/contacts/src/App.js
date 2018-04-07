import React, { Component } from 'react';
import logo from './logo.svg';
import RoloContacts from './content/RoloContacts.svg'
import './styles/App.css';
import ContactPage from './components/ContactPage.jsx'
import ContactsApi from './components/ContactsApi.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "contacts": []
    };

    this.contacts = [];
    /*
    let contacts = [];
    */
    this.contacts.push({ number: "100-100-1000", name: "bob n ferrapples", context: "work", email: 'bob.n.ferrapples@gmail.com'});
    this.contacts.push({ number: "100-100-1001", name: "trevor w ratliff", context: "work", email: 'trevor.w.ratliff@gmail.com'});
    this.contacts.push({ number: "100-100-1002", name: "bob n ferrapples", context: "work" });
    this.contacts.push({ number: "100-100-1003", name: "bob n ferrapples", context: "work" });
    this.contacts.push({ number: "100-100-1004", name: "bob n ferrapples", context: "work" });
    this.contacts.push({ number: "100-100-1005", name: "bob n ferrapples", context: "work" });
    this.contacts.push({ number: "100-100-1006", name: "bob n ferrapples", context: "work" });
    this.contacts.push({ number: "100-100-1007", name: "bob n ferrapples", context: "work" });
    this.contacts.push({ number: "100-100-1008", name: "bob n ferrapples", context: "work" });
    this.contacts.push({ number: "100-100-1009", name: "bob n ferrapples", context: "work" });
    this.contacts.push({ number: "100-100-1010", name: "bob n ferrapples", context: "work" });
    this.contacts.push({ number: "100-100-1011", name: "bob n ferrapples", context: "work" });
    this.contacts.push({ number: "100-100-1012", name: "bob n ferrapples", context: "work" });
    this.contacts.push({ number: "100-100-1013", name: "bob n ferrapples", context: "work" });
    this.contacts.push({ number: "100-100-1014", name: "bob n ferrapples", context: "work" });
    this.contacts.push({ number: "100-100-1015", name: "bob n ferrapples", context: "work" });
    this.contacts.push({ number: "100-100-1016", name: "bob n ferrapples", context: "work" });
    this.contacts.push({ number: "100-100-1017", name: "bob n ferrapples", context: "work" });
    this.contacts.push({ number: "100-100-1018", name: "bob n ferrapples", context: "work" });
    this.contacts.push({ number: "100-100-1019", name: "bob n ferrapples", context: "work" });
    this.contacts.push({ number: "100-100-1020", name: "bob n ferrapples", context: "work" });

    this.capi = new ContactsApi("http://localhost:3001");
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handle_onAddContact = this.handle_onAddContact.bind(this);
    this.handle_onSaveContact = this.handle_onSaveContact.bind(this);
  }

  componentDidMount() {
    let that = this;
    that.capi.getContacts().then((res) => {
      //debugger;
      console.log(`res = `, res);

      that.setState({"contacts": res.contacts.slice()});

    }).catch((err) => {
      console.log(`err getting contacts: ${err}`);
    });
  };

  handle_onAddContact(e, contact) {
    console.log(`adding contact:`, contact);
  }

  handle_onSaveContact(e, oldContact, newContact) {
    console.log(`saving contact:`, oldContact, newContact);
  }

  render() {
    //let contacts = this.state.contacts.slice();
    console.log("contacts:", this.state.contacts);
    if(this.state.contacts.length === 0){
     return false //return false or a <Loader/> when you don't have anything in your message[]
    }

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

    let appHeader = (
      <div className="App-header">
        <div className="col-2 align-right">
          <img src={RoloContacts} className="contacts-logo" alt="Rolo Contacts" />
        </div>
        <div className="col-2 align-left">
          <h1>RoloContacts</h1>
        </div>
      </div>
    );

    let contactPage = (
      <ContactPage
        contacts={this.state.contacts}
        onSaveContact={(e, oldContact, newContact) => { this.handle_onSaveContact(e, oldContact, newContact); }}
        onAddContact={(e, contact) => { this.handle_onAddContact(e, contact); }}
      />
    );

    return (
      <div className="App">
        {appHeader}
        <div className="App-page">
          {contactPage}
          <br />
        </div>
      </div>
    );
  }
}

export default App;
