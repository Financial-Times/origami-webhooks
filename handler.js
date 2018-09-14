'use strict';
const fetch = require('node-fetch');

const env = require('./env.js')();
const httpError = require('./lib/helpers').httpError;
const s3 = require('./lib/s3-functions');

module.exports.webhooks = async (event) => {
	const objects = await s3.listS3Objects();

	if (objects) {
		const keys = objects.map(object => object.Key);
		let issues = await Promise.all(keys.map(s3.getS3Object));
		issues = Array.prototype.concat(...issues);


		const hasIssues = action => issues.filter(issue => issue.action === action);

		const categories = {
			closed: hasIssues('closed'),
			edited: hasIssues('edited'),
			opened: hasIssues('opened'),
			reopened: hasIssues('reopened')
		};

		const issueText = (list, type) => {
			if (list.length >= 1) {
				let section = `*${type}*:\n`;
				list.forEach(issue => section +=`• ${issue.repository}: <${issue.url}|${issue.title}>\n`);

				return section + '\n';
			}

			return '';
		};

		const text = ':bell: *Yesterday\'s issue summary*\n'
								+ issueText(categories.closed, 'Closed')
								+ issueText(categories.edited, 'Edited');
								+ issueText(categories.opened, 'Opened')
								+ issueText(categories.reopened, 'Reopened');

		const payload = {
			text: text,
			mrkdwn: true
		};

	const sendPayload = async (content) => {
		return await fetch(env.SLACK_WEBHOOK_URL, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(content)
		});
	};

	return await sendPayload(payload)
		.then(res => {
			s3.deleteS3Objects();
			return {
				statusCode: res.statusCode
			};
		})
		.catch(err => {
			throw httpError(err, 500);
		});
};};
