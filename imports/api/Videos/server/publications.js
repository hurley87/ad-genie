import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Videos from '../Videos';


Meteor.publish('videos', function videos() {
  return Videos.find();
});

