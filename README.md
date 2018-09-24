# origami-webhooks
A [serverless](https://serverless.com) service that handles incoming and outgoing webhooks for Origami housekeeping.

## Housekeeping
Origami Webhooks currently handles issues opened, closed or edited across all Origami repositories within the [Origami registry](https://registry.origami.ft.com). It currently has two AWS Lambda functions that live at the following endpoints:

`/save`: This endpoint currently accepts incoming payloads from an org-wide GitHub webhook, evaluates whether or not the issue belongs to an Origami repository and logs the payload in an S3 Bucket if it does.

`/report`: This endpoint posts to Slack once a day. There is a scheduled event which parses the information in the S3 bucket and reports the generated payload.

## Requirements

In order to run this Origami Webhooks, you'll need to have [Node.js](https://nodejs.org/en/) 8.x, [npm](https://www.npmjs.com/) installed globally.

You will also need to install `serverless`:
```
npm install -g serverless
```

## Configuration

Running this service locally requires a `.env` file with the following environmental variables:
- `AWS_ACCOUNT_ID`:
- `AWS_ACCESS_KEY_ID`:
- `AWS_SECRET_ACCESS_KEY`: The AWS Secret to access the FT AWS
- `BUCKET`: The S3 bucket where issue payloads are saved.
- `GITHUB_WEBHOOK_SECRET`: The API Key used to accept incoming GitHub webhooks
- `SLACK_WEBHOOK_URL`: The URL for the slack channel that the payload will be sent to.
- `REPO_DATA_API_KEY`:
- `REPO_DATA_API_SECRET`:
