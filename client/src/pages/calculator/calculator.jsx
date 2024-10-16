// CalculatorComponent.jsx
import React, { useEffect, useState, useRef } from 'react';
import './calculator.css';
//========= =========//
const CalculatorComponent = () => {
    const [calculatorInstance, setCalculatorInstance] = useState(null);
    const [clickData, setClickData] = useState({ xValues: [], yValues: [] });
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

    const updateTableLine = (parameters) => {
        console.log("yerd");
        console.log(parameters);
        const b_0 = parameters.b_0;
        console.log("yerd2");
        const b_1 = parameters.b_1;     //y=b0+b1x
        const line = `y = ${b_0} + ${b_1}x`;
        calculatorInstance.setExpression({id: 'Linear_Regression', latex:line});
        //calculator.setExpression({ id: 'a-slider', latex: 'a=1' });
    }

    //=========Sends post request for Linear Regression step=========
    const handleLRPostSend = () => {
        console.log('Click Data:', clickData);
        console.log('JSON String:', JSON.stringify(clickData));
        fetch('http://localhost:3001/post-LR-Iter', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(clickData)
        })
        .then(response => response.json())
        .then(data => {
            updateTableLine(data);
        })
        .catch(error => {
            console.error('Error sending click data:', error);
        });
    };

    return (
      <div id="calculator" className="calculator-container" onClick={handleClick}>
        <button onClick={handleLRPostSend}>Linear Regression Iteration</button>
      </div>
      
    );
};

export default CalculatorComponent;
