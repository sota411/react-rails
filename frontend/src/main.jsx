import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

// index.html にある <div id="root"> を探し、Reactの画面を差し込みます。
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);
