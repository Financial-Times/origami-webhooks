'use strict';

const list = require('./issues').list;
const fetch = require('node-fetch');

const weekday = date => {
	date = new Date(date.setDate(date.getDate() -1));

	const day = date.getDay();
	const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

	return day === 0 ? week[4] : `${week[day - 1]}`;
};

const generateReport = (objects, date = new Date()) => {
	const issues = Array.prototype.concat(...objects);

	return {
		mrkdwn: true,
		text: `*Issue activity since ${weekday(date)} morning*\n`
						+ list('closed', issues)
						+ list('edited', issues)
						+ list('opened', issues)
						+ list('reopened', issues)
	};
};

const sendPayload = (url, payload) => {
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-type': 'application/json'
		},
		body: JSON.stringify(payload)
	})
	.then(() => {
		return {
			body: '✓ payload sent to Slack'
		};
	});
};

module.exports = {
	generateReport,
	sendPayload
};
