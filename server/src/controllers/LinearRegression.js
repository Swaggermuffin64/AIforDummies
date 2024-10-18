//FILE IS CURRENTLY DEPRECATED, MOVED THESE PROCESSES TO THE CLIENT SIDE

//=======Initializes random starter line, for first iteration=======//
const createRandomLine = (clickData) => {
    yValues = clickData.yValues
    const sum = yValues.reduce((acc, curr) => acc + curr, 0);
    b_0 = Number((sum / yValues.length).toFixed(4));                //for beta 1, use average of y values

    max = 2;
    min = -2;
    b_1 = (Math.random() * (max - min) + min).toFixed(4);           //for beta 2, grabbing a randint from (-2 -> 2)

    console.log(yValues,b_0,b_1);
    return [b_0,b_1];
};
//=======Linear Regression Step Math, returns d_b0 and d_b1 (after hyperparamter tune)=======//
const gradientDescentStep = (clickData, regressionLine) => {
    const xValues = clickData.xValues;
    const yValues = clickData.yValues;
    const [b_0,b_1] = regressionLine;
    const alpha = 0.01;                                     
    console.log("b_0 for calculation!", regressionLine[0]);
    console.log("b_1 for calculation!", regressionLine[1]);
    const predicted_ys = xValues.map(x => (b_1 * x + b_0).toFixed(4));    //predict ys, round to 4
    const y_residuals = yValues.map((value, index) => (value - predicted_ys[index]).toFixed(4));
    console.log("xValues to be predicted", xValues);
    console.log("yValues to be predicted", yValues);
    console.log("predicted_ys", predicted_ys);
    console.log("y residuals", y_residuals);
    const d_b0 = alpha * y_residuals.reduce((acc,val)=> (-2*val)+acc,0);                //alpha is learning rate
    const d_b1 = alpha * y_residuals.reduce((acc,val,i)=> (-2*xValues[i]*val)+acc,0);
    console.log("d_b0", d_b0);
    console.log("d_b1", d_b1);
    return ([b_0 - d_b0, b_1 - d_b1]);                               
}

//=======Intakes line and data points, returns new line after one LR iteration=======
const linearRegressionIteration = (req, res) => {
    const { clickData, regressionLine } = req.body;
    if (!clickData || !clickData.yValues || clickData.yValues.length === 0) {
        return res.status(400).json({ error: 'Invalid or missing click data' });
    }
    
    let newRegressionLine;
    
    if (regressionLine == null){                                  //if no regressionLine, initialize "random line"
        console.log("random line call");
        newRegressionLine = createRandomLine(clickData);
    }
    else {                                                        //otherwise perform a linear regression step
        newRegressionLine = gradientDescentStep(clickData, regressionLine);
    }
    console.log("sending newRegressionLine", newRegressionLine);
    res.json({
        regressionLine: newRegressionLine
    });
};


module.exports = {
    createRandomLine,
    linearRegressionIteration
};