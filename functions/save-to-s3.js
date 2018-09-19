'use strict';
const env = require('../env.js')();
const httpError = require('../lib/helpers').httpError;
const listRepos = require('../lib/list-origami-repos');
const s3 = require('../lib/s3.js');
// const verifyGithubWebhook = require('../lib/verify-github-webhook.js');

module.exports.handler = async (event) => {
	// let payload;

	// try {
	// 	payload = verifyGithubWebhook(event);
	// } catch (err) {
	// 	return err;
	// }

	const payload = JSON.parse(event.body);

	const whitelist = await listRepos();
	// const whitelist = ['lool'];
	const repository = payload.repository.name;

	if (whitelist.includes(repository)) {
		const s3Instance = s3.createInstance(env.AWS_ACCESS_ID, env.AWS_SECRET_ACCESS_KEY);
		const location = {
			s3: s3Instance,
			bucket: env.BUCKET
		};

		const object = await s3.getObjectFrom(location, repository);

		const issue = {
			action: payload.action,
			repository: repository,
			title: payload.issue.title,
			url: payload.issue.html_url
		};

		let body;

		if (object) {
			body = object;
			body.push(issue);
		} else {
			body = [issue];
		}

		return s3.uploadObjectTo(location, body, repository);
	}

	const error = {
		message: `\u001b[31m${repository} was not found in the Origami Registry`,
		status: 404
	};

	return Promise.reject(error);
};
