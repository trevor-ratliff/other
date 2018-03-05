import React from 'react';

function ContactCard(props) {
	return (
		<div className="contact-card" style={props.style}>
			<div className="container" onClick={props.onClick}>
				<div className="contact-number">
					<label>Phone Number: </label>
					<span className="data">{props.contact.number}</span>
				</div>
			</div>
		</div>
	);
}

export default ContactCard;
