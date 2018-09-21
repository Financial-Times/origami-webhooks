'use strict';

const list = require('./issues');

const generatePayload = async (objects) => {
	const issues = Array.prototype.concat(...objects);

	let date = new Date(); //get today's date
	date = new Date(date.setDate(date.getDate() -1)); //set the date to yesterday

	const weekday = date.getDate() === 1 ? 'Friday': `${date.toLocaleString('gb-GB', { weekday: 'long' })}`;

	return {
		mrkdwn: true,
		text: `*Issue activity since ${weekday} morning*\n`
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
