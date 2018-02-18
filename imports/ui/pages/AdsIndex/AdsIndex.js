import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Alert, Grid, Row, Col, Table } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Ads from '../../../api/Ads/Ads';
import Loading from '../../components/Loading/Loading';

import './AdsIndex.scss'

const AdsIndex = ({ pausedAds, activeAds, loading, approveAd, pauseAd, deleteAd, ads, match, history }) => ( !loading ? (

	<div>
	    <div className="page-header clearfix">
	      <h4 className="pull-left">Ads</h4>
	      <Link className="btn btn-success pull-right" to={`ads/new`}>Create Ad</Link>
	    </div>
		{
		  ads.length > 0 ? 
		  <Row>

		  	<Table  striped bordered condensed hover>
			    <thead>
			      <tr>
			        <th>#</th>
			        <th>Address</th>
			        <th>City</th>
					<th>Type</th>
					<th>Spend</th>
			        <th>Conversations</th>
			        <th>CPC</th>
			        <th>Status</th>
			      </tr>
			    </thead>
			    <tbody>
				    {activeAds.reverse().map((ad, i) => {
				    	return (
					      <tr key={ i } >
					        <td>{i + 1}</td>
					        <td ><a href={"/properties/"+ad._id}>{ad.ad.address}</a></td>
					        <td>{ad.ad.region }</td>
					        <td>{ad.ad.propertyType }</td>
					        <td>{ad.spend }</td>
					        <td>{ad.conversations}</td>
					        <td>{ad.cpc }</td>
					        <td>Running <button onClick={pauseAd.bind(this, ad.ad_id, ad._id)}>Pause</button></td>
					      </tr>
					    )
				    } )}
				    {pausedAds.reverse().map((ad, i) => {
				    	return (
					      <tr key={ i } >
					        <td>{i + 1}</td>
					        <td ><a href={"/properties/"+ad._id}>{ad.ad.address}</a></td>
					        <td>{ad.ad.region }</td>
					        <td>{ad.ad.propertyType }</td>
					        <td>{ad.spend }</td>
					        <td>{ad.conversations}</td>
					        <td>{ad.cpc }</td>
					        <td>Paused <button onClick={approveAd.bind(this, ad.ad_id, ad._id)}>Run</button></td>
					      </tr>
					    )
				    } )}
			    </tbody>
		  	</Table>
		  </Row> 
		  : <Alert bsStyle="warning">No ads yet!</Alert>
		}
	</div>

): <Loading />);


AdsIndex.propTypes = {
  ads: PropTypes.array,
};

export default createContainer((props) => {
	const subscription = Meteor.subscribe('ads.user', Meteor.userId());

	let ads = Ads.find().fetch();

	let pausedAds = []
	let activeAds = []

	pausedAds = Ads.find({ approve: false }).fetch()
	activeAds = Ads.find({ approve: true }).fetch()

	let loading = !subscription.ready()

	return { 
		pausedAds: pausedAds,
		activeAds: activeAds,
		loading: loading,
		approveAd: props.approveAd,
		pauseAd: props.pauseAd,
		deleteAd: props.deleteAd,
		ads:ads
	}
}, AdsIndex);


