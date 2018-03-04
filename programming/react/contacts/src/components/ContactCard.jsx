import React from 'react';
import ContactListItem from './ContactListItem.js'

function ContactCard(props) {
	return (
		<div className="contact-card">
			<div className="contact-number">
				<label>Phone Number: </label>
				<span className="data">{props.contact.number}</span>
			</div>
			<div><ContactListItem contact={props.contact} /></div>
		</div>
	);
}

export default ContactCard;
