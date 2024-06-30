const BACKEND_PORT = 5002;
const FRONTEND_URL = "http://localhost:3000";
const CREDIT_BUREAU_API = "http://192.168.1.109:8061";
const MONGODB_URI = "mongodb://0.0.0.0:27017/zkredit"

const DATA_BYTES = {
    name: 70,
    address: 100,
    score: 2,
    timestamp: 8
  };

const CREDIT_BUREAU_TIMEOUT = 2000

module.exports = {BACKEND_PORT, FRONTEND_URL, CREDIT_BUREAU_API, CREDIT_BUREAU_TIMEOUT, MONGODB_URI, DATA_BYTES}
