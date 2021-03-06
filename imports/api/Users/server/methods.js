import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import updateSubs from './updateSubs';
import updateUnsubs from './updateUnsubs'; 
import updateEmail from './updateEmail';
import updatePhone from './updatePhone'
import updatePageId from './updatePageId'
import rateLimit from '../../../modules/rate-limit';
import graph from 'fbgraph';
import stripePackage from 'stripe';
import Ads from '../../Ads/Ads';

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
  'users.updateEmail': function usersUpdateEmail(email) {
    check(email, String);

    console.log(email)

    return updateEmail({ userId: this.userId, email })
      .then(response => response)
      .catch((exception) => {
        throw new Meteor.Error('500', exception);
      });
  },
  'users.updatePhone': function usersUpdatePhone(phone) {
    check(phone, String);

    return updatePhone({ userId: this.userId, phone })
      .then(response => response)
      .catch((exception) => {
        throw new Meteor.Error('500', exception);
      });
  },
  'users.updatePageId': function usersUpdatePageId(pageId) {
    check(pageId, String);

    return updatePageId({ userId: this.userId, pageId })
      .then(response => response)
      .catch((exception) => {
        throw new Meteor.Error('500', exception);
      });
  },
  'users.createClient': function usersCreateClient(client){
    check(client, Object)
    const stripe = stripePackage('sk_test_3NyfglCp2OTHo6uhwcVmLMyi');

    stripe.customers.create({
      email: client.email,
      source: client.token
    }, Meteor.bindEnvironment(function(error, customer){
        console.log(client)
        stripe.subscriptions.create({
            customer: customer.id,
            items: [
              {
                plan: client.plan
              }
            ]
        }, Meteor.bindEnvironment(function(error, subscription){
          Meteor.users.update(client.userId, {
            $set: {
              "profile.customerId": subscription.customer,
              "profile.ads": [client.adId],
              "profile.email": client.email
            }
          });
          Ads.update(client.adId, {
            $set: {
              paid: true
            }
          })
        }))
    }))

  },
  'users.updateProfile': function usersUpdateProfile(user){
    check(user, Object)

    Meteor.users.update(user.id, {
      $set: {
        'profile.email': user.email,
        'profile.phone': user.phone,
        'profile.firstName': user.firstName,
        'profile.lastName': user.lastName
      }
    })
  },
  "users.addPlan": function userAddPlan(customerId, plan, userId, adId){
    check(plan, String)
    check(customerId, String)
    check(userId, String)
    check(adId, String)

    const stripe = stripePackage('sk_test_3NyfglCp2OTHo6uhwcVmLMyi');
    stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            plan: plan
          }
        ]
    }, Meteor.bindEnvironment(function(error, subscription){
      Meteor.users.update(userId, {
        $push: {
          "profile.ads": adId
        }
      });
      Ads.update(adId, {
        $set: {
          paid: true
        }
      })
    }))

  }
});

rateLimit({
  methods: [
    'users.sendVerificationEmail',
    'users.editProfile',
  ],
  limit: 5,
  timeRange: 1000,
});
