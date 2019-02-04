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

`/save`: This endpoint currently accepts incoming payloads from an org-wide GitHub webhook, and evaluates whether or not the issue belongs to an Origami repository. If it does, the next step depends on the action that is being performed on the issue ('opened', 'edited', 'closed', etc). If an issue is 'labeled' and is specifically labelled with the UXD tag, this endpoint will reroute the issue to Slack (#ft-uxd), and will **not** save it anywhere. Otherwise, it logs the issue's payload in an S3 Bucket.

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

Make sure that all of the work you are doing happens in the dev stage. When you deploy in dev, the Slack webhook URLS will point at `SLACK_WEBHOOK_URL_TEST`, which points at #origami-webhooks-test. Please join this channel to see the payload deliveries.

In order to activate a GitHub webhook, feel free to open, edit, close and label issues in [`o-test-component`](https://github.com/Financial-Times/o-test-component/issues). This will deliver to the `/save` endpoint of your dev environment. You can find the data in a payload in the past webhook deliveries (Settings > Webhooks)


You can use [cURL](https://curl.haxx.se/) or [Postman](https://www.getpostman.com/) to interact with the `/report` endpoint and send payloads to Slack. You'll need to use some of the [environment variables](#configuration).

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

## Deployment

### Dev Environment
Every push to a branch will deploy your work to the dev environment in AWS, after it has passed unit tests. Again, **this will be live**, but all of the payload will be directed at the test channel in Slack.

### Prod Environment
A successful CircleCI build on the master branch will deploy your work to production, after it has passed both unit and integration tests. 

## License

The Financial Times has published this software under the [MIT license][license].
