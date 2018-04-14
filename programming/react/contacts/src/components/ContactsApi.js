//====
// api interface for Contacts
//====
import 'whatwg-fetch';
import Promise from 'promise-polyfill';

class ContactsApi {

	/*constructor() {
		// set default values for api url
		this._apiUrl = "http://localhost:3001"
	}*/

	constructor(apiUrl) {
		let __apiUrl = apiUrl || "http://localhost:3030";
		this._apiUrl = __apiUrl;
		this.getContacts = this.getContacts.bind(this);
	}


	/****
	* checks the ajax request status
	****/
	checkStatus(response) {
	  if (response.status >= 200 && response.status < 300) {
	    return response
	  } else {
	    var error = new Error(response.statusText)
	    error.response = response
	    throw error
	  }
	}


	/****
	* parses ajax response as json
	****/
	parseJSON(response) {
	  return response.json()
	}


	/****
	* gets the contacts from the api
	****/
	getContacts() {
		let ret = {"contacts": []};
		let that = this;

		let res = new Promise(function(resolve, reject) {
			fetch(`${that._apiUrl}/Contacts?_sort=name`,
				{
					credentials: 'same-origin',
					method: 'GET' //optional for get
			  })
				.then(that.checkStatus)
				.then(that.parseJSON)
				.then((data) => {
					ret.contacts = data;
					resolve(ret);
				})
				.catch((err) => {
					debugger;
					console.log(err);
					reject(err);
				});
		});

		return res;
	}


	/****
	* gets the contacts sorted by passed in value
	****/
	getContactsSorted(sort) {
		let ret = {"contacts": []};
		let that = this;

		let res = new Promise(function(resolve, reject) {
			fetch(`${that._apiUrl}/Contacts?_sort=${sort}`,
				{
					credentials: 'same-origin',
					method: 'GET' //optional for get
			  })
				.then(that.checkStatus)
				.then(that.parseJSON)
				.then((data) => {
					ret.contacts = data;
					resolve(ret);
				})
				.catch((err) => {
					debugger;
					console.log(err);
					reject(err);
				});
		});

		return res;
	}


	/****
	* gets a list of contacts sorted and paged according to parameters
	****/
	getContactsSortedPaged(sort, page, pageSize) {
		//http://localhost:3001/contacts?_sort=name&_start=11&_limit=10
		let ret = {"contacts": []};
		let that = this;

		let res = new Promise(function(resolve, reject) {
			fetch(`${that._apiUrl}/Contacts?_sort=${sort}&_start=${page}&_limit=${pageSize}`,
				{
					credentials: 'same-origin',
					method: 'GET' //optional for get
			  })
				.then(that.checkStatus)
				.then(that.parseJSON)
				.then((data) => {
					ret.contacts = data;
					resolve(ret);
				})
				.catch((err) => {
					debugger;
					console.log(err);
					reject(err);
				});
		});

		return res;
	}


	/****
	* get a filtered list of contacts based on passed in values; sort on filterType
	****/
	getContactsFiltered(filterType, filterValue) {
		let ret = { "contacts": [] };
		let that = this;

		let res = new Promise((resolve, reject) => {
			fetch(
				`${that._apiUrl}/Contacts?_sort=${filterType}&${filterType}_like=${filterValue}`,
				{
					credentials: 'same-origin',
					method: 'GET'
				}
			)
			.then(that.checkStatus)
			.then(that.parseJSON)
			.then((data) => {
				ret.contacts = data;
				resolve(ret);
			})
			.catch((err) => {
				debugger;
				console.error(err);
				reject(err);
			});
		});

		return res;
	}


	/****
	* adds a new contact to the api backing store
	****/
	addContact(contact) {
		//debugger;
		let ret = {"contacts": []};
		let that = this;

		let res = new Promise(function(resolve, reject) {
			fetch(`${that._apiUrl}/Contacts`,
				{
					credentials: 'same-origin',
					method: 'POST', //optional for get
					headers: {
				    'Content-Type': 'application/json'
				  },
				  body: JSON.stringify(contact)
			  })
				.then(that.checkStatus)
				.then(that.parseJSON)
				.then((data) => {
					ret.contacts = data;
					resolve(ret);
				})
				.catch((err) => {
					debugger;
					console.log(err);
					reject(err);
				});
		});

		return res;
	}


	//====
	// save a change to an existing contact
	//====
	saveContact(oldContact, newContact) {
		//debugger;
		let ret = {"contacts": []};
		let that = this;

		let res = new Promise(function(resolve, reject) {
			fetch(`${that._apiUrl}/Contacts/${oldContact.number}`,
				{
					credentials: 'same-origin',
					method: 'PUT', //optional for get
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(newContact)
			  })
				.then(that.checkStatus)
				.then(that.parseJSON)
				.then((data) => {
					ret.contacts = data;
					resolve(ret);
				})
				.catch((err) => {
					debugger;
					console.log(err);
					reject(err);
				});
		});

		return res;
	}
}

export default ContactsApi
