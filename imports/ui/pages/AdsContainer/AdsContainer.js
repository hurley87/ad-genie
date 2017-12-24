import React from 'react';
import Page from '../Page/Page';
import AdsIndex from '../AdsIndex/AdsIndex';

class MyAds extends React.Component {

  approveAd(adId, myId){
    console.log('approved')
    Meteor.call('approved.ad', adId, myId, function(err, result){
      if(err) console.log(err);
      if(result) console.log(result);
    })
  }

  pauseAd(adId, myId){
    Meteor.call('pause.ad', adId, myId, function(err, result){
      if(err) console.log(err);
      if(result) console.log(result);
    })
  }

  deleteAd(adId){
    Meteor.call('delete.ad', adId, function(err, result){
      if(err) console.log(err);
      if(result) console.log(result);
    })
  }

  render() {
    
    return (
        <div>
         <AdsIndex approveAd={this.approveAd} pauseAd={this.pauseAd} deleteAd={this.deleteAd}/>
        </div>
    );
  }
}

const AdsContainer = () => (
  <div className="AdsContainer">
    <MyAds />
  </div>
);

export default AdsContainer;