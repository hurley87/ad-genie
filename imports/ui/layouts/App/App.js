/* eslint-disable jsx-a11y/no-href */

import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Grid } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import Navigation from '../../components/Navigation/Navigation';
import Authenticated from '../../components/Authenticated/Authenticated';
import Public from '../../components/Public/Public';
import Index from '../../pages/Index/Index';
import Documents from '../../pages/Documents/Documents';
import NewDocument from '../../pages/NewDocument/NewDocument';
import NewCampaign from '../../pages/NewCampaign/NewCampaign';
import NewAd from '../../pages/NewAd/NewAd';
import NewVideo from '../../pages/NewVideo/NewVideo';
import ViewDocument from '../../pages/ViewDocument/ViewDocument';
import ViewProperty from '../../pages/ViewProperty/ViewProperty';
import EditDocument from '../../pages/EditDocument/EditDocument';
import Email from '../../pages/Email/Email'
import Phone from '../../pages/Phone/Phone'
import Credit from '../../pages/Credit/Credit'
import Signup from '../../pages/Signup/Signup';
import About from '../../pages/About/About';
import Login from '../../pages/Login/Login';
import Logout from '../../pages/Logout/Logout';
import AdsContainer from '../../pages/AdsContainer/AdsContainer';
import VerifyEmail from '../../pages/VerifyEmail/VerifyEmail';
import RecoverPassword from '../../pages/RecoverPassword/RecoverPassword';
import ResetPassword from '../../pages/ResetPassword/ResetPassword';
import Profile from '../../pages/Profile/Profile';
import NotFound from '../../pages/NotFound/NotFound';
import Footer from '../../components/Footer/Footer';
import Terms from '../../pages/Terms/Terms';
import Privacy from '../../pages/Privacy/Privacy';
import ExamplePage from '../../pages/ExamplePage/ExamplePage';
import VerifyEmailAlert from '../../components/VerifyEmailAlert/VerifyEmailAlert';
import getUserName from '../../../modules/get-user-name';
import NewAudience from '../../pages/NewAudience/NewAudience';
import NewImage from '../../pages/NewImage/NewImage';


import './App.scss';

const App = props => (
  <Router>
    {!props.loading ? (
      <div className="App">
        {props.authenticated ?
          <VerifyEmailAlert
            userId={props.userId}
            emailVerified={props.emailVerified}
            emailAddress={props.emailAddress}
          />
          : ''}
        <Navigation {...props} />
        <Grid>
          <Switch>
            <Route exact name="index" path="/" component={Index} />
            <Authenticated exact path="/documents" component={Documents} {...props} />
            <Authenticated exact path="/documents/new" component={NewDocument} {...props} />
            <Authenticated exact path="/campaigns/new" component={NewCampaign} {...props} />
            <Authenticated exact path="/properties/new" component={NewAd} {...props} />
            <Authenticated exact path="/properties" component={AdsContainer} {...props} />
            <Authenticated exact path="/videos/new" component={NewVideo} {...props} />
            <Authenticated exact path="/properties/:_id" component={ViewProperty} {...props} />
            <Authenticated exact path="/documents/:_id" component={ViewDocument} {...props} />
            <Authenticated exact path="/documents/:_id/edit" component={EditDocument} {...props} />
            <Authenticated exact path="/audiences/new" component={NewAudience} {...props} />
            <Authenticated exact path="/images/new" component={NewImage} {...props} />
            <Authenticated exact path="/profile" component={Profile} {...props} />
            <Authenticated exact path="/email" component={Email} {...props} />
            <Authenticated exact path="/phone" component={Phone} {...props} />
            <Authenticated exact path="/credit" component={Credit} {...props} />
            <Public path="/signup" component={Signup} {...props} />
            <Public path="/about" component={About} {...props} />
            <Public path="/login" component={Login} {...props} />
            <Route path="/logout" component={Logout} {...props} />
            <Route name="verify-email" path="/verify-email/:token" component={VerifyEmail} />
            <Route name="recover-password" path="/recover-password" component={RecoverPassword} />
            <Route name="reset-password" path="/reset-password/:token" component={ResetPassword} />
            <Route name="terms" path="/terms" component={Terms} />
            <Route name="privacy" path="/privacy" component={Privacy} />
            <Route name="examplePage" path="/example-page" component={ExamplePage} />
            <Route component={NotFound} />
          </Switch>
        </Grid>
        <Footer />
      </div>
      ) : ''}
  </Router>
);

App.defaultProps = {
  userId: '',
  emailAddress: '',
};

App.propTypes = {
  loading: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  emailAddress: PropTypes.string,
  emailVerified: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const loggingIn = Meteor.loggingIn();
  const user = Meteor.user();
  const userId = Meteor.userId();
  const loading = !Roles.subscription.ready();
  const name = user && user.profile && user.profile.name && getUserName(user.profile.name);
  const emailAddress = user && user.emails && user.emails[0].address;

  return {
    loading,
    loggingIn,
    authenticated: !loggingIn && !!userId,
    name: name || emailAddress,
    roles: !loading && Roles.getRolesForUser(userId),
    userId,
    emailAddress,
    emailVerified: user && user.emails ? user && user.emails && user.emails[0].verified : true,
  };
})(App);
