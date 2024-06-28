const express = require('express');
const https = require('https');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const getTX = require('./routes/getTX')
const cors = require('cors')
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const fs = require('fs');
const app = express();
const deleteTX = require('./routes/deleteTXRoute')
const csrfRoute = require('./routes/csrf')
const ClientRequest = require('./routes/ClientRequest');
const thresholdRoute = require('./routes/thresholdRoute')
const verificationRoutes = require('./routes/verificationRoutes')
const verificationKeyRoute = require('./routes/verificationKeyRoute')
const getProofRoute = require('./routes/getProofRoute')
const verifyToken = require('./middlewares/authMiddleware');
const {ipGeneralLimiter, ipProofLimiter, generalAccountLimiter, proofAccountLimiter} = require('./middlewares/rateLimiter');
const { BACKEND_PORT, FRONTEND_URL, MONGODB_URI } = require('../config');

app.use(cors({
  origin: FRONTEND_URL
}));


app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(ipGeneralLimiter);
app.use('/ClientRequest/generate-proof', ipProofLimiter);
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  }
});
app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  console.log('Logging with:' );
  console.log(req.csrfToken())
  next();
});
app.use('/csrf-token', csrfRoute);
app.use('/auth', authRoutes);

app.use(verifyToken, generalAccountLimiter);
app.use('/ClientRequest/generate-proof', verifyToken, proofAccountLimiter);


mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/getTX', getTX);
app.use('/deleteTX', deleteTX);
app.use('/ClientRequest', ClientRequest);
app.use('/Creditor', thresholdRoute);
app.use('/verifyTx', verificationRoutes);
app.use('/verification-key', verificationKeyRoute);
app.use('/getProof', getProofRoute);


app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    res.status(403).json({ message: 'CSRF token validation failed' });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 413 && 'body' in err) {
      res.status(413).json({ error: 'Payload too large' });
  } else {
      next();
  }
});

// app.listen(BACKEND_PORT, () => {
//   console.log(`Backend Server is running on port ${BACKEND_PORT}`);
// });

const sslOptions = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

// Create HTTPS server
https.createServer(sslOptions, app).listen(BACKEND_PORT, () => {
  console.log(`Backend Server is running on port ${BACKEND_PORT}`);
});