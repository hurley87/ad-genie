import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Ads from '../Ads';

Meteor.publish('ads.active', function adsActive() {
	const selector = {
		"approved": true
	}
	return Ads.find(selector);
});

Meteor.publish('ads.paused', function adsPaused() {
	const selector = {
		"approved": false
	}
	return Ads.find(selector);
});

Meteor.publish('ads', function ads() {
	return Ads.find();
});

Meteor.publish('ad.view', function ads(adId) {
	check(adId, String)
	return Ads.find({ _id: adId});
});