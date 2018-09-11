'use strict';

const proclaim = require('proclaim');
const helpers = require('../../lib/helpers.js');

describe('responseObject', () => {
	const responseObject = helpers.responseObject;
	let mockBody;
	let mockObject;

	it('is a helper function', () => {
		proclaim.isFunction(responseObject);
	});

	it('returns an object with provided statusCode and stringified body and default headers', () => {
		mockBody = { message: 'Everything works'};
		mockObject = responseObject(mockBody, 200);

		proclaim.equal(mockObject.statusCode, 200);
		proclaim.equal(JSON.stringify(mockObject.headers), JSON.stringify({ 'Content-Type': 'text/plain' }));
		proclaim.equal(mockObject.body, JSON.stringify(mockBody));
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
