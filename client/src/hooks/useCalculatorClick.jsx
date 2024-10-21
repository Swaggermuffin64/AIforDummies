import { useCallback, useState } from 'react';

/*
* This file contains the useCalculatorClick hook. This file contains the logic to add data points to the Desmos
* Graph by clicking. 
*
* handleClick is called from the calculatorComponent when user clicks on graph, it checks whether the click
* occured in the graph div, and if so updates clickData and calls updateDataTable which sets a new point 
* on the desmos calculator. clickData is not updated if regression has already started.
*/


const useCalculatorClick = (calculatorInstance, calculatorRef, regressionStarted) => {
    const [clickData, setClickData] = useState({ xValues: [], yValues: [] });
    //=========Helper Function to determine if click is in graph space=========//
    const inRectangle = useCallback((point, rect) => {
        return (
        point.x >= rect.left &&
        point.x <= rect.right &&
        point.y <= rect.top &&
        point.y >= rect.bottom
        );
    }, []);

    //========Calculate click coords and call updateTable==========//
    //FIXME: points are placed slightly off cursor
    //FIXME: buttons are placed even when dragging
    const handleClick = (evt) => {
        if (!calculatorInstance) return;
        if (regressionStarted){                                          //lock clickData if started regression
            console.log("Regression started, clickData locked")
            return;
        }                                 

        const rect = calculatorRef.current.getBoundingClientRect();
        const x = evt.clientX - rect.left;
        const y = evt.clientY - rect.top;
        const mathCoordinates = calculatorInstance.pixelsToMath({ x, y });

        if (!inRectangle(mathCoordinates, calculatorInstance.graphpaperBounds.mathCoordinates)) {
        return;
        }

        if (!clickData) {
            console.error('clickData is undefined');
            return;
        }
        const updatedXValues = [...clickData.xValues, Number(mathCoordinates.x.toFixed(2))];
        const updatedYValues = [...clickData.yValues, Number(mathCoordinates.y.toFixed(2))];

        setClickData({ xValues: updatedXValues, yValues: updatedYValues });
        updateClickDataTable(updatedXValues, updatedYValues);
    }

     //========Updates the calculator instance to contain new clickData==========//
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

    return {
        handleClick,
        clickData
    };
};

export default useCalculatorClick;