import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import updateSubs from './updateSubs';
import updateUnsubs from './updateUnsubs'; 
import rateLimit from '../../../modules/rate-limit';
import graph from 'fbgraph';

Meteor.methods({
  'users.sendVerificationEmail': function usersSendVerificationEmail() {
    return Accounts.sendVerificationEmail(this.userId);
  },
  'users.subscribe': function usersEditProfile(unsubs, pages, pagesList) {
    check(pagesList, Array);
    check(pages, Array);
    check(unsubs, Array);


    for(let p_idx in unsubs) {
      let pageId = unsubs[p_idx]
      let access_token = pages.filter((page) => { return page.id == pageId })[0].access_token
      let url = "/" + pageId + "/subscribed_apps";
      graph.setAccessToken(access_token);
      graph.post(url)
    }


    return updateSubs({ userId: this.userId, pagesList, unsubs })
      .then(response => response)
      .catch((exception) => {
        throw new Meteor.Error('500', exception);
      });
  },
  'users.unsubscribe': function usersEditProfile(subs, pages, pagesList) {
    check(pagesList, Array);
    check(pages, Array);
    check(subs, Array);


    for(let p_idx in subs) {
      let pageId = subs[p_idx]
      let access_token = pages.filter((page) => { return page.id == pageId })[0].access_token
      let url = "/" + pageId + "/subscribed_apps";
      graph.setAccessToken(access_token);
      graph.del(url)
    }

    return updateUnsubs({ userId: this.userId, pagesList, subs })
      .then(response => response)
      .catch((exception) => {
        throw new Meteor.Error('500', exception);
      });
  },
});

rateLimit({
  methods: [
    'users.sendVerificationEmail',
    'users.editProfile',
  ],
  limit: 5,
  timeRange: 1000,
});
