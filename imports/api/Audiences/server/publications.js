import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Audiences from '../Audiences';


Meteor.publish('audiences', function audiences() {
  return Audiences.find();
});
