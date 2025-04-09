import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./navbar.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="container mx-auto p-4">
          <h1>Welcome to StaffEasy</h1>
        </main>
      </div>
    </BrowserRouter>
  </React.StrictMode>
);