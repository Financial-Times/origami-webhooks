'use strict';

const crypto = require('crypto');

const httpError = (body, statusCode) => {
	const error = Error(body);

	error.body = JSON.stringify(body);
	error.statusCode = statusCode;
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
