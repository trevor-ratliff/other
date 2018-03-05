import React from 'react';
import '../styles/ContactListItem.css'
const gravatarUrl = require('gravatar-url');

function ContactListItem(props) {
	let grav = null;
	const gravStyle = {
		width: (props.gravitarHeight - 10),
		height: (props.gravitarHeight - 10)
	};
	const fieldsStyle = {
		width: "calc(100% - " + (props.gravitarHeight - 15) + "px - 0.25ex)",
		display: "inline-block",
		position: "relative",
		left: "calc("+ (props.gravitarHeight - 15) +"px + 0.25ex)"
	};

	if (!!props.contact && !!props.contact.email) {
		grav = (
			<div className="contact-gravitar" style={gravStyle}>
				<img src={gravatarUrl(props.contact.email, {size: (props.gravitarHeight - 10)})} alt="gravitar" />
			</div>
		);
	}

	return (
		<div style={props.style} className="contact-list-item">
			<div className="container" onClick={props.onClick}>
				{grav}
				<div className="fields" style={fieldsStyle}>
					<div className="field contact-number">
						<label>Phone: </label>
						<span>{props.contact.number}</span>
					</div>
					<div className="field contact-name">
						<label>Name: </label>
						<span>{props.contact.name}</span>
					</div>
					<div className="field contact-context">
						<label>Context: </label>
						<span>{props.contact.context}</span>
					</div>
					<div className="field contact-email">
						<label>Email: </label>
						<span>{props.contact.email}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ContactListItem;
