import React from 'react';
import {injectStripe} from 'react-stripe-elements';
import validate from '../../../modules/validate';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';

class CheckoutForm extends React.Component {

  constructor(props) {
  	super(props)
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
    	elements: null, 
    	card: null,
      email: ''
    }
    this.changeEmail = this.changeEmail.bind(this)
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        email: {
          required: true,
          email: true
        }
      },
      messages: {
        email: {
          required: "Email is required"
        }
      },
      submitHandler() { component.handleSubmit(); }});
  }

  componentWillReceiveProps() {
    this.setState({ elements: this.props.stripe.elements() }, () => {
      this.setState({ card: this.state.elements.create('card') }, () => {
        this.state.card.mount('#card-element');
      });
    });
  }

  changeEmail(evt){
    this.setState({
      email: evt.target.value
    })
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const { history } = this.props;
    console.log('OROS')
    console.log(this.props)
    this.props.stripe.createToken(this.state.card).then((token) => {
      console.log('Received Stripe token:', token.token.id);
	    Meteor.call('users.createClient', token.token.id, this.state.email, Meteor.userId(), this.props.ad.ad.plan, (error) => {
	      if (error) {
	        Bert.alert(error.reason, 'danger');
	      } 
	    });
    }).then(() => {
    	window.location.href = '/ads';
    });
  }

  render() {
    return (
      <form ref={form => (this.form = form)} onSubmit={this.handleSubmit}>
        <FormGroup>
          <ControlLabel>Email</ControlLabel>
          <input
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.changeEmail}
            className='form-control'
          />
        </FormGroup>
        <div>
          <label >
            Credit or debit card
          </label>
          <div id="card-element"/>
          <div id="card-errors" role="alert"/>
        </div>
        <button>Submit Payment</button>
      </form>
    );
  }
}

export default CheckoutForm;