const React = require('react');

// tag::employee-list[]
export class EmployeeList extends React.Component{
	

	render() {
		const employees = this.props.employees.map(employee =>
			<Employee key={employee._links.self.href} data={employee} onDelete={this.props.onDelete}/>
		);

		const navLinks = [];
		if('first' in this.props.links) {
			navLinks.push(<button key='first' onClick={this.props.handleNavFirst}>&lt;&lt;</button>);
		}
		if('prev' in this.props.links) {
			navLinks.push(<button key='prev' onClick={this.props.handleNavPrev}>&lt;</button>);
		}
		if('next' in this.props.links) {
			navLinks.push(<button key='next' onClick={this.props.handleNavNext}>&gt;</button>);
		}
		if('last' in this.props.links) {
			navLinks.push(<button key='last' onClick={this.props.handleNavLast}>&gt;&gt;</button>);
		}

		return (
			<div>
				<input ref='pageSize' defaultValue={this.props.pageSize} onInput={this.props.handleInput}/>
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
				<td>{this.props.data.firstName}</td>
				<td>{this.props.data.lastName}</td>
				<td>{this.props.data.description}</td>
				<td>
					<button onClick={this.handleDelete}>DELETE!</button>
				</td>
			</tr>
		);
	}
}
// end::employee[]