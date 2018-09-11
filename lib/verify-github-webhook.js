const crypto = require('crypto');
const env = require('../env.js')();
const fetch = require('node-fetch');

const errorObject = require('./helpers').responseObject;

function signRequestBody(key, body) {
  return `sha1=${crypto.createHmac('sha1', key).update(body, 'utf-8').digest('hex')}`;
}

module.exports = (event)  => {
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
}
