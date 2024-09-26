const express = require ('express')
const path = require('path');
const app = express()
app.use(express.text());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/static')));


app.get('/home', (req, res) => {
    res.send('Home endpoint hit!')
})
app.get('/', (req, res) => {
    res.send('Hello World')
})


app.listen (3000, () => console.log('server ready'))