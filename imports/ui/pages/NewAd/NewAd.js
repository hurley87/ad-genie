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
import AudiencesList from '../AudiencesList/AudiencesList'
import VideosList from '../VideosList/VideosList';
import NewVideo from '../NewVideo/NewVideo';
import nl2br from 'react-nl2br';
import Loading from '../../components/Loading/Loading';
import NewImage from '../NewImage/NewImage';
import ImagesList from '../ImagesList/ImagesList';
import PagesList from '../PagesList/PagesList'

class NewCampaign extends React.Component {
  constructor(props) {
    super(props);
    
  	this.state = {
  		region: '',
  		description: '',
  		budget: '',
  		vidUrl: '',
  		videoId: '',
  		chooseVid: true,
  		headline: 'GET INSTANTLY',
  		ref: "FB",
      address: '123 Fake Street',
      propertyType: 'Bugalow',
      loading: false,
      imgUrl: '',
      first: 'Newly Renovated Finished Basement',
      second: 'Newly Built Back Two-Level Deck',
      third: 'Open Concept Kitchen',
      page: '',
      price: '1000000'
  	}
  	this.imgChange = this.imgChange.bind(this)
    this.vidChange = this.vidChange.bind(this)
  	this.handleTextareaChange = this.handleTextareaChange.bind(this)
  	this.handleHeadlineChange = this.handleHeadlineChange.bind(this)
    this.handlePriceChange = this.handlePriceChange.bind(this)
  	this.handleRefChange = this.handleRefChange.bind(this)
  	this.handleBudgetChange = this.handleBudgetChange.bind(this)
  	this.handleChange = this.handleChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleFirstChange = this.handleFirstChange.bind(this)
    this.handleSecondChange = this.handleSecondChange.bind(this)
    this.handleThirdChange = this.handleThirdChange.bind(this)
  	this.chooseAnotherVid = this.chooseAnotherVid.bind(this)
    this.chooseAnotherImg = this.chooseAnotherImg.bind(this)
  	this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handlePropertyTypeChange = this.handlePropertyTypeChange.bind(this)
  }


  handleChange(region) {
    this.setState({ 
      region: region
    });
  }

  handlePageChange(page) {
    this.setState({ 
      page: page
    });
  }

  handlePriceChange(evt) {
    this.setState({ 
      price: evt.target.value
    });
  }

  handleFirstChange(evt) {
    this.setState({ 
      first: evt.target.value
    });
  }

  handleSecondChange(evt) {
    this.setState({ 
      second: evt.target.value
    });
  }

  handleThirdChange(evt) {
    this.setState({ 
      third: evt.target.value
    });
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
        address: {
          required: true
        },
        propertyType: {
          required: true
        },
        ref: {
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
        address: {
          required: "What's your address?"
        },
        propertyType: {
          required: "What's your property type?"
        },
        ref: {
          required: 'Need an email address here.'
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

  handleTextareaChange(evt) {
    this.setState({ 
      description: evt.target.value
    });
  }

  handleBudgetChange(budget) {
    this.setState({ 
      budget: budget
    });
  }

  handleHeadlineChange(evt) {
    this.setState({
      headline: evt.target.value
    })
  }

  handleAddressChange(evt) {
    this.setState({
      address: evt.target.value
    })
  }

  handlePropertyTypeChange(evt) {
    this.setState({
      propertyType: evt.value
    })
  }

  handleRefChange(evt) {
    this.setState({
      ref: evt.target.value
    })
  }

  handleRefChange(evt) {
    this.setState({
      ref: evt.target.value
    })
  }

  vidChange(vid, videoId) {
    this.setState({ 
      videoId: videoId,
      vidUrl: vid,
      chooseVid: false
    });
  }

  imgChange(img) {
    this.setState({ 
      imgUrl: img.src
    });
  }

  chooseAnotherVid() {
    this.setState({ 
      vidUrl: ''
    });
  }

  chooseAnotherImg() {
    this.setState({ 
      imgUrl: ''
    });
  }

  handleSubmit(evt) {
    const { history } = this.props;

    evt.preventDefault()

    this.setState({
      loading: true
    })

    let prov = this.state.region.value

    const pageId = '140688513258179';

    const user = Meteor.users.findOne(Meteor.userId())
    const userName = user.profile.name.split(" ")[0]

    const description = `🔥 Stunning ${this.state.propertyType} Located At ${this.state.address} 🔥

  ✅ ${this.state.first} 
  ✅ ${this.state.second}
  ✅ ${this.state.third}

  You need to see this one for yourself!

  To get more information on this property or to book a viewing  hit the "Send Message" button below!`

    const ad = {
      vidUrl: this.state.vidUrl,
      name: 'GET INSTANTLY',
      description: description,
      region: prov,
      budget: parseInt('10000'),
      videoId: this.state.videoId,
      address: this.state.address,
      propertyType: this.state.propertyType,
      imgUrl: this.state.imgUrl,
      pageId: this.state.page.value,
      price: this.state.price.value
    }

    const context = this;                             
    Meteor.call('adset.new', user.profile.campaignId, ad, pageId, Meteor.userId(), function(err, result){
      if(err) {
        console.log(err)
      } else {
        setTimeout(function(){ 
          context.setState({
            loading: false
          })
          history.push('/properties');
        }, 5000);
      }
    })
  }

  render() {
    if(this.state.loading) {
      return <Loading />
    } else {
      if(this.state.vidUrl == ''){
        return (
          <div className="NewCampaign">
            <Row>
              <Col md={12} xs={12}>
                <VideosList imgChange={this.vidChange} />
              </Col>
            </Row>
          </div>
        );
      } else if(this.state.imgUrl == '') {
        return <ImagesList imgChange={this.imgChange} />
      } else {
        return (
          <div className="NewCampaign">
            <Row>
              <Col xs={12} sm={6} md={5} lg={4}>
                <br />
                <button onClick={this.chooseAnotherVid}>Choose another video</button>
                <button onClick={this.chooseAnotherImg}>Choose another image</button>
                <h4 className="page-header">Create Ad</h4>
                <form ref={form => (this.form = form)} onSubmit={this.handleSubmit.bind(this)}>
                    <FormGroup>
                      <ControlLabel>Page</ControlLabel>
                      <PagesList handlePageChange={this.handlePageChange} currentPage={this.state.page} />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>City</ControlLabel>
                      <AudiencesList handleChange={this.handleChange} currentRegion={this.state.region} />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>Address</ControlLabel>
                      <input
                        type="text"
                        name="address"
                        value={this.state.address}
                        ref={address => (this.address = address)}
                        className="form-control"
                        onChange={this.handleAddressChange}
                      />
                    </FormGroup>  
                    <FormGroup>
                      <ControlLabel>#1 Selling Point</ControlLabel>
                      <input
                        type="text"
                        name="first"
                        value={this.state.first}
                        ref={first => (this.first = first)}
                        className="form-control"
                        onChange={this.handleFirstChange}
                      />
                    </FormGroup>   
                    <FormGroup>
                      <ControlLabel>#2 Selling Point</ControlLabel>
                      <input
                        type="text"
                        name="second"
                        value={this.state.second}
                        ref={second => (this.second = second)}
                        className="form-control"
                        onChange={this.handleSecondChange}
                      />
                    </FormGroup>  
                    <FormGroup>
                      <ControlLabel>#3 Selling Point</ControlLabel>
                      <input
                        type="text"
                        name="third"
                        value={this.state.third}
                        ref={third => (this.third = third)}
                        className="form-control"
                        onChange={this.handleThirdChange}
                      />
                    </FormGroup> 
                    <FormGroup>
                      <ControlLabel>Price</ControlLabel>
                      <input
                        type="text"
                        name="price"
                        value={this.state.price}
                        ref={price => (this.price = price)}
                        className="form-control"
                        onChange={this.handlePriceChange}
                      />
                    </FormGroup> 
                    <FormGroup>
                      <ControlLabel>Property Type</ControlLabel>
                      <Select
                        name="propertyType"
                        value={this.state.propertyType}
                        onChange={this.handlePropertyTypeChange}
                        options={[
                          { value: 'loft', label: 'Loft' },
                          { value: 'detached', label: 'Detached'},
                          { value: 'condo', label: 'Condo'},
                          { value: 'detached', label: 'Detached'},
                          { value: 'bungalow', label: 'Bugalow'},
                          { value: 'townhome', label: 'Townhome'},
                          { value: 'semidetachedtownhome', label: 'Semi Detached Townhome'},
                        ]}
                      />
                    </FormGroup>
                  <Button type="submit" bsStyle="success">Create Ad</Button>
                </form>
              </Col>
            </Row>
          </div>
        );
      }
    }



  }
}

NewCampaign.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewCampaign;
