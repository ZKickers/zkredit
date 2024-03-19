const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const gettransaction = require('./routes/getTX')
const app = express();
const deletedTransaction = require('./routes/deleteTX')
const ClientRequest = require('./routes/ClientRequest')
app.use(bodyParser.json());

mongoose.connect('mongodb://0.0.0.0:27017/zkredit')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


// Routes
app.use('/auth', authRoutes);
app.use('/gettransaction', gettransaction);
app.use('/deletetransaction', deletedTransaction);
app.use('/ClientRequest', ClientRequest);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
