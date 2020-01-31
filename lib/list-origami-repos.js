'use strict';

const RepoDataClient = require('@financial-times/origami-repo-data-client');

const repoData = new RepoDataClient();

module.exports = async () => {
	const repos = await repoData.listRepos();
	return repos
		.filter(repo => repo.support.isOrigami)
		.map(repo => repo.name);
};
