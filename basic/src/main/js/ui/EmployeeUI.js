const React = require('react');

export class EmployeeList extends React.Component {

    render() {
        const employees = this.props.employees.map(employee => {
            <Employee key={employee._links.self.href} data={employee}/>
        });

        return (
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
        );
    }
}

class Employee extends React.Component {

    render() {
        return (
            <tr>
                <td>{this.props.data.firstName}</td>
                <td>{this.props.data.lastName}</td>
                <td>{this.props.data.description}</td>
            </tr>
        );
    }
}