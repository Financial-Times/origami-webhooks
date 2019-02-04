'use strict';

const httpError = require('../lib/helpers').httpError;
const listOrigamiRepos = require('../lib/list-origami-repos');
const uploadToS3 = require('../lib/upload-to-s3');
const notifyUXD = require('../lib/notify-uxd');
const verifyGithubWebhook = require('../lib/verify-github-webhook.js');


module.exports.handler = async (event) => {
	let payload;

	try {
		payload = verifyGithubWebhook(event);
	} catch (err) {
		return err;
	}

	const whitelist = await listOrigamiRepos();
	const repository = payload.repository.name;

	if (whitelist.includes(repository)) {
		if (payload.action === 'labeled') {
			return notifyUXD(payload);
		} else {
			return uploadToS3(payload, repository);
		}
	}


	const error = {
		message: `${repository} was not found in the Origami Registry`,
		statusCode: 404
	};

	return httpError(error);
};
