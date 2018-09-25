/* eslint-env mocha */
'use strict';

const proclaim = require('proclaim');
const list = require('../../../lib/issues.js');

describe('list', () => {
	it('exports a function', () => {
		proclaim.isFunction(list);
	});

	it('generates a list of issues for a specific category', () => {
		const mockIssues = [
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

		const mockList = '*Opened*\n\n_test_:\n— <#| issue 1>\n— <#| issue 2>\n\n';

		const openedIssues = list('opened', mockIssues);
		proclaim.deepStrictEqual(openedIssues, mockList);
	});
});
