const AWS = require('aws-sdk');
const env = require('../env.js')();

const s3 = new AWS.S3({
	accessKeyId: env.AWS_ACCESS_ID,
	secretAccessKey: env.AWS_SECRET_ACCESS_KEY
});

const getS3Object = (key) => {
	const params = {
		Bucket: env.BUCKET,
		Key: key
	};

	return s3.getObject(params)
								.promise()
								.then(res => res && res.Body ? JSON.parse(res.Body) : null)
								.catch(err => err.statusCode = 400 ? err : false);
};

const putS3Object = (body, repository) => {
	return s3.putObject({
		Bucket: env.BUCKET,
		Key: repository,
		Body: JSON.stringify(body)
	})
	.promise();
}

module.exports = {
	getS3Object,
	putS3Object
}
