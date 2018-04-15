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
		this.grav = (<span>&nbsp;</span>);

		this.gravStyle = {
			width: (props.gravitarHeight - 10),
			height: (props.gravitarHeight - 10)
		};

		this.fieldsStyle = {
			position: "relative",
			left: "calc(1px + 0.25ex)"
		};

		if (!!props.contact && !!props.contact.email) {
			this.grav = (
				<img src={gravatarUrl(props.contact.email, {size: (props.gravitarHeight - 10)})} alt="gravitar" />
			);
		}

		this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	}

	getInitialState() {
		let ret = {
			number: '',
			name: '',
			context: '',
			email: ''
		}

		return ret;
	}

	handleChangeInput(event) {
		//debugger;
		const target = event.target || null;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		event.preventDefault();

		if (!!target)
			this.setState({[name]: value});
	}

	handleSubmit(event) {
		//alert('A name was submitted: ' + this.state.value);
		event.preventDefault();
		this.props.onSave(event, this.props.contact, this.state);
		//this.props.onClick(event);
	}

	validateEmail(value) {
    // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
		if (!value) return true;
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  }

	render() {
		let emailError = "";
		let isFormValid = true;

		if (!this.validateEmail(this.state.email)) {
			emailError = "Invalid email address";
			isFormValid = false;
		}

		return (
			<div className="contact-card" style={this.props.style}>
				<div className="container align-right">
					<div className="contact-gravitar col-5">
						{this.grav}
					</div>
					<div className="fields col-4of5" style={this.fieldsStyle}>
						<div className="field contact-name col-2">
							<label>Name: </label><br />
							<input type="text" className="name" name="name" value={this.state.name} onChange={this.handleChangeInput} />
						</div>
						<div className="field contact-number col-2">
							<label>Phone: </label><br />
							<input type="text" className="number" name="number" value={this.state.number} onChange={this.handleChangeInput} />
						</div><br />
						<div className="field contact-email col-2">
							<label>Email: </label><span className="error">{emailError}</span><br />
							<input type="text" className="email" name="email" value={this.state.email} onChange={this.handleChangeInput} />
						</div>
						<div className="field contact-context col-2">
							<label>Context: </label><br />
							<input type="text" className="context" name="context" value={this.state.context} onChange={this.handleChangeInput} />
						</div>
						<div className="btn-holder align-center">
							<button type="button" className="save btn-primary" onClick={this.handleSubmit} disabled={!isFormValid}>Save</button>&nbsp;
							<button type="button" className="close btn-secondary" onClick={this.props.onClick}>Close</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ContactCard;
