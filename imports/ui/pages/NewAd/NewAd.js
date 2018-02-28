import React from 'react';
import { Row, Col, FormGroup, ControlLabel, Button, DropdownButton, FormControl } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import InputHint from '../../components/InputHint/InputHint';
import FacebookAd from '../../components/FacebookAd/FacebookAd';
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
import Progress from './Progress'

import './NewAd.scss'

class NewAd extends React.Component {
  constructor(props) {
    super(props);

    const user = Meteor.users.findOne(Meteor.userId())
    const page = {
      'label': user.profile.pages[0].name,
      'value': user.profile.pages[0].id
    }
    const description = `🔥 Stunning House Located At 57 Curzon 🔥

  ✅ Newly Renovated Finished Basement 
  ✅ Newly Built Back Two-Level Deck
  ✅ Open Concept Kitchen

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
      address: "GET INSTANTLY",
      stage: 'video'
  	}

    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.vidChange = this.vidChange.bind(this)
    this.planChange = this.planChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.viewChange = this.viewChange.bind(this)
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
      stage: 'pageId'
    });
  }

  viewChange(view){
    this.setState({
      stage: view
    })
  }

  handlePageChange(page) {
    console.log(page)
    this.setState({
      pageId: page
    });
  }

  handleAddressChange(evt) {
    this.setState({
      address: evt.target.value
    })
  }

  handleSubmit(evt) {
    const { history } = this.props;

    evt.preventDefault()

    this.setState({
      loading: true
    })

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

    this.setState({
      loading: true
    })

    const context = this;
    Meteor.call('adset.new', ad, function(err, result){
      if(err) {
        Bert.alert(err.reason, 'danger');
      } else {
        setTimeout(function(){
          Bert.alert("Your ad was successfully created", 'success');
          history.push('/ads');
          context.setState({
            loading: false
          })
        }, 5000);
      }
    })
  }

  render() {
    const { history } = this.props;
    const pages = this.state.user.profile.pages;
    const pageId = this.state.pageId.value
    const choosenPage = pages.filter((page) => { return page.id == pageId })
    let img = "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/26804369_194105004503045_2459918275830932498_n.jpg?oh=b8241812e0b5e568b8defe52fa35fd39&oe=5B04BDBC";
    if(choosenPage.length > 0) {
      img = choosenPage[0].img
    }
 
    if(this.state.loading) {
      return <Loading />
    } else {
      if(this.state.stage == 'pageId') {
        return (
          <div className="NewAd">
            <Row>
              <Col xs={12} sm={6}>
                <Progress width={'40%'}/>
                <h3>Facebook Page</h3>
                <p>Choose your Facebook page from the dropdown menu. If you aren't an administer of your own page you can use ours.</p>
                <PagesList handlePageChange={this.handlePageChange} currentPage={this.state.pageId} />
                <p><button onClick={this.changeStage.bind(this, 'address')}>Next</button></p>
              </Col>
              <Col xs={12} sm={6}>
                <FacebookAd 
                  pageId={this.state.pageId} 
                  description={nl2br(this.state.description)}  
                  vidUrl={this.state.vidUrl}
                  address={this.state.address}
                  img={img}
                  viewChange={this.viewChange.bind(this)}
                  display='block'
                />
              </Col>
            </Row>
          </div>
        );
      } else if(this.state.stage == 'address') {
        return (
          <div className="NewAd">
            <Row>
              <Col xs={12} sm={6}>
                <Progress width={'60%'}/>
                <h3>Headline</h3>
                <p>Aim to keep your Facebook Ad headline short, sweet, and to the point. Facebook recommends that Ad headlines fall between 25-40 characters in length to maximize engagement, so your focus should be on creating something that is easily understood and value-oriented.

</p>
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
              <Col xs={12} sm={6}>
                <FacebookAd 
                  pageId={this.state.pageId} 
                  description={nl2br(this.state.description)}  
                  vidUrl={this.state.vidUrl}
                  address={this.state.address}
                  img={img}
                  viewChange={this.viewChange.bind(this)}
                  display='block'
                />
              </Col>
            </Row>
          </div>
        );
      } else if(this.state.stage == 'description') {
        return (
          <div className="NewAd">
            <Row>
              <Col xs={12} sm={6}>
                  <Progress width={'80%'}/>
                  <h3>Description</h3>
                  <p>This is chance to sell your ad so explain why someone would want to click on your ad. Pro tip: Use lists! People love lists so use that to your advantage.</p>
                  <ContentEditable
                    html={this.state.description}
                    className="edit-description"
                    tagName="div"
                    onChange={ this.handleDescriptionChange}
                    contentEditable="plaintext-only"
                  />
                  <p><button onClick={this.changeStage.bind(this, 'plan')}>Next</button></p>
                <div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <FacebookAd 
                  pageId={this.state.pageId} 
                  description={nl2br(this.state.description)}  
                  vidUrl={this.state.vidUrl}
                  address={this.state.address}
                  img={img}
                  viewChange={this.viewChange.bind(this)}
                  display='block'
                />
              </Col>
            </Row>
          </div>
        );
      } else if(this.state.stage == 'video'){
        return (
          <div className="NewAd">
            <Row>
              <Col xs={12} sm={6}>
                  <Progress width={'20%'}/>
                  <h3>Video</h3>
                  <p>People are watching more than 100 million hours of video on Facebook every day, and you can tap into this market with your own video. This is the most important part of your ad so make your video count!</p>
                  <NewVideo vidChange={this.vidChange} />
                  
              </Col>
              <Col xs={12} sm={6}>
                <FacebookAd 
                  pageId={this.state.pageId} 
                  description={nl2br(this.state.description)}  
                  vidUrl={this.state.vidUrl}
                  address={this.state.address}
                  img={img}
                  viewChange={this.viewChange.bind(this)}
                  display='block'
                />
              </Col>
            </Row>
          </div>
        );
      } else if(this.state.stage == 'plan'){
        return (
          <div className="NewAd">
            <Row>
              <form ref={form => (this.form = form)} onSubmit={this.handleSubmit.bind(this)}>
              <Col xs={12} sm={6}>
                  <Progress width={'100%'}/>
                  <h3>Budget</h3>
                  <p>The more money you spend, the more conversations you'll have. On average realtors are able to have 1 converion for every two dollars spent.</p>
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
                  <Button type="submit">Create Ad</Button>
              </Col>
              <Col xs={12} sm={6}>
                <FacebookAd 
                  pageId={this.state.pageId} 
                  description={nl2br(this.state.description)}  
                  vidUrl={this.state.vidUrl}
                  address={this.state.address}
                  img={img}
                  viewChange={this.viewChange.bind(this)}
                  display='block'
                />
              </Col>
              </form>
            </Row>
          </div>
        );
      } else {
        return (
          <div className="NewAd">
            <Row>
              <Col xs={12} sm={6}>
                  Looks like your lost. Refresh your browser. 
              </Col>
              <Col xs={12} sm={6}>
                <FacebookAd 
                  pageId={this.state.pageId} 
                  description={nl2br(this.state.description)}  
                  vidUrl={this.state.vidUrl}
                  address={this.state.address}
                  img={img}
                  viewChange={this.viewChange.bind(this)}
                  display='block'
                />
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
