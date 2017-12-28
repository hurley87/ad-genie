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

class NewVideo extends React.Component {
  constructor(props) {
    super(props);
    const { history } = props;
    this.handleUpload = this.handleUpload.bind(this);
    this.state = {
      imgChange: props.imgChange,
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

    reader.readAsDataURL(file);
    this.setState({
      loading: true
    })
    reader.onloadend = (event) => {
      const context = this;
      Meteor.call('video.new', { data: reader.result, file: { name: file.name, type: file.type } }, function(err, result){
        if (err) console.warn(err);
        if (result) console.log(result);
        setTimeout(function(){ 
          context.setState({
            loading: false
          })
        }, 4000);
      })
    };
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
                </FormGroup>
              <Button type="submit" bsStyle="success">Upload Video</Button>
            </form>
          </Col>
        </Row>
      </div>
    );
    }

  }
}

export default NewVideo;
