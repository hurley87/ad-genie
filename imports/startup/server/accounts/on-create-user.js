import { Accounts } from 'meteor/accounts-base';
import sendWelcomeEmail from '../../../api/Users/server/send-welcome-email';
import graph from 'fbgraph';
import _  from 'lodash';

Accounts.onCreateUser((options, user) => {
	const userToCreate = user;
	if (options.profile && user.services.facebook) {
		options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
		options.profile.pagesList = []
		userToCreate.profile = options.profile;

	}
	if(user.services && user.profile){
		const pages = getPages(user)
		_.extend(userToCreate.profile, { pages });
		Meteor.call('campaigns.new', user.profile.name, user._id, pages)
	}

	return user;
});

function subscribePage(access_token, pageId) {
	const url = "/" + pageId + "/subscribed_apps";
	graph.setAccessToken(access_token);
	graph.post(url)
}

function getPages(user) {
	var Future = Npm.require("fibers/future");
	var fut = new Future();
	graph.setAccessToken(user.services.facebook.accessToken);
	graph.get("/me/accounts", function(err, res) {
		const pages = res.data.filter((page) => { return page.perms.indexOf("ADMINISTER") > -1 })
		fut.return(pages);
	});
  return fut.wait();
}