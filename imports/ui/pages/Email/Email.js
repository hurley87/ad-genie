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


class Email extends React.Component {
  constructor(props) {
    super(props);

    const { user } = this.props;

    console.log(user)

    let email = ''
    if (user.services) {
      email = user.services.facebook.email
      console.log(email)
    }

    this.state = {
      email: email
    }


    this.getUserType = this.getUserType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeEmail = this.changeEmail.bind(this)
  }

  componentDidMount() {
    const component = this;

    validate(component.form, { submitHandler() { component.handleSubmit(); }});
  }

  getUserType(user) {
    const userToCheck = user;
    delete userToCheck.services.resume;
    const service = Object.keys(userToCheck.services)[0];
    return service === 'password' ? 'password' : 'oauth';
  }

  changeEmail(evt) {
    this.setState({
      email: evt.target.value
    })
  }

  handleSubmit() {
    const { history } = this.props;

    Meteor.call('users.updateEmail', this.state.email, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Profile updated!', 'success');
        history.push('/phone');
      }
    });
  }

  render() {
    const { loading, user } = this.props;
    let email = ''
    if (user.services && this.state.email == '') {
      email = user.services.facebook.email
      this.setState({
        email: email
      })
    }
    return (
      <div className="Profile">
        <Row>
          <Col xs={12}>
            <h4>Your Email</h4>
            <p>You'll recieve leads right to your inbox</p>
            <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
              <div>
                  <Row>
                    <Col xs={12}>
                    <FormGroup>
                      <input
                        type="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.changeEmail}
                        className='form-control'
                      />
                    </FormGroup>
                    </Col>
                  </Row>
                  <Button type="submit" bsStyle="success">Next</Button>
                </div>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}

Email.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('users.editProfile');

  return {
    loading: !subscription.ready(),
    user: Meteor.user(),
  };
})(Email);
