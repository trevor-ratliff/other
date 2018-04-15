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
      filterType: null,
      filterValue: null,
      pageSize: 10,
      sort: "name",
      listHeight: 700,
      listWidth: 'calc(50% - 0.25ex)',
      listItemHeight: 60,
      cardPaneHeight: 700,
      cardPaneWidth: 'calc(50% - 0.25ex)',
      cardHeight: 150,
      showTest: false
    };

    this.handle_addCard = this.handle_addCard.bind(this);
    this.handle_addContact = this.handle_addContact.bind(this);
    this.handle_closeCard = this.handle_closeCard.bind(this);
    this.handle_saveCard = this.handle_saveCard.bind(this);
    //this.handle_ChangeInput = this.handle_ChangeInput.bind(this);
    this.handle_filterChanged = this.handle_filterChanged.bind(this);

    if (!!console && !!console.log) console.log("ContactPage Constructor", props)
  }

  handle_addCard(e, index) {
    if (!!console && !!console.log) console.log(e, index, this.state.contacts[index]);
    let _openContacts = this.state.openContacts.slice();
    _openContacts.push({ index: index, contact: this.state.contacts[index] });
    this.setState({ openContacts: _openContacts });
    return;
  }

  handle_addContact(e, index) {
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

  handle_closeCard(e, index) {
    if (!!console && !!console.log) console.log(e, index, this.state.openContacts.indexOf(index));

    let _openContacts = this.state.openContacts.slice();
    _openContacts.splice(this.state.openContacts.indexOf(index), 1);
    this.setState({ openContacts: _openContacts });

    return;
  }

	/*handle_ChangeInput(event) {
		//debugger;
		const target = event.target || null;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		if (!!target)
			this.setState({[name]: target.value});
	}*/

  handle_filterChanged(e, filterType, filterValue) {
    let that = this;
    const target = e.target || null;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
    //that.handle_ChangeInput(e);
    e.preventDefault();

    if (!!target)
			that.setState({[name]: value}, () => {
        if (!!console && !!console.log) console.log("handle_filterChanged: ", e, filterType, filterValue, that.state.filterType, that.state.filterValue);

        if (!!that.state.filterType && !!that.state.filterValue) {
          //debugger;
          that.props.onFilterChanged(e, that.state.filterType, that.state.filterValue);
        }
      });

    return;
  }

  handle_saveCard(e, oldContact, newContact) {
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
    let colTest = "";
    let colTestLabel = this.state.showTest ? "Hide" : "Show";
    if (!!console && !!console.log) console.log("ContactPage.js->render() contacts:", this.state.contacts);

    //if (this.state.contacts.length < 1) return false;
    if (this.state.showTest) {
      colTest = (<ColumnTest />);
    }

    return (
      <div id="contact-page">
        <div id="menuPane">
          <div className="controls btn-holder">
            <select className="filterType" name="filterType" onChange={this.handle_filterChanged}>
              <option value="">select a filter field</option>
              <option value="name">Name</option>
              <option value="number">Number</option>
              <option value="email">Email</option>
              <option value="context">Context</option>
            </select>
            <input type="text" className="filterValue" name="filterValue" onChange={this.handle_filterChanged} />
    				<button type="button" className="btn-primary" onClick={(e) => {
              this.handle_addContact(e,this.state.openContacts.length);
            }}>Add Contact</button>&nbsp;&nbsp;
            <button type="button" className="btn-primary" onClick={(e) => {
              this.setState({showTest: (!this.state.showTest)});
            }}>{colTestLabel}&nbsp;Column&nbsp;Test</button>
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
                gravitarHeight={this.state.listItemHeight - 4}
                onClick={(e) => {this.handle_addCard(e, index)}}
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
                gravitarHeight={this.state.cardHeight - 4}
                onClick={(e) => {this.handle_closeCard(e, this.state.openContacts[index])}}
                onSave={this.handle_saveCard}
              />
            }
            onItemsRendered={({startIndex, stopIndex}) => {
              if (!!console && !!console.log) console.log(startIndex, stopIndex, this.state.contacts.length);
            }}
          />
        </div>
        {colTest}
      </div>
    );
  }
}

export default ContactPage;
