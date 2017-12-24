import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import rateLimit from '../../../modules/rate-limit';
import s3 from '../../../modules/server/s3';
import adsSdk from 'facebook-nodejs-ads-sdk';
import request from 'request';
import AWS from 'aws-sdk';
import Images from '../Images'

Meteor.methods({
	'image.new': function imageNew(upload) {
		check(upload, Object);
		return s3.putObject(upload, 'snapmortgages', 'public-read', true)
	    .then((attachment) => {
	     	console.log(attachment);
			const accessToken = Meteor.settings.FBAccess;
			const accountId = Meteor.settings.FBAccountID;

			const FacebookAdsApi = adsSdk.FacebookAdsApi.init(accessToken)
			const AdAccount = adsSdk.AdAccount;
			const AdSet = adsSdk.AdSet;
			const account = new AdAccount(accountId)

			console.log('upload to Facebook')
			account
				.createAdImage(
					[],
					{
						'bytes': upload.data.split(',')[1]
					}
				)
				.then((image) => {
				    try {
				      return Images.upsert({
							name: upload.file.name
						},{ 
				      	owner_id: this.userId, 
				      	name: upload.file.name,
				      	hash: image.images.bytes.hash,
				      	url: "https://s3.us-east-2.amazonaws.com/snapmortgages/" + upload.file.name
				      });
				    } catch (exception) {
				      throw new Meteor.Error('500', exception);
				    }
				})
				.catch((error) => {
					throw new Meteor.Error('500', `${error}`);
				})
	    })
	    .catch((error) => {
	      throw new Meteor.Error('500', `${error}`);
	    });


	}
});



rateLimit({
  methods: [
    'campaigns.new',
  ],
  limit: 5,
  timeRange: 1000,
});
