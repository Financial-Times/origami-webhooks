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

		const opened = issues.filter(issue => issue.action === 'opened' || issue.action === 'reopened');
		const closed = issues.filter(issue => issue.action === 'closed');
		const edited = issues.filter(issue => issue.action === 'edited');


		const issueText = (list, type) => {
			if (list.length >= 1) {
				let section = `*${type}*:\n`;
				list.forEach(issue => section +=`• ${issue.repository}: <${issue.url}|${issue.title}>\n`);

				return section + '\n';
			}

			return '';
		};
		const text = ':bell: *Yesterday\'s issue summary*\n' + issueText(opened, 'Opened') + issueText(closed, 'Closed') + issueText(edited, 'Edited');

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
			return {
				statusCode: res.statusCode
			};
		})
		.catch(err => {
			throw httpError(err, 500);
		});
};};
