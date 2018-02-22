import React from 'react';
import {injectStripe} from 'react-stripe-elements';
import validate from '../../../modules/validate';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import Loading from '../../components/Loading/Loading';

class CheckoutForm extends React.Component {

  constructor(props) {
  	super(props)
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
    	elements: null, 
    	card: null,
      email: '',
      loading: false
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

  handleSubmit() {
    const { history } = this.props;
    console.log('ADSSSSS')
    console.log(this.props.ad)

    this.props.stripe.createToken(this.state.card).then((token) => {
      console.log('Received Stripe token:', token.token.id);
      const client = {
        token: token.token.id,
        email: this.state.email,
        userId: Meteor.userId(),
        plan: this.props.ad.ad.plan,
        adId: this.props.ad._id
      }

      this.setState({
        loading: true
      })
      
	    Meteor.call('users.createClient', client, (error) => {
	      if (error) {
	        Bert.alert(error.reason, 'danger');
	      } else {
          Bert.alert("You just subscribed!", 'succcess');
          window.location.href = '/ads';
        }
	    });
    })
  }

  render() {
    if(this.state.loading) {
      return <Loading />
    } else {
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
}

export default CheckoutForm;