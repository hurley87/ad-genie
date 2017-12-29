import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button, Row, Col } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Link } from 'react-router-dom';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import Audiences from '../../../api/Audiences/Audiences';
import _ from 'lodash';
import Select from 'react-select';

const AudiencesList = ({ loading, regions, select, handleChange, currentRegion, match, history }) => (
  !loading ? 
    <div className="AudiencesList">
      <div className="page-header clearfix">
        <h4>Choose an audience to target</h4>
      </div>
      <p>What city do you want to advertise in?</p>
      <Select
        name="region"
        value={currentRegion}
        onChange={handleChange}
        options={select}
      />
    </div> : <Loading />
);

AudiencesList.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object
};

export default createContainer((props) => {
  const subscription = Meteor.subscribe('audiences');
  let regions = Audiences.find().fetch();
  let select = []
  if(subscription.ready()){
	  for(let region in regions) {
	  	select.push({
	  		value: regions[region].city_id,
	  		label: regions[region].name
	  	})
	  }
  }
 
  return {
    loading: !subscription.ready(),
    regions: regions,
    select: select,
    handleChange: props.handleChange,
    currentRegion: props.currentRegion
  };
}, AudiencesList);
