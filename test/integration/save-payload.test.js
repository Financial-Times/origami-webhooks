/* eslint-env mocha */
'use strict';

const request = require('supertest');

const env = require('../../env.js')();
const signRequestBody = require('../../lib/helpers').sha1;

const opts = {
	url: 'http://localhost:3000/',
	body: {
		repository: {
			name: 'o-test-component' // exists in origami-repo-data
		}
	}
};

describe('POST /save', function () {
	context('header verification', () => {
		context('responds with 200', () => {
			const token = signRequestBody(env.GITHUB_WEBHOOK_SECRET, JSON.stringify(opts.body));

			it('when all headers are accurate', (done) => {
				return request(opts.url)
				.post('save')
				.send(opts.body)
				.set('X-GitHub-Event', 'issues')
				.set('X-GitHub-Delivery', '11a1a111-a1a1-11a1-11a1-1111aa111aa1')
				.set('X-Hub-Signature', token)
				.expect(200, done());
			});
		});

		context('responds with 401', () => {
			it('when token invalid', () => {
				return request(opts.url)
				.post('save')
				.send(opts.body)
				.set('X-GitHub-Event', 'issues')
				.set('X-GitHub-Delivery', '11a1a111-a1a1-11a1-11a1-1111aa111aa1')
				.set('X-Hub-Signature', 'not-token')
				.expect(401, 'X-Hub-Signature is incorrect. The GitHub webhook token doesn\'t match');
			});

			it('when no token is present', () => {
				return request(opts.url)
				.post('save')
				.send(opts.body)
				.set('X-GitHub-Event', 'issues')
				.set('X-GitHub-Delivery', '11a1a111-a1a1-11a1-11a1-1111aa111aa1')
				.expect(401, 'No X-Hub-Signature found on request');
			});

			it('when no delivery ID is provided', () => {
				return request(opts.url)
				.post('save')
				.send(opts.body)
				.set('X-GitHub-Event', 'issues')
				.expect(401, 'No X-Hub-Signature found on request');
			});
		});

		context('responds with 422', () => {
			it('when no event type is provided', () => {
				return request(opts.url)
				.post('save')
				.send(opts.body)
				.set('X-GitHub-Delivery', '11a1a111-a1a1-11a1-11a1-1111aa111aa1')
				.set('X-Hub-Signature', 'some-token')
				.expect(422, 'No X-Github-Event found on request');
			});
		});
	});

	context('checks for repository in Origami registry', () => {
		it('warns if repository does not belong to Origami', () => {
			opts.body.repository.name = 'not-o-component';
			const token = signRequestBody(env.GITHUB_WEBHOOK_SECRET, JSON.stringify(opts.body));

			return request(opts.url)
			.post('save')
			.send(opts.body)
			.set('X-GitHub-Event', 'issues')
			.set('X-GitHub-Delivery', '11a1a111-a1a1-11a1-11a1-1111aa111aa1')
			.set('X-Hub-Signature', token)
			.expect(404, 'not-o-component was not found in the Origami Registry');
		});

		it('is successful if repository belongs to Origami', () => {
			opts.body.repository.name = 'o-test-component';
			const token = signRequestBody(env.GITHUB_WEBHOOK_SECRET, JSON.stringify(opts.body));

			return request(opts.url)
			.post('save')
			.send(opts.body)
			.set('X-GitHub-Event', 'issues')
			.set('X-GitHub-Delivery', '11a1a111-a1a1-11a1-11a1-1111aa111aa1')
			.set('X-Hub-Signature', token)
			.expect(200);
		});
	});
});
