import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";

import AuthProvider from './providers/AuthProvider';
import APIProvider from './providers/APIProvider';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <APIProvider>
        <App />
      </APIProvider>
    </AuthProvider>
  </React.StrictMode>
);
