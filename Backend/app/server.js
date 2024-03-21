const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const getTX = require('./routes/getTX')
const cors = require('cors')
const app = express();
const deleteTX = require('./routes/deleteTX')
const ClientRequest = require('./routes/ClientRequest');
const { BACKEND_PORT, FRONTEND_URL, MONGODB_URI } = require('../config');

app.use(cors({
  origin: FRONTEND_URL
}));
app.use(bodyParser.json());

mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


// Routes
app.use('/auth', authRoutes);
app.use('/getTX', getTX);
app.use('/deleteTX', deleteTX);
app.use('/ClientRequest', ClientRequest);

app.listen(BACKEND_PORT, () => {
  console.log(`Backend Server is running on port ${BACKEND_PORT}`);
});
