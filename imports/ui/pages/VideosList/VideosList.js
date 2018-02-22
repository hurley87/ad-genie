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
import NewVideo from '../NewVideo/NewVideo';

import './VideosList.scss';

const VideosList = ({ videos, loading, vidChange, match, history }) => ( !loading ? (
  videos.length > 0 ? 
  <div>
	<p>Now choose a video below to advertise.</p>
  	<Row>
	{videos.reverse().map((vid, i) => (
	  <Col md={6} xs={6} key={i}>
	  	<video width="150" height="150" controls>
	  		<source src={vid.url} type="video/mp4"/>
	  	</video> 
	  	<button className="vidButton" onClick={vidChange.bind(this, vid.url, vid.video_id)}>{vid.name}</button>
	  </Col>
	))}
	</Row>
  </div> :
  <div>
	Upload a video of your listing to continue
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
		vidChange: props.vidChange
	}
}, VideosList);


