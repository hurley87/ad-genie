import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import rateLimit from '../../../modules/rate-limit';
import Audiences from '../Audiences'


Meteor.methods({
	'audiences.new': function audiencesNew(audience) {
		check(audience, Object)
		console.log(audience)

		Audiences.upsert({
			city_id: audience.city_id
		}, {
			name: audience.city,
			city_id: audience.city_id,
			user_id: audience.userId
		})
	}
});



rateLimit({
  methods: [
    'campaigns.new',
  ],
  limit: 5,
  timeRange: 1000,
});
