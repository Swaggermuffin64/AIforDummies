const express = require ('express');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:8080'
}));

app.use(express.text());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/static')));


app.post('/submit-click-data', (req, res) => {
    console.log(req.body);
    res.send(req.body);
});
app.get('/', (req, res) => {
    res.send('Hello World');
    console.log('test')
});


app.listen (3001, () => console.log('Listening on port 3001'));