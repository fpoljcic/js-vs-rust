const express = require('express');
const path = require('path');
const app = express();

//app.use(cors());
//app.use(express.static('public'));

express.static.mime.define({'application/wasm': ['wasm']});

app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/frontend/build/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT);