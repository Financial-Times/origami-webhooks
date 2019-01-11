'use strict';

const env = require('../env.js')();
const httpError = require('../lib/helpers').httpError;
const slack = require('../lib/slack');
const s3 = require('../lib/s3');


module.exports.handler = async () => {
	const s3Instance = s3.createInstance(env.AWS_ACCESS_ID, env.AWS_SECRET_ACCESS_KEY);
	const location = {
		s3: s3Instance,
		bucket: env.BUCKET
	};

	const objects = await s3.listObjectsFrom(location);

	if (objects && objects.length >= 1) {
		const keys = objects.map(object => object.Key);
		const issues = await Promise.all(keys.map(issue => s3.getObjectFrom(location, issue)));
		const payload = await slack.generatePayload(issues);
		return await slack.sendPayload(env.SLACK_WEBHOOK_URL, payload)
			// .then(() => s3.deleteObjectsFrom(location, objects))
			.then((res) => console.log(res))
			.catch(err => httpError(err));
	} else {
		return {
			statusCode: 200,
			body: 'No issues have been raised across Origami repositories, hooray!'
		};
	}
};
