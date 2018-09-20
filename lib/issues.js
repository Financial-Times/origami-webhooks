'use strict';

const capitalise = string => string.charAt(0).toUpperCase() + string.substring(1);

const categorise = (items) => {
	return {
		closed: items.filter(item => item.action === 'closed'),
		edited: items.filter(item => item.action === 'edited'),
		opened: items.filter(item => item.action === 'opened'),
		reopened: items.filter(item => item.action === 'reopened')
	};
};

module.exports = (action, issues) => {
		const categories = categorise(issues);
		const categorisedIssues = categories[action];

		if (categorisedIssues.length >= 1) {
			const repoNames = new Set(categorisedIssues.map(issue => issue.repository));

			let section = `*${capitalise(action)}*\n`;

			repoNames.forEach(repo => {
				section += `_${repo}_:\n`;

				const repoSpecificIssues = categorisedIssues.filter(issue => issue.repository === repo);
				repoSpecificIssues.forEach(issue => section += `— <${issue.url}| ${issue.title}>\n`);
			});

			return section + '\n';
		}

		return '';
};
