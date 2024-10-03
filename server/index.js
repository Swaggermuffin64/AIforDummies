const express = require ('express');
const path = require('path');
const cors = require('cors');
const router = require('./routes'); 
const app = express();

//use cors for security
app.use(cors({
    origin: 'http://localhost:8080'
}));
app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/static')));

app.use(router)     //routes mounted
app.listen (3001, () => console.log('Listening on port 3001'));