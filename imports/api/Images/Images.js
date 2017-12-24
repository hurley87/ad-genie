import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Images = new Mongo.Collection('Images');
export default Images;