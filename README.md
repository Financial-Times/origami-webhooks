# origami-webhooks
A [serverless](https://serverless.com) service that handles incoming and outgoing webhooks for Origami housekeeping.

## Housekeeping
Origami Webhooks currently handles issues opened, closed or edited across all Origami repositories within the [Origami registry](https://registry.origami.ft.com).

##### But theres a GitHub integration for Slack!

Yes, there is a GitHub integration for Slack. However, it requires subscribing individually to all of the repositories that the Origami Team is responsible for. There are 60+.

There is also no simple way of choosing specific events for the incoming webhooks for each individual repository, and the integration in Slack becomes very noisy very quickly.

Origami also had no centralised webhook handler. Until now.

### Functions
Origami webhooks currently has two AWS Lambda functions that live at the following endpoints:

`/save`: This endpoint currently accepts incoming payloads from an org-wide GitHub webhook, evaluates whether or not the issue belongs to an Origami repository and logs the payload in an S3 Bucket if it does.

`/report`: This endpoint posts to Slack once a day (currently 8h30 UTC). This is a scheduled event which parses the information it finds in the S3 bucket, generates a payload from that information, reports it to Slack and then empties out the S3 bucket.


## Requirements

In order to run this Origami Webhooks, you'll need to have [Node.js](https://nodejs.org/en/) 8.x, [npm](https://www.npmjs.com/) installed globally.

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
- `GITHUB_WEBHOOK_SECRET`: The API Key used to accept incoming GitHub webhooks
- `SLACK_WEBHOOK_URL`: The URL for the slack channel that the payload will be sent to.
- `REPO_DATA_API_KEY`: One half of the security credentials required to sign requests to the [Origami Repo Data Client](https://github.com/Financial-Times/origami-repo-data-client-node)
- `REPO_DATA_API_SECRET`: One half of the security credentials required to sign requests to the [Origami Repo Data Client](https://github.com/Financial-Times/origami-repo-data-client-node)

### Commands

Before running the service, we need to install it's dependencies:
```
npm install
```

And we'll need to spin up a local server, which defaults to:
```
serverless offline start
```

## Deployment

## Contact

## License
