'use strict';
const fetch = require('node-fetch');

const env = require('./env.js')();
const generateSlackPayload = require('./lib/generate-slack-payload');

const httpError = require('./lib/helpers').httpError;
const s3 = require('./lib/s3-functions');

module.exports.webhooks = async () => {
	const objects = await s3.listS3Objects();

	if (objects.length >= 1) {
		const payload = {
			text: await generateSlackPayload(objects),
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
		.then(() => {})
		.catch(err => {
			throw httpError(err, 500);
		});
	} else {
		return {
			statusCode: 200,
			body: 'No issues to report'
		};
	}
};
