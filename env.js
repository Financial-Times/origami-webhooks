'use strict';

const path = require('path');
const dotenvSafe = require('dotenv-safe');

if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = 'production';
}

const env = dotenvSafe.config({
	path: path.join(__dirname, './.env'),
	example: path.join(__dirname, './env.example')
}).parsed;

module.exports = () => {
	return {
		AWS_ACCOUNT_ID: env.AWS_ACCOUNT_ID || process.env.AWS_ACCOUNT_ID,
		AWS_ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID,
		AWS_SECRET_ACCESS_KEY: env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY,
		BUCKET: env.BUCKET || process.env.BUCKET,
		NODE_ENV: env.NODE_ENV || process.env.NODE_ENV,
		GITHUB_WEBHOOK_SECRET: env.GITHUB_WEBHOOK_SECRET || process.env.GITHUB_WEBHOOK_SECRET,
		SLACK_WEBHOOK_URL_ORIGAMI_INTERNAL: env.SLACK_WEBHOOK_URL_ORIGAMI_INTERNAL || process.env.SLACK_WEBHOOK_URL_ORIGAMI_INTERNAL,
		SLACK_WEBHOOK_URL_UXD: env.SLACK_WEBHOOK_URL_UXD || process.env.SLACK_WEBHOOK_URL_UXD,
		SLACK_WEBHOOK_URL_TEST: env.SLACK_WEBHOOK_URL_TEST || process.env.SLACK_WEBHOOK_URL_TEST,
		REPO_DATA_API_KEY: env.REPO_DATA_API_KEY || process.env.REPO_DATA_API_KEY,
		REPO_DATA_API_SECRET: env.REPO_DATA_API_SECRET || process.env.REPO_DATA_API_SECRET
	};
};
