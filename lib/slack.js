'use strict';

const list = require('./issues');

const weekday = date => {
	date = new Date(date.setDate(date.getDate() -1));
	return date.getDate () === 1 ? 'Friday' : `${date.toLocaleString('gb-GB', { weekday: 'long' })}`;
};

const generatePayload = (objects, date = new Date()) => {
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

const sendPayload = async (url, payload) => {
	return await fetch(url, {
		method: 'POST',
		headers: {
			'Content-type': 'application/json'
		},
		body: JSON.stringify(payload)
	});
};

module.exports = {
	generatePayload,
	sendPayload
};
