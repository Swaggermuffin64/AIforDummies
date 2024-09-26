// CalculatorComponent.jsx
import React, { useEffect } from 'react';
import './calculator.css';

const CalculatorComponent = () => {

    useEffect(() => {
        // Load the Desmos calculator after the component mounts
        const script = document.createElement('script');
        script.src = "https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6";
        script.async = true;
        script.onload = () => {
            var elt = document.getElementById('calculator');
            var calculator = Desmos.GraphingCalculator(elt, {
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
            
        };
        document.body.appendChild(script);
    }, []);

    return (
        <div id="calculator" className="calculator-container"></div>
    );
};

export default CalculatorComponent;
