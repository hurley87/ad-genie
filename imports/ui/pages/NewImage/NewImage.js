import React from 'react';
import { Row, Col, FormGroup, ControlLabel, Button, Input } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import InputHint from '../../components/InputHint/InputHint';
import validate from '../../../modules/validate';
import ImagesList from '../ImagesList/ImagesList';
import Loading from '../../components/Loading/Loading';

class NewImage extends React.Component {
  constructor(props) {
    super(props);
    this.handleUpload = this.handleUpload.bind(this);
    this.state = {
      imgChange: props.imgChange,
      loading: false
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
    this.setState({
      loading: true
    })
    reader.readAsDataURL(file);
    const context = this;
    reader.onloadend = (event) => {
      Meteor.call('image.new', { data: reader.result, file: { name: file.name, type: file.type } }, function(err, result){
        if (err) console.warn(err);
        if (result) console.log(result)
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
      return <Loading />
    } else {
      return (
        <div className="NewImage">
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
                <Button type="submit" bsStyle="success">Create Image</Button>
              </form>
            </Col>
          </Row>
          <br />
        </div>
      );
    }

  }
}

export default NewImage;
