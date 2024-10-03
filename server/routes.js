const express = require('express');
const controllers = require('./src/controllers/LinearRegression');
const router = express.Router();


//========Request routes, naming convention is HTTP request type first========
router.get('/', (req, res) => {
    res.send('backslash!');
});
router.post('/post-LR-Iter', controllers.linearRegressionIteration);      //POST request for single Linear Regression Iteration




module.exports = router;