import { useCallback, useState, useEffect } from 'react';

/*
* This file contains the logic to take a linear regression step. 
* 
* regressionLine is initially initialized to null as linear regression hasn't begun at initialization. Once the 
* button from the calculatorComponent is pressed, linearRegressionIterationButton() is called. The function
* checks for clickData to use, and if there is already a regression line.
*     => If no clickData, return
*     => If clickData and no regressionLine, call createRandomLine which initializes a random line to start off
*     linear regression. It sets the the varibles b0 and b1 for regressionLine.
*     => If clickData and regressionLine, we call gradientDescentStep, which calculates new values of b0 and b1
*     for regressionLine in accordance to least squares gradient descent. 
*/

const useRegressionStep = (calculatorInstance, clickData, setRegressionStarted) => {
    const [regressionLine,setRegressionLine] = useState(null);                // no line initially
    //=======Creates random line to start linear regression=======//
    const createRandomLine = (clickData) => { 
        const yValues = clickData.yValues;
        const sum = yValues.reduce((acc, curr) => acc + curr, 0);
        const b_0 = Number((sum / yValues.length).toFixed(4));              //for beta 1, use average of y values

        const max = 2;
        const min = -2;
        const b_1 = (Math.random() * (max - min) + min).toFixed(4);         //for beta 2, grabbing a randint from (-2 -> 2)
        console.log(yValues,b_0,b_1);
        return [b_0,b_1];
    };

    //=======Linear Regression Step Math, returns d_b0 and d_b1 (after hyperparameter tune)=======//
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

    const linearRegressionIterationButton = () => {
        if (!clickData || !clickData.yValues || clickData.yValues.length === 0) {
            console.log('Invalid or missing click data');
            return; 
        }

        let newRegressionLine;
        
        if (regressionLine == null){                                  //if no regressionLine, initialize "random line"
            console.log("Regression started, random line call");
            setRegressionStarted(true);
            newRegressionLine = createRandomLine(clickData);
        }
        else {                                                        //otherwise perform a linear regression step
            console.log("gradient descent step");
            newRegressionLine = gradientDescentStep(clickData, regressionLine);
        }
        console.log("returing newRegressionLine", newRegressionLine);
        updateLinearRegressionParams(newRegressionLine);
    };

    const updateLinearRegressionParams = useCallback((newRegressionLine) => {
        console.log("Updating Linear Regression:", newRegressionLine);

        if (newRegressionLine && newRegressionLine.length === 2) {
            const [b_0, b_1] = newRegressionLine;
            console.log("b_0, b_1 to set regressionLine:", b_0, b_1);

            setRegressionLine([b_0, b_1]);
            if (calculatorInstance) {
                const line = `y = ${b_0} + ${b_1}x`;
                calculatorInstance.setExpression({id: 'Linear_Regression', latex: line});
                console.log("Updated calculator with line:", line);
            } 
            else {
                console.warn("Calculator instance not available");
            }
        } 

        else {
            console.error("Invalid regression line data received");
        }
    }, [calculatorInstance]);

    useEffect(() => {
        console.log("Regression line updated:", regressionLine);
    }, [regressionLine]);

    return {
        linearRegressionIterationButton
    };
}

export default useRegressionStep;