import React from 'react';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import OAuthLoginButtons from '../../components/OAuthLoginButtons/OAuthLoginButtons';
import InputHint from '../../components/InputHint/InputHint';
import AccountPageFooter from '../../components/AccountPageFooter/AccountPageFooter';
import validate from '../../../modules/validate';

import './Signup.scss';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        firstName: {
          required: true,
        },
        lastName: {
          required: true,
        },
        emailAddress: {
          required: true,
          email: true,
        },
        password: {
          required: true,
          minlength: 6,
        },
      },
      messages: {
        firstName: {
          required: 'What\'s your first name?',
        },
        lastName: {
          required: 'What\'s your last name?',
        },
        emailAddress: {
          required: 'Need an email address here.',
          email: 'Is this email address correct?',
        },
        password: {
          required: 'Need a password here.',
          minlength: 'Please use at least six characters.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;

    Accounts.createUser({
      email: this.emailAddress.value,
      password: this.password.value,
      profile: {
        name: {
          first: this.firstName.value,
          last: this.lastName.value,
        },
      },
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Meteor.call('users.sendVerificationEmail');
        Bert.alert('Welcome!', 'success');
        history.push('/ads');
      }
    });
  }

  render() {
    return (
      <div className="Signup">
        <Row>
          <Col xs={12} sm={6} md={5} lg={6} lgOffset={3} className='text-center'>
            <h1>Join hundreds of successful realtors - just like you!</h1>
            <p>Guarantueed 5 leads in your first month or your money back.</p>
            <br />
            <br />
            <Row>
              <Col xs={12}>
                <OAuthLoginButtons
                  services={['facebook']}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

Signup.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Signup;
