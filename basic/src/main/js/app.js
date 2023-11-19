'use strict';

// tag::vars[]
const React = require('react'); // <1>
const ReactDOM = require('react-dom'); // <2>
const client = require('./client'); // <3>
const {EmployeeList} = require('./ui/EmployeeUI')
// end::vars[]

// tag::app[]
class App extends React.Component { // <1>

	constructor(props) {
		super(props);
		this.state = {employees: []};
	}

	componentDidMount() { // <2>
		client({method: 'GET', path: '/api/employees'}).done(response => {
			this.setState({employees: response.entity._embedded.employees});
		});
	}

	render() { // <3>
		return (
			<EmployeeList employees={this.state.employees}/>
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
