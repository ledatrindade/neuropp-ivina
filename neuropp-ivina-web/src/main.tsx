import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import "./index.css";

/*
 * Ponto de entrada do React.
 *
 * BrowserRouter permite que a gente crie rotas como:
 * /
 * /sobre
 * /avaliacao
 * /agendar
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);