const express = require('express');
const app = express();

//app.use(cors());
//app.use(express.static('public'));

express.static.mime.define({'application/wasm': ['wasm']});

const PORT = process.env.PORT || 5000;

app.listen(PORT);