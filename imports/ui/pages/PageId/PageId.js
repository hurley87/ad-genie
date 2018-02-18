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
import Select from 'react-select';


class PageId extends React.Component {
  constructor(props) {
    super(props);

    const { user } = this.props;
    let pages = user.profile.pages;
    let select = [];

    for(let page in pages) {
      select.push({
        value: pages[page].id,
        label: pages[page].name
      })
    }

    console.log(select)

    this.state = {
      pageId: '',
      select: select
    }

    this.getUserType = this.getUserType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changePageId = this.changePageId.bind(this)
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

  changePageId(pageId) {
    this.setState({
      pageId: pageId.value
    })
  }

  handleSubmit() {
    const { viewChange } = this.props;

    Meteor.call('users.updatePageId', this.state.pageId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        viewChange('phone')
      }
    });
  }

  render() {
    const { loading, user } = this.props;
    return (
      <div className="Profile">
        <Row>
          <Col xs={12}>
            <h4>Connect Your Facebook Page</h4>
            <p>You can update this later if you want.</p>
            <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
              <div>
                  <Row>
                    <Col xs={12}>
                      <Select
                        name="pageId"
                        value={this.state.pageId}
                        onChange={this.changePageId}
                        options={this.state.select}
                      />
                    </Col>
                  </Row>
                  <br />
                  <Button type="submit" bsStyle="success">Next</Button>
                </div>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}

PageId.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('users.editProfile');

  return {
    loading: !subscription.ready(),
    user: Meteor.user(),
  };
})(PageId);
