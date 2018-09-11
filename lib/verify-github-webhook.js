'use strict';

const env = require('../env.js')();
const errorObject = require('./helpers').responseObject;
const signRequestBody = require('./helpers').sha1;

module.exports = (event) => {
	const token = env.GITHUB_WEBHOOK_SECRET;
	const headers = event.headers;
	const sig = headers['X-Hub-Signature'];
	const githubEvent = headers['X-GitHub-Event'];
	const id = headers['X-GitHub-Delivery'];
	const calculatedSig = signRequestBody(token, event.body);

	if (typeof token !== 'string') {
		return errorObject('Must provide a \'GITHUB_WEBHOOK_SECRET\' env variable', 401);
	}

	if (!sig) {
		return errorObject('No X-Hub-Signature found on request', 401);
	}

	if (!githubEvent) {
		return errorObject('No X-Github-Event found on request', 422);
	}

	if (!id) {
		return errorObject('No X-Github-Delivery found on request', 401);
	}

	if (sig !== calculatedSig) {
		return errorObject('X-Hub-Signature is incorrect. The GitHub webhook token doesn\'t match', 401);
	}
};
