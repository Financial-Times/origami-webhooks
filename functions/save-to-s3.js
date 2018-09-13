'use strict';
const AWS = require('aws-sdk');

const env = require('../env.js')();
// const httpError = require('../lib/helpers').httpError;
const verifyGithubWebhook = require('../lib/verify-github-webhook.js');

const listRepos = require('../lib/list-origami-repos');

const s3 = new AWS.S3({
	accessKeyId: env.AWS_ACCESS_ID,
	secretAccessKey: env.AWS_SECRET_ACCESS_KEY
});

const checkObjectExists = (key) => {
	const params = {
		Bucket: env.BUCKET,
		Key: key
	};

	return new Promise((resolve, reject) => {
		s3.getObject(params, (err, data) => {
			if (err) {
				resolve(false);
			}

			resolve(data && data.Body ? JSON.parse(data.Body) : null );
		});
	});
};

exports.handler = async (event) => {
	let payload;

	//verify github webhook, and if all is well, return parsed event body
	// try {
	// 	payload = verifyGithubWebhook(event);
	// } catch (err) {
	// 	return err;
	// }

	payload = JSON.parse(event.body);

	const whitelist = await listRepos();
	const repository = payload.repository.name;


	if (whitelist.includes(repository)) {
		const object = await checkObjectExists(repository);
		const body = {
			issues: []
		};

		const issue = {
			action: payload.action,
			repository: repository,
			title: payload.issue.title,
			url: payload.issue.html_url
		};

		if (object) {
			body.issues = object.issues;
			body.issues.push(issue);
		} else {
			body.issues = [issue];
		}


		//send to s3
		return await s3.putObject({
			Bucket: env.BUCKET,
			Key: repository,
			Body: JSON.stringify(body)
		})
		.promise();
	}

	return Promise.resolve(`${repository} was not found in the Origami Registry`);
};
