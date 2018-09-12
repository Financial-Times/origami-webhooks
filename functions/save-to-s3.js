'use strict';
const AWS = require('aws-sdk');

const env = require('../env.js')();
const verifyGithubWebhook = require('../lib/verify-github-webhook.js');

const S3 = new AWS.S3({
	accessKeyId: env.AWS_ACCESS_ID,
	secretAccessKey: env.AWS_SECRET_ACCESS_KEY
});

exports.handler = async (event) => {
	try {
		verifyGithubWebhook(event);
	} catch (err) {
		return err;
	}

	return await S3.putObject({
		Bucket: env.BUCKET,
		Key: 'test',
		Body: event.body
	})
		.promise();
};
