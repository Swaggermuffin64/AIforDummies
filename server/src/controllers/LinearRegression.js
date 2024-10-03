//=======Initializes random starter line, for first iteration=======
const createRandomLine = (req, res) => {
    console.log(req.body);
    res.send(req.body);
}

//=======Intakes line and data points, returns new line after one LR iteration=======
const linearRegressionIteration = (req, res) => {
    console.log(req.body);
    res.send(req.body);
};


module.exports = {
    createRandomLine,
    linearRegressionIteration
};