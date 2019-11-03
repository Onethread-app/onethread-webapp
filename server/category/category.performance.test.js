// const loadtest = require('loadtest');

// describe('Performance Test', () => {
//   const noRequestPerHour = 100000;
//   const avgRequestTime = 1000;
//   const host = 'http://127.0.0.1:4040/api/v1';

//   it('performance testing /category?type=business-category', function(done) {
//     this.timeout(1000 * 60);

//     function statusCallback(error, result, latency) {
//       console.log(
//         'Current latency %j, result %j, error %j',
//         latency,
//         result,
//         error
//       );
//       console.log('----');
//       console.log('Request elapsed milliseconds: ', result.requestElapsed);
//       console.log('Request index: ', result.requestIndex);
//       console.log('Request loadtest() instance index: ', result.instanceIndex);
//       console.info(
//         '\n=========================================================================================================\n'
//       );
//       console.info(
//         `\tThreshold : No of request per hour = ${noRequestPerHour}, Avg request time in millis = ${avgRequestTime}`
//       );
//       console.info(
//         '\n=========================================================================================================\n'
//       );
//       console.info('Total Requests :', latency.totalRequests);
//       console.info('Total Failures :', latency.totalErrors);
//       console.info('Total Time Per Seconds:', latency.totalTimeSeconds);
//       console.info('Requests Per Second :', latency.rps);
//       console.info('Requests Per Hour :', latency.rps * 3600);
//       console.info('Average Request Time(Mills) :', latency.meanLatencyMs);
//       console.info('Minimum Request Time(Mills) :', latency.minLatencyMs);
//       console.info('Maximum Request Time(Mills) :', latency.maxLatencyMs);
//       console.info('Percentiles :', latency.percentiles);
//       console.info(
//         '\n=========================================================================================================\n'
//       );
//     }
//     const options = {
//       url: `${host}/category?type=business-category`,
//       maxSeconds: 60,
//       concurrency: 200,
//       maxRequests: 800,
//       method: 'GET',
//       // contentType: 'application/x-www-form-urlencoded',
//       // body: {
//       //   password: 'Orvi@123456',
//       //   email: 'orvi@orvi.com'
//       // },
//       statusCallback
//     };

//     const operation = loadtest.loadTest(options, error => {
//       if (error) {
//         return console.error('Got an error: %s', error);
//       }
//       console.log('Tests run successfully');
//       done();
//     });
//   });
// });
