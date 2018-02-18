import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Alert, Grid, Row, Col, Table, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Ads from '../../../api/Ads/Ads';
import Loading from '../../components/Loading/Loading';

import './AdsIndex.scss'

const AdsIndex = ({ pausedAds, activeAds, loading, approveAd, pauseAd, deleteAd, ads, match, history }) => ( !loading ? (

	<div className='AdsIndex'>
		{
		  ads.length > 0 ? 
		  <Row>
		    <div className="page-header clearfix">
		      <h4 className="pull-left">Ads</h4>
		    </div>
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
		  : 
		  <Row>
		  	<br />
		  	<Col lg={6} lgOffset={3}>
		  		<img src="/optimize.gif"/>
		  		<h3 className='text-center'>Almost there ...</h3>
		  		<p className='text-center'>Answer 4 simple questions and needls and we'll advertise a listing for you.</p>
		  		<br />
		  		<Button className='main-button' href="/ads/new">Create your first ad</Button>
		  		<br />
		  		<p className='text-center'>Take the First Step to new customers. Let's get started!</p>
		  	</Col>
		  </Row>
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


