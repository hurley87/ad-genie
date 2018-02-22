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


class Phone extends React.Component {
  constructor(props) {
    super(props);

    const { user } = this.props;

    this.state = {
      phone: user.profile.phone || "" ,
      email: user.profile.email,
      firstName: user.profile.firstName || '',
      lastName: user.profile.lastName || ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changeFirstName = this.changeFirstName.bind(this);
    this.changeLastName = this.changeLastName.bind(this);
    this.changePhone = this.changePhone.bind(this);
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        email: {
          required: true,
          email: true
        },
        phone: {
          required: true,
        },
        firstName: {
          required: true,
        },
        lastName: {
          required: true,
        }
      },
      messages: {
        email: {
          required: "Email is required"
        },
        phone: {
          required: 'Phone is required'
        },
        firstName: {
          required: 'What\'s your first name?',
        },
        lastName: {
          required: 'What\'s your last name?',
        }
      },
      submitHandler() { component.handleSubmit(); }});
  }

  changePhone(evt){
  	this.setState({
  		phone: evt.target.value
  	})
  }

  changeEmail(evt){
  	this.setState({
  		email: evt.target.value
  	})
  }

  changeFirstName(evt){
  	this.setState({
  		firstName: evt.target.value
  	})
  }

  changeLastName(evt){
  	this.setState({
  		lastName: evt.target.value
  	})
  }

  handleSubmit() {
    const { history } = this.props;

	const user = {
		id: Meteor.userId(),
		email: this.state.email,
		phone: this.state.phone,
		firstName: this.state.firstName,
		lastName: this.state.lastName
	}

    Meteor.call('users.updateProfile', user, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
      	Bert.alert('Your profile was updated', 'success');
        history.push('/ads')
      }
    });
  }

  render() {
    const { loading, user } = this.props;

    return (
      <div className="Profile">
        <Row>
          <Col sm={6}>
            <h4>Update your Account</h4>
            <p>Potential Clients will contact you here.</p>
            <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
              <div>
                <Row>
                    <Col xs={12}>
                    <FormGroup>
                      <ControlLabel>First Name</ControlLabel>
                      <input
                        type="text"
                        name="firstName"
                        value={this.state.firstName}
                        onChange={this.changeFirstName}
                        className='form-control'
                      />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>Last Name</ControlLabel>
                      <input
                        type="text"
                        name="lastName"
                        value={this.state.lastName}
                        onChange={this.changeLastName}
                        className='form-control'
                      />
                    </FormGroup>
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
                    <FormGroup>
                      <ControlLabel>Phone</ControlLabel>
                      <input
                        type="text"
                        name="phone"
                        value={this.state.phone}
                        onChange={this.changePhone}
                        className='form-control'
                      />
                    </FormGroup>

                    </Col>
                </Row>
                <Button type="submit">Update</Button>
                </div>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}

Phone.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('users.editProfile');

  return {
    loading: !subscription.ready(),
    user: Meteor.user(),
  };
})(Phone);
