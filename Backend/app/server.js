const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const gettransaction = require('./routes/gettransactions')
const app = express();
const deletedTransaction = require('./routes/deletetransactions')
app.use(bodyParser.json());

mongoose.connect('mongodb://0.0.0.0:27017/zkredit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


// Routes
app.use('/auth', authRoutes);
app.use('/gettransaction', gettransaction);
app.use('/deletetransaction', deletedTransaction);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
