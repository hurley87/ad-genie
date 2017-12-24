import { Accounts } from 'meteor/accounts-base';
import sendWelcomeEmail from '../../../api/Users/server/send-welcome-email';
import graph from 'fbgraph';
import _  from 'lodash';

Accounts.onCreateUser((options, user) => {
	const userToCreate = user;
	if (options.profile) {
		options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
		userToCreate.profile = options.profile;
	}
	_.extend(userToCreate.profile, {
	    pages: getPages(user),
	});
	Meteor.call('campaigns.new', user.profile.name, user._id)
	return user;
});

function getPages(user) {
	var Future = Npm.require("fibers/future");
	var fut = new Future();
	graph.setAccessToken(user.services.facebook.accessToken);
	graph.get("/me/accounts", function(err, res) {
		fut.return(res.data);
	});
  return fut.wait();
}