const React = require('react');
const ReactDOM = require('react-dom');

const {UpdateDialog} = require('./DialogsUI')

// tag::employee-list[]
export class EmployeeList extends React.Component{

	constructor(props) {
		super(props);
		this.handleNavFirst = this.handleNavFirst.bind(this);
		this.handleNavPrev = this.handleNavPrev.bind(this);
		this.handleNavNext = this.handleNavNext.bind(this);
		this.handleNavLast = this.handleNavLast.bind(this);
		this.handleInput = this.handleInput.bind(this);
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

	render() {
		console.log('employees:', this.props.employees);
		const employees = this.props.employees.map(employee =>
			<Employee key={employee.entity._links.self.href} 
			data={employee} 
			attributes={this.props.attributes} 
			onDelete={this.props.onDelete}
			onUpdate={this.props.onUpdate}/>
		);

		const navLinks = [];
		if('first' in this.props.links) {
			navLinks.push(<button key='first' onClick={this.handleNavFirst}>&lt;&lt;</button>);
		}
		if('prev' in this.props.links) {
			navLinks.push(<button key='prev' onClick={this.handleNavPrev}>&lt;</button>);
		}
		if('next' in this.props.links) {
			navLinks.push(<button key='next' onClick={this.handleNavNext}>&gt;</button>);
		}
		if('last' in this.props.links) {
			navLinks.push(<button key='last' onClick={this.handleNavLast}>&gt;&gt;</button>);
		}

		return (
			<div>
				<input ref='pageSize' defaultValue={this.props.pageSize} onInput={this.handleInput}/>
				<table>
					<tbody>
						<tr>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Description</th>
						</tr>
						{employees}
					</tbody>
				</table>
				<div>
					{navLinks}
				</div>
			</div>
		);
	}
}
// end::employee-list[]

// tag::employee[]
class Employee extends React.Component{
	constructor(props)  {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleDelete() {
		this.props.onDelete(this.props.data);
	}

	render() {
		return (
			<tr>
				<td>{this.props.data.entity.firstName}</td>
				<td>{this.props.data.entity.lastName}</td>
				<td>{this.props.data.entity.description}</td>
				<td>
					<UpdateDialog employee={this.props.data} 
					attributes={this.props.attributes} 
					onUpdate={this.props.onUpdate}/>
				</td>
				<td>
					<button onClick={this.handleDelete}>DELETE!</button>
				</td>
			</tr>
		);
	}
}
// end::employee[]