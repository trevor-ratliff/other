import React, { Component } from 'react';
import ContactListItem from "./ContactListItem.js"

class ContactPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: props.contacts,
      openContacts: [],
      filter: null,
      pageSize: 10,
      sort: "name"
    };
    if (!!console && !!console.log) console.log("ContactPage Constructor", props)
  }

  render() {
    return (
      <div id="contact-page">
          Contact Page here .{this.state.sort}.
          <ContactListItem contact={ this.state.contacts[0] } />
      </div>
    );
  }
}

export default ContactPage;
