import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Alert, Grid, Row, Col, Table } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Ads from '../../../api/Ads/Ads';
import Loading from '../../components/Loading/Loading';
import FacebookAd from '../../components/FacebookAd/FacebookAd';
import nl2br from 'react-nl2br';
import Credit from '../Credit/Credit'

import './ViewProperty.scss'

const ViewProperty = ({ loading, ad, deleteAd, user, match, history }) => ( !loading ? !ad.approve ? (
  <div className="ViewProperty">
    <Row>
      <Col xs={12} sm={6}>
          <h3>Awaiting Approval</h3>
          <p>You'll be notified when this ad is approved.</p>
      </Col>
      <Col xs={12} sm={6}>
        <FacebookAd 
          pageId={ad.ad.pageId} 
          description={nl2br(ad.ad.description)}  
          vidUrl={ad.ad.vidUrl}
          address={ad.ad.address}
        />
      </Col>
    </Row>
  </div>
) : (
  <div className="ViewProperty">
    <Row>
      <Col xs={12} sm={6}>
          <h3>TODO : Budget</h3>
          <p>Explain how budget is used inside the app. Don't charge here!</p>
          <Credit ad={ad} />
      </Col>
      <Col xs={12} sm={6}>
        <FacebookAd 
          pageId={ad.ad.pageId} 
          description={nl2br(ad.ad.description)}  
          vidUrl={ad.ad.vidUrl}
          address={ad.ad.address}
        />
      </Col>
    </Row>
  </div>

): <Loading />);


ViewProperty.propTypes = {
  stages: PropTypes.array,
};



export default createContainer(({ match, history }) => {

	const adId = match.params._id;
	const subscription = Meteor.subscribe('ad.view', adId);

	let ad = Ads.find().fetch()[0];

	console.log(ad)
	const user = Meteor.users.findOne(Meteor.userId())
	console.log(user)

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
		deleteAd: deleteAd,
		user: user
	}
}, ViewProperty);





