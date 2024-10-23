// CalculatorComponent.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import '../pages/calculator/calculator.css';
import useCalculator from '../hooks/useCalculator.jsx';
import useCalculatorClick from '../hooks/useCalculatorClick.jsx';
import useRegressionStep from '../hooks/useRegressionStep.jsx';

const CalculatorComponent = () => {
    //=========Parent Element=========//
    const [regressionStarted, setRegressionStarted] = useState(false);

    //=========Hooks=========//
    const {calculatorInstance, calculatorRef} = useCalculator();
    const {handleClick, clickData} = useCalculatorClick(calculatorInstance, calculatorRef, regressionStarted);
    const {linearRegressionIterationButton} = useRegressionStep(calculatorInstance, clickData, setRegressionStarted);
    

    return (
        <div id="calculator" className="calculator-container" onClick={handleClick}>
            <button onClick={linearRegressionIterationButton}>Linear Regression Iteration</button>
        </div>
    );
};

export default CalculatorComponent;


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
