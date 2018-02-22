import React from 'react';
import {injectStripe} from 'react-stripe-elements';
import validate from '../../../modules/validate';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';

class Upgrade extends React.Component {

  constructor(props) {
  	super(props)

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const component = this;

    validate(component.form, { submitHandler() { component.handleSubmit(); }});
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const { history } = this.props;
  	console.log('AD ID')
  	console.log(this.props.ad._id)
    Meteor.call('users.addPlan', this.props.customerId, this.props.ad.ad.plan.value, Meteor.userId(), this.props.ad._id, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
      	Bert.alert('You purchased this ad!', 'success')
      }
    });
  }

  render() {
    return (
      <form ref={form => (this.form = form)} onSubmit={this.handleSubmit}>
        <button>Submit Payment</button>
      </form>
    );
  }
}

export default Upgrade;