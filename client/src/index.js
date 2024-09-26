import React from "react";
import { createRoot } from "react-dom/client";
import Calculator from "./pages/calculator/calculator.jsx";

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Calculator />);