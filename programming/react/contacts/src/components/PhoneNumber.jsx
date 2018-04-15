import React, { Component } from 'react';
import '../styles/PhoneNumber.css'

//----
// setup google-libphonenumber stuff
//----
const PNF = require('google-libphonenumber').PhoneNumberFormat;

// Get an instance of `PhoneNumberUtil`.
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

// Parse number with country code and keep raw input.
const _number = phoneUtil.parseAndKeepRawInput('202-456-1414', 'US');

class PhoneNumber extends Component {
	constructor(props) {
		super(props);
		this.state = {
			number: props.number,
			phoneNumber: phoneUtil.parseAndKeepRawInput(props.number, 'US')
		};
	}

	render() {
		let _phone = phoneUtil.format(this.state.phoneNumber, 'US');

		return (
			<div className="PhoneNumber">
				{_phone}
			</div>
		);
	}
}

export default PhoneNumber;
