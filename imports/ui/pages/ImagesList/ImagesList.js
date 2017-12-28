import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Alert, Grid, Row, Col, Table, FormGroup, Radio } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Images from '../../../api/Images/Images';
import Loading from '../../components/Loading/Loading';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';
import _ from 'lodash';
import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css';
import NewImage from '../NewImage/NewImage';

const ImagesList = ({ images, loading, imgChange, match, history }) => ( !loading ? (
  images.length > 0 ? 
  <div>
	<div className="page-header clearfix">
	  <h4>Upload an Image</h4>
	</div>
  	<NewImage />
	<div className="page-header clearfix">
	  <h4>Choose an Image</h4>
	</div>
	<ImagePicker 
	  images={images.map((image, i) => ({src: image.url, value: i, hash: image.hash }))}
	  onPick={imgChange}
	/>
  </div> :
  <div>
	<div className="page-header clearfix">
	  <h4>Upload an Image</h4>
	</div>
	<p>TODO: explain importance of using the right image in an ad.</p>
	<NewImage />
  </div>
): <Loading />);


ImagesList.propTypes = {
  images: PropTypes.array,
};

export default createContainer((props) => {
	const subscription = Meteor.subscribe('images');

	let images = Images.find().fetch();

	let loading = !subscription.ready()

	return { 
		images: images,
		loading: loading,
		imgChange: props.imgChange
	}
}, ImagesList);


