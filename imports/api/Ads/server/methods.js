import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import rateLimit from '../../../modules/rate-limit';
import adsSdk from 'facebook-nodejs-ads-sdk';
import request from 'request';
import Ads from '../Ads'
import Pages from '../../Pages/Pages'
import graph from 'fbgraph'

Meteor.methods({
	'campaigns.new': function campaignsNew(campaignName, userId, pages) {
		check(campaignName, String)
		check(userId, String)
		check(pages, Array)

		const accessToken = Meteor.settings.FBAccess;
		const accountId = Meteor.settings.FBAccountID

		const FacebookAdsApi = adsSdk.FacebookAdsApi.init(accessToken)
		const AdAccount = adsSdk.AdAccount;
		const account = new AdAccount(accountId)
		const Campaign = adsSdk.Campaign;

		account
			.createCampaign(
				[Campaign.Fields.Id],
				{
					[Campaign.Fields.name]: campaignName,
					[Campaign.Fields.status]: Campaign.Status.active,
					[Campaign.Fields.objective]: 'MESSAGES'
				}
			)
			.then((campaign) =>{
				console.log('Creating your CAMPAIGN')
				Meteor.users.update(userId, { $set: { 'profile.campaignId': campaign.id }})
			})
			.then(() => { 
				Meteor.call('pages', pages)
			})
			.catch((error) => {
				console.log(error)
			})

	},
	'pages': function pages(pages){
		check(pages, Array)
		console.log("PAGES")
		console.log(pages)
		for(let p_idx in pages) {
			let page = pages[p_idx];
			Pages.insert(page)
			// Meteor.call('updatePage', page);
		}
	},
	'updatePage': function updatePage(page){
		check(page, Object);

		graph.extendAccessToken({
	        "access_token": page.access_token, 
	        "client_id": "2029273400421368"
	      , "client_secret": "2d5e6288c3aa1a575a485f8dd0e5f03b"
	    }, function (err, facebookRes) {
	       console.log(facebookRes.access_token);
	       console.log('PGE')
	       let cool_page = page
	       cool_page['accessToken'] = facebookRes.access_token
	       console.log(cool_page)
	       Pages.rawCollection().insert(cool_page)
	    });
	},
	'adset.new': function adsetNew(ad) {
		check(ad, Object);
		console.log(ad)
		const accessToken = Meteor.settings.FBAccess;
		const accountId = Meteor.settings.FBAccountID

		const FacebookAdsApi = adsSdk.FacebookAdsApi.init(accessToken)
		const AdAccount = adsSdk.AdAccount;
		const AdSet = adsSdk.AdSet;
		const account = new AdAccount(accountId)

		account.createAdSet(
			[AdSet.Fields.Id],
			{
				[AdSet.Fields.name]: ad.address,
				[AdSet.Fields.campaign_id]: ad.user.profile.campaignId,
				[AdSet.Fields.daily_budget]: ad.budget,
				[AdSet.Fields.billing_event]: AdSet.BillingEvent.impressions,
				[AdSet.Fields.optimization_goal]: AdSet.OptimizationGoal.impressions,
				[AdSet.Fields.targeting]: {
			        "geo_locations": {
			            "cities": [
			                {
			                    "key": '296875'
			                }
			            ]
			        },
			        "age_min": 25,
			        "age_max": 45,
			        "device_platforms": ['mobile', 'desktop'],
			        "publisher_platforms": ['facebook'],
			        "facebook_positions": ["feed"]
				},
				[AdSet.Fields.status]: AdSet.Status.active,
				[AdSet.Fields.is_autobid]: true
			}
		)
		.then((adset) =>{
			console.log('Now creating your ad')
			Meteor.call('ad.new', adset.id, ad)
		})
		.catch((error) =>  {
			console.log('THIS IS THE ERROR')
			console.log(error)
		})
	},
	'ad.new': function adNew(adsetId, ad) {
		check(adsetId, String)
		check(ad, Object)
		console.log('ADDDD')
		console.log(ad)
		const accessToken = Meteor.settings.FBAccess;
		const accountId = Meteor.settings.FBAccountID;
		const FacebookAdsApi = adsSdk.FacebookAdsApi.init(accessToken)
		const AdAccount = adsSdk.AdAccount;
		const account = new AdAccount(accountId)
		const Ad = adsSdk.Ad;
		const AdCreative = adsSdk.AdCreative;

		account
			.createAd(
				[],
				{
					"adset_id": adsetId,
					"status": "PAUSED",
					"name": ad.address,
					"creative": {
						"name": ad.address,
						"object_story_spec": {
						    "page_id": ad.pageId.value, 
						    "video_data": { 
						      "call_to_action": {
						        "type": "OPEN_MESSENGER_EXT",
						        "value": {
						          "app_destination": "MESSENGER",
						        },
						      },
						      "image_url": "https://s3.us-east-2.amazonaws.com/snapmortgages/toronto.png",
						      "page_welcome_message": "Welcome message in messenger",
						      "video_id": ad.videoId,
						      "title": ad.address,
						      "message": ad.description
						    }
						},
						"url_tags": "ref=" + ad.user._id
					}
				}
			)
			.then((result) => {
				console.log('Created your AD')
				Ads.insert({
					ad: ad,
					approved: false,
					paid: false,
					ad_id: result.id, 
					userId: ad.user._id,
					conversations: 0,
					spend: 0,
					cpc: 0
				})
			})
			.catch((error) => {
				console.log(error)
			})

	},
	'approved.ad': function(adId, myId){
		check(adId, String)
		check(myId, String)
		const accessToken = Meteor.settings.FBAccess;
		const accountId = Meteor.settings.FBAccountID;

		const FacebookAdsApi = adsSdk.FacebookAdsApi.init(accessToken)
		const AdAccount = adsSdk.AdAccount;
		const account = new AdAccount(accountId)
		const Ad = adsSdk.Ad;
		const ad = new Ad(adId);
		Ads.update(myId, { $set : { approve: true } })

		return new Ad(adId, {
		    [Ad.Fields.status]: "ACTIVE" })
		    .update()
		    .then((ad) => {
				console.log('ad approved')
			})
			.catch((error) => {
				console.log(error)
			})
	},
	'pause.ad': function(adId, myId) {
		check(adId, String)
		check(myId, String)
		const accessToken = Meteor.settings.FBAccess;
		const accountId = Meteor.settings.FBAccountID;

		const FacebookAdsApi = adsSdk.FacebookAdsApi.init(accessToken)
		const AdAccount = adsSdk.AdAccount;
		const account = new AdAccount(accountId)
		const Ad = adsSdk.Ad;
		const ad = new Ad(adId);
		Ads.update(myId, { $set : { approve: false }})

		return new Ad(adId, {
		    [Ad.Fields.status]: "PAUSED" })
		    .update()
		    .then((ad) => {
				console.log('ad paused')
			})
			.catch((error) => {
				console.log(error)
			})
	},
	'delete.ad':function(adId){
		check(adId, String)
		Ads.remove(adId)
	}
});



rateLimit({
  methods: [
    'campaigns.new',
    'adset.new',
    'ad.new'
  ],
  limit: 5,
  timeRange: 1000,
});
