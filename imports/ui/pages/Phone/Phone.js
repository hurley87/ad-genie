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
      phone: ''
    }


    this.getUserType = this.getUserType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changePhone = this.changePhone.bind(this)
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

  changePhone(evt) {
    this.setState({
      phone: evt.target.value
    })
  }

  handleSubmit() {
    const { history } = this.props;

    Meteor.call('users.updatePhone', this.state.phone, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Profile updated!', 'success');
        history.push('/credit');
      }
    });
  }

  render() {
    const { loading, user } = this.props;
    return (
      <div className="Profile">
        <Row>
          <Col xs={12}>
            <h4>Your Phone Number</h4>
            <p>Potential Clients will contact you here.</p>
            <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
              <div>
                  <Row>
                    <Col xs={12}>
                    <FormGroup>
                      <input
                        type="phone"
                        name="phone"
                        value={this.state.phone}
                        onChange={this.changePhone}
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
