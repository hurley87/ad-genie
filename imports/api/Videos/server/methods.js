import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import rateLimit from '../../../modules/rate-limit';
import s3 from '../../../modules/server/s3';
import adsSdk from 'facebook-nodejs-ads-sdk';
import request from 'request';
import AWS from 'aws-sdk';
import Videos from '../Videos'

Meteor.methods({
	'video.new': function videoNew(upload, user) {
		check(upload, Object);
		check(user, Object)
		return s3.putObject(upload, 'adsgen', 'public-read', true)
	    .then((attachment) => {
			const accessToken = Meteor.settings.FBAccess;
			const accountId = Meteor.settings.FBAccountID;
			const FacebookAdsApi = adsSdk.FacebookAdsApi.init(accessToken)
			const AdAccount = adsSdk.AdAccount;
			const AdSet = adsSdk.AdSet;
			const account = new AdAccount(accountId)
			const vid_file = attachment.url.split('?')[0]
			const vid_name = vid_file.split('/')[3]
			
			Videos.upsert({
				name: vid_name
			},{
				userId: user._id,
				name: vid_name,
				url: vid_file
			})
	    })
	    .catch((error) => {
	      throw new Meteor.Error('500', `${error}`);
	    });


	}
});
