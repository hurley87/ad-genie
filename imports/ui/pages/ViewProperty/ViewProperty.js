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
import Credit from '../Credit/Credit';
import Upgrade from '../Upgrade/Upgrade';
import Stats from '../Stats/Stats'
import './ViewProperty.scss'

const ViewProperty = ({ loading, ad, deleteAd, user, img, match, history }) => ( !loading ? (
  <div className="ViewProperty">
    <Row>
      <Col xs={12} sm={6}>

        {
          user.profile.customerId ?
          <div>
            {
              ad.paid ?
              <Stats ad={ad} />
              :
              <Upgrade customerId={user.profile.customerId} ad={ad}  />
            }
          </div>
          :
          <div>
            <Credit ad={ad} />
          </div>
        }

      </Col>
      <Col xs={12} sm={6}>
        <FacebookAd 
          pageId={ad.ad.pageId} 
          description={nl2br(ad.ad.description)}  
          vidUrl={ad.ad.vidUrl}
          address={ad.ad.address}
          img={user.profile.pages.filter((page) => { return page.id == ad.ad.pageId.value }).length > 0 ? user.profile.pages.filter((page) => { return page.id == ad.ad.pageId.value })[0].img : "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/26804369_194105004503045_2459918275830932498_n.jpg?oh=b8241812e0b5e568b8defe52fa35fd39&oe=5B04BDBC"}
          display='none'
        />
      </Col>
    </Row>
  </div>
) : <Loading />);


ViewProperty.propTypes = {
  stages: PropTypes.array,
};



export default createContainer(({ match, history }) => {

	const adId = match.params._id;
	const subscription = Meteor.subscribe('ad.view', adId);
	let ad = Ads.find().fetch()[0];
	const user = Meteor.users.findOne(Meteor.userId())
	let loading = !subscription.ready()

	const deleteAd = function(adId, history) {
		history.push('/ads')
		Meteor.call('delete.ad', adId, function(err, result){
			if(err) console.log(err)
			if(result) history.push('/ads')
		})
	}

	return { 
		loading:loading,
		ad: ad,
		deleteAd: deleteAd,
		user: user
	}
}, ViewProperty);





