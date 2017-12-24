import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Videos = new Mongo.Collection('Videos');
export default Videos;