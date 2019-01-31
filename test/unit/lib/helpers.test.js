/* eslint-env mocha */
'use strict';

const proclaim = require('proclaim');
const helpers = require('../../../lib/helpers.js');

describe('httpError', () => {
	const httpError = helpers.httpError;
	let error;
	let mockObject;

	it('is a helper function', () => {
		proclaim.isFunction(httpError);
	});

	it('returns an error object with provided statusCode and stringified body and default headers', () => {
		error = {
			message: 'Something went wrong',
			status: 500
		};
		mockObject = httpError(error);

		proclaim.equal(mockObject.statusCode, 500);
		proclaim.equal(JSON.stringify(mockObject.headers), JSON.stringify({ 'Content-Type': 'text/plain' }));
		proclaim.equal(mockObject.message, error);
	});

});

describe('sha1', () => {
	const sha1 = helpers.sha1;

	it('is a helper function', () => {
		proclaim.isFunction(sha1);
	});

	it('returns a signed hash with a key and with body content', () => {
		const body = 'This is the body';
		const key = 'key';
		proclaim.deepStrictEqual(sha1(key, body), 'sha1=00f4245c843497dc11c084e880cc285007e9163e');
	});
});
