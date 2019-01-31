'use strict';
const env = require('../env.js')();
const create = require('../lib/issues.js').create;
const s3 = require('../lib/s3.js');

const location = {
	s3: s3.createInstance(env.AWS_ACCESS_ID, env.AWS_SECRET_ACCESS_KEY),
	bucket: env.BUCKET
};

const issueExists = (array, newIssue) => {
	return array.findIndex(current => {
		return current.title === newIssue.title && current.repository === newIssue.repository && current.action === newIssue.action;
	});
};

module.exports = async (payload, repository) => {

	if (payload.action === 'labeled' ||
			payload.action === 'unlabeled' ||
			payload.action === 'deleted') {
		return `'${payload.action}' action for issues don't get updloaded to S3 at the moment`;
	}

	const object = await s3.getObjectFrom(location, repository);
	const issue = create(payload);

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
