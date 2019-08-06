# Origami Webhooks

A serverless service for incoming and outgoing webhooks for Origami housekeeping

## Service Tier

Bronze

## Lifecycle Stage

Production

## Primary URL

https://github.com/Financial-Times/origami-webhooks

## Host Platform

AWS

## Contains Personal Data

no

## Contains Sensitive Data

no

## Delivered By

origami-team

## Supported By

origami-team

## Dependencies

* slack-financialtimes
* github

## Failover Architecture Type

NotApplicable

## Failover Process Type

NotApplicable

## Failback Process Type

NotApplicable

## Data Recovery Process Type

NotApplicable

## Release Process Type

FullyAutomated

## Rollback Process Type

Manual

## Key Management Process Type

Manual

## Architecture

This is a serverless service with two lambda functions responsible for collecting and reporting issues across origami component repositories. 
It uses GitHub webhooks and a Slack integration to deposit the payload into #ft-origami

## More Information

It is responsible for reporting issues created on origami components to the Origami slack channel #ft-origami
It will also report issues labelled with UXD to the UXD slack channel #ft-uxd

## First Line Troubleshooting

This service isn't critical to Origami operations.
If something goes wrong with it, getting in touch with the Origami team for a fix is an acceptable procedure.

## Second Line Troubleshooting

Again, not a critical service so if it is being problematic it can be switched off without greater effects

## Monitoring

N/A

## Failover Details

There is no specific failover for this service. 

## Data Recovery Details

As part of the service's functionality, data gets deleted after every payload is sent so there is no need for recovering any of it. 

## Release Details

Webhooks are released after successful integration on circle. 
This can be done manually: https://github.com/Financial-Times/origami-webhooks

## Key Management Details

The keys need to be rotated in AWS and updated in Origami's LastPass

