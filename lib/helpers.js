'use strict';

const crypto = require('crypto');

const responseObject = (body, statusCode) => {
	return {
		statusCode,
		headers: { 'Content-Type': 'text/plain' },
		body: JSON.stringify(body)
	};
};

const sha1 = (key, body) => {
	return 'sha1=' + crypto
										.createHmac('sha1', key)
										.update(body, 'utf-8')
										.digest('hex');
};


module.exports = {
	responseObject,
	sha1
};
