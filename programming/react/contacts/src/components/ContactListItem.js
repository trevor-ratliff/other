import React from 'react';
import '../styles/ContactListItem.css'
const gravatarUrl = require('gravatar-url');

function ContactListItem(props) {
	let grav = (<div className="col-8">&nbsp;</div>);

	const gravStyle = {
		width: (props.gravitarHeight),
		height: (props.gravitarHeight)
	};

	const fieldsStyle = {
		width: "calc(100% - " + (props.gravitarHeight - 15) + "px - 0.25ex)",
		display: "inline-block",
		position: "relative",
		left: "calc("+ (props.gravitarHeight - 15) +"px + 0.25ex)"
	};

	if (!!props.contact && !!props.contact.email) {
		grav = (
			<div className="contact-gravitar col-8" style={gravStyle}>
				<img src={gravatarUrl(props.contact.email, {size: (props.gravitarHeight)})} alt="gravitar" />
			</div>
		);
	}

	return (
		<div style={props.style} className="contact-list-item">
			<div className="container" onClick={props.onClick}>
				{grav}
				<div className="fields col-7of8">
					<div className="field contact-name col-2">
						<label className="col-4">Name: </label>
						<span className="col-3of4">{props.contact.name}</span>
					</div>
					<div className="field contact-number col-2">
						<label className="col-4">Phone: </label>
						<span className="col-3of4">{props.contact.number}</span>
					</div><br />
					<div className="field contact-email col-2">
						<label className="col-4">Email: </label>
						<span className="col-3of4">{props.contact.email}</span>
					</div>
					<div className="field contact-context col-2">
						<label className="col-4">Context: </label>
						<span className="col-3of4">{props.contact.context}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ContactListItem;
