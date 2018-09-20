/* eslint-env mocha */

'use strict';

const proclaim = require('proclaim');
const mockery = require('mockery');
const sinon = require('sinon');

sinon.assert.expose(proclaim, {
	includeFail: false,
	prefix: ''
});

describe('create-s3-instance', function () {
	this.timeout(30000);
	let aws;
	let s3;
	let s3Instance;
	let location;

	beforeEach(() => {
		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false,
			warnOnReplace: false
		});

		aws = require('../mock/aws-sdk.mock');
		mockery.registerMock('aws-sdk', aws);

		s3 = require('../../../lib/s3');

		s3Instance = {
			putObject: sinon.stub(),
			getObject: sinon.stub(),
			listObjects: sinon.stub(),
			deleteObjects: sinon.stub()
		};

		location = {
			s3: s3Instance,
			bucket: 'test-bucket'
		};
	});

	afterEach(() => {
		mockery.deregisterAll();
		mockery.disable();
	});

	describe('s3.createInstance', () => {
		it('exports a function', () => {
			proclaim.isFunction(s3.createInstance);
		});

		it('returns an S3 instance which was given the `accessKeyId` and `secretAccessKey` values', async () => {
			const accessKeyId = 'a';
			const secretAccessKey = 'b';
			const s3Instance = s3.createInstance(accessKeyId, secretAccessKey);
			proclaim.isInstanceOf(s3Instance, aws.S3);
			proclaim.calledOnce(aws.S3);
			proclaim.calledWithNew(aws.S3);
			proclaim.calledWith(aws.S3, { accessKeyId, secretAccessKey });
		});
	});

	describe('s3.uploadObjectTo', () => {
		beforeEach(() => {
			s3Instance.putObject.promise = sinon.stub().resolves();
			s3Instance.putObject.returns(s3Instance.putObject);
		});

		it('exports a function', () => {
			proclaim.isFunction(s3.uploadObjectTo);
		});

		it('Uploads the object to S3 and returns the location of the object in S3', async () => {
			const mockBody = { text: 'some content'};
			const mockRepository = 'test-repo';

			const result = await s3.uploadObjectTo(location, mockBody, mockRepository);
			proclaim.calledOnce(s3Instance.putObject);
			proclaim.calledWith(s3Instance.putObject, {
				Bucket: 'test-bucket',
				Key: 'test-repo',
				Body: '{"text":"some content"}'
			});
			proclaim.calledOnce(s3Instance.putObject.promise);
			proclaim.deepStrictEqual(result, { body: '\u001b[32m✓ test-repo uploaded to test-bucket' });
		});
	});

	describe('s3.getObjectFrom', () => {
		beforeEach(() => {
			const response = {
				Body: '{"key":"value"}',
				Key: 'key'
			};

			s3Instance.getObject.promise = sinon.stub().resolves(response);
			s3Instance.getObject.returns(s3Instance.getObject);
		});

		it('exports a function', () => {
			proclaim.isFunction(s3.getObjectFrom);
		});

		it('fetches an object from S3 and parses its content', async () => {
			const mockKey = 'key';
			const result = await s3.getObjectFrom(location, mockKey);
			proclaim.calledOnce(s3Instance.getObject);
			proclaim.calledWith(s3Instance.getObject, {
				Bucket: 'test-bucket',
				Key: 'key'
			});
			proclaim.calledOnce(s3Instance.getObject.promise);
			proclaim.deepStrictEqual(result, { key: 'value'});
		});
	});

	describe('s3.listObjectsFrom', () => {
		beforeEach(() => {
			const response = {
				Contents: {
					key: 'value'
				}
			};

			s3Instance.listObjects.promise = sinon.stub().resolves(response);
			s3Instance.listObjects.returns(s3Instance.listObjects);
		});

		it('exports a function', () => {
			proclaim.isFunction(s3.listObjectsFrom);
		});

		it('fetches an object from S3 and parses its content', async () => {
			const result = await s3.listObjectsFrom(location);
			proclaim.calledOnce(s3Instance.listObjects);
			proclaim.calledWith(s3Instance.listObjects, {
				Bucket: 'test-bucket'
			});
			proclaim.calledOnce(s3Instance.listObjects.promise);
			proclaim.deepStrictEqual(result, { key: 'value'});
		});
	});

	describe('s3.deleteObjectsFrom', () => {
		beforeEach(() => {

			s3Instance.deleteObjects.promise = sinon.stub().resolves();
			s3Instance.deleteObjects.returns(s3Instance.deleteObjects);
		});

		it('exports a function', () => {
			proclaim.isFunction(s3.deleteObjectsFrom);
		});

		it('fetches an object from S3 and parses its content', async () => {
			const mockObjects = [
				{ Key: 'key1' },
				{ Key: 'key2' }
			];
			const result = await s3.deleteObjectsFrom(location, mockObjects);
			proclaim.calledOnce(s3Instance.deleteObjects);
			proclaim.calledWith(s3Instance.deleteObjects, {
				Bucket: 'test-bucket',
				Delete: {
					Objects: mockObjects
				}
			});
			proclaim.calledOnce(s3Instance.deleteObjects.promise);
			proclaim.deepStrictEqual(result, '\u001b[32m✓ test-bucket has been emptied.');
		});
	});
});
