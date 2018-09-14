'use strict';

const s3 = require('../lib/s3-functions.js');
const verifyGithubWebhook = require('../lib/verify-github-webhook.js');

const listRepos = require('../lib/list-origami-repos');


module.exports.handler = async (event) => {
	let payload;

	try {
		payload = verifyGithubWebhook(event);
	} catch (err) {
		return err;
	}

	// payload = JSON.parse(event.body);

	const whitelist = await listRepos();
	const repository = payload.repository.name;

	if (whitelist.includes(repository)) {
		let body;

		const issue = {
			action: payload.action,
			repository: repository,
			title: payload.issue.title,
			url: payload.issue.html_url
		};

		const object = await s3.getS3Object(repository);
		if (object) {
			body = object;
			body.push(issue);
		} else {
			body = [issue];
		}

		return await s3.putS3Object(body, repository);
	}

	return Promise.resolve(`${repository} was not found in the Origami Registry`);
};
