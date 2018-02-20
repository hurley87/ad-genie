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

    let phone = ''
    if(user.profile.phone) {
      phone = user.profile.phone
    }
    this.state = {
      phone: phone
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
        window.location.href = '/ads/' + this.props.adId
      }
    });
  }

  render() {
    const { loading, user } = this.props;

    if(user.profile.phone) {
    return (
      <div className="Profile">
        <Row>
          <Col xs={12}>
            <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
              <div>
                  <Row>
                    <Col className='text-center' lg={4} lgOffset={4}>
                      <img src="/create.gif"/>
                      <h3>All set!</h3>
                      <p>We'll notify you when <a href={'/ads/' + this.props.adId}>your first ad</a> is approved. In the meantime <a href="/settings">update your profile</a> or <a href="/ads/new">create another ad</a>.</p>
                      <br />
                      <p>If you have an issue please call Dave at 647-284-5023</p>
                    </Col>
                  </Row>
                </div>
            </form>
          </Col>
        </Row>
      </div>
    )
    } else {
    return (
      <div className="Profile">
        <Row>
          <Col xs={12}>
            <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
              <div>
                  <Row>
                    <Col lg={4} lgOffset={4}>
                      <img src="/create.gif"/>
                      <h3 className='text-center'>Nice work!</h3>
                      <p className='text-center'>We created your first Facebook ad and it is now in the process of being approved. Where should we text you when your ad is approved?</p>
                      <br />
                      <FormGroup>
                        <input
                          type="phone"
                          name="phone"
                          value={this.state.phone}
                          onChange={this.changePhone}
                          className='form-control'
                        />
                        <br />
                        <Button type='submit' className='main-button'>Update phone number</Button>
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
            </form>
          </Col>
        </Row>
      </div>
    )
    }
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
