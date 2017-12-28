import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Alert, Grid, Row, Col, Table, FormGroup, Radio } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Videos from '../../../api/Videos/Videos';
import Loading from '../../components/Loading/Loading';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';
import _ from 'lodash';
import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css';
import NewVideo from '../NewVideo/NewVideo'

const VideosList = ({ videos, loading, imgChange, match, history }) => ( !loading ? (
  videos.length > 0 ? 
  <div>
	<div className="page-header clearfix">
	  <h4 className="pull-left">Upload a Video</h4>
	</div>
	<NewVideo />
	<div className="page-header clearfix">
	  <h4>Choose a Video</h4>
	</div>
  	<Row>
	{videos.reverse().map((vid, i) => (
	  <Col md={6} xs={6} key={i}>
	  	<button onClick={imgChange.bind(this, vid.url, vid.video_id)}>{vid.name}</button>
	  	<video width="200" height="200" controls>
	  		<source src={vid.url} type="video/mp4"/>
	  	</video> 
	  </Col>
	))}
	</Row>
  </div> :
  <div>
	<div className="page-header clearfix">
	  <h4>Choose a Video</h4>
	</div>
	<p>TODO: Copy explaining the value of using video in an ad.</p>
	<NewVideo />
  </div>
): <Loading />);


VideosList.propTypes = {
  videos: PropTypes.array,
};

export default createContainer((props) => {
	const subscription = Meteor.subscribe('videos.user', Meteor.userId());
	let videos = Videos.find().fetch();
	let loading = !subscription.ready();

	return { 
		videos: videos,
		loading: loading,
		imgChange: props.imgChange
	}
}, VideosList);


