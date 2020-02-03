/* eslint-env mocha */
'use strict';

const fetchMock = require('fetch-mock');
const proclaim = require('proclaim');
const slack = require('../../../lib/slack.js');

describe('slack', () => {
	const mockObjects	 = [
		{
			repository: 'test',
			action: 'opened',
			url: '#',
			title: 'issue 1'
		},
		{
			repository: 'test',
			action: 'opened',
			url: '#',
			title: 'issue 2'
		},
		{
			repository: 'test',
			action: 'closed',
			url: '#',
			title: 'issue 3'
		}
	];

	const mockPayload = {
		mrkdwn: true,
		text: '*Issue activity since Friday morning*\n*Closed*\n\n_test_:\n\t— <#| issue 3>\n\n*Opened*\n\n_test_:\n\t— <#| issue 1>\n\t— <#| issue 2>\n\n'
	};

	afterEach(() => {
		fetchMock.restore();
	});

	describe('.generateReport', () => {
		it('exports a function', () => {
			proclaim.isFunction(slack.generateReport);
		});

		it('generates a payload', () => {
			const payload = slack.generateReport(mockObjects, new Date('Mon Sep 24 2018'));
			proclaim.deepStrictEqual(payload, mockPayload);
		});
	});

	describe('.sendPayload', () => {
		it('exports a functions', () => {
			proclaim.isFunction(slack.sendPayload);
		});

		it('sends a payload', async () => {
			const url = 'https://circleci.com';
			fetchMock.post(url, 200);

			const result = await slack.sendPayload(url, mockPayload);
			proclaim.deepStrictEqual(result, { body: '✓ payload sent to Slack'});
		});
	});
});
