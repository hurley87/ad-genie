import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';

console.log(Meteor.settings)

const OAuthSettings = {
      "facebook": {
        "appId": "1601590126567055",
        "secret": "7b18f91492b7229bdca9a67037c6b9ee",
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
