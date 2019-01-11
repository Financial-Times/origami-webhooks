'use strict';

const env = require('../env.js')();
const RepoDataClient = require('@financial-times/origami-repo-data-client');

const repoData = new RepoDataClient({
	apiKey: env.REPO_DATA_API_KEY,
	apiSecret: env.REPO_DATA_API_SECRET
});

module.exports = async () => {
	const repos = await repoData.listRepos();
	return repos
					.filter(repo => repo.support.isOrigami)
					.map(repo => repo.name);
};
