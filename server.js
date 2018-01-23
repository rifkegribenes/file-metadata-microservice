// server.js

/* ================== SETUP ================== */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const path = require('path');

app.use(bodyParser.json());
app.use(cors());

/* ================== ROUTES ================== */

app.put('/api/file-size', (req, res, next) => {

  });



// set static path
app.use(express.static(path.join(__dirname, '/client/build/')));

app.get('/', (req, res) => {
  res.status(200)
    .sendFile(path.join(__dirname, '../client/build/index.html'));
});

const server = http.createServer(app);
const port = process.env.PORT || 3001;
app.set('port', port);
server.listen(port, () => console.log(`Server listening on localhost:${port}`));
