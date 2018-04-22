const express = require('express');
const app = express();


let port = process.env.PORT || 3000;

app.use(express.static(`client`));

app.get('/', (req, res) => {
    res.sendFile('./client/index.html');
});

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
