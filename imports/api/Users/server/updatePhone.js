/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';

let action;

const updateProfileSubs = (userId, phone) => {
  try {
    Meteor.users.update(userId, {
      $set: {
        'profile.phone': phone
      },
    });
  } catch (exception) {
    throw new Error(`[editProfile.updateUser] ${exception.message}`);
  }
};


const updatePhone = ({ userId, phone }, promise) => {
  try {
    action = promise;
    updateProfileSubs(userId, phone);
    action.resolve();
  } catch (exception) {
    action.reject(exception.message);
  }
};


export default options =>
  new Promise((resolve, reject) =>
    updatePhone(options, { resolve, reject }))
