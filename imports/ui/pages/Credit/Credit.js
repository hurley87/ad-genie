/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import { withTracker } from 'meteor/react-meteor-data';
import InputHint from '../../components/InputHint/InputHint';
import validate from '../../../modules/validate';
import {StripeProvider} from 'react-stripe-elements';

import CheckoutForm from './CheckoutForm';


class Credit extends React.Component {


  constructor(props) {
    super(props);

    const { user } = this.props;

    this.state = { 
      stripe: window.Stripe('pk_test_gBGm5KOgvZnDZhdncbvbBq0m')
    };

  }

  componentDidMount() {
    const component = this;

    validate(component.form, { submitHandler() { component.handleSubmit(); }});

    if (window.Stripe) {
      this.setState({stripe: window.Stripe('pk_test_gBGm5KOgvZnDZhdncbvbBq0m')});
    } else {
      document.querySelector('#stripe-js').addEventListener('load', () => {
        this.setState({stripe: window.Stripe('pk_test_gBGm5KOgvZnDZhdncbvbBq0m')});
      });
    }
  }

  render() {
    const { loading, user } = this.props;
    return (
      <div className="Profile">
        <CheckoutForm ad={this.props.ad} email={user.profile.email} stripe={this.state.stripe}/>
      </div>
    );
  }
}

Credit.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('users.editProfile');

  return {
    loading: !subscription.ready(),
    user: Meteor.user(),
  };
})(Credit);
