import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';

console.log(Meteor.settings)

const OAuthSettings = {
      "facebook": {
        "appId": "2029273400421368",
        "secret": "2d5e6288c3aa1a575a485f8dd0e5f03b",
        "loginStyle": "popup"
      },
      "google": {
        "clientId": "",
        "secret": "",
        "loginStyle": "popup"
      },
      "github": {
        "clientId": "",
        "secret": "",
        "loginStyle": "popup"
      }
    }

if (OAuthSettings) {
  Object.keys(OAuthSettings).forEach((service) => {
    ServiceConfiguration.configurations.upsert(
      { service },
      { $set: OAuthSettings[service] },
    );
  });
}
