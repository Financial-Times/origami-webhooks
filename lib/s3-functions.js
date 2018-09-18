'use strict';

const AWS = require('aws-sdk');
const env = require('../env.js')();

const s3 = new AWS.S3({
	accessKeyId: env.AWS_ACCESS_ID,
	secretAccessKey: env.AWS_SECRET_ACCESS_KEY
});

const getS3Object = async (key) => {
	const params = {
		Bucket: env.BUCKET,
		Key: key
	};

	return s3.getObject(params)
					.promise()
					.then(res => res && res.Body ? JSON.parse(res.Body) : null)
					.catch(err => err.statusCode >= 400 ? err : false);
};

const putS3Object = (body, repository) => {
	const params = {
		Bucket: env.BUCKET,
		Key: repository,
		Body: JSON.stringify(body)
	};

	return s3.putObject(params)
					.promise();
};

const listS3Objects = () => {
	const params = {
		Bucket: env.BUCKET
	};

	return s3.listObjects(params)
					.promise()
					.then(res => res && res.Contents ? res.Contents : null)
					.catch(err => err.statusCode >= 400 ? err : false);
};

const deleteS3Objects = async () => {
	const params = {
		Bucket: env.BUCKET
	};

	const keys = await s3.listObjects(params)
											.promise()
											.then(res => {
												return res.Contents.map(object => {
													return {
														Key: object.Key
													};
												});
											})
											.catch(err => { throw err; });

	params.Delete = {
		Objects: keys
	};

	return s3.deleteObjects(params).promise();
};

module.exports = {
	getS3Object,
	putS3Object,
	deleteS3Objects,
	listS3Objects
};
