import React from 'react';

function ContactListItem(props) {
	return (
		<div className="contact-card">
			<div className="field contact-number">
				<label>Phone: </label>
				<span>{props.contact.number}</span>
			</div>
		</div>
	);
}

export default ContactListItem;
