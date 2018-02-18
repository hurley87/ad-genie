import React from 'react';
import {injectStripe} from 'react-stripe-elements';
import validate from '../../../modules/validate';

class CheckoutForm extends React.Component {

  constructor(props) {
  	super(props)
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
    	elements: null, 
    	card: null
    }
  }
  componentWillReceiveProps() {
    this.setState({ elements: this.props.stripe.elements() }, () => {
      this.setState({ card: this.state.elements.create('card') }, () => {
        this.state.card.mount('#card-element');
      });
    });
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const { history } = this.props;
    const context = this;                             
    Meteor.call('adset.new', this.props.ad, function(err, result){
      if(err) {
        console.log(err)
      } else {
	    context.props.stripe.createToken(context.state.card).then((token) => {
	        console.log('Received Stripe token:', token.token.id);
		    Meteor.call('users.createClient', token.token.id, context.props.email, Meteor.userId(), context.props.ad.plan, (error) => {
		      if (error) {
		        Bert.alert(error.reason, 'danger');
		      } 
		    });
	    }).then(() => {
	    	window.location.href = '/ads';
	    });
      }
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
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