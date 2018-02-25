/* eslint-disable */

import { Meteor } from 'meteor/meteor';
import AWS from 'aws-sdk';
import moment from 'moment';

AWS.config = new AWS.Config();

AWS.config.accessKeyId = Meteor.settings.AWSAccessKeyId;
AWS.config.secretAccessKey = Meteor.settings.AWSSecretAccessKey;

const s3 = new AWS.S3();

export default {
  putObject(upload, bucket, ACL, isSigned) {
    return new Promise((resolve, reject) => {
      s3.putObject({
        Bucket: bucket || 'adsgen',
        Key: upload.file.name,
        Body: new Buffer(upload.data.split(',')[1], 'base64'),
        ContentEncoding: 'base64',
        ContentType: upload.file.type,
        Expires: (new Date(moment().add(10, 'years').format())),
      }, (error, response) => {
        if (error) {
          console.warn('error on upload', error);
          reject(error);
        } else {
          if (isSigned) {
            s3.getSignedUrl('getObject', {
              Bucket: 'adsgen',
              Key: upload.file.name,
            }, (error, response) => {
              if (error) {
                console.warn('error on url', error);
                reject(error);
              } else {
                resolve({
                  url: response,
                  name: upload.file.name,
                  type: upload.file.type || 'application/', // Generic application for unrecognized types.
                });
              }
            });
          } else {
            resolve({
              url: `https://${bucket}.s3.amazonaws.com/${upload.file.name}`,
              name: upload.file.name,
              type: upload.file.type || 'application/',
            });
          }
        }
      });
    });
  },
  deleteObject(Key, bucket) {
    return new Promise((resolve, reject) => {
      s3.deleteObject({
        Bucket: bucket || 'adsgen',
        Key,
      }, Meteor.bindEnvironment((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }));
    });
  },
  getSignedUrl(Key, bucket) {
    return new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', {
        Bucket: bucket || 'adsgen',
        Key,
      }, (error, url) => {
        if (error) {
          reject(error);
        } else {
          resolve(url);
        }
      });
    });
  }
}
