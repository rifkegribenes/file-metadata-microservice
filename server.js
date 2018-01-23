// server.js

/* ================== SETUP ================== */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const path = require('path');
const multer = require('multer');
// const upload = multer({dest:'uploads/'});
const storage = multer.memoryStorage(); // Create memory storage
const upload = multer({ storage: storage }); // Create middleware with the storage above


const app = express();
app.use(bodyParser.json());
app.use(cors());

/* ================== ROUTES ================== */

const type = upload.single('file');

app.post('/upload', type, (req, res, next) => {
  console.log('upload route');
  if (req.file) {
    res.status(200).json({
      filename: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype
    });
  } else {
    res.status(500).json({ error: `No file was provided in the 'data' field` });
  }
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
