/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';

let action;

const updateProfileUnsubs = (userId, pagesList, subs) => {
  try {
    Meteor.users.update(userId, {
      $set: {
        'profile.pagesList': pagesList,
        'profile.subs': subs
      },
    });
  } catch (exception) {
    throw new Error(`[editProfile.updateUser] ${exception.message}`);
  }
};

const updateUnsubs = ({ userId, pagesList, subs}, promise) => {
  try {
    action = promise;
    updateProfileUnsubs(userId, pagesList, subs);
    action.resolve();
  } catch (exception) {
    action.reject(exception.message);
  }
};

export default options =>
  new Promise((resolve, reject) =>
    updateUnsubs(options, { resolve, reject }));
