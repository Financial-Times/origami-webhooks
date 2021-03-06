/* eslint-env mocha */
'use strict';

const proclaim = require('proclaim');
const sinon = require('sinon');
const verifyGithubWebhook = require('../../../lib/verify-github-webhook');

sinon.assert.expose(proclaim, {
	includeFail: false,
	prefix: ''
});

describe('Incoming GitHub webhook verification', () => {
	let error;
	let mockEvent;

	it(('exports a function'), () => {
		proclaim.isFunction(verifyGithubWebhook);
	});

	describe('throws errors for invalid header', () => {

		it('X-Hub-Signature: non-existent', () => {
			error = new Error({ message: 'No X-Hub-Signature found on request' });

			mockEvent = {
				headers: {
					'X-Hub-Signature': null,
					'X-GitHub-Event': 'githubEvent',
					'X-GitHub-Delivery': 'githubDelivery'
				},
				body: 'text'
			};
			proclaim.throws(() => verifyGithubWebhook(mockEvent), error.message);
		});

		it('X-Hub-Signature: incorrect', () => {
			error = new Error({ message: 'X-Hub-Signature is incorrect. The GitHub webhook token doesn\'t match' });

			mockEvent = {
				headers: {
					'X-Hub-Signature': 'different-secret',
					'X-GitHub-Event': 'githubEvent',
					'X-GitHub-Delivery': 'githubDelivery'
				},
				body: 'text'
			};

			proclaim.throws(() => verifyGithubWebhook(mockEvent), error.message);
		});

		it('X-GitHub-Event', () => {
			error = new Error({ message: 'No X-Github-Event found on request' });

			mockEvent = {
				headers: {
					'X-Hub-Signature': 'someHash',
					'X-GitHub-Event': null,
					'X-GitHub-Delivery': 'githubDelivery'
				},
				body: 'text'
			};
			proclaim.throws(() => verifyGithubWebhook(mockEvent), error.message);
		});

		it('X-GitHub-Delivery', () => {
			error = new Error({ message: 'No X-Github-Delivery found on request' });

			mockEvent = {
				headers: {
					'X-Hub-Signature': 'someHash',
					'X-GitHub-Event': 'githubEvent',
					'X-GitHub-Delivery': null
				},
				body: 'text'
			};
			proclaim.throws(() => verifyGithubWebhook(mockEvent), error.message);
		});
	});
});
