import React from 'react';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import InputHint from '../../components/InputHint/InputHint';
import validate from '../../../modules/validate';

class NewCampaign extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        budget: {
          required: true
        },
        region: {
          required: true,
        },
        imgHash: {
          required: true,
        },
        link: {
          required: true,
        },
        name: {
          required: true
        },
        message: {
          required: true
        },
        description: {
          required: true
        },
        pageId: {
          required: true
        }
      },
      messages: {
        budget: {
          required: "Need to pick a budget"
        },
        region: {
          required: 'Need to pick a region'
        },
        imgHash: {
          required: 'What\'s your first name?',
        },
        link: {
          required: 'What\'s your last name?',
        },
        name: {
          required: 'Need an email address here.'
        },
        message: {
          required: 'Need a message here.'
        },
        description: {
          required: 'Need a description here.'
        },
        padeId: {
          required:'Need a pageId here.'
        }
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;

    const ad = {
      image_hash: this.imgHash.value,
      link: this.link.value,
      name: this.name.value,
      message: this.message.value,
      description: this.description.value,
      region: this.region.value,
      budget: parseInt(this.budget.value)
    }
    
    const pageId = '1001845033197335';

    const user = Meteor.users.findOne(Meteor.userId())

    Meteor.call('adset.new', user.profile.campaignId, ad, pageId)
  }

  render() {
    return (
      <div className="NewCampaign">
        <Row>
          <Col xs={12} sm={6} md={5} lg={4}>
            <h4 className="page-header">Create Campaign</h4>
            <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
                <FormGroup>
                  <ControlLabel>Budget</ControlLabel>
                  <input
                    type="text"
                    name="budget"
                    ref={budget => (this.budget = budget)}
                    className="form-control"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>region</ControlLabel>
                  <input
                    type="text"
                    name="region"
                    ref={region => (this.region = region)}
                    className="form-control"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Img Hash</ControlLabel>
                  <input
                    type="text"
                    name="imgHash"
                    ref={imgHash => (this.imgHash = imgHash)}
                    className="form-control"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Link</ControlLabel>
                  <input
                    type="text"
                    name="link"
                    ref={link => (this.link = link)}
                    className="form-control"
                  />
                </FormGroup>
              <FormGroup>
                <ControlLabel>Name</ControlLabel>
                <input
                  type="text"
                  name="name"
                  ref={name => (this.name = name)}
                  className="form-control"
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>message</ControlLabel>
                <input
                  type="message"
                  name="message"
                  ref={message => (this.message = message)}
                  className="form-control"
                />
                <InputHint>Use at least six characters.</InputHint>
              </FormGroup>
              <FormGroup>
                <ControlLabel>description</ControlLabel>
                <input
                  type="description"
                  name="description"
                  ref={description => (this.description = description)}
                  className="form-control"
                />
                <InputHint>Use at least six characters.</InputHint>
              </FormGroup>
              <Button type="submit" bsStyle="success">Create Campaign</Button>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}

NewCampaign.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewCampaign;
