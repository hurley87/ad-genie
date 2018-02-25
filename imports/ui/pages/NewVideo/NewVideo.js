import React from 'react';
import { Row, Col, FormGroup, ControlLabel, Button, Input } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import InputHint from '../../components/InputHint/InputHint';
import validate from '../../../modules/validate';
import Loading from '../../components/Loading/Loading';
import VideoList from '../VideosList/VideosList'

import './NewVideo.scss'

class NewVideo extends React.Component {
  constructor(props) {
    super(props);
    const { history } = props;
    this.handleUpload = this.handleUpload.bind(this);
    this.state = {
      vidChange: props.vidChange,
      loading: false,
      history: history
    }
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        pageId: {
          required: true
        }
      },
      messages: {
        padeId: {
          required:'Need a pageId here.'
        }
      },
      submitHandler() { component.handleUpload(); },
    });
  }

  handleUpload(event) {
    const files = this.imageFile.files;
    const reader = new FileReader();
    const file = files[0];
    const { history } = this.props;
    this.setState({
      loading: true
    })
    if(file) {
      reader.readAsDataURL(file);
      reader.onloadend = (event) => {
        const context = this;
        Meteor.call('video.new', { data: reader.result, file: { name: file.name, type: file.type } }, Meteor.user(), function(err, result){
          if (err) console.warn(err);
          if (result) console.log(result);
          context.setState({
            loading: false
          })
        })
      };
    } else {
      return Bert.alert('Error uploading your video. Please try again.', 'danger')
    }

  }

  render() {
    const loading = this.state.loading;
    if(loading) {
      return (
        <Loading />
      )
    } else {
    return (
      <div className="NewVideo">
        <Row>
          <Col xs={12}>
            <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
                <FormGroup>
                  <input
                    type="file"
                    name="imageFile"
                    ref={imageFile => (this.imageFile = imageFile)}
                    className="form-control"
                  />
                  <Button type="submit" bsStyle="success">Upload Video</Button>
                </FormGroup>
            </form>
            <hr style={{marginTop: '0px'}}/>
            <VideoList vidChange={this.props.vidChange} />
          </Col>
        </Row>
      </div>
    );
    }

  }
}

export default NewVideo;
