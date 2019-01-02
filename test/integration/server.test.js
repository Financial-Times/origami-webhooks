/* eslint-env mocha */
'use strict';

const {spawn} = require('child_process');
const port = require('./helpers').port;

let slsOfflineProcess;

before(function (done) {
  this.timeout(10000);

  startSlsOffline(function (err) {
    if (err) {
      return done(err);
    }
    done();
  });
});

after(function () {
  stopSlsOffline();
});

function startSlsOffline (done) {
  slsOfflineProcess = spawn('npm', ['start', '--port ' + port]);
  console.log(`Serverless offline started with PID : ${slsOfflineProcess.pid}`);

  slsOfflineProcess.stdout.on('data', (data) => {
    if (data.includes('Offline listening on')) {
      console.log(data.toString().trim());
      done();
    }
  });

  slsOfflineProcess.stderr.on('data', (err) => {
    console.log(`Error starting Serverless Offline:\n${err}`);
    done(err);
  });
}


function stopSlsOffline() {
  slsOfflineProcess.kill();
  console.log('Serverless offline stopped');
}
