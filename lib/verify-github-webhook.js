'use strict';

const env = require('../env.js')();
const httpError = require('./helpers').httpError;
const signRequestBody = require('./helpers').sha1;

module.exports = (event) => {
	const token = env.GITHUB_WEBHOOK_SECRET;
	const headers = event.headers;
	const githubEvent = headers['X-GitHub-Event'];
	const id = headers['X-GitHub-Delivery'];
	const sig = headers['X-Hub-Signature'];
	const calculatedSig = signRequestBody(token, event.body);
	let payload;

	if (typeof token !== 'string') {
		throw httpError({
			message: 'Must provide a \'GITHUB_WEBHOOK_SECRET\' env variable',
			statusCode: 401
		});
	}

	if (!sig) {
		throw httpError({
			message: 'No X-Hub-Signature found on request',
			statusCode: 401
		});
	}

	if (!githubEvent) {
		throw httpError({
			message: 'No X-Github-Event found on request',
			statusCode: 422
		});
	}

	if (!id) {
		throw httpError({
			message: 'No X-Github-Delivery found on request',
			statusCode: 401
		});
	}

	if (sig !== calculatedSig) {
		throw httpError({
			message: 'X-Hub-Signature is incorrect. The GitHub webhook token doesn\'t match',
			statusCode: 401
		});
	}

	try {
		payload = JSON.parse(event.body);
	} catch (err) {
		throw httpError(err);
	}

	return payload;
};
