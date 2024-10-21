import React from "react";
import { createRoot } from "react-dom/client";
import Calculator from "./components/calculator.jsx";

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Calculator />);