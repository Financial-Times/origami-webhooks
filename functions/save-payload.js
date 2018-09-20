'use strict';

const listRepos = require('../lib/list-origami-repos');
const upload = require('../lib/upload-to-bucket');
const verifyGithubWebhook = require('../lib/verify-github-webhook.js');
const httpError = require('../lib/helpers').httpError;


module.exports.handler = async (event) => {
	let payload;

	try {
		payload = verifyGithubWebhook(event);
	} catch (err) {
		return err;
	}

	const whitelist = await listRepos();
	const repository = payload.repository.name;

	if (whitelist.includes(repository)) {
		return upload(payload, repository);
	}

	const error = {
		message: `${repository} was not found in the Origami Registry`,
		status: 404
	};

	return httpError(error);
};
