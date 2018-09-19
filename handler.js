'use strict';
const fetch = require('node-fetch');

const env = require('./env.js')();
const generateSlackPayload = require('./lib/generate-slack-payload');

const httpError = require('./lib/helpers').httpError;
const s3 = require('./lib/s3.js');

module.exports.webhooks = async () => {
	const s3Instance = s3.createInstance(env.AWS_ACCESS_ID, env.AWS_SECRET_ACCESS_KEY);
	const location = {
		s3: s3Instance,
		bucket: env.BUCKET
	};

	const objects = await s3.listObjectsFrom(location);

	if (objects && objects.length >= 1) {
		const payload = {
			text: await generateSlackPayload(location, objects),
			mrkdwn: true
		};

		const sendPayload = async (content) => {
			return await fetch(env.SLACK_WEBHOOK_URL, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify(content)
			});
		};

		return await sendPayload(payload)
			.then(() => s3.deleteObjectsFrom(location, objects))
			.catch(err => httpError(err));
	} else {
		return {
			statusCode: 200,
			body: '\n> No issues have been raised across Origami repositories, hooray!\n'
		};
	}
};
