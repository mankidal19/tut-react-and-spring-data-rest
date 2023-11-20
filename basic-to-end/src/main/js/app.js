'use strict';

// tag::vars[]
const React = require('react'); // <1>
const ReactDOM = require('react-dom'); // <2>
const client = require('./client'); // <3>
const {EmployeeList} = require('./ui/EmployeeUI')
const {CreateDialog} = require('./ui/CreateDialogUI')
// end::vars[]

// tag::app[]
class App extends React.Component { // <1>

	constructor(props) {
		super(props);
		this.state = {employees: []};
	}

	componentDidMount() { // <2>
		this.loadFromServer(this.state.pageSize);
	}

	loadFromServer(pageSize) {
		follow(client, root, [
			{rel: 'employees', params: {size: pageSize}}
			]
		).then(employeeCollection => {
			return client({
				method: 'GET', 
				path: employeeCollection.entity._links.profile.href,
				headers: {
					'Accept': 'application/schema+json'
				}
			}).then(schema => {
				this.schema = schema.entity;
				return employeeCollection;
			});
		}).done(response => {
			this.setState({
				employees: response.entity._embedded.employees,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: response.employees._links
			});
		})
	}

	onCreate(newEmployee) {
		follow(client, root, ['employees'])
			.then(employeeCollection => {
				return client({
					method: 'POST',
					path: employeeCollection.entity._links.self.href,
					entity: newEmployee,
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}).then(response => {
				return follow(client, root, [
					{rel: 'employees',
					params: {
						'size': this.state.pageSize
					}}
				]);
			}).done(response => {
				// Since the user probably wants to see the newly created employee, 
				// you can then use the hypermedia controls and navigate to the last entry.
				if(typeof response.entity._links.last !== 'undefined') {
					this.onNavigate(response.entity._links.last.href);
				} else {
					this.onNavigate(response.entity._links.self.href);
				}
			});
	}

	onDelete(employee) {
		client({
			method: 'DELETE',
			path: employee._links.self.href
		}).done(response => {
			this.loadFromServer(this.state.pageSize);
		});
	}

	// handle page size change input
	handleInput(e) {
		e.preventDefault();
		const pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
		if(/^[0-9]+$/.test(pageSize)) { // input has digits only
			this.props.updatePageSize(pageSize);
		} else { // invalid input
			ReactDOM.findDOMNode(this.refs.pageSize).value = '';
		}
	}

	updatePageSize(newPageSize) {
		if(newPageSize !== this.state.pageSize) {
			this.loadFromServer(newPageSize);
		}
	}

	onNavigate(navUri) {
		client({
			method: 'GET',
			path: navUri
		}).done(employeeCollection => {
			this.setState({
				employees: employeeCollection.entity._embedded.employees;
				attributes: this.state.attributes,
				pageSize: this.state.pageSize,
				links: employeeCollection.entity._links
			});
		});
	}

	handleNavFirst(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.first.href);
	}

	handleNavPrev(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.prev.href);
	}

	handleNavNext(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.next.href);
	}

	handleNavLast(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.last.href);
	}

	render() { // <3>
		return (
			<div>
			<CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
			<EmployeeList employees={this.state.employees}/>
			</div>
		)
	}
}
// end::app[]


// tag::render[]
ReactDOM.render(
	<App />,
	document.getElementById('react')
)
// end::render[]
