import { Mongo } from 'meteor/mongo';

const Files = new Mongo.Collection('Files');

Files.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Files.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

export default Files;