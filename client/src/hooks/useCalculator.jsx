import { useState, useEffect, useRef } from 'react';

/*
* This is the useCalculator hook file. It is used to initialize the desmos calculatorInstance,
* and set its settings.
*/ 

function useCalculator() {
    const [calculatorInstance, setCalculatorInstance] = useState(null);
    const calculatorRef = useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6";
        script.async = true;
        script.onload = () => {
            const elt = document.getElementById('calculator');
            calculatorRef.current = elt;
            const calculator = Desmos.GraphingCalculator(elt, {
              keypad: false,
              showResetButtonOnGraphpaper: false,
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
  return { calculatorInstance, calculatorRef };
}
export default useCalculator;
