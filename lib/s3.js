'use strict';
const AWS = require('aws-sdk');
const httpError = require('./helpers').httpError;

const createInstance = (accessKeyId, secretAccessKey) => new AWS.S3({ accessKeyId, secretAccessKey});

const uploadObjectTo = async (location, body, repository) => {
	return await location.s3.putObject({
										Bucket: location.bucket,
										Key: repository,
										Body: JSON.stringify(body)
									})
									.promise()
									.then(() => {
										return {
											body: `✓ ${repository} uploaded to ${location.bucket}`
										};
									})
									.catch(err => httpError(err));
};

const getObjectFrom = async (location, key) => {
	return await location.s3.getObject({
										Bucket: location.bucket,
										Key: key
									})
									.promise()
									.then(res => res && res.Body ? JSON.parse(res.Body): null )
									.catch(err => err.statusCode !== 404 ? httpError(err) : false );
};

const listObjectsFrom = async (location) => {
	return await location.s3.listObjects({
						Bucket: location.bucket
					})
					.promise()
					.then(res => res && res.Contents ? res.Contents : null)
					.catch(err => err.statusCode !== 404 ? httpError(err) : false);
};

const deleteObjectsFrom = async (location, objects) => {
	const keys = objects.map(object => {
														return {
															Key: object.Key
														};
													});

	return await location.s3.deleteObjects({
										Bucket: location.bucket,
										Delete: {
											Objects: keys
										}
									})
									.promise()
									.then(() => `✓ ${location.bucket} has been emptied.`)
									.catch(err => httpError(err));
};

module.exports = {
	createInstance,
	getObjectFrom,
	uploadObjectTo,
	listObjectsFrom,
	deleteObjectsFrom
};
