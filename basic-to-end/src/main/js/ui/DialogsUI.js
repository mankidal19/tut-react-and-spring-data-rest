const React = require('react');
const ReactDOM = require('react-dom');

export class CreateDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const newEmployee = {};
        this.props.attributes.forEach(attribute => {
            newEmployee[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });

        this.props.onCreate(newEmployee);

        // clear out dialog's input
        this.props.attributes.forEach(attribute => {
            ReactDOM.findDOMNode(this.refs[attribute]).value = '';
        });

        // navig away from dialog to hide it
        window.location = '#';
    }

    render() {
        const inputs = this.props.attributes.map(attribute =>
            <p key={attribute}>
                <input type='text' placeholder={attribute} ref={attribute} className='field'/>
            </p>
            );
        
        //console.log('attributes: ', this.props.attributes);
        //console.log('inputs: ', inputs);

        // React does not create event handlers on every DOM element. 
        // Instead, it has a much more performant and sophisticated solution. 
        // You need not manage that infrastructure and can instead focus on writing functional code.
        return (
            <div>
                <a href='#createEmployee'>Create</a>
                <div id='createEmployee' className='modalDialog'>
                    <div>
                        <a href='#' title='Close' className='close'>X</a>
                        <h2>Create a new employee</h2>
                        <form>
                            {inputs}
                            <button onClick={this.handleSubmit}>CREATE!</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export class UpdateDialog extends React.Component {

    constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

    handleSubmit(e) {
        e.preventDefault();
        const updatedEmployee = {};
        this.props.attributes.forEach(attribute => {
            updatedEmployee[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });
        this.props.onUpdate(this.props.employee, updatedEmployee);
        window.location = '#';
    }

    render() {
        const inputs = this.props.attributes.map(attribute =>
            <p key={this.props.employee.entity[attribute]}>
                <input type='text' placeholder={attribute} 
                defaultValue={this.props.employee.entity[attribute]}
                ref={attribute}/>
            </p>
            );
        
        const dialogId = `updateEmployee-${this.props.employee.entity._links.self.href}`;

        return (
            <div key={this.props.employee.entity._links.self.href}>
                <a href={'#' + dialogId}>UPDATE!</a>
                <div id={dialogId} className='modalDialog'>
                    <div>  
                        <a href='#' title='Close' className='close'>X</a>
                        <h2>Update an employee</h2>
                        <form>
                            {inputs}
                            <button onClick={this.handleSubmit}>UPDATE!!</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}