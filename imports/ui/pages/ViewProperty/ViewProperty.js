import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Alert, Grid, Row, Col, Table } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Ads from '../../../api/Ads/Ads';
import Loading from '../../components/Loading/Loading';

const ViewProperty = ({ loading, ad, deleteAd, match, history }) => ( !loading ? (
  <div>
  	<h3>{ad.ad.address}</h3>
  	<img style={{height: "200px"}} src={ad.ad.imgUrl} />
  	<p>{ad.ad.description}</p>
  	<button onClick={deleteAd.bind(this, ad._id, history)}>Delete</button>
  </div>
): <Loading />);


ViewProperty.propTypes = {
  stages: PropTypes.array,
};



export default createContainer(({ match, history }) => {

	const adId = match.params._id;
	const subscription = Meteor.subscribe('ad.view', adId);

	let ad = Ads.find().fetch()[0];

	let loading = !subscription.ready()

	const deleteAd = function(adId, history) {
		history.push('/properties')
		Meteor.call('delete.ad', adId, function(err, result){
			if(err) console.log(err)
			if(result) history.push('/properties')
		})
	}

	return { 
		loading:loading,
		ad: ad,
		deleteAd: deleteAd
	}
}, ViewProperty);





