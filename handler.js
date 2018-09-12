'use strict';
const fetch = require('node-fetch');

const env = require('./env.js')();
const httpError = require('./lib/helpers').httpError;
const verifyGithubWebhook = require('./lib/verify-github-webhook.js');

module.exports.webhooks = async (event) => {
	try {
		verifyGithubWebhook(event);
	} catch (err) {
		return err;
	}

	let payload;
	try {
		payload = JSON.parse(event.body);
	} catch (err) {
		throw httpError(err, 400);
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

	return await sendPayload(content)
		.then(res => {
			return {
				statusCode: res.statusCode
			};
		})
		.catch(err => {
			throw httpError(err, 500);
		});
};

const AWS = require('aws-sdk');

const S3 = new AWS.S3({
	accessKeyId: env.AWS_ACCESS_ID,
	secretAccessKey: env.AWS_SECRET_ACCESS_KEY
});

module.exports.save = async (event) => {
	try {
		verifyGithubWebhook(event);
	} catch (err) {
		return err;
	}

	return await S3.putObject({
		Bucket: env.BUCKET,
		Key: 'test',
		Body: event.body
	}).promise()
};
