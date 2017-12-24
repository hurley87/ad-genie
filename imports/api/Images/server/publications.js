import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Images from '../Images';


Meteor.publish('images', function images() {
  return Images.find();
});

