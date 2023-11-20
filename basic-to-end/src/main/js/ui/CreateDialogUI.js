const React = require('react');
const ReactDOM = require('react-dom');

class CreateDialog extends React.Component {

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
        const inputs = this.props.attributes.forEach(attribute =>
            <p key={attribute}>
                <input type='text' placeholder={attribute} ref={attribute} className='field'/>
            </p>
            );
        
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