require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const getTX = require('./routes/getTX');
const cors = require('cors');
const app = express();
const deleteTX = require('./routes/deleteTXRoute');
const ClientRequest = require('./routes/ClientRequest');
const thresholdRoute = require('./routes/thresholdRoute');
const verificationRoutes = require('./routes/verificationRoutes');
const verificationKeyRoute = require('./routes/verificationKeyRoute');
const recaptchaRoute = require('./routes/recaptchaRoute');
const getProofRoute = require('./routes/getProofRoute');
const os = require('os');

const port = process.env.EXPRESS_APP_BACKEND_PORT
const bureauApi = process.env.EXPRESS_APP_CREDIT_BUREAU_API
const frontendUrl = process.env.EXPRESS_APP_FRONTEND_URL
const mongoDbUri = process.env.EXPRESS_APP_MONGODB_URI

if (os.platform() === 'win32') {
  console.error('This application cannot run on Windows.');
  process.exit(1);
}

app.use(cors({
  origin: frontendUrl
}));
app.use(bodyParser.json());

mongoose.connect(mongoDbUri)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/getTX', getTX);
app.use('/deleteTX', deleteTX);
app.use('/ClientRequest', ClientRequest);
app.use('/Creditor', thresholdRoute);
app.use('/verifyTx', verificationRoutes);
app.use('/verification-key', verificationKeyRoute);
app.use('/getProof', getProofRoute);
app.use('/recaptcha', recaptchaRoute)

app.listen(port, () => {
  console.log(`Backend Server is running on port ${port}`);
  console.log(`Listening to FBAPI on ${bureauApi}`)
});
