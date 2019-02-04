'use strict';

const env = require('../env.js')();
const fetch = require('node-fetch');
const create = require('../lib/issues').create;
const slack = require('../lib/slack');

const setUser = issue => {
	return fetch(issue.sender.url)
		.then(res => res.json())
		.then(res => res.name);
};

const generateNotification = issue => {
	return {
		attachments: [
			{
				fallback: `${issue.user} has asked for UXD input on <${issue.url}|${issue.title}> :nail_care:`,
				color: '#663399',
				pretext: `${issue.user} has asked for UXD input on a new issue :nail_care:`,
				title: issue.title,
				title_link: issue.url,
				footer: issue.repository,
				ts: Date.now() / 1000
			}
		]
	};
};

module.exports = async (payload) => {
	const issue = create(payload);

	if (issue.labels && issue.labels.includes('UXD')) {
		issue.user = await setUser(payload);
		const body = generateNotification(issue);
		return await slack.sendPayload(env.SLACK_WEBHOOK_URL_UXD, body);
	}
};
