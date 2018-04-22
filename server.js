const request = require('request');
const express = require('express');
const {api} = process.env.API || require('./secret.js');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

let port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(`client`));

app.post('/api/midpoint', (req, res) => {
    let numBuses = req.body.buses;
    let locations = req.body.locations;
});

app.get('/', (req, res) => {
    res.sendFile('./client/index.html');
});

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});