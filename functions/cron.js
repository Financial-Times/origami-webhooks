'use strict';

exports.handler = (event, context) => {
	const time = new Date();
	console.log(`cron done run ${context.functionName} at ${time}`);
};
