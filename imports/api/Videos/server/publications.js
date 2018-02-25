import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Videos from '../Videos';


Meteor.publish('videos', function videos() {
  return Videos.find();
});

Meteor.publish('videos.user', function videos(userId) {
	check(userId, String)
	return Videos.find({userId: userId});
});
