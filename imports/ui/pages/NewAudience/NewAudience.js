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
import { Route, Redirect } from 'react-router-dom';


class NewAudience extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const component = this;

    validate(component.form, {
      rules: {
        city: {
          required: true
        },
        city_id: {
          required: true,
        }
      },
      messages: {
        city: {
          required: "Need to pick a city"
        },
        city_id: {
          required: 'Need to pick a city_id',
        }
      },
      submitHandler() { component.handleSubmit(); },
    });
  }


  handleSubmit() {
    const { history } = this.props;

    const audience = {
      userId: Meteor.userId(),
      city_id: this.city_id.value,
      city: this.city.value
    }

    console.log(audience)

    Meteor.call('audiences.new', audience, function(err, result){
    	if(err) {
    		console.log(err)
    	} else {
    		history.push('/campaigns/new');
    	}
    });	
  }

  render() {
    return (
      <div className="NewAudience">
        <Row>
          <Col xs={12} sm={6} md={5} lg={4}>
            <h4 className="page-header">Create Campaign</h4>
            <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
            	<FormGroup>
	              <ControlLabel>province Id</ControlLabel>
	              <input
	                type="text"
	                name="city_id"
	                ref={city_id => (this.city_id = city_id)}
	                className="form-control"
	              />
	          	</FormGroup>
	            <FormGroup>
	              <ControlLabel>Province</ControlLabel>
	              <input
	                type="text"
	                name="city"
	                ref={city => (this.city = city)}
	                className="form-control"
	              />
		        </FormGroup>
              <Button type="submit" bsStyle="success">Create Campaign</Button>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}

NewAudience.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewAudience;
