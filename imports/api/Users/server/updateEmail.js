/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';

let action;

const updateProfileSubs = (userId, email) => {
  try {
    Meteor.users.update(userId, {
      $set: {
        'profile.email': email
      },
    });
  } catch (exception) {
    throw new Error(`[editProfile.updateUser] ${exception.message}`);
  }
};


const updateEmail = ({ userId, email }, promise) => {
  try {
    action = promise;
    updateProfileSubs(userId, email);
    action.resolve();
  } catch (exception) {
    action.reject(exception.message);
  }
};


export default options =>
  new Promise((resolve, reject) =>
    updateEmail(options, { resolve, reject }))
