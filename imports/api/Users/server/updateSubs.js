/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';

let action;

const updateProfileSubs = (userId, pagesList, unsubs) => {
  try {
    Meteor.users.update(userId, {
      $set: {
        'profile.pagesList': pagesList,
        'profile.unsubs': unsubs
      },
    });
  } catch (exception) {
    throw new Error(`[editProfile.updateUser] ${exception.message}`);
  }
};


const updateSubs = ({ userId, pagesList, unsubs}, promise) => {
  try {
    action = promise;
    updateProfileSubs(userId, pagesList, unsubs);
    action.resolve();
  } catch (exception) {
    action.reject(exception.message);
  }
};


export default options =>
  new Promise((resolve, reject) =>
    updateSubs(options, { resolve, reject }))
