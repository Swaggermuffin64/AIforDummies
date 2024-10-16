//=======Initializes random starter line, for first iteration=======
const createRandomLine = (req, res) => {
    //=======for beta 1, using average of y values rn=======//
    yValues = req.body.yValues
    const sum = yValues.reduce((acc, curr) => acc + curr, 0);
    b_1 = sum / yValues.length

    //=======for beta 2, grabbing a randint from -2 -> 2=======//
    max = 2;
    min = -2;
    b_2 = Math.floor(Math.random() * (max - min + 1)) + min;



    console.log(yValues,b_1,b_2);
    res.send(b_1,b_2);
}

//=======Intakes line and data points, returns new line after one LR iteration=======
const linearRegressionIteration = (req, res) => {
    //=======for beta 1, using average of y values rn=======//
    yValues = req.body.yValues
    const sum = yValues.reduce((acc, curr) => acc + curr, 0);
    b_0 = (sum / yValues.length).toFixed(4);

    //=======for beta 2, grabbing a randint from -2 -> 2=======//
    max = 2;
    min = -2;
    b_1 = (Math.random() * (max - min) + min).toFixed(4);

    console.log(yValues,b_0,b_1);
    res.json({
        b_0: b_0,
        b_1: b_1
    });
};


module.exports = {
    createRandomLine,
    linearRegressionIteration
};