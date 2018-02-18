/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';

let action;

const updateProfileSubs = (userId, pageId) => {
  try {
    Meteor.users.update(userId, {
      $set: {
        'profile.pageId': pageId
      },
    });
  } catch (exception) {
    throw new Error(`[editProfile.updateUser] ${exception.message}`);
  }
};


const updatePageId = ({ userId, pageId }, promise) => {
  try {
    action = promise;
    updateProfileSubs(userId, pageId);
    action.resolve();
  } catch (exception) {
    action.reject(exception.message);
  }
};


export default options =>
  new Promise((resolve, reject) =>
    updatePageId(options, { resolve, reject }))
