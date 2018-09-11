const crypto = require('crypto');
const fetch = require('node-fetch');

function signRequestBody(key, body) {
  return `sha1=${crypto.createHmac('sha1', key).update(body, 'utf-8').digest('hex')}`;
}

const env = require('./env.js')();

module.exports.githubWebhookListener = (event, context, callback) => {
  let errorMessage;
  const token = env.GITHUB_WEBHOOK_SECRET;
  const headers = event.headers;
  const sig = headers['X-Hub-Signature'];
  const githubEvent = headers['X-GitHub-Event'];
  const id = headers['X-GitHub-Delivery'];
  const calculatedSig = signRequestBody(token, event.body);

	const errorObject = (message, statusCode) => {
		return {
			statusCode,
			headers: { 'Content-Type': 'text/plain' },
			body: message
		}
	}

  if (typeof token !== 'string') {
		return errorObject('Must provide a \'GITHUB_WEBHOOK_SECRET\' env variable', 401);
	}

  if (!sig) {
    return errorObject('No X-Hub-Signature found on request', 401);
  }

  if (!githubEvent) {
		return errorObject('No X-Github-Event found on request', 422);
  }

  if (!id) {
		return errorObject('No X-Github-Delivery found on request', 401);
  }

  if (sig !== calculatedSig) {
		return errorObject('X-Hub-Signature is incorrect. The GitHub webhook token doesn\'t match', 401);
  }

	let payload;
	try  {
		payload = JSON.parse(event.body);
	} catch (err) {
		return { err }
	}

	const content = {
		text: `${payload.issue.user.login} ${payload.action} an issue on ${payload.repository.name}.\n<${payload.issue.html_url}|*Title: ${payload.issue.title}*>\n${payload.issue.body ? payload.issue.body : ''}`,
		mrkdwn: true,
		icon_emoji: ':origami-crane:'
	}

	const sendPayload = async (content) => {
		return await fetch(env.SLACK_WEBHOOK_URL, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(content)
		})
	}

	return sendPayload(content)
		.then(res => {
			return {
				statusCode: res.statusCode
			}
		})
		.catch(err => {
			return errorObject(err, 500);
		})
};
