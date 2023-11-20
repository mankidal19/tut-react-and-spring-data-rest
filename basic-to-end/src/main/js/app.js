'use strict';

// tag::vars[]
const React = require('react'); // <1>
const ReactDOM = require('react-dom'); // <2>
const client = require('./client'); // <3>
const follow = require('./follow'); // function to hop multiple links by "rel"
const when = require('when');

const {EmployeeList} = require('./ui/EmployeeUI')
const {CreateDialog} = require('./ui/DialogsUI')

const root = '/api';

// end::vars[]

// tag::app[]
class App extends React.Component { // <1>

	constructor(props) {
		super(props);
		this.state = {employees: [], attributes: [], pageSize: 2, links: {}};
		this.updatePageSize = this.updatePageSize.bind(this);
		this.onCreate = this.onCreate.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
	}

	componentDidMount() { // <2>
		this.loadFromServer(this.state.pageSize);
	}

	loadFromServer(pageSize) {
		// to get headers like ETags, you need to fetch each resource individually.
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
				this.links = employeeCollection.entity._links;
				return employeeCollection;
			});
		}).then(employeeCollection => {
			// This is what you need to fetch an ETag header for each employee.
			return employeeCollection.entity._embedded.employees.map(employee =>
				client({
					method: 'GET',
					path: employee._links.self.href
				})
			);
		}).then(employeePromises => {
			return when.all(employeePromises);
		}).done(employees => {
			this.setState({
				employees: employees,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: this.links
			});
			console.log(this.state);
		});
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

	onUpdate(employee, updatedEmployee) {
		client({
			method: 'PUT',
			path: employee.entity._links.self.href,
			entity: updatedEmployee,
			headers: {
				'Content-Type': 'application/json',
				'If-Match': employee.headers.Etag
			}
		}).done(response => { // on fulfilled
			this.loadFromServer(this.state.pageSize);
		}, response => { // on rejected
			if(response.status.code === 412) { //  Precondition Failed 
				alert(`DENIED: Unable to update ${employee.entity._links.self.href}.\n Your copy is stale! :(`);
			} else {
				alert('Ops. Something went wrong!');
			}
		})
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
				employees: employeeCollection.entity._embedded.employees,
				attributes: this.state.attributes,
				pageSize: this.state.pageSize,
				links: employeeCollection.entity._links
			});
		});
	}

	render() { // <3>
		return (
			<div>
			<CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
			<EmployeeList employees={this.state.employees} 
				links={this.state.links} 
				pageSize={this.state.pageSize} 
				attributes = {this.state.attributes} 
				onDelete={this.onDelete} 
				updatePageSize={this.updatePageSize} 
				onNavigate={this.onNavigate} 
				onUpdate = {this.onUpdate}
			/>
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
