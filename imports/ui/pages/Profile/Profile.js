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

import './Profile.scss';

class Profile extends React.Component {
  constructor(props) {
    super(props);

    const pagesList = props.user.profile.pagesList;
    const subs = pagesList.filter((page) => { return pagesList.indexOf(page.id) == -1 })
    const unsubs = pagesList.filter((page) => { return pagesList.indexOf(page.id) > -1 })

    this.state = { pagesList, subs, unsubs }

    this.getUserType = this.getUserType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderOAuthUser = this.renderOAuthUser.bind(this);
    this.renderPasswordUser = this.renderPasswordUser.bind(this);
    this.renderProfileForm = this.renderProfileForm.bind(this);
    this.toggleSubscribe = this.toggleSubscribe.bind(this);
    this.toggleUnsubscribe = this.toggleUnsubscribe.bind(this);
  }

  toggleSubscribe(evt){
    let subs = this.state.subs;
    let pagesList = this.state.pagesList;
    const pageId =  evt.target.value;
    const index = subs.indexOf(pageId)
    const index2 = pagesList.indexOf(pageId)

    if( index == -1) {
      subs.push(pageId)
    } else {
      subs.splice(index, 1)
    }
    
    if( index2 == -1) {
      pagesList.push(pageId)
    } else {
      pagesList.splice(index, 1)
    }
    this.setState({ pagesList, subs })
  }

  toggleUnsubscribe(evt){
    let unsubs = this.state.unsubs;
    const pageId =  evt.target.value;
    const index = unsubs.indexOf(pageId)
    let pagesList = this.state.pagesList;
    const index2 = pagesList.indexOf(pageId)

    if( index == -1) {
      unsubs.push(pageId)
    } else {
      unsubs.splice(index, 1)
    }

    if( index2 == -1) {
      pagesList.push(pageId)
    } else {
      pagesList.splice(index, 1)
    }
    this.setState({ unsubs, pagesList })
  }

  componentDidMount() {
    const component = this;

    validate(component.form, { submitHandler() { component.handleSubmit(); }});
    validate(component.form2, { submitHandler() { component.handleSubmit2(); }});
  }

  getUserType(user) {
    const userToCheck = user;
    delete userToCheck.services.resume;
    const service = Object.keys(userToCheck.services)[0];
    return service === 'password' ? 'password' : 'oauth';
  }

  handleSubmit() {
    const { history } = this.props;

    Meteor.call('users.subscribe', this.state.subs, this.props.user.profile.pages, this.state.pagesList, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Profile updated!', 'success');
        history.push('/properties/new');
      }
    });
  }

  handleSubmit2() {
    const { history } = this.props;

    Meteor.call('users.unsubscribe', this.state.unsubs, this.props.user.profile.pages, this.state.pagesList, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Profile updated!', 'success');
        history.push('/properties/new');
      }
    });
  }

  renderOAuthUser(loading, user) {
    return !loading ? (
      <div className="OAuthProfile">
        <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
          {this.renderProfileForm(loading, user)}
        </form>
      </div>) : <div />;
  }

  renderPasswordUser(loading, user) {
    return !loading ? (
      <div>
        <Row>
          <Col xs={6}>
            <FormGroup>
              <ControlLabel>First Name</ControlLabel>
              <input
                type="text"
                name="firstName"
                defaultValue={user.profile.name.first}
                className="form-control"
              />
            </FormGroup>
          </Col>
          <Col xs={6}>
            <FormGroup>
              <ControlLabel>Last Name</ControlLabel>
              <input
                type="text"
                name="lastName"
                defaultValue={user.profile.name.last}
                ref={lastName => (this.lastName = lastName)}
                className="form-control"
              />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <ControlLabel>Email Address</ControlLabel>
          <input
            type="email"
            name="emailAddress"
            defaultValue={user.emails[0].address}
            ref={emailAddress => (this.emailAddress = emailAddress)}
            className="form-control"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Current Password</ControlLabel>
          <input
            type="password"
            name="currentPassword"
            ref={currentPassword => (this.currentPassword = currentPassword)}
            className="form-control"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>New Password</ControlLabel>
          <input
            type="password"
            name="newPassword"
            ref={newPassword => (this.newPassword = newPassword)}
            className="form-control"
          />
          <InputHint>Use at least six characters.</InputHint>
        </FormGroup>
        <Button type="submit" bsStyle="success">Save Profile</Button>
      </div>
    ) : <div />;
  }

  renderProfileForm(loading, user) {
    return !loading ? ({
      password: this.renderPasswordUser,
      oauth: this.renderOAuthUser,
    }[this.getUserType(user)])(loading, user) : <div />;
  }

  render() {
    const { loading, user } = this.props;
    const pages = user.profile.pages;
    const pagesList = user.profile.pagesList;
    return (
      <div className="Profile">
        <Row>
          <Col xs={12} sm={6} md={4}>
            <h4 className="page-header">Subscribe</h4>
            <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
              <div>
                  <Row>
                    {pages.filter((page) => { return pagesList.indexOf(page.id) == -1 }).map((page, i) => (
                      <Col key={i} xs={12}>
                        <FormGroup>
                          <ControlLabel>{page.name}</ControlLabel>
                          <input
                            type="checkbox"
                            name="pageId"
                            defaultValue={page.id}
                            defaultChecked={pagesList.indexOf(page.id) > -1}
                            onChange={this.toggleSubscribe}
                          />
                        </FormGroup>
                      </Col>
                    ))}
                  </Row>
                  <Button type="submit" bsStyle="success">Save Profile</Button>
                </div>
            </form>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <h4 className="page-header">Unsubscribe</h4>
            <form ref={form2 => (this.form2 = form2)} onSubmit={event => event.preventDefault()}>
              <div>
                  <Row>
                    {pages.filter((page) => { return pagesList.indexOf(page.id) > -1 }).map((page, i) => (
                      <Col key={i} xs={12}>
                        <FormGroup>
                          <ControlLabel>{page.name}</ControlLabel>
                          <input
                            type="checkbox"
                            name="pageId"
                            defaultValue={page.id}
                            onChange={this.toggleUnsubscribe}
                          />
                        </FormGroup>
                      </Col>
                    ))}
                  </Row>
                  <Button type="submit" bsStyle="success">Save Profile</Button>
                </div>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}

Profile.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('users.editProfile');

  return {
    loading: !subscription.ready(),
    user: Meteor.user(),
  };
})(Profile);
