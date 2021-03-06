import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Icon from '../Icon/Icon';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import './OAuthLoginButton.scss';

const handleLogin = (service, callback) => {
  const options = {
    facebook: {
      requestPermissions: ['email', 'manage_pages', 'ads_management', 'ads_read', 'pages_show_list', "publish_pages"],
      loginStyle: 'popup',
    },
    github: {
      requestPermissions: ['user:email'],
      loginStyle: 'popup',
    },
    google: {
      requestPermissions: ['email', 'profile'],
      requestOfflineToken: true,
      loginStyle: 'popup',
    },
  }[service];

  return {
    facebook: Meteor.loginWithFacebook,
    github: Meteor.loginWithGithub,
    google: Meteor.loginWithGoogle,
  }[service](options, callback);
};

const serviceLabel = {
  facebook: <Button className='main-button'>Connect Your Facebook Account</Button>,
  github: <span><Icon icon="github" /> Log In with GitHub</span>,
  google: <span><Icon icon="google" /> Log In with Google</span>,
};

const OAuthLoginButton = ({ service, callback }) => (
  <div
    className={`OAuthLoginButton OAuthLoginButton-${service}`}
    onClick={() => handleLogin(service, callback)}
  >
    {serviceLabel[service]}
  </div>
);

OAuthLoginButton.defaultProps = {
  callback: (error) => {
    if (error) Bert.alert(error.message, 'danger');
  },
};

OAuthLoginButton.propTypes = {
  service: PropTypes.string.isRequired,
  callback: PropTypes.func,
};

export default OAuthLoginButton;
