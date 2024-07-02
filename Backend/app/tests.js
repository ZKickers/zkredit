// const axios = require('axios');
// const { performance } = require('perf_hooks');

// const apiUrl = 'http://localhost:5002/ClientRequest/issue-transaction';
// const triggerUrl = 'http://localhost:5002/creditor/trigger-threshold';
// const proofUrl = 'http://localhost:5002/ClientRequest/generate-proof';
// const GeTproof = 'http://localhost:5002/getProof/';
// const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJhY2NfMHRhNGNrZzA2IiwidXNlcm5hbWUiOiJvbWFyQCIsImlhdCI6MTcxOTU5NDUyNX0.pFVTBn_ezIPXuTpGmT2d5cT8XJJQ0R0OKCpSdEdCalE'; // Replace with your actual Authorization token

// const requestData = {
//     clientFullName: 'John Q.Doe',
//     creditorUsername: 'omar@'
// };

// // Number of concurrent requests to make
// const numUsers = 2;

// async function runLoadTest() {
//     let issueTransactionRequests = [];
//     let triggerThresholdRequests = [];
//     let generateProofRequests = [];
    
//     // async function makeRequest(url, data, requestType) {
//     //     try {
//     //         const startReq = performance.now();
//     //         const response = await axios.post(url, data, {
//     //             headers: {
//     //                 Authorization: authToken
//     //             }
//     //         });
//     //         const endReq = performance.now();
//     //         const requestTime = endReq - startReq;

//     //         const requestMetrics = {
//     //             url: url,
//     //             requestType: requestType,
//     //             status: response.status,
//     //             requestTime: requestTime
//     //         };

//     //         return requestMetrics;
//     //     } catch (error) {
//     //         const requestMetrics = {
//     //             url: url,
//     //             requestType: requestType,
//     //             status: error.response ? error.response.status : 'Request Failed',
//     //             requestTime: 0
//     //         };

//     //         return requestMetrics;
//     //     }
//     // }

//     const start = performance.now();

//     // Function to issue transaction, trigger threshold, and generate proof
//     async function processUserRequest() {
//         try {
//             const startIssue = performance.now();
//             const response = await axios.post(apiUrl, requestData, {
//                 headers: {
//                     Authorization: authToken
//                 }
//             });
            
//             const endIssue = performance.now();
//             const issueTime = endIssue - startIssue;

// <<<<<<< HEAD
// // // Write your array to a JSON file
// // const filePath = '../123/input.json';
// // fs.writeFile(filePath, JSON.stringify(myArray, null, 2), (err) => {
// //     if (err) {
// //         console.error('Error writing JSON file:', err);
// //     } else {
// //         console.log('JSON file has been saved successfully.');
// //     }
// // });
// =======
//             const txId = response.data.transaction._id.toString(); // Convert to string
//             const TxID = response.data.transaction._id;
//             const issueMetrics = {
//                 url: apiUrl,
//                 requestType: 'issue-transaction',
//                 status: response.status,
//                 requestTime: issueTime
//             };
//             issueTransactionRequests.push(issueMetrics);
//             console.log(issueTransactionRequests);
//             // If successful, trigger threshold with txId
//             if (response.status === 200 || response.status === 201) {
//                 const startTrigger = performance.now();
//                 const triggerResponse = await axios.post(triggerUrl, {
//                     txId: txId,
//                     threshold: 50
//                 }, {
//                     headers: {
//                         Authorization: authToken
//                     }
//                 });
//                 const endTrigger = performance.now();
//                 const triggerTime = endTrigger - startTrigger;

//                 const triggerMetrics = {
//                     url: triggerUrl,
//                     requestType: 'trigger-threshold',
//                     status: triggerResponse.status,
//                     requestTime: triggerTime
//                 };
//                 triggerThresholdRequests.push(triggerMetrics);

//                 // If threshold trigger is successful, generate proof
//                 if (triggerResponse.status === 200 || triggerResponse.status === 201) {
//                     const proofRequestData = {
//                         address: "123 Oak saint Anytown, wl.1111",
//                         birthdate: "02-07-2001",
//                         ssn: "210734803",
//                         txId: txId
//                     };

//                     const startProof = performance.now();
//                   const resp =  await axios.post(proofUrl, proofRequestData, {
//                         headers: {
//                             Authorization: authToken
//                         }
//                     });
//                     // Poll for status change
//                     let proofTime = 0;
//                     const proofMetrics = {
//                         url: proofUrl,
//                         requestType: 'generate-proof',
//                         status: 'Pending',
//                         requestTime: 0
//                     };
//                     const url = 'http://localhost:5002/getProof/'+TxID;
//                     const getProofUrl = 'http://localhost:5002/getProof/667eff487b27ee8e83e139f2';
//                     console.log(TxID);
                    
//                     while (true) {
//                         try {
//                             const checkStatusResponse = await axios.get(url, {
//                                 headers: {
//                                     Authorization: authToken
//                                 }
//                             });
//                             console.log('Proof Status Response:', checkStatusResponse.status);
//                             if (checkStatusResponse.status === 200) {
//                                 proofMetrics.status = 200; // Successful status
//                                 proofMetrics.requestTime = performance.now() - startProof;
//                                 generateProofRequests.push(proofMetrics);
//                                 break;
//                             }
//                             // Add your condition to break the loop if desired status is achieved
//                         } catch (error) {
//                             // console.error('Error during status check:', error.response ? error.response.data : error.message);
//                         }
//                         await new Promise(resolve => setTimeout(resolve, 1000)); // Poll every 1 second
//                     }
//                 }
//             }
//         } catch (error) {
//             const issueMetrics = {
//                 url: apiUrl,
//                 requestType: 'issue-transaction',
//                 status: error.response ? error.response.status : 'Request Failed',
//                 requestTime: 0
//             };
//             issueTransactionRequests.push(issueMetrics);
//         }
//     }

//     // Run the requests in parallel
//     await Promise.all(Array.from({ length: numUsers }, () => processUserRequest()));

//     const end = performance.now();
//     const duration = end - start;

//     // Aggregate metrics for issue transaction requests
//     const issueTransactionMetrics = aggregateMetrics(issueTransactionRequests);
//     console.log('Issue Transaction Metrics:');
//     console.log(issueTransactionMetrics);

//     // Aggregate metrics for trigger threshold requests
//     const triggerThresholdMetrics = aggregateMetrics(triggerThresholdRequests);
//     console.log('Trigger Threshold Metrics:');
//     console.log(triggerThresholdMetrics);

//     // Aggregate metrics for generate proof requests
//     const generateProofMetrics = aggregateMetrics(generateProofRequests);
//     console.log('Generate Proof Metrics:');
//     console.log(generateProofMetrics);
// }

// // Function to aggregate metrics
// function aggregateMetrics(requests) {
//     let totalRequests = requests.length;
//     let successfulRequests = requests.filter(req => req.status === 200 || req.status === 201).length;
//     let failedRequests = totalRequests - successfulRequests;
//     let totalTime = requests.reduce((total, req) => total + req.requestTime, 0);
//     let minTime = Math.min(...requests.map(req => req.requestTime));
//     let maxTime = Math.max(...requests.map(req => req.requestTime));
//     let responseTimes = requests.map(req => req.requestTime);
//     let errors = requests.filter(req => req.status !== 200 && req.status !== 201);

//     // Calculate average response time
//     let avgResponseTime = totalTime / totalRequests || 0;

//     // Calculate 90th percentile response time
//     responseTimes.sort((a, b) => a - b);
//     let idx90 = Math.floor(responseTimes.length * 0.9);
//     let nthPercentile = responseTimes[idx90] || 0;

//     // Calculate error percentage
//     let errorPercentage = (failedRequests / totalRequests) * 100 || 0;

//     return {
//         totalRequests: totalRequests,
//         successfulRequests: successfulRequests,
//         failedRequests: failedRequests,
//         totalTime: totalTime,
//         avgResponseTime: avgResponseTime.toFixed(2),
//         minTime: minTime.toFixed(2),
//         maxTime: maxTime.toFixed(2),
//         nthPercentile: nthPercentile.toFixed(2),
//         errorPercentage: errorPercentage.toFixed(2)
//     };
// }

// runLoadTest();
// >>>>>>> 3a2698de602a527b63d9a62834725b03e6714b18
