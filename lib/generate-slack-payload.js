'use strict';

const s3 = require('./s3-functions');

const capitalise = string => string.charAt(0).toUpperCase() + string.substring(1);

module.exports = async (objects) => {
	const keys = objects.map(object => object.Key);
	let issues = await Promise.all(keys.map(s3.getS3Object));
	issues = Array.prototype.concat(...issues);

	const hasIssues = action => issues.filter(issue => issue.action === action);
	const categories = {
		closed: hasIssues('closed'),
		edited: hasIssues('edited'),
		opened: hasIssues('opened'),
		reopened: hasIssues('reopened')
	};

	const listIssues = (type) => {
		const categorisedIssues = categories[type];

		if (categorisedIssues.length >= 1) {
			const repoNames = new Set(categorisedIssues.map(issue => issue.repository));

			let section = `*${capitalise(type)}*\n`;

			repoNames.forEach(repo => {
				section += `_${repo}_:\n`;

				const repoSpecificIssues = categorisedIssues.filter(issue => issue.repository === repo);
				repoSpecificIssues.forEach(issue => section += `— <${issue.url}| ${issue.title}>\n`);
			});

			return section + '\n';
		}

		return '';
	};

	return ':bell: *Yesterday\'s issue summary*\n'
					+ listIssues('closed')
					+ listIssues('edited')
					+ listIssues('opened')
					+ listIssues('reopened');
};
