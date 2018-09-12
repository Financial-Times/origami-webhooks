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
	let errorMessage;
	let mockEvent;

	it(('exports a function'), () => {
		proclaim.isFunction(verifyGithubWebhook);
	});

	describe('throws errors for invalid header', () => {

		it('X-Hub-Signature: non-existent', () => {
			errorMessage = 'No X-Hub-Signature found on request';
			mockEvent = {
				headers: {
					'X-Hub-Signature': null,
					'X-GitHub-Event': 'githubEvent',
					'X-GitHub-Delivery': 'githubDelivery'
				},
				body: 'text'
			};
			proclaim.throws(() => verifyGithubWebhook(mockEvent), errorMessage);
		});

		it('X-Hub-Signature: incorrect', () => {
			errorMessage = 'X-Hub-Signature is incorrect. The GitHub webhook token doesn\'t match';
			mockEvent = {
				headers: {
					'X-Hub-Signature': 'different-secret',
					'X-GitHub-Event': 'githubEvent',
					'X-GitHub-Delivery': 'githubDelivery'
				},
				body: 'text'
			};
			proclaim.throws(() => verifyGithubWebhook(mockEvent), errorMessage);
		});

		it('X-GitHub-Event', () => {
			errorMessage = 'No X-Github-Event found on request';
			mockEvent = {
				headers: {
					'X-Hub-Signature': 'someHash',
					'X-GitHub-Event': null,
					'X-GitHub-Delivery': 'githubDelivery'
				},
				body: 'text'
			};
			proclaim.throws(() => verifyGithubWebhook(mockEvent), errorMessage);
		});

		it('X-GitHub-Delivery', () => {
			errorMessage = 'No X-Github-Delivery found on request';
			mockEvent = {
				headers: {
					'X-Hub-Signature': 'someHash',
					'X-GitHub-Event': 'githubEvent',
					'X-GitHub-Delivery': null
				},
				body: 'text'
			};
			proclaim.throws(() => verifyGithubWebhook(mockEvent), errorMessage);
		});
	});
});
