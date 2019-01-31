'use strict';

const crypto = require('crypto');

const httpError = (err) => {
	const error = new Error(err);

	error.body = `${err.message}`;
	error.statusCode = err.status;
	error.headers = { 'Content-Type': 'text/plain' };

	return error;
};

const sha1 = (key, body) => {
	return 'sha1=' + crypto
										.createHmac('sha1', key)
										.update(body, 'utf-8')
										.digest('hex');
};

module.exports = {
	httpError,
	sha1
};
