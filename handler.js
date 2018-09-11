'use strict';
const fetch = require('node-fetch');

const env = require('./env.js')();
const errorObject = require('./lib/helpers').responseObject;
const verifyGithubWebhook = require('./lib/verify-github-webhook.js');

module.exports.webhooks = (event) => {
	verifyGithubWebhook(event);

	let payload;
	try {
		payload = JSON.parse(event.body);
	} catch (err) {
		return errorObject(err, 400);
	}

	/* eslint-disable quotes */
	const content = {
		text: `${payload.issue.user.login} ${payload.action} an issue on ${payload.repository.name}.\n` +
		`<${payload.issue.html_url}|*Title: ${payload.issue.title}*>\n${payload.issue.body ? payload.issue.body : ''}` ,
		mrkdwn: true
	};
	/* eslint-enable quotes */

	const sendPayload = async (content) => {
		return await fetch(env.SLACK_WEBHOOK_URL, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(content)
		});
	};

	return sendPayload(content)
		.then(res => {
			return {
				statusCode: res.statusCode
			};
		})
		.catch(err => {
			return errorObject(err, 500);
		});
};
