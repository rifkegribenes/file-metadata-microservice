// server.js

/* ================== SETUP ================== */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const path = require('path');
const multer = require('multer');
const upload = multer({dest:'uploads/'});

const app = express();
app.use(bodyParser.json());
app.use(cors());

/* ================== ROUTES ================== */

app.post('/upload', upload.single('file'), (req, res, next) => {
  return res.json(req.file);
  });



// set static path
app.use(express.static(path.join(__dirname, '/client/build/')));

app.get('/', (req, res, next) => {
  res.status(200)
    .sendFile(path.join(__dirname, '../client/build/index.html'));
});

const server = http.createServer(app);
const port = process.env.PORT || 3001;
app.set('port', port);
server.listen(port, () => console.log(`Server listening on localhost:${port}`));
