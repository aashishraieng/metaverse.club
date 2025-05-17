import React from "react";
import ReactDOM from "react-dom/client";
import {Auth0Provider} from '@auth0/auth0-react';
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import './index.css'; // this must include Tailwind setup

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider domain={import.meta.env.VITE_AUTH_DOMAIN} clientId={import.meta.env.VITE_AUTH_CLIENT_ID}
	authorizationParams={{redirect_uri: window.location.origin}}>
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);
