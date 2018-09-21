/* eslint-env mocha */
'use strict';

const request = require('supertest');

describe('POST /save', function () {
	it('responds with a 200 status', () => {
		return request('http://localhost:3000/')
			.post('/save')
			.expect(200);
			// .expect('Content-Type', 'application/json')
			// .end((err, res) => {console.log({err, res})})
	});
});
