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
		AWS_ACCOUNT_ID: env.AWS_ACCOUNT_ID,
		AWS_ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID,
		AWS_SECRET_ACCESS_KEY: env.AWS_SECRET_ACCESS_KEY,
		NODE_ENV: env.NODE_ENV,
		GITHUB_WEBHOOK_SECRET: env.GITHUB_WEBHOOK_SECRET,
		SLACK_WEBHOOK_URL: env.SLACK_WEBHOOK_URL
	};
};
