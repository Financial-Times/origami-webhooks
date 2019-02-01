# origami-webhooks
A [serverless](https://serverless.com) service that handles incoming and outgoing webhooks for Origami housekeeping.

## Housekeeping
Origami Webhooks currently handles issues opened, closed or edited across all Origami repositories within the [Origami registry](https://registry.origami.ft.com).

#### But theres a GitHub integration for Slack!

Yes, there is a GitHub integration for Slack. However, it requires subscribing individually to all of the repositories that the Origami Team is responsible for. There are 60+.

There is also no simple way of choosing specific events for the incoming webhooks for each individual repository, and the integration in Slack becomes very noisy very quickly.

Origami also had no centralised webhook handler. Until now.

### Functions
Origami webhooks currently has two AWS Lambda functions that live at the following endpoints:

`/save`: This endpoint currently accepts incoming payloads from an org-wide GitHub webhook, evaluates whether or not the issue belongs to an Origami repository. If it does, the next step depends on the action that is being performed on the issue ('opened', 'edited', 'closed', etc). If an issue is 'labeled' and is specifically labelled with the UXD tag, this endpoint will reroute the issue to Slack (#ft-uxd), and will **not** save it anywhere. Otherwise, it logs the issue's payload in an S3 Bucket.

`/report`: This endpoint posts to Slack once a day (currently 8h30 UTC). This is a scheduled event which parses the information it finds in the S3 bucket, generates a payload from that information, reports it to Slack (origami-internal) and then empties out the S3 bucket.


## Requirements

In order to run this service, you'll need to have [Node.js](https://nodejs.org/en/) 8.x, [npm](https://www.npmjs.com/) installed globally.

You will also need to install `serverless`:
```
npm install -g serverless
```
## Running locally

### Configuration

Running this service locally requires a `.env` file with the following environmental variables:
- `AWS_ACCOUNT_ID`: The account id for the Origami AWS account
- `AWS_ACCESS_KEY_ID`: One half of the security credentials required to sign requests to AWS
- `AWS_SECRET_ACCESS_KEY`: One half of the security credentials required to sign requests to AWS
- `NODE_ENV`: Your service's environment, either `production` or `dev`
- `BUCKET`: The S3 bucket where issue payloads are saved.
- `GITHUB_WEBHOOK_SECRET`: The API Key used to accept incoming GitHub webhooks.
- `SLACK_WEBHOOK_URL_TEST`: The URL for the slack channel that the payload will be sent to, this should be used for testing and points at #origami-webhooks-test.
- `SLACK_WEBHOOK_URL_ORIGAMI_INTERNAL`: The URL for the slack channel that the regular report will be sent to.
- `SLACK_WEBHOOK_URL_UXD`: The URL for the slack channel that will be notified when an issue is labeled 'UXD'.
- `REPO_DATA_API_KEY`: One half of the security credentials required to sign requests to the [Origami Repo Data Client](https://github.com/Financial-Times/origami-repo-data-client-node)
- `REPO_DATA_API_SECRET`: One half of the security credentials required to sign requests to the [Origami Repo Data Client](https://github.com/Financial-Times/origami-repo-data-client-node)

### Commands

Before running the service, we need to install it's dependencies:
```
npm install
```

And we'll need to spin up a local server, which defaults to `https://localhost:3000/`:
```
serverless offline start
```

### Development

**Please be aware that the Slack webhook URLs are live**.

If you want to work on these endpoints, or add more, please change all instances of `SLACK_WEBHOOK_URL_ORIGAMI_INTERNAL` and `SLACK_WEBHOOK_URL_UXD` to `SLACK_WEBHOOK_URL_TEST`. This way you won't be disturbing any channels, and can test and tweak to your heart's content.

The most effective way of interacting with this serverless instance while it is running locally, is to [cURL](https://curl.haxx.se/)  directly into your localhost endpoints with the relevant headers and request body (this combination is used to pass the GitHub webhook verification), it looks something like this:

```
curl -X POST -H "Content-Type: application/json"  -d '{"action": "opened","issue":{"labels":[], "title":"New Issue", "html_url":"https://example.com"},"repository": {"name":"o-test-component"}, "sender": {"url":"https://api.github.com/users/XXXX"}}' http://localhost:3000/save
```

Keep in mind that any issue opened on an Origami component _will interact with the current, live, instance of serverless Webhooks_. The webhooks have been set org-wide, and exist on every repository that the FT owns, so remember to work with your local URL if you want to see the changes that you're making.

If you need to see what a GitHub payload looks like, [`o-test-component`](https://github.com/Financial-Times/o-test-component/issues) houses all of the test issues and webhook details that have been recorded in the past (Settings > Webhooks)


### Testing

This service has unit tests and integration tests, which can be run with one command:
```
npm run test
```

This triggers the following commands, which can also be used individually:

```
npm run test-unit
```

```
npm run test-integration
```

If your tests are not passing, your work will not be deployed. (???)

## Deployment
