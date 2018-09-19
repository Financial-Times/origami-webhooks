/* eslint-env mocha */

'use strict';

const proclaim = require('proclaim');
const mockery = require('mockery');
const sinon = require('sinon');

sinon.assert.expose(proclaim, {
	includeFail: false,
	prefix: ''
});

describe('create-s3-instance', function() {
	this.timeout(30000);
	let aws;
	let s3;

	beforeEach(() => {
		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false,
			warnOnReplace: false
		});

		aws = require('../mock/aws-sdk.mock');
		mockery.registerMock('aws-sdk', aws);

		s3 = require('../../../lib/s3');
	});

	afterEach(() => {
		mockery.deregisterAll();
		mockery.disable();
	});

	describe('s3.createInstance', () => {
		it('exports a function', () => {
			proclaim.isFunction(s3.createInstance);
		});

		// it('returns an S3 instance which was given the `accessKeyId` and `secretAccessKey` values', async () => {
		// 	const accessKeyId = 'a';
		// 	const secretAccessKey = 'b';
		// 	const s3Instance = s3.createInstance({ accessKeyId, secretAccessKey });
		// 	proclaim.isInstanceOf(s3Instance, aws.S3);
		// 	proclaim.calledOnce(aws.S3);
		// 	proclaim.calledWithNew(aws.S3);
		// 	proclaim.calledWith(aws.S3, {accessKeyId, secretAccessKey});
		// });
	});

	describe('s3.uploadObjectTo', () => {
		let s3Instance;
		let location;

		beforeEach(() => {
			s3Instance = {
				putObject: sinon.stub()
			};
			s3Instance.putObject.promise = sinon.stub().resolves();
			s3Instance.putObject.returns(s3Instance.putObject);

			location = {
				s3: s3Instance,
				bucket: 'test-bucket'
			};
		});

		it('exports a function', () => {
			proclaim.isFunction(s3.uploadObjectTo);
		});

		it('Uploads the object to S3 and returns the location of the object in S3', async () => {
			const mockBody = { text: 'some content'};
			const mockRepository = 'test-repo';

			const result = await s3.uploadObjectTo(location, mockBody, mockRepository);
			proclaim.calledOnce(s3Instance.putObject);
			// proclaim.calledWith(s3Instance.putObject, {
			// 	Body: '{ "text": "some content" }',
			// 	Bucket: 'test-bucket',
			// 	Key: 'test-repo'
			// });
			proclaim.calledOnce(s3Instance.putObject.promise);
			proclaim.deepStrictEqual(result, { body: '\u001b[32m✓ test-repo uploaded to test-bucket' });
		});
	});
});
