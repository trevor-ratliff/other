import React, { Component } from 'react';
import '../styles/ContactCard.css'
const gravatarUrl = require('gravatar-url');

class ContactCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//"contact": {
				number: props.contact.number,
				name: props.contact.name,
				context: props.contact.context,
				email: props.contact.email
			//}
		};

		this.props = props;
		this.grav = null;

		this.gravStyle = {
			width: (props.gravitarHeight - 10),
			height: (props.gravitarHeight - 10)
		};

		this.fieldsStyle = {
			width: "calc(100% - " + (props.gravitarHeight - 15) + "px - 0.25ex)",
			display: "inline-block",
			position: "relative",
			left: "calc("+ (props.gravitarHeight - 15) +"px + 0.25ex)"
		};

		if (!!props.contact && !!props.contact.email) {
			this.grav = (
				<div className="contact-gravitar" style={this.gravStyle}>
					<img src={gravatarUrl(props.contact.email, {size: (props.gravitarHeight - 10)})} alt="gravitar" />
				</div>
			);
		}

		this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChangeInput(event) {
		//debugger;
		const target = event.target || null;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		if (!!target)
			this.setState({[name]: target.value});
	}

	handleSubmit(event) {
		//alert('A name was submitted: ' + this.state.value);
		event.preventDefault();
		this.props.onSave(event, this.props.contact, this.state);
		//this.props.onClick(event);
	}

	render() {
		return (
			<div className="contact-card" style={this.props.style}>
				<div className="container">
					{this.grav}
					<div className="fields" style={this.fieldsStyle}>
						<div className="field contact-number">
							<label>Phone: </label><br />
							<input type="phone" name="number" value={this.state.number} onChange={this.handleChangeInput} />
						</div>
						<div className="field contact-name">
							<label>Name: </label><br />
							<input type="text" name="name" value={this.state.name} onChange={this.handleChangeInput} />
						</div>
						<div className="field contact-context">
							<label>Context: </label><br />
							<input type="text" name="context" value={this.state.context} onChange={this.handleChangeInput} />
						</div>
						<div className="field contact-email">
							<label>Email: </label><br />
							<input type="email" name="email" value={this.state.email} onChange={this.handleChangeInput} />
						</div>
					</div>
					<div className="close" onClick={this.props.onClick}>x</div>
					<div className="save" onClick={this.handleSubmit}>save</div>
				</div>
			</div>
		);
	}
}

export default ContactCard;
