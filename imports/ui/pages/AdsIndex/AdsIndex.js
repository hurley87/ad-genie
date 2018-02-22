import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Alert, Grid, Row, Col, Table, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Ads from '../../../api/Ads/Ads';
import Loading from '../../components/Loading/Loading';
import Phone from "../Phone/Phone";

import './AdsIndex.scss'

const AdsIndex = ({ pausedAds, activeAds, loading, approveAd, pauseAd, deleteAd, ads, match, history }) => ( !loading ? (

	<div className='AdsIndex'>
		{
		  ads.length == 0 ? 
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
		  : 
		  ads.length == 1 ?
		  <Row>
		  	<br />
		  	<Phone adId={ads[0]._id} />
		  </Row>
		  :
		  <Row>
		  	<Col lg={10}>
			    <Row>
			    	<Col className='first' xs={2}>
			    		<div className='header'>
			    			Name
			    		</div>
			    	</Col>
			    	<Col className='middle' xs={2}>
			    		<div className='header'>
			    			Plan
			    		</div>
			    	</Col>
			    	<Col  className='middle' xs={2}>
			    		<div className='header'>
			    			Status
			    		</div>
			    	</Col>
			    	<Col  className='middle' xs={2}>
			    		<div className='header'>
			    			Spend
			    		</div>
			    	</Col>
			    	<Col  className='middle' xs={2}>
			    		<div className='header'>
			    			Conversations
			    		</div>
			    	</Col>
			    	<Col className='last' xs={2}>
			    		<div className='header'>
			    			CPC
			    		</div>
			    	</Col>
			    </Row>
			    {activeAds.reverse().map((ad, i) => {
			    	return (
			    		<a href={`/ads/${ad._id}`}>
					    <Row className='table-row'>
					    	<Col  className='first' xs={2}>
					    		<div className='table-cell'>
					    			{ad.ad.address}
					    		</div>
					    	</Col>
					    	<Col  className='middle' xs={2}>
					    		<div className='table-cell'>
					    			{ad.ad.plan.value}
					    		</div>
					    	</Col>
					    	<Col  className='middle' xs={2}>
					    		<div className='table-cell'>
					    			{ad.approved ? 'Approved' : "Pending"}
					    		</div>
					    	</Col>
					    	<Col  className='middle' xs={2}>
					    		<div className='table-cell'>
					    			{ad.spend}
					    		</div>
					    	</Col>
					    	<Col  className='middle' xs={2}>
					    		<div className='table-cell'>
					    			{ad.conversations}
					    		</div>
					    	</Col>
					    	<Col  className='last' xs={2}>
					    		<div className='table-cell'>
					    			{ad.cpc}
					    		</div>
					    	</Col>
					    </Row>
					    </a>
				    )
			    } )}
			    {pausedAds.reverse().map((ad, i) => {
			    	return (
			    		<a href={`/ads/${ad._id}`}>
					    <Row className='table-row'>
					    	<Col className='first' xs={2}>
					    		<div className='table-cell'>
					    			{ad.ad.address}
					    		</div>
					    	</Col>
					    	<Col   className='middle' xs={2}>
					    		<div className='table-cell'>
					    			{ad.ad.plan.value}
					    		</div>
					    	</Col>
					    	<Col   className='middle' xs={2}>
					    		<div className='table-cell'>
					    			{ad.approved ? 'Approved' : "Pending"}
					    		</div>
					    	</Col>
					    	<Col   className='middle' xs={2}>
					    		<div className='table-cell'>
					    			{ad.spend}
					    		</div>
					    	</Col>
					    	<Col   className='middle' xs={2}>
					    		<div className='table-cell'>
					    			{ad.conversations}
					    		</div>
					    	</Col>
					    	<Col  className='last' xs={2}>
					    		<div className='table-cell'>
					    			{ad.cpc}
					    		</div>
					    	</Col>
					    </Row>
					    </a>
				    )
			    } )}  	
		  	</Col>
		  	<Col lg={2}>
		  		<h3>Ads</h3>
		  		<p>3</p>
		  		<hr />
		  		<h3>Spend</h3>
		  		<p>$0</p>
		  		<hr />
		  		<h3>Conversations</h3>
		  		<p>$0</p>
		  		<hr />
		  		<h3>CPC</h3>
		  		<p>$0</p>
		  		<hr />
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

	console.log(ads)

	let pausedAds = []
	let activeAds = []

	pausedAds = Ads.find({ approved: false }).fetch()
	activeAds = Ads.find({ approved: true }).fetch()

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