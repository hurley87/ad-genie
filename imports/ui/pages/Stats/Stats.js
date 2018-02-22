import React from 'react';
import {injectStripe} from 'react-stripe-elements';
import validate from '../../../modules/validate';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';

class Stats extends React.Component {

  constructor(props) {
  	super(props)

  	console.log(props.ad)

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
  	const ad = this.props.ad;
    return (
    	<div>
    		<h3 style={{marginTop: '0px'}}>{ad.ad.address}</h3>
    		<p>{ad.ad.plan.value}</p>
    		<hr />
    		<h3>Status</h3>
    		<p>{ ad.approved ? "Approved" : "Pending" }</p>
    		<hr />
    		<h3>Spend</h3>
    		<p>{ ad.spend }</p>
    		<hr />
    		<h3>Conversations</h3>
    		<p>{ ad.conversations }</p>
    	</div>
    );
  }
}

export default Stats;