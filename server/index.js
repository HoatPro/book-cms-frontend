const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.static(path.join(__dirname, '..', 'build')));

const port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`);
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.disable('x-powered-by');