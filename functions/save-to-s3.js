'use strict';

const s3 = require('../lib/s3-functions.js');
const verifyGithubWebhook = require('../lib/verify-github-webhook.js');

const listRepos = require('../lib/list-origami-repos');


exports.handler = async (event) => {
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
		const body = {
			issues: []
		};

		const issue = {
			action: payload.action,
			repository: repository,
			title: payload.issue.title,
			url: payload.issue.html_url
		};

		const object = await s3.getS3Object(repository);
		if (object) {
			body.issues = object.issues;
			body.issues.push(issue);
		} else {
			body.issues = [issue];
		}

		return await s3.putS3Object(body, repository);
	}

	return Promise.resolve(`${repository} was not found in the Origami Registry`);
};
