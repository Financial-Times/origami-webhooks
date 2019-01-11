'use strict';
const env = require('../env.js')();
const s3 = require('../lib/s3.js');

const location = {
	s3: s3.createInstance(env.AWS_ACCESS_ID, env.AWS_SECRET_ACCESS_KEY),
	bucket: env.BUCKET
};

const issueExists = (array, newIssue) => {
	return array.findIndex(current => {
		return current.title === newIssue.title && current.repository === newIssue.repository;
	});
};

module.exports = async (payload, repository) => {
	const object = await s3.getObjectFrom(location, repository);

	const issue = {
		action: payload.action,
		repository: repository,
		title: payload.issue.title,
		url: payload.issue.html_url
	};

	let body;

	if (object && object.length >= 1) {
		body = object;
		const existingIssue = issueExists(body, issue);

		if (existingIssue >= 0) {
			body[existingIssue] = issue;
		} else {
			body.push(issue);
		}
	} else {
		body = [issue];
	}

	return s3.uploadObjectTo(location, body, repository);
};
