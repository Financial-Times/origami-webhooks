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

const create = (payload) => {
	return {
		action: payload.action,
		repository: payload.repository.name,
		labels: payload.issue.labels.map(label => label.name),
		title: payload.issue.title,
		url: payload.issue.html_url
	};
};

const list = (action, issues) => {
	const categories = categorise(issues);
	const categorisedIssues = categories[action];

	if (categorisedIssues.length >= 1) {
		const repoNames = new Set(categorisedIssues.map(issue => issue.repository));


		let section = `*${capitalise(action)}*\n`;

		repoNames.forEach(repo => {
			section += `\n_${repo}_:\n`;

			const repoSpecificIssues = categorisedIssues.filter(issue => issue.repository === repo);
			repoSpecificIssues.forEach(issue => section += `\t— <${issue.url}| ${issue.title}>\n`);
		});

		return section + '\n';
	}

	return '';
};

module.exports = {
	create,
	list
};
