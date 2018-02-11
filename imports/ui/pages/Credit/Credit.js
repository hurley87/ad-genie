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


class Credit extends React.Component {
  constructor(props) {
    super(props);

    const { user } = this.props;

    this.state = {
      number: '',
      month: '',
      year: '',
      cvv: ''
    }


    this.getUserType = this.getUserType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeNumber = this.changeNumber.bind(this);
    this.changeMonth = this.changeMonth.bind(this);
    this.changeYear = this.changeYear.bind(this);
    this.changeCvv = this.changeCvv.bind(this);
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

  changeNumber(evt) {
    this.setState({
      number: evt.target.value
    })
  }
  changeMonth(evt) {
    this.setState({
      month: evt.target.value
    })
  }
  changeYear(evt) {
    this.setState({
      year: evt.target.value
    })
  }

  changeCvv(evt) {
    this.setState({
      cvv: evt.target.value
    })
  }
  handleSubmit() {
    const { history } = this.props;

    console.log(this.state)

    // Meteor.call('users.updateCredit', this.state.Credit, (error) => {
    //   if (error) {
    //     Bert.alert(error.reason, 'danger');
    //   } else {
    //     Bert.alert('Profile updated!', 'success');
    //     history.push('/credit');
    //   }
    // });
  }

  render() {
    const { loading, user } = this.props;
    return (
      <div className="Profile">
        <Row>
          <Col xs={12}>
            <h4>Verify Your Identity</h4>
            <p>You will not be charged.</p>
            <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
              <div>
                  <Row>
                    <Col xs={12}>
                    <ControlLabel>Card Number</ControlLabel>
                    <FormGroup>
                      <input
                        type="text"
                        name="number"
                        value={this.state.number}
                        onChange={this.changeNumber}
                        className='form-control'
                      />
                    </FormGroup>
                    </Col>
                    <Col xs={4}>
                    <ControlLabel>Exp Month</ControlLabel>
                    <FormGroup>
                      <input
                        type="text"
                        name="month"
                        value={this.state.month}
                        onChange={this.changeMonth}
                        className='form-control'
                      />
                    </FormGroup>
                    </Col>
                    <Col xs={4}>
                    <ControlLabel>Exp Year</ControlLabel>
                    <FormGroup>
                      <input
                        type="text"
                        name="year"
                        value={this.state.year}
                        onChange={this.changeYear}
                        className='form-control'
                      />
                    </FormGroup>
                    </Col>
                    <Col xs={4}>
                    <ControlLabel>CVV</ControlLabel>
                    <FormGroup>
                      <input
                        type="text"
                        name="cvv"
                        value={this.state.cvv}
                        onChange={this.changeCvv}
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
