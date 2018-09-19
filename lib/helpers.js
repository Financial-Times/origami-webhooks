'use strict';

const crypto = require('crypto');

const httpError = (err) => {
	const error = Error(err);

	error.body = JSON.stringify(err.message);
	error.statusCode = err.statusCode;
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
