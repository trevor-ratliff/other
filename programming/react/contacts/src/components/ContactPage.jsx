import React, { Component } from 'react';
import VirtualList from 'react-tiny-virtual-list';
import ContactCard from './ContactCard.jsx'
import ContactListItem from "./ContactListItem.js";
import ColumnTest from "./ColumnTest.js"

class ContactPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: props.contacts,
      openContacts: [],
      filter: null,
      pageSize: 10,
      sort: "name",
      listHeight: 500,
      listWidth: 'calc(50% - 0.25ex)',
      listItemHeight: 60,
      cardPaneHeight: 500,
      cardPaneWidth: 'calc(50% - 0.25ex)',
      cardHeight: 150
    };
    this.addCard = this.addCard.bind(this);
    this.addContact = this.addContact.bind(this);
    this.closeCard = this.closeCard.bind(this);
    this.saveCard = this.saveCard.bind(this);

    if (!!console && !!console.log) console.log("ContactPage Constructor", props)
  }

  addCard(e, index) {
    if (!!console && !!console.log) console.log(e, index, this.state.contacts[index]);
    let _openContacts = this.state.openContacts.slice();
    _openContacts.push({ index: index, contact: this.state.contacts[index] });
    this.setState({ openContacts: _openContacts });
    return;
  }

  addContact(e, index) {
    if (!!console && !!console.log) console.log(e, index, 'adding new contact');
    let _openContacts = this.state.openContacts.slice();
    let contact = {
      "email": "",
      "name": "",
      "number": "",
      "context": "RoloContacts",
      "new": true
    };

    _openContacts.push({index: _openContacts.length, contact: contact});
    this.setState({openContacts: _openContacts});
    //this.props.onAddContact(e, contact);
  }

  closeCard(e, index) {
    if (!!console && !!console.log) console.log(e, index, this.state.openContacts.indexOf(index));
    let _openContacts = this.state.openContacts.slice();
    _openContacts.splice(this.state.openContacts.indexOf(index), 1);
    this.setState({ openContacts: _openContacts });
    return;
  }

  saveCard(e, oldContact, newContact) {
    //debugger;
    let _contacts = this.state.contacts.slice();
    let _old = _contacts.indexOf(oldContact);
    _contacts.splice(_old, 1, newContact);
    this.setState({contacts: _contacts});
    if (oldContact.new) {
      this.props.onAddContact(e, newContact);
    } else {
      this.props.onSaveContact(e, oldContact, newContact);
    }
  }

  render() {
    return (
      <div id="contact-page">
        <div id="menuPane">
          <div className="controls">
    				<button type="button" className="btn-primary" onClick={(e) => { this.addContact(e,this.state.openContacts.length); }}>Add Contact</button>
    			</div>
        </div>
        <div id="workPane">
          <VirtualList
            className="col-2"
            width={this.state.listWidth}
            height={this.state.listHeight}
            itemCount={this.state.contacts.length}
            itemSize={this.state.listItemHeight} // Also supports variable heights (array or function getter)
            renderItem={({index, style}) =>
              <ContactListItem
                key={"cli_" + this.state.contacts[index].number + "_" + this.state.contacts[index].name.replace(" ", "")}
                index={index}
                style={style}
                contact={this.state.contacts[index]}
                gravitarHeight={this.state.listItemHeight}
                onClick={(e) => {this.addCard(e, index)}}
              />
            }
            onItemsRendered={({startIndex, stopIndex}) => {
              if (!!console && !!console.log) console.log(startIndex, stopIndex, this.state.contacts.length);
            }}
          />
          <VirtualList
            className="col-2"
            height={this.state.cardPaneHeight}
            itemCount={this.state.openContacts.length}
            itemSize={this.state.cardHeight} // Also supports variable heights (array or function getter)
            renderItem={({index, style}) =>
              <ContactCard
                key={"crd_" + this.state.openContacts[index].contact.number}
                index={index}
                style={style}
                contact={this.state.openContacts[index].contact}
                gravitarHeight={this.state.cardHeight}
                onClick={(e) => {this.closeCard(e, this.state.openContacts[index])}}
                onSave={this.saveCard}
              />
            }
            onItemsRendered={({startIndex, stopIndex}) => {
              if (!!console && !!console.log) console.log(startIndex, stopIndex, this.state.contacts.length);
            }}
          />
        </div>
        <ColumnTest />
      </div>
    );
  }
}

export default ContactPage;
