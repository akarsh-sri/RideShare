// index.js or main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from react-dom/client
import App from './App';
// Example in Navbar.jsx


const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
