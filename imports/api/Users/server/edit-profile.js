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

const updateSubs = ({ userId, pagesList, unsubs}, promise) => {
  try {
    action = promise;
    updateProfileSubs(userId, pagesList);
    action.resolve();
  } catch (exception) {
    action.reject(exception.message);
  }
};

const updateUnsubs = ({ userId, pagesList}, promise) => {
  try {
    action = promise;
    updateProfileUnsubs(userId, pagesList);
    action.resolve();
  } catch (exception) {
    action.reject(exception.message);
  }
};

export options =>
  new Promise((resolve, reject) =>
    updateUnsubs(options, { resolve, reject }));

export options =>
  new Promise((resolve, reject) =>
    updateSubs(options, { resolve, reject }))
