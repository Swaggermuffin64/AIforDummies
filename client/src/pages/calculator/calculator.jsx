// CalculatorComponent.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import './calculator.css';
const CalculatorComponent = () => {
    const [calculatorInstance, setCalculatorInstance] = useState(null);
    const [clickData, setClickData] = useState({ xValues: [], yValues: [] });
    const [regressionLine,setRegressionLine] = useState(null);               //no line yet, get first line from server
    const calculatorRef = useRef(null);

    //=========Load the calculator API=========//

    useEffect(() => {
      const script = document.createElement('script');
      script.src = "https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6";
      script.async = true;
      script.onload = () => {
        const elt = document.getElementById('calculator');
        calculatorRef.current = elt;
        const calculator = Desmos.GraphingCalculator(elt, {
          keypad: false,
          expressions: false, 
  
          showResetButtonOnGraphpaper: false,
          zoomButtons: false
        });
        calculator.setMathBounds({
          left: 0,
          right: 10,
          bottom: 0,
          top: 10
        });
        setCalculatorInstance(calculator);
      };
      document.body.appendChild(script);
      return () => {
        // Clean up resources
      };
    }, []);

    //=========Helper Function to determine if click is in graph space=========//

    const inRectangle = (point, rect) => {
        return (
          point.x >= rect.left &&
          point.x <= rect.right &&
          point.y <= rect.top &&
          point.y >= rect.bottom
        );
    };

    //========Calculate click coords and call updateTable==========//
    //FIXME: points are placed slightly off cursor
    //FIXME: buttons are placed even when dragging

    const handleClick = (evt) => {
      if (!calculatorInstance) return; // Check if calculator is loaded
  
      const rect = calculatorRef.current.getBoundingClientRect();
      const x = evt.clientX - rect.left;
      const y = evt.clientY - rect.top;
      const mathCoordinates = calculatorInstance.pixelsToMath({ x, y });
  
      if (!inRectangle(mathCoordinates, calculatorInstance.graphpaperBounds.mathCoordinates)) {
        return;
      };
  
      const updatedXValues = [...clickData.xValues, Number(mathCoordinates.x.toFixed(2))];
      const updatedYValues = [...clickData.yValues, Number(mathCoordinates.y.toFixed(2))];
  
      setClickData({ xValues: updatedXValues, yValues: updatedYValues });
      updateClickDataTable(updatedXValues, updatedYValues);
    };

    //=========Update table with clickData=========//
    const updateClickDataTable = (xValues, yValues) => {
        calculatorInstance.setExpression({
            id: 'click_data_table',
            type: 'table',
            columns: [
              {latex: 'x', values: xValues.map(String)},
              {latex: 'y', values: yValues.map(String)}
            ]
        });
    };
    const createRandomLine = () =>{ 
      const yValues = clickData.yValues;
      const sum = yValues.reduce((acc, curr) => acc + curr, 0);
      const b_0 = Number((sum / yValues.length).toFixed(4));                //for beta 1, use average of y values

      const max = 2;
      const min = -2;
      const b_1 = (Math.random() * (max - min) + min).toFixed(4);           //for beta 2, grabbing a randint from (-2 -> 2)
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
  
  //=======Intakes line and data points, returns new line after one LR iteration=======//
  const linearRegressionIteration = () => {
      if (!clickData || !clickData.yValues || clickData.yValues.length === 0) {
          console.log('Invalid or missing click data');
          return; 
      }

      let newRegressionLine;
      
      if (regressionLine == null){                                  //if no regressionLine, initialize "random line"
          console.log("random line call");
          newRegressionLine = createRandomLine(clickData);
      }
      else {                                                        //otherwise perform a linear regression step
          console.log("gradient descent step");
          newRegressionLine = gradientDescentStep(clickData, regressionLine);
      }
      console.log("returing newRegressionLine", newRegressionLine);
      updateLinearRegressionParams(newRegressionLine);
  };

    //=========Update table and regressionLine with new regressionLine=========//
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


    //=========Sends post request for Linear Regression step, DEPRECATED=========//
    /*const handleLRPostSend = () => {
        const dataToSend = {
          clickData : clickData,
          regressionLine : regressionLine
        };

        console.log('Data to send:', dataToSend);
        console.log('Json String:', JSON.stringify(dataToSend));

        fetch('http://localhost:3001/post-LR-Iter', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
        .then(response => response.json())
        .then(data => {
            updateLinearRegressionParams(data);
        })
        .catch(error => {
            console.error('Error sending click data:', error);
        });
    };*/
    return (
      <div id="calculator" className="calculator-container" onClick={handleClick}>
        <button onClick={linearRegressionIteration}>Linear Regression Iteration</button>
      </div>
      
    );
};

export default CalculatorComponent;
