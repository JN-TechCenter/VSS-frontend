import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './assets/index.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
