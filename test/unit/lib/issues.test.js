/* eslint-env mocha */
'use strict';

const proclaim = require('proclaim');
const list = require('../../../lib/issues.js').list;
const create = require('../../../lib/issues.js').create;

describe('create', () => {
	it('exports a function', () => {
		proclaim.isFunction(create);
	});

	it('creates an issues object', () => {
		const mockPayload = {
			action: 'opened',
			repository: {
				name: 'test'
			},
			issue: {
				title: 'issue 1',
				html_url: '#',
				labels: [
					{
						name: 'label'
					}
				]
			}
		};

		const mockIssue = {
			action: 'opened',
			repository: 'test',
			labels: ['label'],
			title: 'issue 1',
			url: '#'
		};

		const createdIssue = create(mockPayload);
		proclaim.deepStrictEqual(createdIssue, mockIssue);
	});
});

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

		const mockList = '*Opened*\n\n_test_:\n\t— <#| issue 1>\n\t— <#| issue 2>\n\n';

		const openedIssues = list('opened', mockIssues);
		proclaim.deepStrictEqual(openedIssues, mockList);
	});
});
