import React from 'react';
import { Row, Col, FormGroup, ControlLabel, Button, DropdownButton, FormControl } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import InputHint from '../../components/InputHint/InputHint';
import validate from '../../../modules/validate';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import VideosList from '../VideosList/VideosList';
import NewVideo from '../NewVideo/NewVideo';
import nl2br from 'react-nl2br';
import Loading from '../../components/Loading/Loading';
import PagesList from '../PagesList/PagesList'
import Email from '../Email/Email'
import Phone from '../Phone/Phone'
import PageId from '../PageId/PageId'
import ContentEditable from 'react-simple-contenteditable';
import Credit from '../Credit/Credit'

import './NewAd.scss'

class NewAd extends React.Component {
  constructor(props) {
    super(props);

    const user = Meteor.users.findOne(Meteor.userId())
    const page = {
      'label': user.profile.pages[0].name,
      'value': user.profile.pages[0].id
    }
    const address = "57 Curzon";
    const description = `🔥 Stunning House Located At ${address} 🔥

  ✅ Newly Renovated Finished Basement 
  ✅ Newly Built Back Two-Level Deck
  ✅ Open Concept Kitchen

  You need to see this one for yourself!

  To get more information on this property or to book a viewing  hit the "Send Message" button below!`
    
  	this.state = {
  		description: description,
      plan: "pro",
  		vidUrl: '',
  		videoId: '',
      address: '',
      loading: false,
      user: user,
      pageId: page,
      address: address,
      stage: 'pageId'
  	}

    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.vidChange = this.vidChange.bind(this)
    this.planChange = this.planChange.bind(this)
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {

      },
      messages: {

      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleDescriptionChange(evt, value){
    this.setState({
      description: value
    })
  }

  changeStage(stage){
    this.setState({
      stage: stage
    })
  }

  planChange(plan){
    this.setState({
      plan: plan
    })
  }

  vidChange(vid, videoId) {
    this.setState({
      videoId: videoId,
      vidUrl: vid,
      stage: 'plan'
    });
  }

  handlePageChange(page) {
    this.setState({
      pageId: page
    });
  }

  handleAddressChange(evt) {
    let description = `🔥 Stunning House Located At ${evt.target.value} 🔥

  ✅ Newly Renovated Finished Basement 
  ✅ Newly Built Back Two-Level Deck
  ✅ Open Concept Kitchen

  You need to see this one for yourself!

  To get more information on this property or to book a viewing  hit the "Send Message" button below!`
 
    this.setState({
      address: evt.target.value,
      description: description
    })
  }

  render() {
    const { history } = this.props;

    if(this.state.loading) {
      return <Loading />
    } else {
      if(this.state.stage == 'pageId') {
        return (
          <div className="NewAd">
            <div className="page-header clearfix">
              <h4 className="pull-left">Create an Ad</h4>
            </div>
            <Row>
              <Col xs={6}>
                <PagesList handlePageChange={this.handlePageChange} currentPage={this.state.pageId} />
                <p><button onClick={this.changeStage.bind(this, 'address')}>Next</button></p>
              </Col>
              <Col xs={6}>
                <h5>{this.state.pageId.label == '' ? "Page Name" : this.state.pageId.label }</h5>
                <div>
                  {nl2br(this.state.description)}
                </div>
                <video width="200" height="200" controls>
                  <source src={this.state.vidUrl} type="video/mp4"/>
                </video>
              </Col>
            </Row>
          </div>
        );
      } else if(this.state.stage == 'address') {
        return (
          <div className="NewAd">
            <div className="page-header clearfix">
              <h4 className="pull-left">Create an Ad</h4>
            </div>
            <Row>
              <Col xs={6}>
                <input
                  type="text"
                  name="address"
                  value={this.state.address}
                  ref={address => (this.address = address)}
                  className="form-control"
                  onChange={this.handleAddressChange}
                />
                <p><button onClick={this.changeStage.bind(this, 'description')}>Next</button></p>
              </Col>
              <Col xs={6}>
                <h5>{this.state.pageId.label}</h5>
                <div>
                  {nl2br(this.state.description)}
                </div>
                <video width="200" height="200" controls>
                  <source src={this.state.vidUrl} type="video/mp4"/>
                </video>
              </Col>
            </Row>
          </div>
        );
      } else if(this.state.stage == 'description') {
        return (
          <div className="NewAd">
            <div className="page-header clearfix">
              <h4 className="pull-left">Create an Ad</h4>
            </div>
            <Row>
              <Col xs={6}>
                  <ContentEditable
                    html={this.state.description}
                    className="edit-description"
                    tagName="div"
                    onChange={ this.handleDescriptionChange}
                    contentEditable="plaintext-only"
                  />
                  <p><button onClick={this.changeStage.bind(this, 'video')}>Next</button></p>
                <div>
                </div>
              </Col>
              <Col xs={6}>
                <h5>{this.state.pageId.label}</h5>
                <div>
                  {nl2br(this.state.description)}
                </div>
                <video width="200" height="200" controls>
                  <source src={this.state.vidUrl} type="video/mp4"/>
                </video>
              </Col>
            </Row>
          </div>
        );
      } else if(this.state.stage == 'video'){
        return (
          <div className="NewAd">
            <div className="page-header clearfix">
              <h4 className="pull-left">Create an Ad</h4>
            </div>
            <Row>
              <Col xs={6}>
                  <NewVideo />
                  <VideosList vidChange={this.vidChange} />
              </Col>
              <Col xs={6}>
                <h5>{this.state.pageId.label}</h5>
                <div>
                  {nl2br(this.state.description)}
                </div>
                <video width="200" height="200" controls>
                  <source src={this.state.vidUrl} type="video/mp4"/>
                </video>
              </Col>
            </Row>
          </div>
        );
      } else if(this.state.stage == 'plan'){
        return (
          <div className="NewAd">
            <div className="page-header clearfix">
              <h4 className="pull-left">Create an Ad</h4>
            </div>
            <Row>
              <Col xs={6}>
                  <ControlLabel>Budget</ControlLabel>
                  <Select
                    name="propertyType"
                    value={this.state.plan}
                    onChange={this.planChange}
                    options={[
                      { value: 'starter', label: '$50' },
                      { value: 'pro', label: '$100'},
                      { value: 'ultra', label: '$250'}
                    ]}
                  />
                  <p><button onClick={this.changeStage.bind(this, 'payment')}>Next</button></p>
              </Col>
              <Col xs={6}>
                <h5>{this.state.pageId.label}</h5>
                <div>
                  {nl2br(this.state.description)}
                </div>
                <video width="200" height="200" controls>
                  <source src={this.state.vidUrl} type="video/mp4"/>
                </video>
              </Col>
            </Row>
          </div>
        );
      } else if(this.state.stage == 'payment') {

        let budget = 1000
        const plan = this.state.plan
        if(plan == 'pro'){
          budget = 2000
        }
        if(plan == 'ultra') {
          budget = 5000
        }

        const ad = {
          vidUrl: this.state.vidUrl,
          description: this.state.description,
          plan: this.state.plan,
          videoId: this.state.videoId,
          address: this.state.address,
          pageId: this.state.pageId,
          user: this.state.user,
          budget: budget
        }

        return (
          <div className="NewAd">
            <div className="page-header clearfix">
              <h4 className="pull-left">Create an Ad</h4>
            </div>
            <Row>
              <Col xs={6}>
                  <p>Awesome time to make a payment</p>
                  <Credit ad={ad} />
              </Col>
              <Col xs={6}>
                <h5>{this.state.pageId.label}</h5>
                <div>
                  {nl2br(this.state.description)}
                </div>
                <video width="200" height="200" controls>
                  <source src={this.state.vidUrl} type="video/mp4"/>
                </video>
              </Col>
            </Row>
          </div>
        );
      }
    }



  }
}

NewAd.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewAd;
