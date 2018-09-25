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
		text: '*Issue activity since Thu morning*\n*Closed*\n\n_test_:\n— <#| issue 3>\n\n*Opened*\n\n_test_:\n— <#| issue 1>\n— <#| issue 2>\n\n'
	};

	afterEach(() => {
		fetchMock.restore();
	});

	describe('.generatePayload', () => {
		it('exports a function', () => {
			proclaim.isFunction(slack.generatePayload);
		});

		it('generates a payload', () => {
			const payload = slack.generatePayload(mockObjects, new Date('Fri Sep 21 2018'));
			proclaim.deepStrictEqual(payload, mockPayload);
		});
	});

	describe('.sendPayload', () => {
		it('exports a functions', () => {
			proclaim.isFunction(slack.sendPayload);
		});

		it('sends a payload', async () => {
			const url = 'http://www.test.com';
			fetchMock.post(url, 200);

			await slack.sendPayload(url, mockPayload)
				.then(res => proclaim.isTrue(res.ok));
		});
	});
});
