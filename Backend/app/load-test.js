const axios = require('axios');
const { performance } = require('perf_hooks');
const pidusage = require('pidusage');
const os = require('os');
const si = require('systeminformation');
const diskusage = require('diskusage');
const networkInterfaces = require('network-interfaces');

const apiUrl = 'http://localhost:5002/ClientRequest/issue-transaction';
const triggerUrl = 'http://localhost:5002/creditor/trigger-threshold';
const proofUrl = 'http://localhost:5002/ClientRequest/generate-proof';
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJhY2NfMHRhNGNrZzA2IiwidXNlcm5hbWUiOiJvbWFyQCIsImlhdCI6MTcxOTU5NDUyNX0.pFVTBn_ezIPXuTpGmT2d5cT8XJJQ0R0OKCpSdEdCalE'; // Replace with your actual Authorization token

const requestData = {
    clientFullName: 'John Q.Doe',
    creditorUsername: 'omar@'
};

const numUsers = 100; // Number of concurrent users

async function runLoadTest() {
    let issueTransactionRequests = [];
    let triggerThresholdRequests = [];
    let generateProofRequests = [];

    const start = performance.now();

    // Queue management using async functions and Promise
    const proofQueue = [];
    let processingProofs = 0;

    async function processUserRequest() {
        try {
            const startIssue = performance.now();
            const issueResponse = await axios.post(apiUrl, requestData, {
                headers: { Authorization: authToken }
            });
            const endIssue = performance.now();
            const issueTime = endIssue - startIssue;

            const txId = issueResponse.data.transaction._id.toString();

            const issueMetrics = {
                url: apiUrl,
                requestType: 'issue-transaction',
                status: issueResponse.status,
                requestTime: issueTime
            };
            issueTransactionRequests.push(issueMetrics);

            if (issueResponse.status === 200 || issueResponse.status === 201) {
                const startTrigger = performance.now();
                const triggerResponse = await axios.post(triggerUrl, {
                    txId: txId,
                    threshold: 50
                }, {
                    headers: { Authorization: authToken }
                });
                const endTrigger = performance.now();
                const triggerTime = endTrigger - startTrigger;

                const triggerMetrics = {
                    url: triggerUrl,
                    requestType: 'trigger-threshold',
                    status: triggerResponse.status,
                    requestTime: triggerTime
                };
                triggerThresholdRequests.push(triggerMetrics);

                if (triggerResponse.status === 200 || triggerResponse.status === 201) {
                    // Enqueue proof request
                    proofQueue.push({
                        txId: txId,
                        enqueueTime: performance.now()
                    });
                    // Start processing the proof queue
                    await processProofQueue();
                }
            }
        } catch (error) {
            console.error('Request failed:', error.response ? error.response.data : error.message);
        }
    }

    // Function to handle proof generation asynchronously
    async function processProofQueue() {
        const maxConcurrentProofs = 3;
        let pendingRequests = proofQueue.length;

        while (proofQueue.length > 0 && processingProofs < maxConcurrentProofs) {
            const proofRequest = proofQueue.shift(); // Dequeue proof request
            if (!proofRequest) continue;

            processingProofs++;

            const queueingTime = performance.now() - proofRequest.enqueueTime;

            const proofRequestData = {
                address: "123 Oak saint Anytown, wl.1111",
                birthdate: "02-07-2001",
                ssn: "210734803",
                txId: proofRequest.txId
            };

            const startProof = performance.now();
            try {
                const proofResponse = await axios.post(proofUrl, proofRequestData, {
                    headers: { Authorization: authToken }
                });

                const proofMetrics = {
                    url: proofUrl,
                    requestType: 'generate-proof',
                    status: 'Pending',
                    requestTime: performance.now() - startProof,
                    queueingTime: queueingTime
                };
                generateProofRequests.push(proofMetrics);

                // Poll for proof status
                await pollProofStatus(proofMetrics, proofRequest.txId, startProof);
            } catch (error) {
                console.error('Error generating proof:', error.response ? error.response.data : error.message);
            } finally {
                processingProofs--;
                pendingRequests--;
                console.log(`Pending proof requests: ${pendingRequests}`);
            }
        }
    }

    // Poll for proof status
    async function pollProofStatus(proofMetrics, txId, startProof) {
        const getProofUrl = `http://localhost:5002/getProof/${txId}`;
        while (true) {
            try {
                const checkStatusResponse = await axios.get(getProofUrl, {
                    headers: { Authorization: authToken }
                });
                if (checkStatusResponse.status === 200) {
                    proofMetrics.status = 200;
                    proofMetrics.requestTime = performance.now() - startProof;
                    break;
                }
            } catch (error) {

            }
            await new Promise(resolve => setTimeout(resolve, 1000)); // Poll every second
        }
    }

    // Execute requests in parallel
    await Promise.all(Array.from({ length: numUsers }, () => processUserRequest()));

    // Process proof queue sequentially
    await processProofQueue();

    const end = performance.now();
    const duration = end - start;

    // Aggregate and display metrics
    const issueTransactionMetrics = aggregateMetrics(issueTransactionRequests);
    console.log('Issue Transaction Metrics:');
    console.log(issueTransactionMetrics);

    const triggerThresholdMetrics = aggregateMetrics(triggerThresholdRequests);
    console.log('Trigger Threshold Metrics:');
    console.log(triggerThresholdMetrics);

    const generateProofMetrics = aggregateMetrics(generateProofRequests);
    console.log('Generate Proof Metrics:');
    console.log(generateProofMetrics);

    // Display throughput and resource utilization
    const throughput = (numUsers / (duration / 1000)).toFixed(2); // requests per second
    console.log(`Throughput: ${throughput} requests/second`);

    const resourceMetrics = await getResourceUtilization();
    console.log('Resource Utilization:');
    console.log(resourceMetrics);
}

function aggregateMetrics(requests) {
    const totalRequests = requests.length;
    const successfulRequests = requests.filter(req => req.status === 200 || req.status === 201).length;
    const failedRequests = totalRequests - successfulRequests;
    const totalTime = requests.reduce((total, req) => total + req.requestTime, 0);
    const totalQueueingTime = requests.reduce((total, req) => total + (req.queueingTime || 0), 0);
    const responseTimes = requests.map(req => req.requestTime);
    const queueingTimes = requests.map(req => req.queueingTime || 0);
    const minTime = Math.min(...responseTimes);
    const maxTime = Math.max(...responseTimes);
    const avgTime = totalTime / totalRequests || 0;
    const avgQueueingTime = totalQueueingTime / totalRequests || 0;

    // Calculate 90th percentile response time
    responseTimes.sort((a, b) => a - b);
    const idx90 = Math.floor(responseTimes.length * 0.9);
    const nthPercentile = responseTimes[idx90] || 0;

    const errorPercentage = (failedRequests / totalRequests) * 100 || 0;

    return {
        totalRequests,
        successfulRequests,
        failedRequests,
        totalTime: totalTime.toFixed(2),
        queueingTime: totalQueueingTime.toFixed(2),
        avgTime: avgTime.toFixed(2),
        avgQueueingTime: avgQueueingTime.toFixed(2),
        minTime: minTime.toFixed(2),
        maxTime: maxTime.toFixed(2),
        nthPercentile: nthPercentile.toFixed(2),
        errorPercentage: errorPercentage.toFixed(2)
    };
}
function bytesToMB(bytes) {
    return (bytes / (1024 * 1024)).toFixed(2);
  }
  
  // Helper function to format bytes to KB
  function bytesToKB(bytes) {
    return (bytes / 1024).toFixed(2);
  }

async function getResourceUtilization() {
    const cpuLoad = await si.currentLoad();
    const memoryInfo = process.memoryUsage();
    const diskInfo = await diskusage.check('/');
    const networkStats = await si.networkStats();
  
    return {
      cpuUsage: `${cpuLoad.currentLoad.toFixed(2)}%`,
      memoryUsage: `${bytesToMB(memoryInfo.rss)} MB`,
      diskRead: `${bytesToMB(diskInfo.available)} MB`,
      diskWrite: `${bytesToMB(diskInfo.total - diskInfo.free)} MB`,
      networkIn: `${bytesToKB(networkStats[0].rx_sec)} KB/s`,
      networkOut: `${bytesToKB(networkStats[0].tx_sec)} KB/s`
    };
  }

runLoadTest();
